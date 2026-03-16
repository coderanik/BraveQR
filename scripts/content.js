chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scan_page') {
    scanPage(sendResponse);
    return true; 
  } else if (request.action === 'scan_image') {
    processImageUrl(request.srcUrl);
  } else if (request.action === 'start_lens') {
    startLens();
  }
});

let lensOverlay = null;
let lensSelector = null;
let startX, startY;

function startLens() {
  if (lensOverlay) return;

  if (!document.getElementById('brave-qr-lens-css')) {
    const link = document.createElement('link');
    link.id = 'brave-qr-lens-css';
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('styles/lens.css');
    document.head.appendChild(link);
  }

  lensOverlay = document.createElement('div');
  lensOverlay.className = 'brave-qr-lens-overlay';
  
  const hint = document.createElement('div');
  hint.className = 'brave-qr-lens-hint';
  hint.innerText = 'Drag to select a QR code (Press Esc to cancel)';
  lensOverlay.appendChild(hint);

  lensSelector = document.createElement('div');
  lensSelector.className = 'brave-qr-lens-selector';
  lensOverlay.appendChild(lensSelector);

  document.body.appendChild(lensOverlay);

  const onMouseDown = (e) => {
    startX = e.clientX;
    startY = e.clientY;
    lensSelector.style.display = 'block';
    lensSelector.style.left = startX + 'px';
    lensSelector.style.top = startY + 'px';
    lensSelector.style.width = '0px';
    lensSelector.style.height = '0px';

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    const left = Math.min(startX, currentX);
    const top = Math.min(startY, currentY);
    const width = Math.abs(startX - currentX);
    const height = Math.abs(startY - currentY);

    lensSelector.style.left = left + 'px';
    lensSelector.style.top = top + 'px';
    lensSelector.style.width = width + 'px';
    lensSelector.style.height = height + 'px';
  };

  const onMouseUp = (e) => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    
    const rect = lensSelector.getBoundingClientRect();
    if (rect.width > 5 && rect.height > 5) {
      captureAndScan(rect);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') cleanupLens();
  };

  lensOverlay.addEventListener('mousedown', onMouseDown);
  window.addEventListener('keydown', onKeyDown);
}

function cleanupLens() {
  if (lensOverlay) {
    document.body.removeChild(lensOverlay);
    lensOverlay = null;
  }
}

async function captureAndScan(rect) {
  chrome.runtime.sendMessage({ 
    action: 'capture_region', 
    rect: {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      devicePixelRatio: window.devicePixelRatio
    }
  }, async (response) => {
    if (response && response.croppedDataUrl) {
      const img = new Image();
      img.src = response.croppedDataUrl;
      img.onload = async () => {
        const result = await detectQRCode(img);
        if (result) {
          showLensResult(result, rect);
        } else {
          alert("No QR code found in selection.");
          cleanupLens();
        }
      };
    } else {
      cleanupLens();
    }
  });
}

function showLensResult(text, rect) {
  cleanupLens();
  
  const resultDiv = document.createElement('div');
  resultDiv.className = 'brave-qr-lens-result';
  resultDiv.style.display = 'block';
  resultDiv.style.left = rect.left + 'px';
  resultDiv.style.top = (rect.bottom + window.scrollY + 10) + 'px';
  
  const isUrl = text.startsWith('http');
  const content = isUrl ? `<a href="${text}" target="_blank">${text}</a>` : text;
  
  resultDiv.innerHTML = `
    <div class="close-btn">×</div>
    <strong>BraveQR Result:</strong><br>
    ${content}
  `;
  
  resultDiv.querySelector('.close-btn').onclick = () => document.body.removeChild(resultDiv);
  document.body.appendChild(resultDiv);
  navigator.clipboard.writeText(text);
}

async function scanPage(sendResponse) {
  const elements = [
    ...Array.from(document.getElementsByTagName('img')),
    ...Array.from(document.getElementsByTagName('canvas'))
  ];
  for (const el of elements) {
    try {
      const result = await detectQRCode(el);
      if (result) {
        sendResponse({ result });
        return;
      }
    } catch (e) {}
  }
  sendResponse({ error: 'Not found' });
}

async function detectQRCode(source) {
  if ('BarcodeDetector' in window) {
    try {
      const detector = new BarcodeDetector({ formats: ['qr_code'] });
      const barcodes = await detector.detect(source);
      if (barcodes.length > 0) return barcodes[0].rawValue;
    } catch (e) {}
  }

  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = source.naturalWidth || source.width;
      const height = source.naturalHeight || source.height;
      if (!width || !height) return resolve(null);
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(source, 0, 0);
      const imageData = ctx.getImageData(0, 0, width, height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      resolve(code ? code.data : null);
    } catch (e) {
      resolve(null);
    }
  });
}

function processImageUrl(url) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = url;
  img.onload = async () => {
    const result = await detectQRCode(img);
    if (result) {
      alert(`BraveQR Found: ${result}`);
      navigator.clipboard.writeText(result);
    }
  };
}
