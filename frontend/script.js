
/* ==========================================================
   MEDISCAN
   Vanilla HTML + CSS + JavaScript
   No React / No npm / No Tailwind
========================================================== */


/* ==========================================================
   APPLICATION STATE
========================================================== */

const state = {
    page: "upload",

    imageData: "",

    imageName: "",

    language: "en",

    cameraStream: null
};


/* ==========================================================
   MOCK PRESCRIPTION DATA
========================================================== */

const prescriptionData = {

    en: {

        patient: "Demo Patient",

        doctor: "Dr. A. Sharma",

        date: "10 September 2026",

        confidence: "High",

        summary:
            "AI-readable prescription summary prepared for pharmacy verification. Please compare the digital result with the original prescription before dispensing.",

        medicines: [

            {
                medicine: "Amoxicillin 500 mg",
                dosage: "1 capsule",
                frequency: "Twice daily",
                quantity: "10",
                confidence: "96%",
                level: "high"
            },

            {
                medicine: "Paracetamol 500 mg",
                dosage: "1 tablet",
                frequency: "As needed",
                quantity: "6",
                confidence: "94%",
                level: "high"
            },

            {
                medicine: "Text unclear",
                dosage: "Not detected",
                frequency: "Not detected",
                quantity: "—",
                confidence: "Low",
                level: "low"
            }

        ],

        warning:
            "The final line of the handwritten prescription is unclear. Do not assume a medicine, dosage, quantity or frequency from unreadable text.",

        details:
            "Two medicine entries were detected with high confidence. One handwritten line could not be read confidently. This is mock frontend data for demonstration only and is not a medical diagnosis."
    },


    hi: {

        patient: "डेमो मरीज",

        doctor: "डॉ. ए. शर्मा",

        date: "10 सितम्बर 2026",

        confidence: "उच्च",

        summary:
            "फार्मेसी सत्यापन के लिए AI द्वारा पढ़ी गई प्रिस्क्रिप्शन का डिजिटल सारांश। दवा देने से पहले डिजिटल परिणाम को मूल प्रिस्क्रिप्शन से मिलाएँ।",

        medicines: [

            {
                medicine: "Amoxicillin 500 mg",
                dosage: "1 कैप्सूल",
                frequency: "दिन में दो बार",
                quantity: "10",
                confidence: "96%",
                level: "high"
            },

            {
                medicine: "Paracetamol 500 mg",
                dosage: "1 टैबलेट",
                frequency: "जरूरत के अनुसार",
                quantity: "6",
                confidence: "94%",
                level: "high"
            },

            {
                medicine: "टेक्स्ट अस्पष्ट",
                dosage: "पता नहीं चला",
                frequency: "पता नहीं चला",
                quantity: "—",
                confidence: "कम",
                level: "low"
            }

        ],

        warning:
            "हस्तलिखित प्रिस्क्रिप्शन की अंतिम पंक्ति स्पष्ट नहीं है। अस्पष्ट टेक्स्ट से दवा, मात्रा या सेवन की आवृत्ति का अनुमान न लगाएँ।",

        details:
            "दो दवाओं की जानकारी उच्च confidence के साथ मिली है और एक पंक्ति पढ़ी नहीं जा सकी। यह केवल frontend demonstration के लिए mock AI output है, medical diagnosis नहीं।"
    }

};


/* ==========================================================
   ICONS
========================================================== */

const icons = {

    upload: "⬆",

    camera: "📷",

    arrow: "→",

    back: "←",

    copy: "▣",

    download: "↓",

    edit: "✎",

    refresh: "↻"
};


/* ==========================================================
   HEADER COMPONENT
========================================================== */

function Header() {

    return `

        <header class="header">

            <div class="container header-inner">

                <a
                    href="#"
                    class="logo"
                    onclick="goHome(); return false;"
                >

                    <span class="logo-icon">
                        +
                    </span>

                    <span>
                        MediScan
                    </span>

                </a>


                <nav class="navigation">

                    <button
                        class="nav-btn"
                        onclick="goHome()"
                    >
                        Home
                    </button>


                    <button
                        class="nav-btn"
                        onclick="showDemoResult()"
                    >
                        Demo Result
                    </button>

                </nav>

            </div>

        </header>

    `;
}


