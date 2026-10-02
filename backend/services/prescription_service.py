"""
Prescription service handling file storage and validation
"""

import os
import uuid
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "pdf"}


def is_allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def save_prescription_file(file, upload_folder):
    """
    Saves uploaded file securely with a unique filename.
    """
    os.makedirs(upload_folder, exist_ok=True)
    orig_name = secure_filename(file.filename or "prescription.png")
    ext = orig_name.rsplit(".", 1)[1].lower() if "." in orig_name else "png"
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join(upload_folder, unique_name)
    file.save(file_path)
    return unique_name, file_path
