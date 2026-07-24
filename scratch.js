const scratchCard = document.getElementById("scratchCard");
const scratchCanvas = document.getElementById("scratchCanvas");
const ctx = scratchCanvas.getContext("2d");

const couponCode = document.getElementById("couponCode");
const copyCoupon = document.getElementById("copyCoupon");

let isScratching = false;
let isRevealed = false;

function setupScratchCard() {
  const width = scratchCard.clientWidth;
  const height = scratchCard.clientHeight;
  const ratio = window.devicePixelRatio || 1;

  scratchCanvas.width = width * ratio;
  scratchCanvas.height = height * ratio;

  scratchCanvas.style.width = width + "px";
  scratchCanvas.style.height = height + "px";

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  drawSilverLayer(width, height);
}

function drawSilverLayer(width, height) {
  ctx.globalCompositeOperation = "source-over";

  const gradient = ctx.createLinearGradient(0, 0, width, height);

  gradient.addColorStop(0, "#7f858d");
  gradient.addColorStop(0.5, "#c5c9ce");
  gradient.addColorStop(1, "#6f757d");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255,255,255,0.12)";

  for (let x = 0; x < width; x += 22) {
    ctx.fillRect(x, 0, 8, height);
  }

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.font = "bold 28px Arial";
  ctx.fillText(
    "SCRATCH & WIN",
    width / 2,
    height / 2 - 12
  );

  ctx.font = "15px Arial";
  ctx.fillText(
    "Scratch here to reveal your reward",
    width / 2,
    height / 2 + 25
  );
}

function getPointerPosition(event) {
  const rect = scratchCanvas.getBoundingClientRect();

  const clientX =
    event.touches?.[0]?.clientX ??
    event.changedTouches?.[0]?.clientX ??
    event.clientX;

  const clientY =
    event.touches?.[0]?.clientY ??
    event.changedTouches?.[0]?.clientY ??
    event.clientY;

  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function scratch(event) {
  if (!isScratching || isRevealed) {
    return;
  }

  event.preventDefault();

  const position = getPointerPosition(event);

  ctx.globalCompositeOperation = "destination-out";

  ctx.beginPath();
  ctx.arc(
    position.x,
    position.y,
    24,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function startScratch(event) {
  if (isRevealed) {
    return;
  }

  isScratching = true;
  scratch(event);
}

function stopScratch() {
  if (!isScratching) {
    return;
  }

  isScratching = false;
  checkScratchPercentage();
}

function checkScratchPercentage() {
  const pixels = ctx.getImageData(
    0,
    0,
    scratchCanvas.width,
    scratchCanvas.height
  ).data;

  let clearedPixels = 0;

  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] === 0) {
      clearedPixels++;
    }
  }

  const totalPixels =
    scratchCanvas.width * scratchCanvas.height;

  const percentage =
    (clearedPixels / totalPixels) * 100;

  if (percentage >= 35) {
    revealReward();
  }
}

function revealReward() {
  isRevealed = true;

  scratchCanvas.style.transition = "opacity 0.5s ease";
  scratchCanvas.style.opacity = "0";

  setTimeout(function () {
    scratchCanvas.style.display = "none";
  }, 500);
}

scratchCanvas.addEventListener("mousedown", startScratch);
scratchCanvas.addEventListener("mousemove", scratch);
window.addEventListener("mouseup", stopScratch);

scratchCanvas.addEventListener("touchstart", startScratch, {
  passive: false
});

scratchCanvas.addEventListener("touchmove", scratch, {
  passive: false
});

scratchCanvas.addEventListener("touchend", stopScratch);

copyCoupon.addEventListener("click", async function () {
  try {
    await navigator.clipboard.writeText(
      couponCode.textContent.trim()
    );

    copyCoupon.textContent = "Copied ✓";

    setTimeout(function () {
      copyCoupon.textContent = "Copy";
    }, 1800);
  } catch (error) {
    alert("Coupon code: " + couponCode.textContent.trim());
  }
});

window.addEventListener("load", setupScratchCard);