/* ==========================================================
   FOOTER COMPONENT
========================================================== */

function Footer() {

    return `

        <footer class="footer">

            <div class="container footer-inner">

                <div>

                    <div class="logo">

                        <span class="logo-icon">
                            +
                        </span>

                        <span>
                            MediScan
                        </span>

                    </div>

                    <p>
                        AI-assisted prescription digitization
                        for pharmacy workflows.
                    </p>

                </div>


                <div class="footer-links">

                    <a href="#" onclick="goHome(); return false;">
                        Upload
                    </a>

                    <a href="#" onclick="showDemoResult(); return false;">
                        Demo Result
                    </a>

                    <a
                        href="#"
                        onclick="
                            showToast('Privacy information is for demo purposes.');
                            return false;
                        "
                    >
                        Privacy
                    </a>

                </div>

            </div>

        </footer>

    `;
}


/* ==========================================================
   AI VIDEO COMPONENT
========================================================== */



function AIVideo() {
    return `
        <div class="ai-video">

            <div class="video-screen">

                <!-- Uploaded AI Video -->
                <video
                    class="medi-scan-video"
                    autoplay
                    muted
                    loop
                    playsinline
                    controls
                >
                    <source src="WhatsApp Video 2026-09-27 at 8.11.12 PM(1).mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>

                <!-- AI Label -->
                <div class="ai-label">
                    <span class="ai-dot"></span>
                    AI Video
                </div>

                <!-- Text Overlay -->
                <div class="ai-video-text">
                    <h3>Scan → Read → Digitize</h3>
                    <p>
                        AI-assisted scanning visual for
                        the MediScan pharmacy workflow.
                    </p>
                </div>

            </div>

        </div>
    `;
}


/* ==========================================================
   UPLOAD COMPONENT
========================================================== */

function UploadArea() {

    return `

        <section
            class="upload-section"
            id="uploadSection"
        >

            <div class="container">

                <div class="section-card">


                    <div class="section-title">

                        <div>

                            <h2>
                                Upload a prescription
                            </h2>

                            <p>
                                Use a clear JPG, PNG or WEBP
                                image for the best result.
                            </p>

                        </div>


                        <span class="eyebrow">

                            <span class="eyebrow-dot"></span>

                            Secure frontend demo

                        </span>

                    </div>



                    <div class="upload-grid">


                        <!-- DROPZONE -->

                        <div>

                            <label
                                class="dropzone"
                                id="dropzone"
                                for="fileInput"
                            >

                                <div>

                                    <div class="upload-icon">
                                        ${icons.upload}
                                    </div>


                                    <h3>
                                        Upload prescription image
                                    </h3>


                                    <p>
                                        Drag & drop here or
                                        <span class="browse">
                                            browse files
                                        </span>
                                    </p>


                                    <p>
                                        JPG · PNG · WEBP ·
                                        Maximum 10 MB
                                    </p>

                                </div>

                            </label>


                            <input
                                id="fileInput"
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                hidden
                            >



                            <!-- CAMERA -->

                            <div class="camera-panel">

                                <div>

                                    <strong>
                                        Prefer your camera?
                                    </strong>

                                    <p>
                                        Capture the prescription
                                        directly from your device.
                                    </p>

                                </div>


                                <button
                                    class="secondary-btn"
                                    onclick="openCamera()"
                                >

                                    ${icons.camera}

                                    Capture with Camera

                                </button>

                            </div>


                            <div
                                id="statusMessage"
                                class="status-message"
                            ></div>

                        </div>



                        <!-- PREVIEW -->

                        <div class="preview-card">

                            <div
                                class="preview-empty"
                                id="previewEmpty"
                            >

                                <div>

                                    <strong>
                                        No prescription selected
                                    </strong>

                                    <p>
                                        Your image preview
                                        will appear here.
                                    </p>

                                </div>

                            </div>


                            <img
                                id="previewImage"
                                class="preview-image"
                                alt="Prescription preview"
                            >


                            <div
                                id="previewInfo"
                                class="preview-info"
                            >

                                <span id="previewName">
                                    Prescription
                                </span>

                                <strong id="previewSize"></strong>

                            </div>

                        </div>

                    </div>



                    <div
                        style="
                            display:flex;
                            justify-content:flex-end;
                            margin-top:18px;
                        "
                    >

                        <button
                            id="continueBtn"
                            class="primary-btn"
                            onclick="continueToResult()"
                            disabled
                        >

                            Continue to AI Result

                            ${icons.arrow}

                        </button>

                    </div>


                </div>

            </div>

        </section>

    `;
}


