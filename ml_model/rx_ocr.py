"""
Handwritten prescription-word OCR on RxHandBD  --  CRNN + CTC (TensorFlow / Keras)

Usage
  python rx_ocr.py --data RxHandBD-Raw --epochs 60            # train + evaluate
  python rx_ocr.py --predict some_word.jpg                    # inference with saved model
"""
import os, json, argparse, random
import numpy as np, pandas as pd
from PIL import Image
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

IMG_H, IMG_W = 32, 128
SEED = 42
random.seed(SEED); np.random.seed(SEED); tf.random.set_seed(SEED)


# ----------------------------------------------------------------- preprocessing
def preprocess(img: Image.Image) -> np.ndarray:
    """Gray -> invert (ink=high) -> crop to ink bbox -> keep aspect, resize to
    IMG_H x IMG_W, pad on the right. Returns uint8 (H, W)."""
    a = 255 - np.asarray(img.convert("L"), dtype=np.uint8)
    ys, xs = np.where(a > 40)
    if len(ys):
        a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    h, w = a.shape
    new_w = max(1, min(IMG_W - 2, int(round(w * (IMG_H - 4) / h))))
    a = np.asarray(Image.fromarray(a).resize((new_w, IMG_H - 4), Image.BILINEAR))
    out = np.zeros((IMG_H, IMG_W), np.uint8)
    out[2:IMG_H - 2, 2:2 + min(new_w, IMG_W - 2)] = a[:, :IMG_W - 2]
    return out


def load_dataset(root):
    cache = os.path.join(root, f"cache_{IMG_H}x{IMG_W}.npz")
    df = pd.read_csv(os.path.join(root, "Prescription_Labels.csv")).iloc[:, :2]
    df.columns = ["img", "text"]
    df["text"] = df.text.astype(str).str.strip()
    if os.path.exists(cache):
        X = np.load(cache)["X"]
    else:
        X = np.stack([preprocess(Image.open(os.path.join(root, "Images", f))) for f in df.img])
        np.savez_compressed(cache, X=X)
    return X[..., None], df.text.tolist()


# ----------------------------------------------------------------- vocab / CTC helpers
def build_vocab(texts):
    chars = sorted(set("".join(texts)))
    return chars, {c: i for i, c in enumerate(chars)}      # blank index = len(chars)


def encode(texts, c2i, max_len):
    y = -np.ones((len(texts), max_len), np.int32)           # -1 = padding
    for i, t in enumerate(texts):
        y[i, :len(t)] = [c2i[c] for c in t]
    return y


def ctc_loss(y_true, y_pred):
    y_true = tf.cast(y_true, tf.int32)
    label_len = tf.reduce_sum(tf.cast(y_true >= 0, tf.int32), axis=1)
    logit_len = tf.fill([tf.shape(y_pred)[0]], tf.shape(y_pred)[1])
    loss = tf.nn.ctc_loss(labels=tf.maximum(y_true, 0), logits=tf.cast(y_pred, tf.float32),
                          label_length=label_len, logit_length=logit_len,
                          logits_time_major=False, blank_index=-1)
    return tf.reduce_mean(loss)


def decode(probs, chars):
    """Greedy CTC decoding. probs: (B, T, C+1)."""
    ids = np.argmax(probs, -1); blank = len(chars); out = []
    for seq in ids:
        s, prev = [], -1
        for k in seq:
            if k != prev and k != blank:
                s.append(chars[k])
            prev = k
        out.append("".join(s))
    return out


# ----------------------------------------------------------------- model
def conv_block(x, f, pool):
    x = layers.Conv2D(f, 3, padding="same", use_bias=False)(x)
    x = layers.BatchNormalization()(x)
    x = layers.ReLU()(x)
    return layers.MaxPooling2D(pool)(x) if pool else x


