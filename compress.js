const successMessage = document.getElementById("successMessage");
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const quality = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");
const compressBtn = document.getElementById("compressBtn");
const downloadBtn = document.getElementById("downloadBtn");
const format = document.getElementById("format");

const fileSize = document.getElementById("fileSize");
const resizedSize = document.getElementById("resizedSize");
const savedPercent = document.getElementById("savedPercent");
const loader = document.getElementById("loader");

let originalFile;

imageInput.addEventListener("change", (e) => {
    originalFile = e.target.files[0];
    if (!originalFile) return;

    previewImage.src = URL.createObjectURL(originalFile);
    previewImage.style.display = "block";

    document.getElementById("resizeControls").style.display = "block";

    fileSize.textContent =
        (originalFile.size / 1024).toFixed(2) + " KB";
});

quality.addEventListener("input", () => {
    qualityValue.textContent = quality.value;
});

compressBtn.addEventListener("click", () => {

    if (!originalFile) {
        alert("Please select an image.");
        return;
    }

    loader.style.display = "block";

    const img = new Image();

    img.onload = function () {

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const mime = format.value;

        canvas.toBlob(function(blob){

            loader.style.display = "none";

            const newSize = blob.size;

            resizedSize.textContent =
                (newSize/1024).toFixed(2)+" KB";

            const saved =
                ((originalFile.size-newSize)/originalFile.size*100).toFixed(1);

            savedPercent.textContent = saved+"%";

            downloadBtn.href = URL.createObjectURL(blob);
            downloadBtn.download = "compressed-image";

            downloadBtn.style.display="block";

        }, mime, quality.value/100);

    };

    img.src = URL.createObjectURL(originalFile);

});
const themeBtn = document.getElementById("themeBtn");
// Default Dark Mode
document.body.classList.add("dark");
themeBtn.textContent = "☀️ Light Mode";

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.textContent = "☀ Light Mode";
    } else {
        themeBtn.textContent = "🌙 Dark Mode";
    }
});
const uploadBox = document.querySelector(".upload-box");

uploadBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadBox.classList.add("dragover");
});

uploadBox.addEventListener("dragleave", () => {
    uploadBox.classList.remove("dragover");
});

uploadBox.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadBox.classList.remove("dragover");

    const file = e.dataTransfer.files[0];
    if (!file) return;

    originalFile = file;

    imageInput.files = e.dataTransfer.files;

    previewImage.src = URL.createObjectURL(file);
    previewImage.style.display = "block";
    document.getElementById("resizeControls").style.display = "block";

    fileSize.textContent = (file.size / 1024).toFixed(2) + " KB";
});
const rotateLeftBtn = document.getElementById("rotateLeftBtn");
const rotateRightBtn = document.getElementById("rotateRightBtn");
const flipHorizontalBtn = document.getElementById("flipHorizontalBtn");
const flipVerticalBtn = document.getElementById("flipVerticalBtn");

let rotation = 0;
let flipX = 1;
let flipY = 1;


/*
resetBtn.addEventListener("click", () => {

    if (!originalFile) return;

    // Preview reset
    previewImage.src = URL.createObjectURL(originalFile);
    previewImage.style.transform = "rotate(0deg) scale(1,1)";

    // Quality reset
    quality.value = 90;
    qualityValue.textContent = "90";

    // Download button hide
    downloadBtn.style.display = "none";

    // Reset info
    resizedSize.textContent = "-";
    savedPercent.textContent = "-";

});
*/