/* ==========================================================
   UPLOAD PAGE
========================================================== */

function UploadPage() {

    return `

        <div class="app-shell">

            ${Header()}


            <main>


                <!-- HERO -->

                <section class="hero">

                    <div class="container hero-grid">


                        <div>

                            <span class="eyebrow">

                                <span class="eyebrow-dot"></span>

                                AI-powered pharmacy workflow

                            </span>


                            <h1>

                                MediScan:

                                <span class="gradient-text">
                                    Prescription Handwriting Digitizer
                                </span>

                                for Pharmacies

                            </h1>


                            <p class="hero-description">

                                Turn difficult handwritten prescriptions
                                into clear digital information.

                                MediScan uses AI-assisted text recognition
                                to help pharmacy staff review medicines,
                                dosage, quantity and frequency faster —
                                while clearly flagging uncertain text.

                            </p>


                            <div class="hero-actions">

                                <button
                                    class="primary-btn"
                                    onclick="scrollToUpload()"
                                >

                                    ${icons.upload}

                                    Upload Prescription

                                </button>


                                <button
                                    class="secondary-btn"
                                    onclick="openCamera()"
                                >

                                    ${icons.camera}

                                    Capture with Camera

                                </button>

                            </div>


                            <div class="trust-row">

                                <span class="trust-item">

                                    <span class="check">✓</span>

                                    Fast pharmacy workflow

                                </span>


                                <span class="trust-item">

                                    <span class="check">✓</span>

                                    Bilingual results

                                </span>


                                <span class="trust-item">

                                    <span class="check">✓</span>

                                    Uncertainty warnings

                                </span>

                            </div>

                        </div>


                        ${AIVideo()}

                    </div>

                </section>


                ${UploadArea()}


            </main>


            ${Footer()}

        </div>

    `;
}


/* ==========================================================
   RESULT PAGE
========================================================== */

