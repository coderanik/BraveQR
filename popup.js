document.addEventListener('DOMContentLoaded', () => {
  const pageBtn     = document.getElementById('scan-page');
  const btnLabel    = document.getElementById('btn-label');
  const btnIcon     = document.querySelector('.btn-icon');
  const qrList      = document.getElementById('qr-list');
  const statusDot   = document.getElementById('status-dot');
  const statusText  = document.getElementById('status-text');
  const countBadge  = document.getElementById('count-badge');
  const footerHint  = document.getElementById('footer-hint');

  const setStatus = (state) => {
    if (state === 'scanning') {
      statusDot.className = 'status-dot active';
      statusText.textContent = 'Scanning…';
      btnLabel.textContent = 'Scanning…';
      pageBtn.classList.add('scanning');
      pageBtn.disabled = true;
      btnIcon.textContent = '⏳';
    } else if (state === 'done') {
      statusDot.className = 'status-dot active';
      statusText.textContent = 'Scan complete';
      btnLabel.textContent = 'Scan Again';
      pageBtn.classList.remove('scanning');
      pageBtn.disabled = false;
      btnIcon.textContent = '🔄';
    } else {
      statusDot.className = 'status-dot';
      statusText.textContent = 'Ready';
      btnLabel.textContent = 'Scan Page for QR Codes';
      pageBtn.classList.remove('scanning');
      pageBtn.disabled = false;
      btnIcon.textContent = '📄';
    }
  };

  const buildResultItem = (text, index) => {
    const isUrl = /^https?:\/\//i.test(text);
    const item = document.createElement('div');
    item.className = 'qr-item';
    item.style.animationDelay = `${index * 60}ms`;

    const tag = isUrl
      ? `<span class="qr-type-tag url">🌐 URL</span>`
      : `<span class="qr-type-tag text">📝 Text</span>`;

    const content = isUrl
      ? `<a href="${text}" target="_blank" title="${text}">${text}</a>`
      : `<span title="${text}">${text}</span>`;

    item.innerHTML = `
      ${tag}
      <div class="qr-content">${content}</div>
      <div class="copy-hint" id="hint-${index}">
        <span>📋</span><span>Click to copy</span>
      </div>
    `;

    item.addEventListener('click', async (e) => {
      // Don't hijack link clicks
      if (e.target.tagName === 'A') return;
      await navigator.clipboard.writeText(text);
      const hint = document.getElementById(`hint-${index}`);
      item.classList.add('copied');
      hint.className = 'copy-hint done';
      hint.innerHTML = '<span>✅</span><span>Copied!</span>';
      setTimeout(() => {
        item.classList.remove('copied');
        hint.className = 'copy-hint';
        hint.innerHTML = '<span>📋</span><span>Click to copy</span>';
      }, 2200);
    });

    return item;
  };

  const showEmpty = (msg, sub = '') => {
    qrList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🙅</div>
        <div class="empty-title">${msg}</div>
        ${sub ? `<div class="empty-sub">${sub}</div>` : ''}
      </div>`;
    countBadge.style.display = 'none';
    footerHint.textContent = 'Privacy · Local · Instant';
  };

  pageBtn.addEventListener('click', async () => {
    qrList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon" style="animation: spin 1s linear infinite; display:inline-block">⏳</div>
        <div class="empty-title">Scanning page…</div>
        <div class="empty-sub">Looking through all images and canvases</div>
      </div>`;
    countBadge.style.display = 'none';
    setStatus('scanning');

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (tab.url.startsWith('chrome://') || tab.url.startsWith('brave://')) {
        showEmpty('Cannot scan internal pages', 'Navigate to a regular webpage first.');
        setStatus('idle');
        return;
      }

      chrome.tabs.sendMessage(tab.id, { action: 'scan_page' }, (response) => {
        setStatus('done');

        if (chrome.runtime.lastError) {
          showEmpty('Extension error', 'Try refreshing the page and try again.');
          return;
        }

        if (response && response.results && response.results.length > 0) {
          qrList.innerHTML = '';
          response.results.forEach((text, i) => {
            qrList.appendChild(buildResultItem(text, i));
          });
          const count = response.results.length;
          countBadge.style.display = 'inline-flex';
          countBadge.textContent = `${count} found`;
          footerHint.textContent = `${count} QR code${count > 1 ? 's' : ''} detected`;
        } else {
          showEmpty('No QR codes found', 'This page may not contain any scannable QR codes.');
        }
      });
    } catch (e) {
      showEmpty('Scan failed', 'An unexpected error occurred.');
      setStatus('idle');
    }
  });
});
