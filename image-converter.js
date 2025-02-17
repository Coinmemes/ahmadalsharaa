// Image Conversion Functions
let img = new Image();
let originalImage = null;

function handleImageUpload(event) {
    const upload = document.getElementById('upload');
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            img = new Image();
            img.onload = function () {
                const maxWidth = 800;
                const maxHeight = 600;
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                originalImage = ctx.getImageData(0, 0, width, height);
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

function applyFlagOverlay() {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    if (!originalImage) return;
    ctx.putImageData(originalImage, 0, 0);
    const width = canvas.width;
    const height = canvas.height;
    const opacity = document.getElementById('opacity').value;
    const starSize = document.getElementById('starSize').value;

    ctx.globalAlpha = opacity / 255;

    // Top part in green
    ctx.fillStyle = 'rgba(0, 128, 0, 1)';
    ctx.fillRect(0, 0, width, height / 3);

    // Middle part in white
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(0, height / 3, width, height / 3);

    // Bottom part in black
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 2 * height / 3, width, height / 3);

    // Adding red stars
    ctx.fillStyle = 'red';
    drawStar(width / 4, height / 2, 5, starSize, starSize / 2);
    drawStar(width / 2, height / 2, 5, starSize, starSize / 2);
    drawStar(3 * width / 4, height / 2, 5, starSize, starSize / 2);

    ctx.globalAlpha = 1; // Reset alpha

    const addQrCodeCheckbox = document.getElementById('addQrCode');
    if (addQrCodeCheckbox.checked) {
        addQRCode("https://pump.fun/coin/9bDTN4FahNPaQLTk9p6rjjbL3Uej46CCcAwyuKxFpump");
    }
}

function drawStar(x, y, points, outerRadius, innerRadius) {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const angle = Math.PI / points;
    ctx.beginPath();
    for (let i = 0; i < 2 * points; i++) {
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const a = i * angle - Math.PI / 2;
        ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
    }
    ctx.closePath();
    ctx.fill();
}

function addQRCode(text) {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const qr = qrcode(4, 'L');
    qr.addData(text);
    qr.make();
    const qrCanvas = document.createElement('canvas');
    const qrCtx = qrCanvas.getContext('2d');
    qrCanvas.width = 100;
    qrCanvas.height = 100;
    qrCtx.fillStyle = "white";
    qrCtx.fillRect(0, 0, 100, 100);
    const qrImg = new Image();
    qrImg.src = qr.createDataURL();
    qrImg.onload = function() {
        ctx.drawImage(qrImg, canvas.width - 110, canvas.height - 110, 100, 100);
    }
}

function resetImage() {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    if (originalImage) {
        ctx.putImageData(originalImage, 0, 0);
    }
}

function downloadImage() {
    const canvas = document.getElementById('imageCanvas');
    const link = document.createElement('a');
    link.download = 'converted_image.png';
    link.href = canvas.toDataURL();
    link.click();
}
