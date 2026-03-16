chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "scan_qr",
    title: "Scan QR Code from Image",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "scan_qr") {
    // Send message to content script to process the image
    chrome.tabs.sendMessage(tab.id, { 
      action: "scan_image", 
      srcUrl: info.srcUrl 
    });
  }
});
