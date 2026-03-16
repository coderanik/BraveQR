chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "scan_qr",
    title: "Scan QR Code from Image",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "scan_qr") {
    chrome.tabs.sendMessage(tab.id, { 
      action: "scan_image", 
      srcUrl: info.srcUrl 
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'capture_region') {
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      processCapture(dataUrl, request.rect, sendResponse);
    });
    return true; // async
  }
});

async function processCapture(dataUrl, rect, sendResponse) {
  try {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const dpr = rect.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.drawImage(
        img, 
        rect.x * dpr, rect.y * dpr, rect.width * dpr, rect.height * dpr, 
        0, 0, canvas.width, canvas.height
      );
      
      // We can't use BarcodeDetector easily here because it's a background worker
      // Let's send the cropped image back to the content script or try to scan here
      // Since background workers don't have DOM for jsQR easily, we send data back
      const croppedDataUrl = canvas.toDataURL();
      sendResponse({ croppedDataUrl });
    };
  } catch (e) {
    sendResponse({ error: e.message });
  }
}
