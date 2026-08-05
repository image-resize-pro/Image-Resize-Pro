const successMessage = document.getElementById("successMessage");
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const quality = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");
const convertBtn = document.getElementById("convertBtn");
const downloadBtn = document.getElementById("downloadBtn");
const format = document.getElementById("format");
const width = document.getElementById("width");
const height = document.getElementById("height");
const dimensions = document.getElementById("dimensions");
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
    const img = new Image();
    img.onload = function () {
    width.value = img.width;
    height.value = img.height;
    dimensions.textContent = img.width + " × " + img.height;
};

img.src = URL.createObjectURL(originalFile);
    document.getElementById("resizeControls").style.display = "block";

    fileSize.textContent =
        (originalFile.size / 1024).toFixed(2) + " KB";
       
});

quality.addEventListener("input", () => {
    qualityValue.textContent = quality.value;
});

convertBtn.addEventListener("click", () => {

    if (!originalFile) {
        alert("Please select an image.");
        return;
    }

    loader.style.display = "block";

    const img = new Image();

    img.onload = function () {
        width.value = img.width;
height.value = img.height;
dimensions.textContent = img.width + " × " + img.height;

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
    (newSize / 1024).toFixed(2) + " KB";

// Convert page par percentage hide rahega
savedPercent.textContent = "-";

            downloadBtn.href = URL.createObjectURL(blob);
            successMessage.style.display = "block";

setTimeout(() => {
    successMessage.style.display = "none";
}, 3000);
            if (mime === "image/jpeg") {
    downloadBtn.download = "converted-image.jpg";
} else if (mime === "image/png") {
    downloadBtn.download = "converted-image.png";
} else if (mime === "image/webp") {
    downloadBtn.download = "converted-image.webp";
}

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

});*/