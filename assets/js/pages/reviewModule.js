// Stars
let mainStar = 0;
const reviewParams = new URLSearchParams(window.location.search);
const currentPostId = reviewParams.get('postId') || reviewParams.get('id') || 'post-1';
const starLabels = ['', 'Rất tệ', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Tuyệt vời!'];

function setMainStar(v) {
  mainStar = v;
  document.querySelectorAll('.sp-star').forEach((s, i) => { s.classList.toggle('lit', i < v); });
  document.getElementById('starLabel').textContent = starLabels[v];
  document.getElementById('starLabel').style.color = '#fbbf24';
}

const miniCriteria = { perf: 5, build: 5, value: 5, service: 5 };
function setMini(group, v) {
  miniCriteria[group] = v;
  const container = document.querySelector(`.mini-stars[data-group="${group}"]`);
  container.querySelectorAll('.mstar').forEach((s, i) => s.classList.toggle('lit', i < v));
}

document.getElementById('rvText').addEventListener('input', function () {
  document.getElementById('charCount').textContent = this.value.length + ' / 1000 ký tự';
});

let photoCount = 0;
const photoEmojis = ['🖼️', '📸', '🔍', '💡', '🎯'];
function addPhoto() {
  if (photoCount >= 5) { showToast('Tối đa 5 ảnh.', 'warn'); return; }
  const c = document.getElementById('uploadedImgs');
  const d = document.createElement('div'); d.className = 'uimg';
  d.innerHTML = photoEmojis[photoCount] + '<div class="del" onclick="this.parentElement.remove();photoCount--">×</div>';
  c.appendChild(d); photoCount++;
}

function renderStats() {
  const reviews = window.FTECHDB.getReviews(currentPostId);
  const total = reviews.length;
  if (total === 0) {
    document.querySelector('.rs-big-num').textContent = '0.0';
    document.querySelector('.rs-total').textContent = '0 đánh giá';
    return;
  }

  // Average
  const avg = (reviews.reduce((sum, r) => sum + r.stars, 0) / total).toFixed(1);
  document.querySelector('.rs-big-num').textContent = avg;
  document.querySelector('.rs-total').textContent = `${total} đánh giá`;

  // Bars
  const starsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(r => {
    starsCount[r.stars] = (starsCount[r.stars] || 0) + 1;
  });

  const bars = document.querySelectorAll('.rs-bars .rs-br');
  bars.forEach(bar => {
    const starVal = parseInt(bar.getAttribute('onclick').match(/\d+/)[0]);
    const count = starsCount[starVal] || 0;
    const pct = ((count / total) * 100).toFixed(1);
    bar.querySelector('.rs-br-fill').style.width = `${pct}%`;
    bar.querySelector('.rs-br-pct').textContent = `${pct}%`;
    bar.querySelector('span:last-child').textContent = `(${count})`;
  });

  // Criteria stats
  let perfSum = 0, buildSum = 0, valueSum = 0, serviceSum = 0;
  reviews.forEach(r => {
    if (r.criteria) {
      perfSum += r.criteria.perf || 5;
      buildSum += r.criteria.build || 5;
      valueSum += r.criteria.value || 5;
      serviceSum += r.criteria.service || 5;
    } else {
      perfSum += 5; buildSum += 5; valueSum += 5; serviceSum += 5;
    }
  });

  document.querySelectorAll('.criteria-grid .criterion, .sidebar-card .u-style-126 div').forEach(c => {
    const nameEl = c.querySelector('.u-style-128') || c.querySelector('.criterion-label');
    if (!nameEl) return;
    const label = nameEl.textContent;
    let avgScore = 5.0;
    if (label.includes('Hiệu năng')) avgScore = (perfSum / total).toFixed(1);
    else if (label.includes('Độ bền')) avgScore = (buildSum / total).toFixed(1);
    else if (label.includes('Giá trị')) avgScore = (valueSum / total).toFixed(1);
    else if (label.includes('Dịch vụ')) avgScore = (serviceSum / total).toFixed(1);

    const valEl = c.querySelector('.u-style-129');
    if (valEl) valEl.textContent = `${avgScore} ⭐`;
  });
}

function getSafeAvatar(avatar) {
  return String(avatar || '👤');
}

function renderReviewList(reviews) {
  document.getElementById('reviewsList').innerHTML = reviews.map(r => `
    <div class="rv-card">
      <div class="rv-top">
        <div class="rv-user">
          <div class="rv-avatar">
            ${getSafeAvatar(r.avatar).startsWith('http') ? `<img src="${r.avatar}" alt="${r.name}">` : `<div style="font-size:24px;width:36px;height:36px;display:grid;place-items:center;background:#eef;border-radius:50%;">${getSafeAvatar(r.avatar)}</div>`}
          </div>
          <div>
            <div class="rv-name">${r.name}</div>
            <div class="rv-meta">${r.date} · Đã mua qua Shopee/Lazada</div>
            <div class="rv-source">Nguồn ảnh minh họa: Unsplash</div>
          </div>
        </div>
        <div class="rv-right">
          ${r.verified ? '<span class="rv-verified">✓ Đã duyệt</span>' : ''}
          <span class="rv-stars-row">${'⭐'.repeat(Math.round(r.stars))}</span>
          <span class="rv-score">${r.stars.toFixed(1)}</span>
        </div>
      </div>
      ${r.criteria ? `
        <div class="rv-criteria">
          <div class="rv-crit">Hiệu năng<span>${'⭐'.repeat(Math.round(r.criteria.perf))}</span></div>
          <div class="rv-crit">Build<span>${'⭐'.repeat(Math.round(r.criteria.build))}</span></div>
          <div class="rv-crit">Giá trị<span>${'⭐'.repeat(Math.round(r.criteria.value))}</span></div>
          <div class="rv-crit">Dịch vụ<span>${'⭐'.repeat(Math.round(r.criteria.service))}</span></div>
        </div>` : ''}
      <div class="rv-title">${r.title || 'Đánh giá sản phẩm'}</div>
      <div class="rv-text">${r.text}</div>
      ${r.hasPhotos ? `<div class="rv-photos"><div class="rv-photo">📸</div><div class="rv-photo">🖼️</div><div class="rv-photo">🔍</div></div>` : ''}
      <div class="rv-actions">
        <span class="rv-helpful">Hữu ích không?</span>
        <button class="rv-helpful-btn" onclick="vote(this,${r.id},'up')">👍 Có (${r.helpful})</button>
        <button class="rv-helpful-btn" onclick="vote(this,${r.id},'down')">👎 Không</button>
        <button class="rv-report">🚩 Báo cáo</button>
      </div>
      ${r.adminReply ? `
        <div class="admin-reply">
          <div class="ar-header">
            <span class="ar-badge">FTECH STAFF</span>
            <span class="ar-name">${r.adminReply.name}</span>
            <span class="ar-time">· Phản hồi chính thức</span>
          </div>
          <div class="ar-text">${r.adminReply.text}</div>
        </div>` : ''}
    </div>`).join('');
}

function renderReviews() {
  renderReviewList(window.FTECHDB.getReviews(currentPostId));
}

function getReviewAuthState() {
  const session = window.FTECHAuth && window.FTECHAuth.getSession ? window.FTECHAuth.getSession() : {
    loggedIn: localStorage.getItem('ftech_logged_in') === 'true',
    role: localStorage.getItem('ftech_role') || '',
    username: localStorage.getItem('ftech_user') || '',
    displayName: localStorage.getItem('ftech_username') || '',
    avatar: localStorage.getItem('ftech_avatar') || '',
    token: localStorage.getItem('ftech_access_token') || ''
  };
  const username = session.username;
  const role = session.role;
  const token = session.token;
  const loggedIn = session.loggedIn;

  if (!username || (!token && !loggedIn)) {
    return { ok: false, reason: 'login' };
  }
  if (role !== 'customer') {
    return { ok: false, reason: 'role' };
  }
  return { ok: true, username, displayName: session.displayName, avatar: session.avatar };
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function formatLockDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
}

function getSeverityLabel(severity) {
  const labels = {
    low: 'nhẹ',
    medium: 'trung bình',
    high: 'nghiêm trọng'
  };
  return labels[severity] || severity || 'chưa xác định';
}

function closeReviewModal() {
  const modal = document.getElementById('reviewGateModal');
  if (modal) modal.classList.remove('open');
}

function focusReviewText() {
  closeReviewModal();
  const textarea = document.getElementById('rvText');
  if (textarea) textarea.focus();
}

function showReviewModal(type, data = {}) {
  let modal = document.getElementById('reviewGateModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'reviewGateModal';
    modal.className = 'review-modal-overlay';
    modal.addEventListener('click', event => {
      if (event.target === modal) closeReviewModal();
    });
    document.body.appendChild(modal);
  }

  const configs = {
    lock: {
      title: 'Tài khoản bị khóa đánh giá',
      tone: 'danger',
      body: `<p>Bạn đã nhận 3 cảnh báo về ngôn ngữ không phù hợp. Chức năng gửi đánh giá bị khóa trong 3 ngày.</p><p>Thời gian mở khóa: <strong>${escapeHtml(formatLockDate(data.lockedUntil))}</strong></p>`,
      actions: '<button class="review-modal-btn primary" onclick="closeReviewModal()">Đã hiểu</button>'
    },
    noClick: {
      title: 'Bạn chưa mua hàng',
      tone: 'warn',
      body: '<p>Bạn cần mua hàng thông qua liên kết affiliate hợp lệ trong bài review sản phẩm trước khi gửi đánh giá.</p>',
      actions: `<button class="review-modal-btn ghost" onclick="closeReviewModal()">Đóng</button><a class="review-modal-btn primary" href="product.html?id=${encodeURIComponent(currentPostId)}">Quay lại bài review</a>`
    },
    profanity: {
      title: 'Nội dung chứa từ không phù hợp',
      tone: data.isLocked ? 'danger' : 'warn',
      body: `
        <p>Vui lòng chỉnh sửa đánh giá trước khi gửi lại. Số lần cảnh báo hiện tại: <strong>${data.warningCount}/3</strong>.</p>
        <div class="review-modal-list">${(data.matches || []).map(match => `<span>${escapeHtml(match.word)} · Mức độ ${escapeHtml(getSeverityLabel(match.severity))}</span>`).join('')}</div>
        <div class="review-modal-suggestions">${(data.suggestions || []).map(item => `<p>${escapeHtml(item)}</p>`).join('')}</div>
        ${data.isLocked ? `<p><strong>Tài khoản đã bị khóa đến ${escapeHtml(formatLockDate(data.lockedUntil))}.</strong></p>` : ''}
      `,
      actions: '<button class="review-modal-btn primary" onclick="focusReviewText()">Chỉnh sửa</button>'
    }
  };
  const cfg = configs[type];
  modal.innerHTML = `
    <div class="review-modal ${cfg.tone}">
      <button class="review-modal-close" onclick="closeReviewModal()" aria-label="Đóng">x</button>
      <div class="review-modal-title">${cfg.title}</div>
      <div class="review-modal-body">${cfg.body}</div>
      <div class="review-modal-actions">${cfg.actions}</div>
    </div>
  `;
  modal.classList.add('open');
}

function applyReviewFormState() {
  const submitBtn = document.querySelector('.submit-btn');
  if (!submitBtn) return;

  let notice = document.getElementById('reviewAuthNotice');
  if (!notice) {
    notice = document.createElement('div');
    notice.id = 'reviewAuthNotice';
    notice.className = 'review-auth-notice';
    submitBtn.parentElement.insertBefore(notice, submitBtn);
  }

  const state = getReviewAuthState();
  if (state.ok) {
    notice.textContent = '';
    notice.style.display = 'none';
    submitBtn.disabled = false;
    return;
  }

  notice.style.display = 'block';
  submitBtn.disabled = true;
  if (state.reason === 'login') {
    notice.innerHTML = 'Vui lòng <a href="login.html">đăng nhập</a> tài khoản khách hàng để gửi đánh giá.';
  } else if (state.reason === 'role') {
    notice.textContent = 'Chỉ tài khoản khách hàng mới có thể gửi đánh giá sản phẩm.';
  }
}

function submitReview() {
  const auth = getReviewAuthState();
  function _blockSubmit(msg) {
    applyReviewFormState();
    showToast(msg, 'warn');
  }

  if (!auth.ok) {
    if (auth.reason === 'login') {
      applyReviewFormState();
      window.location.href = 'login.html';
      return;
    }
    _blockSubmit(auth.reason === 'duplicate'
      ? 'Bạn đã đánh giá sản phẩm này. Mỗi tài khoản chỉ được gửi một đánh giá.'
      : 'Chỉ tài khoản khách hàng mới có thể gửi đánh giá.');
    return;
  }

  const warningState = window.FTECHDB.getReviewWarnings(auth.username);
  if (window.FTECHDB.isReviewLocked(auth.username)) {
    showReviewModal('lock', warningState);
    return;
  }

  const hasValidPurchase = window.FTECHDB.hasValidClickLog(auth.username, currentPostId);
  if (!hasValidPurchase) {
    showReviewModal('noClick');
    return;
  }

  const textVal = document.getElementById('rvText').value.trim();
  const profanityResult = window.FTECHProfanityFilter ? window.FTECHProfanityFilter.checkProfanity(textVal) : { hasProfanity: false };
  if (profanityResult.hasProfanity) {
    const updatedWarning = window.FTECHDB.addWarning(auth.username);
    showReviewModal('profanity', {
      matches: profanityResult.matches,
      suggestions: profanityResult.suggestions,
      warningCount: updatedWarning.warningCount,
      isLocked: updatedWarning.isLocked,
      lockedUntil: updatedWarning.lockedUntil
    });
    return;
  }

  if (window.FTECHDB.hasUserReviewedPost(currentPostId, auth.username)) {
    showToast('Bạn đã đánh giá sản phẩm này. Mỗi tài khoản chỉ được gửi một đánh giá.', 'warn');
    applyReviewFormState();
    return;
  }

  if (mainStar === 0) { showToast('Vui lòng chọn số sao đánh giá.', 'warn'); return; }
  if (!textVal) { showToast('Vui lòng nhập nội dung đánh giá.', 'warn'); return; }

  const account = window.FTECHDB.getAccount(auth.username);
  const currentUser = account ? account.name : auth.displayName || auth.username;
  const currentAvatar = account ? account.avatar : auth.avatar || '👨';

  const newReview = {
    postId: currentPostId,
    userId: auth.username,
    name: currentUser,
    avatar: currentAvatar,
    stars: mainStar,
    title: document.getElementById('rvTitle').value.trim() || 'Nhận xét',
    text: textVal,
    hasPhotos: photoCount > 0,
    verified: hasValidPurchase,
    hasValidPurchase,
    criteria: { ...miniCriteria }
  };

  const btn = document.querySelector('.submit-btn');
  btn.disabled = true; btn.textContent = '⏳ Đang gửi...';

  setTimeout(() => {
    const saved = window.FTECHDB.saveReview(newReview);
    if (!saved) {
      showToast('Bạn đã đánh giá sản phẩm này. Mỗi tài khoản chỉ được gửi một đánh giá.', 'warn');
      btn.disabled = false;
      btn.textContent = '📤 Gửi đánh giá';
      applyReviewFormState();
      return;
    }
    document.getElementById('toastSuccess').classList.add('show');
    btn.textContent = '✅ Đã gửi!';

    // Reset Form
    document.getElementById('rvText').value = '';
    document.getElementById('rvTitle').value = '';
    document.querySelectorAll('.sp-star').forEach(s => s.classList.remove('lit'));
    document.querySelectorAll('.mstar').forEach(s => s.classList.remove('lit'));
    mainStar = 0; photoCount = 0;
    document.getElementById('uploadedImgs').innerHTML = '';
    document.getElementById('starLabel').textContent = 'Nhấn để chọn sao';

    renderReviews();
    renderStats();

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = '📤 Gửi đánh giá';
      document.getElementById('toastSuccess').classList.remove('show');
      applyReviewFormState();
    }, 2500);
  }, 900);
}

