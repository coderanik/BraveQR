document.addEventListener('DOMContentLoaded', () => {
  const pageBtn = document.getElementById('scan-page');
  const qrList = document.getElementById('qr-list');

  const addResultRow = (text) => {
    const item = document.createElement('div');
    item.className = 'qr-item';
    
    const isUrl = text.startsWith('http');
    const displayContent = isUrl 
      ? `<a href="${text}" target="_blank">${text}</a>` 
      : `<span>${text}</span>`;
    
    item.innerHTML = `
      ${displayContent}
      <span class="copy-hint">Click to copy</span>
    `;
    
    item.addEventListener('click', () => {
      navigator.clipboard.writeText(text);
      const hint = item.querySelector('.copy-hint');
      const originalText = hint.textContent;
      hint.textContent = '✅ Copied!';
      hint.style.color = '#00ff00';
      setTimeout(() => {
        hint.textContent = originalText;
        hint.style.color = '';
      }, 2000);
    });

    qrList.appendChild(item);
  };

  pageBtn.addEventListener('click', async () => {
    qrList.innerHTML = '<div class="empty-state">Scanning page metadata, images, and canvases...</div>';
    pageBtn.disabled = true;
    pageBtn.style.opacity = '0.5';

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('brave://')) {
        qrList.innerHTML = '<div class="empty-state">Cannot scan internal browser pages.</div>';
        pageBtn.disabled = false;
        pageBtn.style.opacity = '1';
        return;
      }

      chrome.tabs.sendMessage(tab.id, { action: 'scan_page' }, (response) => {
        pageBtn.disabled = false;
        pageBtn.style.opacity = '1';

        if (chrome.runtime.lastError) {
          qrList.innerHTML = '<div class="empty-state">Error: Try refreshing the page.</div>';
          return;
        }

        qrList.innerHTML = '';
        if (response && response.results && response.results.length > 0) {
          response.results.forEach(text => addResultRow(text));
        } else {
          qrList.innerHTML = '<div class="empty-state">No QR codes found on the visible parts of this page.</div>';
        }
      });
    } catch (e) {
      qrList.innerHTML = '<div class="empty-state">Scan failed.</div>';
      pageBtn.disabled = false;
      pageBtn.style.opacity = '1';
    }
  });
});
