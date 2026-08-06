const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");

const removeImageBtn = document.getElementById("removeImageBtn");

const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");

const fileSizeText = document.getElementById("fileSize");
const dimensionsText = document.getElementById("dimensions");
const resizedSizeText = document.getElementById("resizedSize");
const savedPercentText = document.getElementById("savedPercent");
const loader = document.getElementById("loader");

const lockRatio = document.getElementById("lockRatio");

let originalImage = new Image();
let aspectRatio = 1;
let cropper = null;

const rightPanel = document.querySelector(".right-panel");
rightPanel.style.display = "none";

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;
    


    // Original file size
    const sizeKB = (file.size / 1024).toFixed(2);
    fileSizeText.textContent = sizeKB + " KB";


    const reader = new FileReader();


    reader.onload = function(e){

        originalImage.src = e.target.result;

originalImage.onload = function(){

    previewImage.src = originalImage.src;
    document.getElementById("uploadBox").style.display = "none";
    rightPanel.style.display = "flex";
    previewImage.style.display = "block";
    rightPanel.style.display = "flex";
    document.querySelector(".right-panel").style.display = "flex";

    document.querySelector(".preview").style.display = "block";
    document.querySelector(".image-info").style.display = "block";
    document.getElementById("resizeControls").style.display = "block";
    document.querySelector(".format-box").style.display = "block";
    downloadBtn.style.display = "block";

   
    cropBtn.style.display = "block";

    widthInput.value = originalImage.width;
    heightInput.value = originalImage.height;

    if (cropper) {
        cropper.destroy();
    }

    aspectRatio = originalImage.width / originalImage.height;

    dimensionsText.textContent =
        originalImage.width + " × " + originalImage.height + " px";
};

    };


    reader.readAsDataURL(file);

});


// Lock Aspect Ratio

widthInput.addEventListener("input", function(){

    if(lockRatio.checked && aspectRatio){

        heightInput.value =
        Math.round(widthInput.value / aspectRatio);

    }

});


heightInput.addEventListener("input", function(){

    if(lockRatio.checked && aspectRatio){

        widthInput.value =
        Math.round(heightInput.value * aspectRatio);

    }

});

const resizeBtn = document.getElementById("resizeBtn");
const downloadBtn = document.getElementById("downloadBtn");

const formatSelect = document.getElementById("format");


const targetSizeInput = document.getElementById("targetSize");
const targetUnit = document.getElementById("targetUnit");

function getImageData(canvas, format, quality) {
    return canvas.toDataURL(format, quality);
}

function getImageSize(base64) {
    return (base64.length * 3) / 4;
}

function findTargetQuality(canvas, format, targetBytes){

    let min = 0.05;
    let max = 1.0;

    let bestImage = "";
    let bestQuality = 1;

    for(let i = 0; i < 10; i++){

        let quality = (min + max) / 2;

        let image = canvas.toDataURL(format, quality);

        let size = getImageSize(image);

        bestImage = image;
        bestQuality = quality;

        if(Math.abs(size - targetBytes) < 2048){
            break;
        }

        if(size > targetBytes){
            max = quality;
        }else{
            min = quality;
        }

    }

    return {
        image: bestImage,
        quality: bestQuality
    };

}