function vote(btn, id, dir) {
  if (btn.classList.contains('voted')) return;
  btn.classList.add('voted');
  if (dir === 'up') {
    window.FTECHDB.voteHelpful(id, true);
  } else {
    window.FTECHDB.voteHelpful(id, false);
  }
  renderReviews();
}

function filterTab(btn, val) {
  document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const reviews = window.FTECHDB.getReviews(currentPostId);
  let filtered = reviews;
  if (val === '5' || val === '4' || val === '3') {
    filtered = reviews.filter(r => r.stars === parseInt(val));
  } else if (val === 'photo') {
    filtered = reviews.filter(r => r.hasPhotos);
  } else if (val === 'verified') {
    filtered = reviews.filter(r => r.verified);
  }
  
  renderReviewList(filtered);
}

function filterByStar(n) {
  const tabs = document.querySelectorAll('.ftab');
  if (tabs.length >= n) {
    tabs[5 - n + 1].click();
  }
}

function sortReviews(v) {
  const reviews = window.FTECHDB.getReviews(currentPostId);
  if (v === 'newest') reviews.sort((a,b) => b.id - a.id);
  else if (v === 'helpful') reviews.sort((a,b) => b.helpful - a.helpful);
  else if (v === 'highest') reviews.sort((a,b) => b.stars - a.stars);
  else if (v === 'lowest') reviews.sort((a,b) => a.stars - b.stars);
  renderReviewList(reviews);
}

