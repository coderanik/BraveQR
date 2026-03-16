document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('video-preview');
  const lensBtn = document.getElementById('start-lens');
  const startBtn = document.getElementById('start-scan');
  const pageBtn = document.getElementById('scan-page');
  const resultDiv = document.getElementById('scan-result');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  let stream = null;
  let scanning = false;

  const updateResult = (text, isUrl = false) => {
    if (isUrl) {
      resultDiv.innerHTML = `<a href="${text}" target="_blank" style="color: #ff5000; text-decoration: none; font-weight: bold;">${text}</a>`;
      navigator.clipboard.writeText(text);
    } else {
      resultDiv.textContent = text;
      navigator.clipboard.writeText(text);
    }
  };

  const handleSuccess = (content) => {
    updateResult(content, content.startsWith('http'));
    stopCamera();
    if (navigator.vibrate) navigator.vibrate(200);
  };

  const scanFrame = async () => {
    if (!scanning) return;
    if ('BarcodeDetector' in window) {
      try {
        const detector = new BarcodeDetector({ formats: ['qr_code'] });
        const barcodes = await detector.detect(video);
        if (barcodes.length > 0) {
          handleSuccess(barcodes[0].rawValue);
          return;
        }
      } catch (e) {}
    }
    try {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          handleSuccess(code.data);
          return;
        }
      }
    } catch (e) {}
    requestAnimationFrame(scanFrame);
  };

  const startCamera = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      video.srcObject = stream;
      video.setAttribute("playsinline", true);
      await video.play();
      scanning = true;
      startBtn.innerHTML = '<span>⏹</span> Stop Camera';
      startBtn.classList.add('primary');
      resultDiv.textContent = 'Scanning...';
      scanFrame();
    } catch (err) {
      updateResult('Camera Error: ' + err.name);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
    scanning = false;
    startBtn.innerHTML = '<span>📸</span> Camera View';
    startBtn.classList.remove('primary');
  };

  lensBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('brave://')) {
      updateResult('Cannot use Lens on internal pages.');
      return;
    }
    chrome.tabs.sendMessage(tab.id, { action: 'start_lens' });
    window.close(); // Close popup to allow lens selection
  });

  startBtn.addEventListener('click', () => {
    if (scanning) stopCamera();
    else startCamera();
  });

  pageBtn.addEventListener('click', async () => {
    resultDiv.textContent = 'Searching page...';
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.tabs.sendMessage(tab.id, { action: 'scan_page' }, (response) => {
        if (chrome.runtime.lastError) {
          updateResult('Error: Try refreshing the page.');
          return;
        }
        if (response && response.result) {
          updateResult(response.result, response.result.startsWith('http'));
        } else {
          updateResult('No QR code found.');
        }
      });
    } catch (e) {
      updateResult('Search failed.');
    }
  });
});
