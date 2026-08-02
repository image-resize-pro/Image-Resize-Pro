const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");

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
            previewImage.style.display = "block";


            widthInput.value = originalImage.width;
            heightInput.value = originalImage.height;


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
const qualitySlider = document.getElementById("quality");


resizeBtn.addEventListener("click", function(){
    loader.style.display = "block";
loader.textContent = "⏳ Processing...";

    if(!originalImage.src){
        alert("Please select an image first.");
        return;
    }

const width = parseInt(widthInput.value);
const height = parseInt(heightInput.value);

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


    const format = formatSelect.value;

    const quality = qualitySlider.value / 100;


    const resizedImage = canvas.toDataURL(
        format,
        quality
    );

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
const rotateRightBtn = document.getElementById("rotateRightBtn");
const flipHorizontalBtn = document.getElementById("flipHorizontalBtn");
const flipVerticalBtn = document.getElementById("flipVerticalBtn");
const resetBtn = document.getElementById("resetBtn");

let rotation = 0;
let flipX = 1;
let flipY = 1;
const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeBtn.innerHTML = "☀️ Light Mode";
    }
    else{
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

    }

});
rotateLeftBtn.addEventListener("click", () => {
    rotation -= 90;
    previewImage.style.transform =
        `rotate(${rotation}deg) scale(${flipX}, ${flipY})`;
});
rotateRightBtn.addEventListener("click", () => {
    rotation += 90;
    previewImage.style.transform =
        `rotate(${rotation}deg) scale(${flipX}, ${flipY})`;
});
flipHorizontalBtn.addEventListener("click", () => {
    flipX *= -1;
    previewImage.style.transform =
        `rotate(${rotation}deg) scale(${flipX}, ${flipY})`;
});

flipVerticalBtn.addEventListener("click", () => {
    flipY *= -1;
    previewImage.style.transform =
        `rotate(${rotation}deg) scale(${flipX}, ${flipY})`;
});
resetBtn.addEventListener("click", () => {

    rotation = 0;
    flipX = 1;
    flipY = 1;

    previewImage.style.transform = "rotate(0deg) scale(1,1)";

    if (originalImage.src) {
        previewImage.src = originalImage.src;

        widthInput.value = originalImage.width;
        heightInput.value = originalImage.height;
    }

});