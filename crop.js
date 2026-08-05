const successMessage =
document.getElementById("successMessage");
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");

const cropBtn = document.getElementById("cropBtn");
const applyCropBtn = document.getElementById("applyCropBtn");

const rotateRightBtn = document.getElementById("rotateRightBtn");

const flipHorizontalBtn = document.getElementById("flipHorizontalBtn");


const resetBtn = document.getElementById("resetBtn");

const downloadBtn = document.getElementById("downloadBtn");

const qualitySlider = document.getElementById("quality");

const formatSelect = document.getElementById("format");

const loader = document.getElementById("loader");

const themeBtn = document.getElementById("themeBtn");

let cropper = null;

let originalImage = "";

let scaleX = 1;
let scaleY = 1;

const originalSize = document.getElementById("originalSize");
const originalDimension = document.getElementById("originalDimension");

const croppedSize = document.getElementById("croppedSize");
const croppedDimension = document.getElementById("croppedDimension");

const customWidth = document.getElementById("customWidth");
const customHeight = document.getElementById("customHeight");

document.body.classList.add("dark");

themeBtn.innerHTML = "☀️ Light Mode";

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        themeBtn.innerHTML = "☀️ Light Mode";

    }else{

        themeBtn.innerHTML = "🌙 Dark Mode";

    }

});
imageInput.addEventListener("change", function(){

    const file = this.files[0];
    originalSize.textContent =
(file.size / 1024).toFixed(1) + " KB";

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        originalImage = e.target.result;

        previewImage.src = originalImage;
        previewImage.onload = function(){

originalDimension.textContent =
previewImage.naturalWidth + " × " +
previewImage.naturalHeight;

customWidth.value =
previewImage.naturalWidth;

customHeight.value =
previewImage.naturalHeight;

}

        previewImage.style.display = "block";

    }

    reader.readAsDataURL(file);

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

    if (!file || !file.type.startsWith("image/")) return;

    imageInput.files = e.dataTransfer.files;

    imageInput.dispatchEvent(new Event("change"));

});
cropBtn.addEventListener("click", () => {

    if (!previewImage.src) return;

    if (cropper) {

        cropper.destroy();

    }

    cropper = new Cropper(previewImage, {

        viewMode: 1,

        autoCropArea: 1,

        movable: true,

        zoomable: true,

        scalable: true,

        rotatable: true,

        responsive: true

    });

    applyCropBtn.style.display = "flex";

});
applyCropBtn.addEventListener("click", () => {

    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas({

width: customWidth.value || undefined,

height: customHeight.value || undefined

});

    const format = formatSelect.value;
    const quality = qualitySlider.value / 100;

    const croppedImage = canvas.toDataURL(format, quality);
    croppedDimension.textContent =
canvas.width + " × " + canvas.height;

croppedSize.textContent =
(Math.round((croppedImage.length * 3) / 4) / 1024).toFixed(1) + " KB";

    previewImage.src = croppedImage;

    originalImage = croppedImage;

   /* downloadBtn.href = croppedImage;
    

    if (format === "image/jpeg") {

        downloadBtn.download = "cropped-image.jpg";

    } else if (format === "image/webp") {

        downloadBtn.download = "cropped-image.webp";

    } else {

        downloadBtn.download = "cropped-image.png";

    }*/

    cropper.destroy();

    cropper = null;

    applyCropBtn.style.display = "none";
    successMessage.style.display = "block";

setTimeout(() => {

successMessage.style.display = "none";

},3000);

});

rotateRightBtn.addEventListener("click", () => {

    if (!cropper) return;

    cropper.rotate(90);

});

flipHorizontalBtn.addEventListener("click", () => {

    if (!cropper) return;

    scaleX *= -1;

    cropper.scaleX(scaleX);

});

resetBtn.addEventListener("click", () => {

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }

    previewImage.src = originalImage;

    scaleX = 1;
    scaleY = 1;

    applyCropBtn.style.display = "none";
    

});
const qualityValue = document.getElementById("qualityValue");

qualitySlider.addEventListener("input", () => {

    qualityValue.textContent =
        qualitySlider.value + "%";

});
downloadBtn.addEventListener("click", function () {

    const format = formatSelect.value;
    const quality = qualitySlider.value / 100;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();

    img.onload = function () {

        canvas.width = img.width;
        canvas.height = img.height;

        if (format === "image/jpeg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        const output = canvas.toDataURL(format, quality);

        downloadBtn.href = output;

        if (format === "image/jpeg") {
            downloadBtn.download = "cropped-image.jpg";
        } else if (format === "image/webp") {
            downloadBtn.download = "cropped-image.webp";
        } else {
            downloadBtn.download = "cropped-image.png";
        }

    };

    img.src = previewImage.src;

});
window.addEventListener("load", () => {

    loader.style.display = "none";

});