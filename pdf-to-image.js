const pdfInput = document.getElementById("pdfInput");

const pdfPreview = document.getElementById("pdfPreview");

const convertBtn = document.getElementById("convertBtn");

const downloadSection = document.getElementById("downloadSection");

const imageFormat = document.getElementById("imageFormat");

const loader = document.getElementById("loader");

const themeBtn = document.getElementById("themeBtn");

let pdfFile = null;
document.body.classList.add("dark");

themeBtn.innerHTML = "☀️ Light Mode";

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        themeBtn.innerHTML="☀️ Light Mode";

    }else{

        themeBtn.innerHTML="🌙 Dark Mode";

    }

});
pdfInput.addEventListener("change",function(){

    pdfFile=this.files[0];

    if(!pdfFile) return;

    pdfPreview.innerHTML=
    `<h3>${pdfFile.name}</h3>
     <p>PDF Ready to Convert</p>`;

});
pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

convertBtn.addEventListener("click", async () => {

    if (!pdfFile) {

        alert("Please select a PDF first.");

        return;

    }

    loader.style.display = "block";

    downloadSection.innerHTML = "";

    const fileReader = new FileReader();

    fileReader.onload = async function () {

        const typedArray = new Uint8Array(this.result);

        const pdf = await pdfjsLib.getDocument(typedArray).promise;

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {

            const page = await pdf.getPage(pageNumber);

            const viewport = page.getViewport({ scale: 2 });

            const canvas = document.createElement("canvas");

            const ctx = canvas.getContext("2d");

            canvas.width = viewport.width;

            canvas.height = viewport.height;

            await page.render({

                canvasContext: ctx,

                viewport: viewport

            }).promise;

            let mime = "image/png";

            if (imageFormat.value === "jpeg") {

                mime = "image/jpeg";

            }

            if (imageFormat.value === "webp") {

                mime = "image/webp";

            }

            const imageURL = canvas.toDataURL(mime, 0.95);

            const card = document.createElement("div");

            card.className = "page-card";

            card.innerHTML = `

                <img src="${imageURL}">

                <a href="${imageURL}"

                   download="page-${pageNumber}.${imageFormat.value}">

                   Download Page ${pageNumber}

                </a>

            `;

            downloadSection.appendChild(card);

        }

        loader.style.display = "none";

    };

    fileReader.readAsArrayBuffer(pdfFile);

});