resizeBtn.addEventListener("click", function(){

console.log("Resize button clicked");

    loader.style.display = "block";
loader.textContent = "⏳ Processing...";

    if(!originalImage.src){
        alert("Please select an image first.");
        return;
    }

const width = parseInt(widthInput.value);
const height = parseInt(heightInput.value);

console.log("Width:", width);
console.log("Height:", height);

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

if (rotation % 180 === 0) {
    canvas.width = width;
    canvas.height = height;
} else {
    canvas.width = height;
    canvas.height = width;
}

  ctx.save();

// JPG ke liye pehle white background
if(formatSelect.value === "image/jpeg"){
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

ctx.translate(canvas.width / 2, canvas.height / 2);

ctx.rotate(-rotation * Math.PI / 180);

ctx.scale(flipX, flipY);

ctx.drawImage(
    originalImage,
    -width / 2,
    -height / 2,
    width,
    height
);

ctx.restore();

let quality = 0.90;

let targetBytes = null;

if (targetSizeInput.value.trim() !== "") {

    targetBytes = parseFloat(targetSizeInput.value);

    if (targetUnit.value === "KB") {
        targetBytes *= 1024;
    } else {
        targetBytes *= 1024 * 1024;
    }

}
    const format = formatSelect.value;
    

    


    let resizedImage;

if(targetBytes){

    const result = findTargetQuality(
        canvas,
        format,
        targetBytes
    );

    resizedImage = result.image;

}else{

    resizedImage = canvas.toDataURL(
        format,
        quality
    );

}
    downloadBtn.href = resizedImage;

if (format === "image/jpeg") {
    downloadBtn.download = "resized-image.jpg";
} else if (format === "image/webp") {
    downloadBtn.download = "resized-image.webp";
} else {
    downloadBtn.download = "resized-image.png";
}

    const resizedSizeKB = ((resizedImage.length * 3 / 4) / 1024).toFixed(2);
resizedSizeText.textContent = resizedSizeKB + " KB";
const originalSizeKB = parseFloat(fileSizeText.textContent);

const savedPercent = (
    (originalSizeKB - resizedSizeKB) / originalSizeKB
) * 100;

savedPercentText.textContent =
    savedPercent.toFixed(1) + "%";

    previewImage.src = resizedImage;


    downloadBtn.href = resizedImage;
    const successMessage = document.getElementById("successMessage");
successMessage.style.display = "block";
successMessage.textContent =
"✅ Image resized successfully! Click Download.";
    setTimeout(() => {
    loader.style.display = "none";
}, 800);


    // Download file name

    if(format === "image/jpeg"){
        downloadBtn.download = "resized-image.jpg";
    }
    else if(format === "image/webp"){
        downloadBtn.download = "resized-image.webp";
    }
    else{
        downloadBtn.download = "resized-image.png";
    }

});
const rotateLeftBtn = document.getElementById("rotateLeftBtn");

const flipHorizontalBtn = document.getElementById("flipHorizontalBtn");



let rotation = 0;
let flipX = 1;
let flipY = 1;
const themeBtn = document.getElementById("themeBtn");

// Default Dark Mode
document.body.classList.add("dark");
themeBtn.innerHTML = "☀️ Light Mode";

// Theme Toggle
themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.innerHTML = "☀️ Light Mode";
    } else {
        themeBtn.innerHTML = "🌙 Dark Mode";
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

    if(file && file.type.startsWith("image/")){

        imageInput.files = e.dataTransfer.files;

        imageInput.dispatchEvent(new Event("change"));

        document.querySelector(".right-panel").style.display = "flex";

    }

});
rotateLeftBtn.addEventListener("click", () => {
    rotation -= 90;
    previewImage.style.transform =
        `rotate(${rotation}deg) scale(${flipX}, ${flipY})`;
});


flipHorizontalBtn.addEventListener("click", () => {
    flipX *= -1;
    previewImage.style.transform =
        `rotate(${rotation}deg) scale(${flipX}, ${flipY})`;
});



const cropBtn = document.getElementById("cropBtn");
const applyCropBtn = document.getElementById("applyCropBtn");

cropBtn.addEventListener("click", () => {

    rightPanel.classList.add("crop-mode");

    if (cropper) {
        cropper.destroy();
    }

    cropper = new Cropper(previewImage, {
        viewMode: 1,
        autoCropArea: 1,
        movable: true,
        zoomable: true,
        scalable: true,
        rotatable: true
    });

    document.getElementById("applyCropBtn").style.display = "block";

});
applyCropBtn.addEventListener("click", () => {

    if (!cropper) return;

   const canvas = cropper.getCroppedCanvas();

let croppedImage;

if (formatSelect.value === "image/jpeg") {
    croppedImage = canvas.toDataURL("image/jpeg", 0.90);
} else if (formatSelect.value === "image/webp") {
    croppedImage = canvas.toDataURL("image/webp", 0.90);
} else {
    croppedImage = canvas.toDataURL("image/png");
}

previewImage.src = croppedImage;

originalImage.src = croppedImage;

downloadBtn.href = croppedImage;

if (formatSelect.value === "image/jpeg") {
    downloadBtn.download = "cropped-image.jpg";
} else if (formatSelect.value === "image/webp") {
    downloadBtn.download = "cropped-image.webp";
} else {
    downloadBtn.download = "cropped-image.png";
}

cropper.destroy();
cropper = null;

applyCropBtn.style.display = "none";

rightPanel.classList.remove("crop-mode");

});
removeImageBtn.addEventListener("click", function () {

    previewImage.src = "";
    previewImage.style.display = "none";
document.getElementById("uploadBox").style.display = "block";
    imageInput.value = "";

    document.querySelector(".preview").style.display = "none";
    document.querySelector(".image-info").style.display = "none";
    document.getElementById("resizeControls").style.display = "none";

    rightPanel.style.display = "none";

    widthInput.value = "";
    heightInput.value = "";
});