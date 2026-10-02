import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from routes.prescription_routes import prescription_bp

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
CORS(app, resources={r"/*": {"origins": "*"}})

# Register API blueprints
app.register_blueprint(prescription_bp)


# --------------------------------------------------
# Frontend & Static Files Serving
# --------------------------------------------------
@app.route("/", methods=["GET"])
def index():
    if os.path.exists(os.path.join(FRONTEND_DIR, "index.html")):
        return send_from_directory(FRONTEND_DIR, "index.html")
    return {
        "success": True,
        "message": "MediScan API is running in stateless mode",
        "endpoints": {
            "health": "/health",
            "upload_prescription": "POST /upload",
            "ocr_predict": "POST /predict"
        }
    }


@app.route("/<path:path>", methods=["GET"])
def static_proxy(path):
    if os.path.exists(os.path.join(FRONTEND_DIR, path)):
        return send_from_directory(FRONTEND_DIR, path)
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/health", methods=["GET"])
def health():
    return {
        "success": True,
        "status": "healthy",
        "mode": "stateless_ai_ocr",
        "message": "MediScan API is running healthy"
    }


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "0.0.0.0")
    debug = os.environ.get("FLASK_ENV") != "production"
    print(f"🚀 MediScan starting on http://{host}:{port}")
    app.run(host=host, port=port, debug=debug)
