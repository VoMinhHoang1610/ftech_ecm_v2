/**
 * FTECH Toast & Confirm Utility
 * Thay the alert(), confirm(), prompt() bang UI chuyen nghiep.
 * Su dung:
 *   showToast('Thong bao', 'success' | 'error' | 'warn' | 'info')
 *   showConfirm('Noi dung', function() { ... })
 *   showPromptModal('Tieu de', 'Placeholder', function(value) { ... })
 */

(function () {
  // ---- CSS inject ----
  const TOAST_STYLE_ID = 'ftech-toast-style';
  if (!document.getElementById(TOAST_STYLE_ID)) {
    const style = document.createElement('style');
    style.id = TOAST_STYLE_ID;
    style.textContent = `
      /* ===== FTECH TOAST ===== */
      #ftech-toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      }
      .ftech-toast {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 18px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 500;
        color: #fff;
        min-width: 260px;
        max-width: 360px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.22);
        pointer-events: auto;
        animation: ftechToastIn 0.32s cubic-bezier(.4,0,.2,1) forwards;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        line-height: 1.45;
      }
      .ftech-toast.hiding {
        animation: ftechToastOut 0.28s cubic-bezier(.4,0,.2,1) forwards;
      }
      .ftech-toast-icon { font-size: 18px; flex-shrink: 0; }
      .ftech-toast-msg { flex: 1; }
      .ftech-toast-close {
        background: none; border: none; color: rgba(255,255,255,0.75);
        cursor: pointer; font-size: 16px; padding: 0; line-height: 1;
        flex-shrink: 0;
      }
      .ftech-toast-close:hover { color: #fff; }
      .ftech-toast.success { background: linear-gradient(135deg, #059669 0%, #10b981 100%); }
      .ftech-toast.error   { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); }
      .ftech-toast.warn    { background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); }
      .ftech-toast.info    { background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); }

      @keyframes ftechToastIn {
        from { opacity: 0; transform: translateX(60px) scale(0.94); }
        to   { opacity: 1; transform: translateX(0)    scale(1); }
      }
      @keyframes ftechToastOut {
        from { opacity: 1; transform: translateX(0)    scale(1); }
        to   { opacity: 0; transform: translateX(60px) scale(0.94); }
      }

      /* ===== FTECH CONFIRM MODAL ===== */
      #ftech-confirm-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.55);
        z-index: 99998;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }
      #ftech-confirm-overlay.open { display: flex; }
      #ftech-confirm-box {
        background: #1e2232;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 16px;
        padding: 32px 28px 24px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        animation: ftechModalIn 0.28s cubic-bezier(.4,0,.2,1);
      }
      #ftech-confirm-box.light-bg {
        background: #fff;
        border-color: rgba(0,0,0,0.1);
        color: #1e2232;
      }
      @keyframes ftechModalIn {
        from { opacity: 0; transform: scale(0.9) translateY(20px); }
        to   { opacity: 1; transform: scale(1)   translateY(0); }
      }
      #ftech-confirm-icon { font-size: 36px; margin-bottom: 12px; }
      #ftech-confirm-title {
        font-size: 17px; font-weight: 700; margin-bottom: 8px;
        color: #f1f5f9;
      }
      #ftech-confirm-msg {
        font-size: 14px; color: rgba(241,245,249,0.75);
        line-height: 1.55; margin-bottom: 24px;
      }
      #ftech-confirm-input {
        width: 100%; box-sizing: border-box;
        padding: 10px 14px; border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.2);
        background: rgba(255,255,255,0.07); color: #f1f5f9;
        font-size: 14px; margin-bottom: 18px; outline: none;
      }
      #ftech-confirm-input::placeholder { color: rgba(241,245,249,0.4); }
      #ftech-confirm-input:focus { border-color: #3b82f6; }
      .ftech-confirm-actions { display: flex; gap: 10px; justify-content: flex-end; }
      .ftech-confirm-actions button {
        padding: 10px 22px; border-radius: 8px; font-size: 14px;
        font-weight: 600; cursor: pointer; border: none; transition: opacity .15s;
      }
      .ftech-confirm-actions button:hover { opacity: 0.85; }
      #ftech-confirm-cancel {
        background: rgba(255,255,255,0.1); color: #f1f5f9;
      }
      #ftech-confirm-ok {
        background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
        color: #fff;
      }
      #ftech-confirm-ok.ok-blue {
        background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
      }
      #ftech-confirm-ok.ok-green {
        background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      }
    `;
    document.head.appendChild(style);
  }

  // ---- Toast container ----
  function getToastContainer() {
    let c = document.getElementById('ftech-toast-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'ftech-toast-container';
      document.body.appendChild(c);
    }
    return c;
  }

  /**
   * Hien toast thong bao.
   * @param {string} message - Noi dung thong bao
   * @param {'success'|'error'|'warn'|'info'} type - Kieu thong bao
   * @param {number} duration - Thoi gian hien (ms), mac dinh 3200
   */
  window.showToast = function (message, type, duration) {
    type = type || 'success';
    duration = duration || 3200;
    const iconMap = { success: '✅', error: '❌', warn: '⚠️', info: 'ℹ️' };
    const container = getToastContainer();

    const toast = document.createElement('div');
    toast.className = 'ftech-toast ' + type;
    toast.innerHTML = `
      <span class="ftech-toast-icon">${iconMap[type] || 'ℹ️'}</span>
      <span class="ftech-toast-msg">${message}</span>
      <button class="ftech-toast-close" onclick="this.closest('.ftech-toast').remove()">✕</button>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }, duration);
  };

  // ---- Confirm/Prompt overlay ----
  function ensureOverlay() {
    let ov = document.getElementById('ftech-confirm-overlay');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'ftech-confirm-overlay';
      ov.innerHTML = `
        <div id="ftech-confirm-box">
          <div id="ftech-confirm-icon">⚠️</div>
          <div id="ftech-confirm-title">Xac nhan</div>
          <div id="ftech-confirm-msg"></div>
          <input type="text" id="ftech-confirm-input" style="display:none" />
          <div class="ftech-confirm-actions">
            <button id="ftech-confirm-cancel">Huy</button>
            <button id="ftech-confirm-ok">Xac nhan</button>
          </div>
        </div>
      `;
      document.body.appendChild(ov);

      // Close on overlay click
      ov.addEventListener('click', function (e) {
        if (e.target === ov) _closeConfirm();
      });
    }
    return ov;
  }

  function _closeConfirm() {
    const ov = document.getElementById('ftech-confirm-overlay');
    if (ov) ov.classList.remove('open');
    // Reset input
    const inp = document.getElementById('ftech-confirm-input');
    if (inp) { inp.style.display = 'none'; inp.value = ''; }
  }

  /**
   * Hien modal xac nhan (thay confirm()).
   * @param {string} message - Noi dung xac nhan
   * @param {function} onOk - Callback khi bam OK
   * @param {object} [opts] - { title, icon, okText, cancelText, okClass }
   */
  window.showConfirm = function (message, onOk, opts) {
    opts = opts || {};
    const ov = ensureOverlay();
    document.getElementById('ftech-confirm-icon').textContent = opts.icon || '⚠️';
    document.getElementById('ftech-confirm-title').textContent = opts.title || 'Xac nhan hanh dong';
    document.getElementById('ftech-confirm-msg').textContent = message;
    document.getElementById('ftech-confirm-input').style.display = 'none';

    const okBtn = document.getElementById('ftech-confirm-ok');
    okBtn.textContent = opts.okText || 'Xac nhan';
    okBtn.className = 'ok-' + (opts.okClass || 'red');

    const cancelBtn = document.getElementById('ftech-confirm-cancel');
    cancelBtn.textContent = opts.cancelText || 'Huy';

    // Remove old handlers
    const newOk = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOk, okBtn);
    const newCancel = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);

    document.getElementById('ftech-confirm-ok').addEventListener('click', function () {
      _closeConfirm();
      if (onOk) onOk();
    });
    document.getElementById('ftech-confirm-cancel').addEventListener('click', _closeConfirm);

    ov.classList.add('open');
  };

  /**
   * Hien modal nhap lieu (thay prompt()).
   * @param {string} title - Tieu de
   * @param {string} placeholder - Placeholder input
   * @param {function} onOk - Callback nhan gia tri (value)
   * @param {object} [opts] - { icon, okText, cancelText, okClass }
   */
  window.showPromptModal = function (title, placeholder, onOk, opts) {
    opts = opts || {};
    const ov = ensureOverlay();
    document.getElementById('ftech-confirm-icon').textContent = opts.icon || '✏️';
    document.getElementById('ftech-confirm-title').textContent = title;
    document.getElementById('ftech-confirm-msg').textContent = opts.message || '';

    const inp = document.getElementById('ftech-confirm-input');
    inp.placeholder = placeholder || '';
    inp.value = opts.defaultValue || '';
    inp.style.display = 'block';

    const okBtn = document.getElementById('ftech-confirm-ok');
    okBtn.textContent = opts.okText || 'Xac nhan';
    okBtn.className = 'ok-' + (opts.okClass || 'blue');

    const cancelBtn = document.getElementById('ftech-confirm-cancel');
    cancelBtn.textContent = opts.cancelText || 'Huy';

    const newOk = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOk, okBtn);
    const newCancel = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);

    document.getElementById('ftech-confirm-ok').addEventListener('click', function () {
      const val = document.getElementById('ftech-confirm-input').value.trim();
      _closeConfirm();
      if (onOk) onOk(val);
    });
    document.getElementById('ftech-confirm-cancel').addEventListener('click', _closeConfirm);

    ov.classList.add('open');
    setTimeout(() => inp.focus(), 80);
  };
})();
