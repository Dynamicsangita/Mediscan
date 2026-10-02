# MediScan | Smart Prescription Digitizer

MediScan is a high-accuracy, real-time prescription handwriting digitizer powered by a Deep Learning CRNN (Convolutional Recurrent Neural Network) + CTC greedy decoder, connected to an interactive frontend for patients and pharmacies.

The backend operates in **100% Stateless Mode** (no database required) — ensuring privacy and simple cloud deployment.

---

## 📁 Project Structure

```text
Backend(S)/
│
├── backend/                              # Flask REST API (Stateless)
│   ├── app.py                            # Server entry point
│   ├── requirements.txt                  # Python dependencies
│   ├── routes/
│   │   ├── __init__.py
│   │   └── prescription_routes.py        # /upload, /predict, /health endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── prescription_service.py       # File handling
│   │   └── ocr_service.py                # CRNN model inference & pharmacopeia lexicon
│   ├── utils/
│   │   ├── __init__.py
│   │   └── validators.py
│   └── uploads/                          # Temporary upload storage
│
├── frontend/                             # Vanilla Web App (Deployable on Vercel)
│   ├── index.html                        # Main UI layout
│   ├── style.css                         # Modern styling & animations
│   ├── script.js                         # Dynamic UI & backend API integration
│   └── vercel.json                       # Vercel configuration
│
├── ml_model/                             # Machine Learning & OCR Weights
│   ├── rx_ocr.py                         # CRNN architecture & training script
│   ├── best.weights.h5                   # Trained model weights (10.4 MB)
│   ├── vocab.json                        # 69-character CTC vocab mapping
│   ├── train.log                         # Training logs
│   └── test_metrics.json                 # Evaluation metrics
│
├── dataset/                              # Prescription Dataset
│   ├── Images/                           # Prescription word images
│   ├── Prescription_Labels.csv           # Ground truth annotations & pharmacy lexicon
│   └── Prescription_Labels.xlsx
│
├── notebooks/                            # Experimental Jupyter Notebooks
├── Procfile                              # Render deployment process definition
├── render.yaml                           # Render 1-click blueprint configuration
├── .gitignore                            # Standard git exclusions
└── README.md
```

---

## 🚀 Deployment Guide

### Part 1: Deploy Backend to Render

1. Push your repository to GitHub.
2. Go to [Render.com](https://render.com) and click **"New +"** → **"Web Service"**.
3. Select your GitHub repository.
4. Render will auto-detect the configuration, or configure it as follows:
   - **Name:** `mediscan-backend`
   - **Environment:** `Python 3`
   - **Root Directory:** *(leave blank / repository root)*
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `gunicorn --chdir backend app:app --bind 0.0.0.0:$PORT --workers 1 --timeout 180`
5. Click **"Deploy Web Service"**.
6. Once deployed, Render will give you a public URL (e.g. `https://mediscan-backend.onrender.com`).
   - Test it by visiting: `https://mediscan-backend.onrender.com/health`

---

### Part 2: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Import the same GitHub repository.
3. In the project configuration:
   - **Root Directory:** Click **Edit** and select `frontend`.
   - **Framework Preset:** Select `Other`.
4. Before clicking deploy (or right after):
   - In [`frontend/script.js`](frontend/script.js#L1475), set your Render backend URL:
     ```javascript
     const PRODUCTION_BACKEND_URL = "https://mediscan-backend.onrender.com";
     ```
5. Click **"Deploy"**.
6. Your frontend is now live on `https://your-project.vercel.app` and talking directly to your Render backend!

---

## 💻 Local Development

### 1. Run Backend:
```powershell
cd backend
python app.py
```
*Server runs on `http://localhost:5000`.*

### 2. Run Frontend:
```powershell
cd frontend
python -m http.server 8000
```
*Visit `http://localhost:8000` in your browser.*
