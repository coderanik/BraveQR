chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scan_page') {
    scanAllImagesOnPage(sendResponse);
    return true; // Keep channel open for async
  } else if (request.action === 'scan_image') {
    processImageUrl(request.srcUrl);
  }
});

async function scanAllImagesOnPage(sendResponse) {
  const images = Array.from(document.getElementsByTagName('img'));
  const detector = new BarcodeDetector({ formats: ['qr_code'] });

  for (const img of images) {
    try {
      // Create a temporary canvas to draw the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      const barcodes = await detector.detect(canvas);
      if (barcodes.length > 0) {
        sendResponse({ result: barcodes[0].rawValue });
        return;
      }
    } catch (e) {
      console.warn('Failed to scan image:', img.src, e);
    }
  }
  sendResponse({ error: 'Not found' });
}

async function processImageUrl(url) {
  const detector = new BarcodeDetector({ formats: ['qr_code'] });
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = url;
  
  img.onload = async () => {
    try {
      const barcodes = await detector.detect(img);
      if (barcodes.length > 0) {
        const result = barcodes[0].rawValue;
        alert(`BraveQR Found: ${result}`);
        // Optionally copy to clipboard
        navigator.clipboard.writeText(result);
      } else {
        alert("No QR code detected in this image.");
      }
    } catch (e) {
      console.error(e);
    }
  };
}
