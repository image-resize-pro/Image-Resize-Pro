const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const removeBgBtn = document.getElementById("removeBgBtn");
const downloadBtn = document.getElementById("downloadBtn");
const loader = document.getElementById("loader");
const themeBtn = document.getElementById("themeBtn");
const uploadBox = document.querySelector(".upload-box");

let originalFile;

// Default Dark Mode
document.body.classList.add("dark");
themeBtn.textContent = "☀️ Light Mode";

// Theme Toggle
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.textContent = "☀️ Light Mode";
    } else {
        themeBtn.textContent = "🌙 Dark Mode";
    }
});

// Image Upload
imageInput.addEventListener("change", (e) => {

    originalFile = e.target.files[0];
    if (!originalFile) return;

    previewImage.src = URL.createObjectURL(originalFile);
    previewImage.style.display = "block";
});

// Drag & Drop
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
});
removeBgBtn.addEventListener("click", () => {

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

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const bgColor = document.getElementById("bgColor").value;

        for (let i = 0; i < data.length; i += 4) {

            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // White Background
            if (bgColor === "white") {

                if (r > 220 && g > 220 && b > 220) {
                    data[i + 3] = 0;
                }

            }

            // Blue Background
            if (bgColor === "blue") {

                if (b > 120 && b > r + 20 && b > g + 20) {
                    data[i + 3] = 0;
                }

            }

        }

        ctx.putImageData(imageData, 0, 0);

        const result = canvas.toDataURL("image/png");

        previewImage.src = result;

        downloadBtn.href = result;
        downloadBtn.download = "background-removed.png";

        loader.style.display = "none";
        downloadBtn.style.display = "block";

    };

    img.src = URL.createObjectURL(originalFile);

});