function ResultPage() {

    const data =
        state.apiResult ||
        prescriptionData[state.language];


    const image =
        state.imageData ||
        createDemoPrescription();


    return `

        <div class="app-shell">

            ${Header()}


            <main>

                <section class="result-page">

                    <div class="container">


                        <button
                            class="back-btn"
                            onclick="goHome()"
                        >

                            ${icons.back}

                            Back to Upload

                        </button>


                        <div class="result-heading">

                            <span class="eyebrow">

                                <span class="eyebrow-dot"></span>

                                AI analysis complete

                            </span>


                            <h1>
                                Prescription Result
                            </h1>


                            <p>
                                Review the extracted information
                                before using it in a pharmacy workflow.
                            </p>

                        </div>



                        <div class="result-grid">


                            <!-- ORIGINAL PRESCRIPTION -->

                            <div class="image-card">

                                <img
                                    class="prescription-image"
                                    src="${image}"
                                    alt="Original prescription"
                                >


                                <div class="image-caption">

                                    <span>
                                        ${escapeHTML(
                                            state.imageName ||
                                            "Demo prescription"
                                        )}
                                    </span>

                                    <strong>
                                        Original
                                    </strong>

                                </div>

                            </div>



                            <!-- DIGITAL RESULT -->

                            <div class="result-card">

                                <div
                                    id="processing"
                                    class="processing"
                                >

                                    <span class="spinner"></span>

                                    <span>
                                        Analyzing prescription…
                                    </span>

                                </div>


                                <div
                                    id="resultContent"
                                    style="display:none;"
                                >

                                    <div class="result-top">

                                        <div>

                                            <h2>
                                                Digital Prescription
                                            </h2>

                                            <p>
                                                ${state.isLiveBackend
                                                    ? `<span style="color:#087f8c; font-weight:700;">🟢 Live AI Model (CRNN + CTC)</span>`
                                                    : `Demo AI Output`}
                                            </p>
                                            ${data.raw_text ? `<p style="font-size:0.85rem; color:#4a5568; margin-top:6px;"><strong>Recognized Text:</strong> <code style="background:#eef6f6; color:#05636e; padding:3px 8px; border-radius:4px; font-weight:bold;">${escapeHTML(data.raw_text)}</code></p>` : ""}

                                        </div>


                                        <div
                                            class="language-toggle"
                                        >

                                            <button
                                                class="
                                                    language-btn
                                                    ${state.language === "en" ? "active" : ""}
                                                "
                                                onclick="changeLanguage('en')"
                                            >
                                                English
                                            </button>


                                            <button
                                                class="
                                                    language-btn
                                                    ${state.language === "hi" ? "active" : ""}
                                                "
                                                onclick="changeLanguage('hi')"
                                            >
                                                हिंदी
                                            </button>

                                        </div>

                                    </div>



                                    <!-- PATIENT INFO -->

                                    <div class="info-grid">

                                        <div class="info-box">

                                            <div class="info-label">
                                                Patient
                                            </div>

                                            <div class="info-value">
                                                ${escapeHTML(data.patient)}
                                            </div>

                                        </div>


                                        <div class="info-box">

                                            <div class="info-label">
                                                Doctor
                                            </div>

                                            <div class="info-value">
                                                ${escapeHTML(data.doctor)}
                                            </div>

                                        </div>


                                        <div class="info-box">

                                            <div class="info-label">
                                                Date
                                            </div>

                                            <div class="info-value">
                                                ${escapeHTML(data.date)}
                                            </div>

                                        </div>


                                        <div class="info-box">

                                            <div class="info-label">
                                                AI Confidence
                                            </div>

                                            <div class="info-value">
                                                ${escapeHTML(data.confidence)}
                                            </div>

                                        </div>

                                    </div>



                                    <!-- SUMMARY -->

                                    <div class="description">

                                        ${escapeHTML(data.summary)}

                                    </div>



                                    <!-- MEDICINE TABLE -->

                                    <div class="table-wrapper">

                                        <table
                                            class="medicine-table"
                                        >

                                            <thead>

                                                <tr>

                                                    <th>
                                                        Medicine
                                                    </th>

                                                    <th>
                                                        Dosage
                                                    </th>

                                                    <th>
                                                        Frequency
                                                    </th>

                                                    <th>
                                                        Qty.
                                                    </th>

                                                    <th>
                                                        Confidence
                                                    </th>

                                                </tr>

                                            </thead>


                                            <tbody>

                                                ${data.medicines.map(
                                                    medicine => `

                                                    <tr>

                                                        <td>
                                                            <strong>
                                                                ${escapeHTML(
                                                                    medicine.medicine
                                                                )}
                                                            </strong>
                                                        </td>


                                                        <td>
                                                            ${escapeHTML(
                                                                medicine.dosage
                                                            )}
                                                        </td>


                                                        <td>
                                                            ${escapeHTML(
                                                                medicine.frequency
                                                            )}
                                                        </td>


                                                        <td>
                                                            ${escapeHTML(
                                                                medicine.quantity
                                                            )}
                                                        </td>


                                                        <td>

                                                            <span
                                                                class="
                                                                    confidence
                                                                    ${medicine.level}
                                                                "
                                                            >

                                                                ${escapeHTML(
                                                                    medicine.confidence
                                                                )}

                                                            </span>

                                                        </td>

                                                    </tr>

                                                `).join("")}

                                            </tbody>

                                        </table>

                                    </div>



                                    <!-- WARNING -->

                                    <div class="warning">

                                        ⚠

                                        ${escapeHTML(
                                            data.warning
                                        )}

                                    </div>



                                    <!-- DETAILS -->

                                    <div class="description">

                                        ${escapeHTML(
                                            data.details
                                        )}

                                    </div>



                                    <!-- ACTIONS -->

                                    <div class="result-actions">


                                        <button
                                            class="secondary-btn"
                                            onclick="editResult()"
                                        >

                                            ${icons.edit}

                                            Edit Result

                                        </button>


                                        <button
                                            class="secondary-btn"
                                            onclick="copyResult()"
                                        >

                                            ${icons.copy}

                                            Copy

                                        </button>


                                        <button
                                            class="secondary-btn"
                                            onclick="downloadResult()"
                                        >

                                            ${icons.download}

                                            Download

                                        </button>


                                        <button
                                            class="primary-btn"
                                            onclick="goHome()"
                                        >

                                            ${icons.refresh}

                                            Scan Another Prescription

                                        </button>


                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            </main>


            ${Footer()}

        </div>

    `;
}


