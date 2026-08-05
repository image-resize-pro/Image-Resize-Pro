const imageInput = document.getElementById("imageInput");
const previewContainer = document.getElementById("previewContainer");
const imageCount = document.getElementById("imageCount");
const pdfSize = document.getElementById("pdfSize");
const convertBtn = document.getElementById("convertBtn");
const downloadBtn = document.getElementById("downloadBtn");
const loader = document.getElementById("loader");
const themeBtn = document.getElementById("themeBtn");
const uploadBox = document.querySelector(".upload-box");

let images = [];

// Default Dark Mode
document.body.classList.add("dark");
themeBtn.textContent = "☀️ Light Mode";

// Theme Toggle
themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeBtn.textContent = "☀️ Light Mode";
    }else{
        themeBtn.textContent = "🌙 Dark Mode";
    }

});
// Image Upload
imageInput.addEventListener("change", (e) => {

    images = Array.from(e.target.files);

    previewContainer.innerHTML = "";

    let totalSize = 0;

    images.forEach(file => {

        totalSize += file.size;

        const reader = new FileReader();

        reader.onload = function(event){

            const img = document.createElement("img");

            img.src = event.target.result;

            previewContainer.appendChild(img);

        };

        reader.readAsDataURL(file);

    });

    imageCount.textContent = images.length;

    pdfSize.textContent =
        (totalSize / 1024 / 1024).toFixed(2) + " MB";

});
// Upload Box Click
uploadBox.addEventListener("click", () => {
    imageInput.click();
});

// Drag Over
uploadBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadBox.classList.add("dragover");
});

// Drag Leave
uploadBox.addEventListener("dragleave", () => {
    uploadBox.classList.remove("dragover");
});

// Drop Images
uploadBox.addEventListener("drop", (e) => {

    e.preventDefault();

    uploadBox.classList.remove("dragover");

    imageInput.files = e.dataTransfer.files;

    imageInput.dispatchEvent(new Event("change"));

});
convertBtn.addEventListener("click", async () => {

    if(images.length === 0){
        alert("Please select images first.");
        return;
    }

    loader.style.display = "flex";
    convertBtn.disabled = true;

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    for(let i=0;i<images.length;i++){

        const imgData = await new Promise(resolve=>{
            const reader = new FileReader();
            reader.onload=e=>resolve(e.target.result);
            reader.readAsDataURL(images[i]);
        });

        if(i>0) pdf.addPage();

        pdf.addImage(imgData,"JPEG",10,10,190,270);

    }

    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);

    downloadBtn.href = url;
    downloadBtn.download = "ImageResizePro.pdf";
    downloadBtn.style.display = "inline-block";

    loader.style.display = "none";
    convertBtn.disabled = false;

    alert("✅ PDF Created Successfully");

});