function loadMoreReviews() {
  const listEl = document.getElementById('reviewsList');
  if (listEl) {
    const notice = document.createElement('div');
    notice.style.cssText = 'text-align:center;color:var(--muted,#888);padding:12px;font-size:13px;';
    notice.textContent = 'Đã hiển thị toàn bộ đánh giá có trong cơ sở dữ liệu.';
    listEl.appendChild(notice);
    setTimeout(() => notice.remove(), 2500);
  }
}

// Initial nạp
document.addEventListener('DOMContentLoaded', () => {
  const post = window.FTECHDB.getPost(currentPostId);
  if (post) {
    const productName = document.querySelector('.pm-name');
    const productBrand = document.querySelector('.pm-brand');
    const productPrice = document.querySelector('.pm-price');
    const productScore = document.querySelector('.pm-score');
    const productBack = document.querySelector('.pm-link');
    const productImg = document.querySelector('.pm-img img');

    if (productName) productName.textContent = post.title;
    if (productBrand) productBrand.textContent = post.brand || 'FTECH';
    if (productPrice) productPrice.textContent = window.FTECHDB.formatMoney(post.price);
    if (productScore) productScore.innerHTML = `<span class="pm-stars">${'⭐'.repeat(Math.round(post.stars || 5))}</span><strong>${Number(post.stars || 0).toFixed(1)}</strong><span>· ${window.FTECHDB.getReviews(currentPostId).length} đánh giá · đồng bộ từ bài review</span>`;
    if (productBack) productBack.href = `product.html?id=${encodeURIComponent(currentPostId)}`;
    if (productImg && post.image) productImg.src = post.image;
  }

  renderReviews();
  renderStats();
  applyReviewFormState();
});
