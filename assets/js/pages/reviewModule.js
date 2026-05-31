// Stars
let mainStar = 0;
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
  if (photoCount >= 5) { alert('Tối đa 5 ảnh.'); return; }
  const c = document.getElementById('uploadedImgs');
  const d = document.createElement('div'); d.className = 'uimg';
  d.innerHTML = photoEmojis[photoCount] + '<div class="del" onclick="this.parentElement.remove();photoCount--">×</div>';
  c.appendChild(d); photoCount++;
}

function renderStats() {
  const reviews = window.FTECHDB.getReviews();
  const total = reviews.length;
  if (total === 0) return;

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

function renderReviews() {
  const reviews = window.FTECHDB.getReviews();
  document.getElementById('reviewsList').innerHTML = reviews.map(r => `
    <div class="rv-card">
      <div class="rv-top">
        <div class="rv-user">
          <div class="rv-avatar">
            ${r.avatar.startsWith('http') ? `<img src="${r.avatar}" alt="${r.name}">` : `<div style="font-size:24px;width:36px;height:36px;display:grid;place-items:center;background:#eef;border-radius:50%;">${r.avatar}</div>`}
          </div>
          <div>
            <div class="rv-name">${r.name}</div>
            <div class="rv-meta">${r.date} · Đã mua qua Shopee/Lazada</div>
            <div class="rv-source">Nguồn ảnh minh họa: Unsplash</div>
          </div>
        </div>
        <div class="rv-right">
          ${r.verified ? '<span class="rv-verified">✓ Đã duyệt</span>' : ''}
          <span class="rv-stars-row">${'⭐'.repeat(r.stars)}</span>
          <span class="rv-score">${r.stars.toFixed(1)}</span>
        </div>
      </div>
      ${r.criteria ? `
        <div class="rv-criteria">
          <div class="rv-crit">Hiệu năng<span>${'⭐'.repeat(r.criteria.perf)}</span></div>
          <div class="rv-crit">Build<span>${'⭐'.repeat(r.criteria.build)}</span></div>
          <div class="rv-crit">Giá trị<span>${'⭐'.repeat(r.criteria.value)}</span></div>
          <div class="rv-crit">Dịch vụ<span>${'⭐'.repeat(r.criteria.service)}</span></div>
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

function submitReview() {
  if (mainStar === 0) { alert('Vui lòng chọn số sao đánh giá.'); return; }
  const textVal = document.getElementById('rvText').value.trim();
  if (!textVal) { alert('Vui lòng nhập nội dung đánh giá.'); return; }

  const currentUser = localStorage.getItem('ftech_username') || 'Nguyễn Minh Vỹ';
  const currentAvatar = localStorage.getItem('ftech_avatar') || '👨';

  const newReview = {
    name: currentUser,
    avatar: currentAvatar,
    stars: mainStar,
    title: document.getElementById('rvTitle').value.trim() || 'Nhận xét',
    text: textVal,
    hasPhotos: photoCount > 0,
    verified: true,
    criteria: { ...miniCriteria }
  };

  const btn = document.querySelector('.submit-btn');
  btn.disabled = true; btn.textContent = '⏳ Đang gửi...';

  setTimeout(() => {
    window.FTECHDB.saveReview(newReview);
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
  const reviews = window.FTECHDB.getReviews();
  let filtered = reviews;
  if (val === '5' || val === '4' || val === '3') {
    filtered = reviews.filter(r => r.stars === parseInt(val));
  } else if (val === 'photo') {
    filtered = reviews.filter(r => r.hasPhotos);
  } else if (val === 'verified') {
    filtered = reviews.filter(r => r.verified);
  }
  
  // Re-render list
  document.getElementById('reviewsList').innerHTML = filtered.map(r => `
    <div class="rv-card">
      <div class="rv-top">
        <div class="rv-user">
          <div class="rv-avatar">
            ${r.avatar.startsWith('http') ? `<img src="${r.avatar}" alt="${r.name}">` : `<div style="font-size:24px;width:36px;height:36px;display:grid;place-items:center;background:#eef;border-radius:50%;">${r.avatar}</div>`}
          </div>
          <div>
            <div class="rv-name">${r.name}</div>
            <div class="rv-meta">${r.date} · Đã mua qua Shopee/Lazada</div>
          </div>
        </div>
        <div class="rv-right">
          <span class="rv-stars-row">${'⭐'.repeat(r.stars)}</span>
          <span class="rv-score">${r.stars.toFixed(1)}</span>
        </div>
      </div>
      <div class="rv-title">${r.title || 'Đánh giá sản phẩm'}</div>
      <div class="rv-text">${r.text}</div>
      <div class="rv-actions">
        <span class="rv-helpful">Hữu ích không?</span>
        <button class="rv-helpful-btn" onclick="vote(this,${r.id},'up')">👍 Có (${r.helpful})</button>
      </div>
    </div>`).join('');
}

function filterByStar(n) {
  const tabs = document.querySelectorAll('.ftab');
  if (tabs.length >= n) {
    tabs[5 - n + 1].click();
  }
}

function sortReviews(v) {
  const reviews = window.FTECHDB.getReviews();
  if (v === 'newest') reviews.sort((a,b) => b.id - a.id);
  else if (v === 'helpful') reviews.sort((a,b) => b.helpful - a.helpful);
  else if (v === 'highest') reviews.sort((a,b) => b.stars - a.stars);
  else if (v === 'lowest') reviews.sort((a,b) => a.stars - b.stars);
  renderReviews();
}

function loadMoreReviews() {
  alert('Đã hiển thị toàn bộ đánh giá có trong cơ sở dữ liệu ảo!');
}

// Initial nạp
document.addEventListener('DOMContentLoaded', () => {
  renderReviews();
  renderStats();
});
