/**
 * FTECH Toast & Confirm Utility — Premium UI Edition
 * Design system: Poppins, purple-blue palette (#303a75 / #4a7dff / #8a5bff)
 * showToast(message, type, duration)
 * showConfirm(message, onOk, opts)
 * showPromptModal(title, placeholder, onOk, opts)
 */

(function () {
  /* ─────────────────────────────────────────
     INJECT CSS  (chỉ inject 1 lần)
  ───────────────────────────────────────── */
  const STYLE_ID = 'ftech-toast-premium-style';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

      /* ══════════════════════════════
         TOAST CONTAINER
      ══════════════════════════════ */
      #ftech-toast-container {
        position: fixed;
        top: 20px;
        right: 22px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      }

      /* ══════════════════════════════
         INDIVIDUAL TOAST
      ══════════════════════════════ */
      .ftech-toast {
        font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 13px 16px 13px 14px;
        border-radius: 14px;
        font-size: 13px;
        font-weight: 500;
        min-width: 280px;
        max-width: 380px;
        pointer-events: auto;
        position: relative;
        overflow: hidden;
        border: 1px solid transparent;
        box-shadow:
          0 4px 20px rgba(42, 47, 95, 0.12),
          0 1px 4px rgba(42, 47, 95, 0.07);
        animation: ftToastIn 0.35s cubic-bezier(0.34, 1.36, 0.64, 1) forwards;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }

      .ftech-toast.hiding {
        animation: ftToastOut 0.25s cubic-bezier(0.4, 0, 1, 1) forwards;
      }

      /* Progress bar */
      .ftech-toast::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2.5px;
        border-radius: 0 0 14px 14px;
        animation: ftToastBar linear forwards;
        animation-duration: inherit;
      }

      /* ── TYPE: SUCCESS ── */
      .ftech-toast.success {
        background: linear-gradient(135deg,
          rgba(27, 207, 138, 0.10) 0%,
          rgba(255, 255, 255, 0.96) 100%);
        border-color: rgba(27, 207, 138, 0.28);
        color: #0a6644;
      }
      .ftech-toast.success::after { background: linear-gradient(90deg, #1bcf8a, #00cc6a); }
      .ftech-toast.success .ft-icon-wrap { background: rgba(27, 207, 138, 0.15); color: #1bcf8a; }
      .ftech-toast.success .ft-title { color: #0a6644; }

      /* ── TYPE: ERROR ── */
      .ftech-toast.error {
        background: linear-gradient(135deg,
          rgba(239, 68, 68, 0.09) 0%,
          rgba(255, 255, 255, 0.96) 100%);
        border-color: rgba(239, 68, 68, 0.26);
        color: #7f1d1d;
      }
      .ftech-toast.error::after { background: linear-gradient(90deg, #ef4444, #f97316); }
      .ftech-toast.error .ft-icon-wrap { background: rgba(239, 68, 68, 0.12); color: #ef4444; }
      .ftech-toast.error .ft-title { color: #7f1d1d; }

      /* ── TYPE: WARN ── */
      .ftech-toast.warn {
        background: linear-gradient(135deg,
          rgba(245, 158, 11, 0.09) 0%,
          rgba(255, 255, 255, 0.96) 100%);
        border-color: rgba(245, 158, 11, 0.28);
        color: #78450a;
      }
      .ftech-toast.warn::after { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
      .ftech-toast.warn .ft-icon-wrap { background: rgba(245, 158, 11, 0.12); color: #f59e0b; }
      .ftech-toast.warn .ft-title { color: #78450a; }

      /* ── TYPE: INFO ── */
      .ftech-toast.info {
        background: linear-gradient(135deg,
          rgba(74, 125, 255, 0.09) 0%,
          rgba(255, 255, 255, 0.96) 100%);
        border-color: rgba(74, 125, 255, 0.24);
        color: #1e3a8a;
      }
      .ftech-toast.info::after { background: linear-gradient(90deg, #4a7dff, #8a5bff); }
      .ftech-toast.info .ft-icon-wrap { background: rgba(74, 125, 255, 0.12); color: #4a7dff; }
      .ftech-toast.info .ft-title { color: #1e3a8a; }

      /* ── ICON WRAP ── */
      .ft-icon-wrap {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 16px;
        transition: transform 0.2s;
      }

      /* ── BODY ── */
      .ft-body {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .ft-title {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        opacity: 0.65;
        line-height: 1.2;
        margin-bottom: 2px;
      }

      .ft-msg {
        font-size: 13px;
        font-weight: 500;
        line-height: 1.45;
        color: #303a75;
      }

      /* ── CLOSE BUTTON ── */
      .ft-close {
        background: none;
        border: none;
        cursor: pointer;
        width: 24px;
        height: 24px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #8a93b8;
        font-size: 13px;
        flex-shrink: 0;
        transition: all 0.15s;
        padding: 0;
      }
      .ft-close:hover {
        background: rgba(42, 47, 95, 0.08);
        color: #303a75;
      }

      /* ── ANIMATIONS ── */
      @keyframes ftToastIn {
        0%   { opacity: 0; transform: translateX(80px) scale(0.9); }
        60%  { transform: translateX(-6px) scale(1.01); }
        100% { opacity: 1; transform: translateX(0) scale(1); }
      }
      @keyframes ftToastOut {
        0%   { opacity: 1; transform: translateX(0) scale(1); }
        100% { opacity: 0; transform: translateX(80px) scale(0.92); }
      }
      @keyframes ftToastBar {
        from { width: 100%; }
        to   { width: 0%; }
      }

      /* ══════════════════════════════
         CONFIRM OVERLAY
      ══════════════════════════════ */
      #ftech-confirm-overlay {
        font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(42, 47, 95, 0.45);
        z-index: 99998;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
      }
      #ftech-confirm-overlay.open {
        display: flex;
        animation: ftOverlayIn 0.2s ease forwards;
      }
      @keyframes ftOverlayIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      /* ── CONFIRM BOX ── */
      #ftech-confirm-box {
        background: #ffffff;
        border: 1px solid rgba(76, 84, 170, 0.18);
        border-radius: 20px;
        padding: 0;
        max-width: 420px;
        width: 90%;
        box-shadow:
          0 24px 80px rgba(42, 47, 95, 0.22),
          0 4px 16px rgba(42, 47, 95, 0.10);
        animation: ftModalIn 0.3s cubic-bezier(0.34, 1.36, 0.64, 1) forwards;
        overflow: hidden;
      }
      @keyframes ftModalIn {
        from { opacity: 0; transform: scale(0.88) translateY(24px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
      }

      /* Modal header stripe */
      #ftech-confirm-header {
        padding: 28px 28px 20px;
        text-align: center;
        position: relative;
      }

      #ftech-confirm-icon-wrap {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        margin: 0 auto 16px;
        background: rgba(74, 125, 255, 0.1);
      }
      /* Icon wrap color variants */
      #ftech-confirm-icon-wrap.ic-red    { background: rgba(239, 68, 68, 0.10); }
      #ftech-confirm-icon-wrap.ic-green  { background: rgba(27, 207, 138, 0.10); }
      #ftech-confirm-icon-wrap.ic-orange { background: rgba(245, 158, 11, 0.10); }
      #ftech-confirm-icon-wrap.ic-blue   { background: rgba(74, 125, 255, 0.10); }

      #ftech-confirm-title {
        font-size: 16px;
        font-weight: 700;
        color: #303a75;
        margin-bottom: 8px;
        line-height: 1.35;
      }
      #ftech-confirm-msg {
        font-size: 13px;
        color: #5d6897;
        line-height: 1.6;
        max-width: 320px;
        margin: 0 auto;
      }

      /* Modal body (for input) */
      #ftech-confirm-body {
        padding: 0 28px 4px;
      }
      #ftech-confirm-input {
        width: 100%;
        box-sizing: border-box;
        padding: 11px 14px;
        border-radius: 10px;
        border: 1px solid rgba(76, 84, 170, 0.22);
        background: #f3f1ff;
        color: #303a75;
        font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      #ftech-confirm-input::placeholder { color: #8a93b8; }
      #ftech-confirm-input:focus {
        border-color: rgba(74, 125, 255, 0.5);
        box-shadow: 0 0 0 3px rgba(74, 125, 255, 0.1);
      }

      /* Modal footer */
      #ftech-confirm-footer {
        padding: 20px 28px 24px;
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        border-top: 1px solid rgba(76, 84, 170, 0.1);
      }

      #ftech-confirm-cancel {
        padding: 10px 22px;
        border-radius: 10px;
        border: 1px solid rgba(76, 84, 170, 0.2);
        background: transparent;
        color: #5d6897;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
        transition: all 0.15s;
      }
      #ftech-confirm-cancel:hover {
        border-color: #4a7dff;
        color: #4a7dff;
        background: rgba(74, 125, 255, 0.05);
      }

      #ftech-confirm-ok {
        padding: 10px 24px;
        border-radius: 10px;
        border: none;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
        color: #ffffff;
        transition: opacity 0.15s, transform 0.12s;
        background: linear-gradient(135deg, #ef4444, #f97316);
      }
      #ftech-confirm-ok:hover  { opacity: 0.88; transform: translateY(-1px); }
      #ftech-confirm-ok:active { transform: translateY(0); }

      #ftech-confirm-ok.ok-green  { background: linear-gradient(135deg, #1bcf8a, #00cc6a); }
      #ftech-confirm-ok.ok-blue   { background: linear-gradient(135deg, #4a7dff, #8a5bff); }
      #ftech-confirm-ok.ok-orange { background: linear-gradient(135deg, #f59e0b, #f97316); }
      #ftech-confirm-ok.ok-red    { background: linear-gradient(135deg, #ef4444, #f97316); }
    `;
    document.head.appendChild(style);
  }

  /* ─────────────────────────────────────────
     TOAST
  ───────────────────────────────────────── */
  function getToastContainer() {
    let c = document.getElementById('ftech-toast-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'ftech-toast-container';
      document.body.appendChild(c);
    }
    return c;
  }

  const TOAST_META = {
    success: { icon: '✓',  label: 'Thành công' },
    error:   { icon: '✕',  label: 'Lỗi' },
    warn:    { icon: '!',  label: 'Cảnh báo' },
    info:    { icon: 'i',  label: 'Thông tin' },
  };

  /**
   * Hiện toast thông báo đẹp.
   * @param {string} message
   * @param {'success'|'error'|'warn'|'info'} type
   * @param {number} duration  (ms, mặc định 3500)
   */
  window.showToast = function (message, type, duration) {
    type = type || 'success';
    duration = duration || 3500;

    const meta = TOAST_META[type] || TOAST_META.info;
    const container = getToastContainer();

    const toast = document.createElement('div');
    toast.className = 'ftech-toast ' + type;
    toast.style.setProperty('animation-duration', duration + 'ms');

    toast.innerHTML = `
      <div class="ft-icon-wrap">${meta.icon}</div>
      <div class="ft-body">
        <div class="ft-title">${meta.label}</div>
        <div class="ft-msg">${message}</div>
      </div>
      <button class="ft-close" title="Đóng">✕</button>
    `;

    toast.querySelector('.ft-close').addEventListener('click', () => dismissToast(toast));
    container.appendChild(toast);

    const timer = setTimeout(() => dismissToast(toast), duration - 300);
    toast._timer = timer;

    // Pause progress on hover
    toast.addEventListener('mouseenter', () => {
      clearTimeout(toast._timer);
      toast.style.animationPlayState = 'paused';
    });
    toast.addEventListener('mouseleave', () => {
      toast.style.animationPlayState = 'running';
      toast._timer = setTimeout(() => dismissToast(toast), 1200);
    });
  };

  function dismissToast(toast) {
    if (toast._dismissed) return;
    toast._dismissed = true;
    toast.classList.add('hiding');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
    setTimeout(() => toast.remove(), 350); // fallback
  }

  /* ─────────────────────────────────────────
     CONFIRM / PROMPT MODAL
  ───────────────────────────────────────── */
  function buildOverlay() {
    let ov = document.getElementById('ftech-confirm-overlay');
    if (ov) return ov;

    ov = document.createElement('div');
    ov.id = 'ftech-confirm-overlay';
    ov.innerHTML = `
      <div id="ftech-confirm-box" role="dialog" aria-modal="true">
        <div id="ftech-confirm-header">
          <div id="ftech-confirm-icon-wrap">❓</div>
          <div id="ftech-confirm-title">Xác nhận hành động</div>
          <div id="ftech-confirm-msg"></div>
        </div>
        <div id="ftech-confirm-body">
          <input type="text" id="ftech-confirm-input" style="display:none" autocomplete="off" />
        </div>
        <div id="ftech-confirm-footer">
          <button id="ftech-confirm-cancel">Hủy</button>
          <button id="ftech-confirm-ok">Xác nhận</button>
        </div>
      </div>
    `;
    document.body.appendChild(ov);

    ov.addEventListener('click', function (e) {
      if (e.target === ov) _closeModal();
    });

    // Keyboard ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && ov.classList.contains('open')) _closeModal();
    });

    return ov;
  }

  function _closeModal() {
    const ov = document.getElementById('ftech-confirm-overlay');
    if (ov) ov.classList.remove('open');
    const inp = document.getElementById('ftech-confirm-input');
    if (inp) { inp.style.display = 'none'; inp.value = ''; }
  }

  // Icon wrapper color mapping
  const ICON_CLASS = {
    red: 'ic-red', green: 'ic-green', blue: 'ic-blue', orange: 'ic-orange'
  };

  function _openModal(opts) {
    const ov = buildOverlay();

    // Icon
    const iconWrap = document.getElementById('ftech-confirm-icon-wrap');
    iconWrap.textContent = opts.icon || '⚠️';
    iconWrap.className = ICON_CLASS[opts.okClass || 'red'] || 'ic-red';

    document.getElementById('ftech-confirm-title').textContent = opts.title || 'Xác nhận hành động';
    document.getElementById('ftech-confirm-msg').textContent = opts.message || '';

    // Input (for prompt)
    const inp = document.getElementById('ftech-confirm-input');
    if (opts.showInput) {
      inp.placeholder = opts.placeholder || '';
      inp.value = opts.defaultValue || '';
      inp.style.display = 'block';
    } else {
      inp.style.display = 'none';
    }

    // Buttons
    const okBtn = document.getElementById('ftech-confirm-ok');
    okBtn.textContent = opts.okText || 'Xác nhận';
    okBtn.className = 'ok-' + (opts.okClass || 'red');

    const cancelBtn = document.getElementById('ftech-confirm-cancel');
    cancelBtn.textContent = opts.cancelText || 'Hủy';

    // Clone để xoá listener cũ
    const newOk = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOk, okBtn);
    const newCancel = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);

    document.getElementById('ftech-confirm-ok').addEventListener('click', function () {
      _closeModal();
      if (opts.onOk) {
        const val = opts.showInput
          ? document.getElementById('ftech-confirm-input').value.trim()
          : undefined;
        opts.onOk(val);
      }
    });
    document.getElementById('ftech-confirm-cancel').addEventListener('click', _closeModal);

    ov.classList.add('open');

    if (opts.showInput) {
      setTimeout(() => document.getElementById('ftech-confirm-input').focus(), 80);
    }
  }

  /**
   * Hiện modal xác nhận (thay confirm()).
   * @param {string}   message
   * @param {function} onOk
   * @param {object}   [opts] { title, icon, okText, cancelText, okClass }
   */
  window.showConfirm = function (message, onOk, opts) {
    opts = opts || {};
    _openModal({
      title:      opts.title      || 'Xác nhận hành động',
      icon:       opts.icon       || '⚠️',
      message:    message,
      okText:     opts.okText     || 'Xác nhận',
      cancelText: opts.cancelText || 'Hủy',
      okClass:    opts.okClass    || 'red',
      showInput:  false,
      onOk:       onOk,
    });
  };

  /**
   * Hiện modal nhập liệu (thay prompt()).
   * @param {string}   title
   * @param {string}   placeholder
   * @param {function} onOk   nhận (value: string)
   * @param {object}   [opts] { icon, message, okText, okClass, defaultValue }
   */
  window.showPromptModal = function (title, placeholder, onOk, opts) {
    opts = opts || {};
    _openModal({
      title:        title,
      icon:         opts.icon        || '✏️',
      message:      opts.message     || '',
      placeholder:  placeholder,
      defaultValue: opts.defaultValue || '',
      okText:       opts.okText      || 'Xác nhận',
      cancelText:   opts.cancelText  || 'Hủy',
      okClass:      opts.okClass     || 'blue',
      showInput:    true,
      onOk:         onOk,
    });
  };
})();