/* ==========================================================
   RENDER
========================================================== */

function render() {

    const app =
        document.getElementById("app");


    if (state.page === "upload") {

        app.innerHTML =
            UploadPage();

        setupUploadEvents();

        restorePreview();

    }

    else {

        app.innerHTML =
            ResultPage();

        startAIProcessing();

    }

}


/* ==========================================================
   UPLOAD EVENTS
========================================================== */

function setupUploadEvents() {

    const fileInput =
        document.getElementById("fileInput");


    const dropzone =
        document.getElementById("dropzone");


    if (!fileInput || !dropzone) {
        return;
    }


    fileInput.addEventListener(
        "change",
        function(event) {

            const file =
                event.target.files[0];

            processFile(file);

        }
    );


    dropzone.addEventListener(
        "dragover",
        function(event) {

            event.preventDefault();

            dropzone.classList.add(
                "dragging"
            );

        }
    );


    dropzone.addEventListener(
        "dragleave",
        function() {

            dropzone.classList.remove(
                "dragging"
            );

        }
    );


    dropzone.addEventListener(
        "drop",
        function(event) {

            event.preventDefault();

            dropzone.classList.remove(
                "dragging"
            );


            const file =
                event.dataTransfer.files[0];


            processFile(file);

        }
    );

}


/* ==========================================================
   FILE PROCESSING
========================================================== */

function processFile(file) {

    const status =
        document.getElementById(
            "statusMessage"
        );


    if (!file) {
        return;
    }


    if (!file.type.startsWith("image/")) {

        status.textContent =
            "Please select a JPG, PNG or WEBP image.";

        return;

    }


    if (file.size > 10 * 1024 * 1024) {

        status.textContent =
            "Image size must be less than 10 MB.";

        return;

    }


    status.textContent = "";


    const reader =
        new FileReader();


    reader.onload =
        function(event) {

            state.imageData =
                event.target.result;

            state.imageName =
                file.name;
            state.currentFile = file;
            state.apiResult = null;
            state.isLiveBackend = false;


            updatePreview(
                file.size
            );

        };


    reader.readAsDataURL(file);

}


/* ==========================================================
   PREVIEW
========================================================== */

function updatePreview(size) {

    const image =
        document.getElementById(
            "previewImage"
        );


    const empty =
        document.getElementById(
            "previewEmpty"
        );


    const info =
        document.getElementById(
            "previewInfo"
        );


    const name =
        document.getElementById(
            "previewName"
        );


    const fileSize =
        document.getElementById(
            "previewSize"
        );


    const continueBtn =
        document.getElementById(
            "continueBtn"
        );


    if (!image) {
        return;
    }


    image.src =
        state.imageData;


    image.style.display =
        "block";


    empty.style.display =
        "none";


    info.style.display =
        "flex";


    name.textContent =
        state.imageName;


    fileSize.textContent =
        formatBytes(size);


    continueBtn.disabled =
        false;

}