def build_model(n_classes):
    inp = keras.Input((IMG_H, IMG_W, 1))
    x = layers.Rescaling(1 / 255.)(inp)
    x = conv_block(x, 32, (2, 2))     # 16 x 64
    x = conv_block(x, 64, (2, 2))     # 8 x 32
    x = conv_block(x, 96, (2, 1))     # 4 x 32
    x = conv_block(x, 128, (2, 1))    # 2 x 32
    x = layers.Permute((2, 1, 3))(x)                      # (time, H, C)
    x = layers.Reshape((IMG_W // 4, 2 * 128))(x)          # time steps = 32
    x = layers.Dropout(0.25)(x)
    x = layers.Bidirectional(layers.LSTM(128, return_sequences=True, dropout=0.2))(x)
    x = layers.Bidirectional(layers.LSTM(96, return_sequences=True, dropout=0.2))(x)
    out = layers.Dense(n_classes + 1)(x)                  # +1 = CTC blank (logits)
    return keras.Model(inp, out, name="rx_crnn")


augment = keras.Sequential([
    layers.RandomRotation(0.03, fill_mode="constant"),
    layers.RandomTranslation(0.06, 0.04, fill_mode="constant"),
    layers.RandomZoom((-0.12, 0.08), (-0.12, 0.08), fill_mode="constant"),
])


def make_ds(X, y, bs, train):
    ds = tf.data.Dataset.from_tensor_slices((X, y))
    if train:
        ds = ds.shuffle(len(X), seed=SEED)
    ds = ds.batch(bs)
    if train:
        ds = ds.map(lambda a, b: (tf.cast(augment(tf.cast(a, tf.float32), training=True), tf.float32), b),
                    num_parallel_calls=tf.data.AUTOTUNE)
    return ds.prefetch(tf.data.AUTOTUNE)


# ----------------------------------------------------------------- metrics
def edit_distance(a, b):
    d = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        prev, d[0] = d[0], i
        for j, cb in enumerate(b, 1):
            prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (ca != cb))
    return d[-1]


def evaluate(preds, truths):
    exact = np.mean([p == t for p, t in zip(preds, truths)])
    exact_ci = np.mean([p.lower() == t.lower() for p, t in zip(preds, truths)])
    cer = sum(edit_distance(p, t) for p, t in zip(preds, truths)) / sum(len(t) for t in truths)
    return dict(word_acc=float(exact), word_acc_case_insensitive=float(exact_ci), CER=float(cer))


# ----------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default="RxHandBD-Raw")
    ap.add_argument("--epochs", type=int, default=60)
    ap.add_argument("--bs", type=int, default=32)
    ap.add_argument("--out", default="rx_ocr_out")
    ap.add_argument("--predict", default=None)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)

    if a.predict:
        meta = json.load(open(os.path.join(a.out, "vocab.json")))
        model = keras.models.load_model(os.path.join(a.out, "rx_crnn.keras"), compile=False)
        x = preprocess(Image.open(a.predict))[None, ..., None]
        print(decode(model.predict(x, verbose=0), meta["chars"])[0]); return

    X, texts = load_dataset(a.data)
    chars, c2i = build_vocab(texts)
    y = encode(texts, c2i, max(map(len, texts)))
    print(f"{len(X)} images | {len(chars)} chars | max label len {y.shape[1]}")

    idx = np.random.permutation(len(X)); n = len(X)
    tr, va, te = idx[:int(.8 * n)], idx[int(.8 * n):int(.9 * n)], idx[int(.9 * n):]
    json.dump({"chars": chars, "img_h": IMG_H, "img_w": IMG_W}, open(os.path.join(a.out, "vocab.json"), "w"))

    model = build_model(len(chars))
    model.compile(optimizer=keras.optimizers.Adam(1e-3, clipnorm=5.0), loss=ctc_loss)
    model.summary()

    cbs = [keras.callbacks.ModelCheckpoint(os.path.join(a.out, "rx_crnn.keras"), save_best_only=True, monitor="val_loss"),
           keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=4, min_lr=1e-5),
           keras.callbacks.EarlyStopping(patience=12, restore_best_weights=True)]
    hist = model.fit(make_ds(X[tr], y[tr], a.bs, True), validation_data=make_ds(X[va], y[va], a.bs, False),
                     epochs=a.epochs, callbacks=cbs, verbose=2)

    for name, ids in [("val", va), ("test", te)]:
        preds = decode(model.predict(X[ids], batch_size=64, verbose=0), chars)
        truths = [texts[i] for i in ids]
        print(name, evaluate(preds, truths))
        if name == "test":
            json.dump(evaluate(preds, truths), open(os.path.join(a.out, "test_metrics.json"), "w"), indent=2)
            for p, t in list(zip(preds, truths))[:15]:
                print(f"  pred={p!r:18} true={t!r}")
    json.dump(hist.history, open(os.path.join(a.out, "history.json"), "w"))


if __name__ == "__main__":
    main()
