const fileInput = document.querySelector("#upload");
const colorPicker = document.querySelector("#color-picker");
const widthInput = document.querySelector("#width-input");
const heightInput = document.querySelector("#height-input");
const bgImagePicker = document.querySelector("#imagebg-picker");
const exportButton = document.querySelector("#export-button");
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

let imgToResize = null;
let canvasWidth = 700;
let canvasHeight = 300;
let backgroundColor = 'black';
let scale = 1.00;
let xOffset = 0;
let yOffset = 0;
let isDragging = false;
let mouseStartX, mouseStartY;
let canvasOffsetX, canvasOffsetY;

document.addEventListener("DOMContentLoaded", function () {
    calcOffsetOfCanvas();
    window.onscroll = function (e) { calcOffsetOfCanvas(); }
    window.onresize = function (e) { calcOffsetOfCanvas(); }
    canvas.onresize = function (e) { calcOffsetOfCanvas(); }

    renderCanvas();
    canvas.onmousedown = handleMouseDown;
    canvas.onmousemove = handleMouseMove;
    canvas.onmouseup = handleMouseUp;
    canvas.onmouseout = handleMouseOut;
    canvas.onmousewheel = handleScroll;
});

colorPicker.addEventListener("change", async (e) => {
    backgroundColor = e.target.value;
    renderCanvas();
});

bgImagePicker.addEventListener("change", async (e) => {
    renderCanvas();
});


heightInput.addEventListener("change", async (e) => {
    canvasHeight = e.target.value;
    renderCanvas();
});

widthInput.addEventListener("change", async (e) => {
    canvasWidth = e.target.value;
    renderCanvas();
});

function calcOffsetOfCanvas() {
    const canvasBounds = canvas.getBoundingClientRect();
    canvasOffsetX = canvasBounds.left;
    canvasOffsetY = canvasBounds.top;
}

function downloadImage() {
    console.log('download image')
    let canvasImage = canvas.toDataURL('image/jpeg');

    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = 'ImageResizerDownload.jpg';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
    };
    xhr.open('GET', canvasImage); 
    xhr.send();
}

fileInput.addEventListener("change", async (e) => {
    const [file] = fileInput.files;
    imgToResize = document.querySelector("#imgToResize");
    imgToResize.src = await fileToDataUri(file);

    imgToResize.addEventListener("load", () => {
        renderCanvas();
    });

    return false;
});

function fileToDataUri(field) {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            resolve(reader.result);
        });

        reader.readAsDataURL(field);
    });
}

function renderCanvas() {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (imgToResize) {
        if (bgImagePicker.checked) {
            //apply bg blur
            let blurImage = new Image();
            blurImage.src = imgToResize.src;
            context.filter = 'blur(50px)';


            context.drawImage(
                blurImage,
                -80,
                -80,
                canvas.width + 160,
                canvas.height + 160
            );
        }

        context.filter = 'blur(0px)';

        const originalWidth = imgToResize.width;
        const originalHeight = imgToResize.height;

        const aspectRatio = originalWidth / originalHeight;
        const width = canvasWidth;
        const height = width / aspectRatio;

        context.drawImage(
            imgToResize,
            xOffset,
            yOffset,
            width * scale,
            height * scale
        );
    }
}


function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    mouseStartX = parseInt(e.clientX - canvasOffsetX);
    mouseStartY = parseInt(e.clientY - canvasOffsetY);

    isDragging = true;
}

function handleMouseUp(e) {
    if (!isDragging) { return; }

    e.preventDefault();
    e.stopPropagation();

    isDragging = false;
}

function handleMouseOut(e) {
    if (!isDragging) { return; }

    e.preventDefault();
    e.stopPropagation();

    isDragging = false;
}

function handleMouseMove(e) {
    if (!isDragging) { return; }

    e.preventDefault();
    e.stopPropagation();

    let mouseX = parseInt(e.clientX - canvasOffsetX);
    let mouseY = parseInt(e.clientY - canvasOffsetY);

    const dx = mouseX - mouseStartX;
    const dy = mouseY - mouseStartY;

    xOffset += dx;
    yOffset += dy;
    
    renderCanvas();

    mouseStartX = mouseX;
    mouseStartY = mouseY;
}

function handleScroll(e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.deltaY > 0) {
        scale += 0.01;
    } else {
        scale -= 0.01;
    }
    renderCanvas();
}

document.addEventListener("keydown", function (e) {
    switch (e.key) {
        case "ArrowLeft":
            xOffset -= 3;
            break;
        case "ArrowRight":
            xOffset += 3;
            break;
        case "ArrowUp":
            yOffset -= 3;
            break;
        case "ArrowDown":
            yOffset += 3;
            break;
        case "=":
            scale += 0.01;
            break;
        case "-":
            scale -= 0.01;
            break;
    }
    renderCanvas();
})