/* ==========================================================
   RESTORE PREVIEW
========================================================== */

function restorePreview() {

    if (!state.imageData) {
        return;
    }


    const image =
        document.getElementById(
            "previewImage"
        );


    const empty =
        document.getElementById(
            "previewEmpty"
        );


    const info =
        document.getElementById(
            "previewInfo"
        );


    const name =
        document.getElementById(
            "previewName"
        );


    const continueBtn =
        document.getElementById(
            "continueBtn"
        );


    image.src =
        state.imageData;


    image.style.display =
        "block";


    empty.style.display =
        "none";


    info.style.display =
        "flex";


    name.textContent =
        state.imageName;


    continueBtn.disabled =
        false;

}


/* ==========================================================
   CONTINUE
========================================================== */


/* ==========================================================
   BACKEND API INTEGRATION
========================================================== */

// Set this to your deployed Render URL once deployed (e.g., "https://mediscan-backend.onrender.com")
const PRODUCTION_BACKEND_URL = "https://mediscan-a573.onrender.com";

const API_BASE_URL =
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
        ? "http://localhost:5000"
        : (PRODUCTION_BACKEND_URL || window.location.origin);

async function sendPrescriptionToBackend(fileOrDataUrl) {
    try {
        const formData = new FormData();
        if (state.currentFile) {
            formData.append("file", state.currentFile);
        } else if (state.imageData) {
            // Convert data URL to blob
            const response = await fetch(state.imageData);
            const blob = await response.blob();
            formData.append("file", blob, state.imageName || "prescription.png");
        } else {
            return null;
        }

        const res = await fetch(`${API_BASE_URL}/upload`, {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            console.warn("Backend responded with status:", res.status);
            return null;
        }

        const data = await res.json();
        console.log("Prescription upload response from backend:", data);
        return data;
    } catch (err) {
        console.info("Backend server not reachable at http://localhost:5000. Running in demo client mode.");
        return null;
    }
}

async function continueToResult() {

    if (!state.imageData) {

        showToast(
            "Please upload or capture a prescription first."
        );

        return;

    }

    state.page = "result";
    state.isAnalyzing = true;
    state.apiResult = null;
    render();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    try {
        const response = await sendPrescriptionToBackend();
        if (response && response.success && response.prescription_data) {
            state.apiResult = response.prescription_data;
            state.isLiveBackend = true;
            showToast("Prescription digitized with Live CRNN Model!");
        } else {
            state.isLiveBackend = false;
        }
    } catch (e) {
        console.warn("Backend error, falling back to demo:", e);
        state.isLiveBackend = false;
    } finally {
        state.isAnalyzing = false;
        render();
        const proc = document.getElementById("processing");
        const cont = document.getElementById("resultContent");
        if (proc) proc.style.display = "none";
        if (cont) cont.style.display = "block";
    }

}


/* ==========================================================
   AI PROCESSING ANIMATION
========================================================== */

function startAIProcessing() {

    const processing =
        document.getElementById(
            "processing"
        );


    const content =
        document.getElementById(
            "resultContent"
        );

    if (!processing || !content) return;

    if (!state.isAnalyzing) {
        processing.style.display = "none";
        content.style.display = "block";
        return;
    }

    processing.style.display = "flex";
    content.style.display = "none";

}


/* ==========================================================
   LANGUAGE TOGGLE
========================================================== */

function changeLanguage(language) {

    state.language =
        language;


    render();

}


/* ==========================================================
   DEMO RESULT
========================================================== */

function showDemoResult() {

    // Trigger backend upload in background if available
    sendPrescriptionToBackend();

    state.page =
        "result";


    render();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ==========================================================
   HOME
========================================================== */

function goHome() {

    stopCamera();


    state.page =
        "upload";


    render();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ==========================================================
   SCROLL
========================================================== */

function scrollToUpload() {

    const section =
        document.getElementById(
            "uploadSection"
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* ==========================================================
   CAMERA
========================================================== */

async function openCamera() {

    const modal =
        document.getElementById(
            "cameraModal"
        );


    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        showToast(
            "Camera is not supported by this browser."
        );

        return;

    }


    modal.classList.add(
        "active"
    );


    try {

        state.cameraStream =
            await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: {
                        ideal: "environment"
                    }
                },

                audio: false

            });


        const video =
            document.getElementById(
                "cameraVideo"
            );


        video.srcObject =
            state.cameraStream;


    }

    catch(error) {

        modal.classList.remove(
            "active"
        );


        showToast(
            "Camera permission was denied or unavailable."
        );

    }

}


/* ==========================================================
   CAPTURE
========================================================== */

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.id ===
            "captureBtn"
        ) {

            capturePhoto();

        }


        if (
            event.target.id ===
            "closeCamera"
        ) {

            closeCamera();

        }


        if (
            event.target.id ===
            "cancelCamera"
        ) {

            closeCamera();

        }

    }
);


