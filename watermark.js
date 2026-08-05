const imageInput = document.getElementById("imageInput");

const previewImage = document.getElementById("previewImage");
const watermarkText = document.getElementById("watermarkText");
const fontSize = document.getElementById("fontSize");
const fontSizeValue = document.getElementById("fontSizeValue");
fontSize.addEventListener("input", () => {
    fontSizeValue.textContent = fontSize.value;
});
const addWatermarkBtn = document.getElementById("addWatermarkBtn");
const downloadBtn = document.getElementById("downloadBtn");
const loader = document.getElementById("loader");
const themeBtn = document.getElementById("themeBtn");
const fileSize = document.getElementById("fileSize");
const dimensions = document.getElementById("dimensions");
const resizedSize = document.getElementById("resizedSize");
const savedPercent = document.getElementById("savedPercent");
const uploadBox = document.querySelector(".upload-box");

const opacity = document.getElementById("opacity");
const opacityValue = document.getElementById("opacityValue");
const watermarkColor = document.getElementById("watermarkColor");
const downloadFormat = document.getElementById("downloadFormat");

opacity.addEventListener("input", () => {
    opacityValue.textContent = opacity.value;
});

let originalFile = null;
// Default Dark Mode
document.body.classList.add("dark");
themeBtn.textContent = "☀️ Light Mode";

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeBtn.textContent = "☀️ Light Mode";
    }else{
        themeBtn.textContent = "🌙 Dark Mode";
    }

});
imageInput.addEventListener("change",(e)=>{

    originalFile = e.target.files[0];

    if(!originalFile) return;

    document.getElementById("fileSize").textContent =
(originalFile.size / 1024).toFixed(2) + " KB";

fileSize.textContent = (originalFile.size / 1024).toFixed(2) + " KB";

    previewImage.src = URL.createObjectURL(originalFile);
    previewImage.style.display = "block";

    downloadBtn.style.display = "none";

});
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

    if (!file || !file.type.startsWith("image/")) return;

    originalFile = file;
    fileSize.textContent = (originalFile.size / 1024).toFixed(2) + " KB";

    imageInput.files = e.dataTransfer.files;

    previewImage.src = URL.createObjectURL(file);
    previewImage.style.display = "block";

    downloadBtn.style.display = "none";

});
addWatermarkBtn.addEventListener("click", () => {

    if (!originalFile) {
        alert("Please select an image first.");
        return;
    }

    loader.style.display = "block";

    const img = new Image();

    img.onload = function () {

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        dimensions.textContent = img.width + " × " + img.height;

        // Draw Original Image
        ctx.drawImage(img, 0, 0);

        // Watermark Text
        ctx.save();

ctx.translate(canvas.width / 2, canvas.height / 2);

ctx.rotate(-Math.PI / 4);

ctx.font = "bold " + fontSize.value + "px Arial";

const alpha = opacity.value / 100;
const hex = watermarkColor.value;

const r = parseInt(hex.substr(1,2),16);
const g = parseInt(hex.substr(3,2),16);
const b = parseInt(hex.substr(5,2),16);

ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;

ctx.textAlign = "center";

ctx.fillText(
    watermarkText.value || "IMAGE RESIZE PRO",
    0,
    0
);

ctx.restore();
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.textAlign = "center";

        ctx.fillText(
            watermarkText.value || "Image Resize Pro",
            canvas.width / 2,
            canvas.height - 40
        );

        // Result
        let mime = "image/png";
let ext = "png";

if (downloadFormat.value === "jpeg") {
    mime = "image/jpeg";
    ext = "jpg";
} else if (downloadFormat.value === "webp") {
    mime = "image/webp";
    ext = "webp";
}

const result = canvas.toDataURL(mime, 0.9);
        const resizedKB = (result.length * 3 / 4 / 1024).toFixed(2);

resizedSize.textContent = resizedKB + " KB";

const saved =
(((originalFile.size / 1024) - resizedKB) / (originalFile.size / 1024) * 100);

savedPercent.textContent = saved.toFixed(1) + "%";

        previewImage.src = result;

        downloadBtn.href = result;
        downloadBtn.download = "watermarked-image." + ext;
        downloadBtn.style.display = "inline-block";

        loader.style.display = "none";

    };

    img.src = URL.createObjectURL(originalFile);

});