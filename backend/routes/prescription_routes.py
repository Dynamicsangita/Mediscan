import os
import uuid
from flask import Blueprint, request, jsonify
from services.prescription_service import is_allowed_file, save_prescription_file
from services.ocr_service import run_ocr_on_image

prescription_bp = Blueprint("prescription", __name__)

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_FOLDER = os.path.join(BACKEND_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# --------------------------------------------------
# Stateless Upload & Digitization API
# --------------------------------------------------
@prescription_bp.route("/upload", methods=["POST"])
def upload_prescription():
    """
    Stateless endpoint: Receives prescription image, runs OCR model inference,
    and immediately returns the digitized prescription structure.
    No database storage required.
    """
    if "file" not in request.files:
        return jsonify({
            "success": False,
            "error": "No file uploaded"
        }), 400

    file = request.files["file"]

    if not file or file.filename == "":
        return jsonify({
            "success": False,
            "error": "No file selected"
        }), 400

    if not is_allowed_file(file.filename):
        return jsonify({
            "success": False,
            "error": "Invalid file type. Allowed: JPG, JPEG, PNG, WEBP, PDF."
        }), 400

    filename, file_path = save_prescription_file(file, UPLOAD_FOLDER)

    # Run CRNN model inference
    ocr_result = run_ocr_on_image(file_path)

    return jsonify({
        "success": True,
        "message": "Prescription processed and digitized successfully",
        "filename": filename,
        "ocr_result": ocr_result,
        "prescription_data": ocr_result.get("prescription_data", {})
    }), 200


# --------------------------------------------------
# Stateless OCR Predict Endpoint
# --------------------------------------------------
@prescription_bp.route("/predict", methods=["POST"])
def predict_prescription():
    """
    Direct endpoint for running OCR inference on an uploaded image.
    """
    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file uploaded"}), 400

    file = request.files["file"]
    if not file or not is_allowed_file(file.filename):
        return jsonify({"success": False, "error": "Invalid or missing file"}), 400

    filename, file_path = save_prescription_file(file, UPLOAD_FOLDER)
    ocr_result = run_ocr_on_image(file_path)

    return jsonify({
        "success": True,
        "filename": filename,
        "result": ocr_result,
        "prescription_data": ocr_result.get("prescription_data", {})
    }), 200


# --------------------------------------------------
# Prescriptions Endpoint (Stateless Notice)
# --------------------------------------------------
@prescription_bp.route("/prescriptions", methods=["GET"])
def get_prescriptions():
    """
    Returns notice that MediScan is operating in high-privacy stateless mode.
    """
    return jsonify({
        "success": True,
        "mode": "stateless",
        "message": "MediScan is running in stateless OCR mode. Prescriptions are processed in real-time and not stored in a database for maximum user privacy.",
        "count": 0,
        "prescriptions": []
    }), 200