function capturePhoto() {

    const video =
        document.getElementById(
            "cameraVideo"
        );


    if (
        !video ||
        video.readyState < 2
    ) {

        showToast(
            "Camera is not ready yet."
        );

        return;

    }


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        video.videoWidth ||
        1280;


    canvas.height =
        video.videoHeight ||
        960;


    const context =
        canvas.getContext("2d");


    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );


    canvas.toBlob(
        function(blob) {

            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    state.imageData =
                        event.target.result;

                    state.imageName =
                        "camera-prescription.jpg";


                    closeCamera();


                    state.page =
                        "upload";


                    render();


                    showToast(
                        "Prescription captured successfully."
                    );

                };


            reader.readAsDataURL(blob);

        },
        "image/jpeg",
        0.92
    );

}


/* ==========================================================
   CLOSE CAMERA
========================================================== */

function closeCamera() {

    stopCamera();


    const modal =
        document.getElementById(
            "cameraModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


function stopCamera() {

    if (state.cameraStream) {

        state.cameraStream
            .getTracks()
            .forEach(
                track => track.stop()
            );


        state.cameraStream =
            null;

    }

}


/* ==========================================================
   COPY RESULT
========================================================== */

async function copyResult() {

    const data =
        prescriptionData[
            state.language
        ];


    let text =
        "MediScan Prescription Result\n\n";


    text +=
        "Patient: " +
        data.patient +
        "\n";


    text +=
        "Doctor: " +
        data.doctor +
        "\n";


    text +=
        "Date: " +
        data.date +
        "\n\n";


    data.medicines.forEach(
        function(medicine, index) {

            text +=
                `${index + 1}. ` +
                medicine.medicine +
                " | " +
                medicine.dosage +
                " | " +
                medicine.frequency +
                " | Qty: " +
                medicine.quantity +
                "\n";

        }
    );


    text +=
        "\nWarning: " +
        data.warning;


    try {

        await navigator.clipboard.writeText(
            text
        );


        showToast(
            "Prescription result copied."
        );

    }

    catch(error) {

        showToast(
            "Copy is not available in this browser."
        );

    }

}


/* ==========================================================
   DOWNLOAD
========================================================== */

function downloadResult() {

    const data =
        prescriptionData[
            state.language
        ];


    let text =
        "MEDISCAN PRESCRIPTION RESULT\n\n";


    text +=
        "Patient: " +
        data.patient +
        "\n";


    text +=
        "Doctor: " +
        data.doctor +
        "\n";


    text +=
        "Date: " +
        data.date +
        "\n\n";


    data.medicines.forEach(
        function(medicine, index) {

            text +=
                `${index + 1}. ${medicine.medicine}\n`;

            text +=
                `Dosage: ${medicine.dosage}\n`;

            text +=
                `Frequency: ${medicine.frequency}\n`;

            text +=
                `Quantity: ${medicine.quantity}\n`;

            text +=
                `Confidence: ${medicine.confidence}\n\n`;

        }
    );


    text +=
        "WARNING:\n" +
        data.warning;


    const blob =
        new Blob(
            [text],
            {
                type:
                    "text/plain;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "mediscan-prescription-result.txt";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


    showToast(
        "Result downloaded."
    );

}


/* ==========================================================
   EDIT RESULT
========================================================== */

function editResult() {

    const data =
        prescriptionData[
            state.language
        ];


    const newName =
        prompt(
            state.language === "en"
                ? "Edit first medicine name:"
                : "पहली दवा का नाम बदलें:",
            data.medicines[0].medicine
        );


    if (
        newName &&
        newName.trim()
    ) {

        data.medicines[0].medicine =
            newName.trim();


        render();


        showToast(
            "Result updated."
        );

    }

}


/* ==========================================================
   DEMO PRESCRIPTION IMAGE
========================================================== */

function createDemoPrescription() {

    const svg = `

        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="900"
            height="1100"
        >

            <rect
                width="900"
                height="1100"
                fill="#f4f0e8"
            />


            <rect
                x="85"
                y="65"
                width="730"
                height="970"
                rx="12"
                fill="#fffdf7"
                stroke="#d9d1c1"
                stroke-width="5"
            />


            <text
                x="130"
                y="145"
                font-family="Arial"
                font-size="40"
                fill="#1d5560"
                font-weight="700"
            >
                Dr. A. Sharma
            </text>


            <text
                x="130"
                y="185"
                font-family="Arial"
                font-size="21"
                fill="#65747a"
            >
                General Physician
            </text>


            <line
                x1="130"
                y1="215"
                x2="770"
                y2="215"
                stroke="#d8d1c6"
                stroke-width="3"
            />


            <text
                x="135"
                y="275"
                font-family="cursive"
                font-size="38"
                fill="#3e3b38"
            >
                Rx
            </text>


            <text
                x="190"
                y="335"
                font-family="cursive"
                font-size="31"
                fill="#3e3b38"
            >
                Amoxicillin 500 mg
            </text>


            <text
                x="190"
                y="390"
                font-family="cursive"
                font-size="28"
                fill="#3e3b38"
            >
                1 capsule twice daily
            </text>


            <text
                x="190"
                y="475"
                font-family="cursive"
                font-size="31"
                fill="#3e3b38"
            >
                Paracetamol 500 mg
            </text>


            <text
                x="190"
                y="530"
                font-family="cursive"
                font-size="28"
                fill="#3e3b38"
            >
                1 tablet when required
            </text>


            <path
                d="M150 615
                   C260 575,340 675,460 625
                   S680 600,750 660"
                fill="none"
                stroke="#46423e"
                stroke-width="5"
            />


            <path
                d="M155 685
                   C280 645,370 740,490 690
                   S660 665,755 730"
                fill="none"
                stroke="#46423e"
                stroke-width="5"
            />


            <path
                d="M150 800
                   C270 750,380 850,500 800"
                fill="none"
                stroke="#46423e"
                stroke-width="5"
            />


            <text
                x="135"
                y="950"
                font-family="Arial"
                font-size="18"
                fill="#8c8477"
            >
                MediScan Demo Prescription
            </text>

        </svg>
    `;


    return (
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(svg)
    );

}


/* ==========================================================
   UTILITY FUNCTIONS
========================================================== */

function formatBytes(bytes) {

    if (!bytes) {
        return "";
    }


    const units = [
        "B",
        "KB",
        "MB"
    ];


    let index = 0;


    let size = bytes;


    while (
        size >= 1024 &&
        index < units.length - 1
    ) {

        size /= 1024;

        index++;

    }


    return (
        size.toFixed(
            index === 0 ? 0 : 1
        ) +
        " " +
        units[index]
    );

}


function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


/* ==========================================================
   TOAST
========================================================== */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function() {

                toast.classList.remove(
                    "show"
                );

            },
            2600
        );

}


/* ==========================================================
   START APPLICATION
========================================================== */

render();