document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('video-preview');
  const startBtn = document.getElementById('start-scan');
  const pageBtn = document.getElementById('scan-page');
  const resultDiv = document.getElementById('scan-result');

  let stream = null;
  let scanning = false;

  const updateResult = (text, isUrl = false) => {
    if (isUrl) {
      resultDiv.innerHTML = `<a href="${text}" target="_blank" style="color: #ff5000; text-decoration: none;">${text}</a>`;
    } else {
      resultDiv.textContent = text;
    }
  };

  const scanFrame = async () => {
    if (!scanning) return;

    try {
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
        const barcodes = await barcodeDetector.detect(video);
        
        if (barcodes.length > 0) {
          const content = barcodes[0].rawValue;
          updateResult(content, content.startsWith('http'));
          stopCamera();
          return;
        }
      }
    } catch (e) {
      console.error('Scan error:', e);
    }

    requestAnimationFrame(scanFrame);
  };

  const startCamera = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      video.srcObject = stream;
      scanning = true;
      startBtn.textContent = '⏹ Stop Camera';
      startBtn.classList.remove('primary');
      scanFrame();
    } catch (err) {
      updateResult('Error accessing camera: ' + err.message);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
    scanning = false;
    startBtn.textContent = '📸 Start Camera Scan';
    startBtn.classList.add('primary');
  };

  startBtn.addEventListener('click', () => {
    if (scanning) {
      stopCamera();
    } else {
      startCamera();
    }
  });

  pageBtn.addEventListener('click', async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'scan_page' }, (response) => {
        if (response && response.result) {
          updateResult(response.result, response.result.startsWith('http'));
        } else if (response && response.error) {
          updateResult('No QR code found on page.');
        }
      });
    });
  });
});
