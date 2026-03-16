chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scan_page') {
    scanPage(sendResponse);
    return true; 
  }
});

async function scanPage(sendResponse) {
  const elements = [
    ...Array.from(document.getElementsByTagName('img')),
    ...Array.from(document.getElementsByTagName('canvas'))
  ];
  
  const results = new Set();
  
  for (const el of elements) {
    try {
      const result = await detectQRCode(el);
      if (result) {
        results.add(result);
      }
    } catch (e) {
      console.warn('Failed to scan element:', el, e);
    }
  }
  
  sendResponse({ results: Array.from(results) });
}

async function detectQRCode(source) {
  // Try Native BarcodeDetector
  if ('BarcodeDetector' in window) {
    try {
      const detector = new BarcodeDetector({ formats: ['qr_code'] });
      const barcodes = await detector.detect(source);
      if (barcodes.length > 0) return barcodes[0].rawValue;
    } catch (e) {}
  }

  // Fallback to jsQR
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      let width, height;
      if (source instanceof HTMLImageElement) {
        width = source.naturalWidth;
        height = source.naturalHeight;
      } else {
        width = source.width;
        height = source.height;
      }

      if (width === 0 || height === 0) return resolve(null);

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
