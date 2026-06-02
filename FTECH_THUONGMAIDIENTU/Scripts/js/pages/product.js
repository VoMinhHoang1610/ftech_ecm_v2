// --- DYNAMIC PRODUCT DETAIL LOGIC ---

let currentPostId = 'post-1';

function partnerClick(linkId) {
  const aff = window.FTECHDB.getAffiliate(linkId);
  if (!aff) {
    alert('Không tìm thấy liên kết tiếp thị cho đối tác này.');
    return;
  }

  const redirectPage = window.location.pathname.toLowerCase().endsWith('.html') ? 'redirect.html' : '/redirect.html';
  window.location.href = `${redirectPage}?linkId=${encodeURIComponent(linkId)}&from=${encodeURIComponent(window.location.pathname + window.location.search)}`;
}

function renderComments() {
  const comments = window.FTECHDB.getComments(currentPostId, { status: 'approved' });
  const list = document.getElementById('commentList');
  if (!list) return;

  if (comments.length === 0) {
    list.innerHTML = '<div class="comment-empty">Chưa có bình luận nào đã được duyệt cho bài viết này.</div>';
    return;
  }

  list.innerHTML = comments.map(c => `
    <div class="comment-item">
      <div class="comment-head">
        <div class="comment-name">${c.name}</div>
        <div class="comment-date">${c.date}</div>
      </div>
      <div class="comment-text">${c.text}</div>
    </div>
  `).join('');
}

function showCommentNotice(message) {
  const actions = document.querySelector('.comment-actions');
  if (!actions) return;

  let notice = document.getElementById('commentNotice');
  if (!notice) {
    notice = document.createElement('div');
    notice.id = 'commentNotice';
    notice.className = 'comment-notice';
    actions.insertAdjacentElement('afterend', notice);
  }
  notice.textContent = message;
}

function submitComment() {
  const input = document.getElementById('commentInput');
  const value = input.value.trim();
  const isLoggedIn = localStorage.getItem('ftech_logged_in') === 'true';
  const currentUserId = localStorage.getItem('ftech_user') || '';

  if (!value) {
    alert('Vui lòng nhập nội dung bình luận.');
    return;
  }

  if (!isLoggedIn || !currentUserId) {
    alert('Vui long dang nhap de gui binh luan.');
    window.location.href = 'login.html';
    return;
  }

  const account = window.FTECHDB.getAccount(currentUserId);
  const newComment = {
    postId: currentPostId,
    userId: currentUserId,
    name: (account && account.name) || localStorage.getItem('ftech_username') || currentUserId,
    text: value,
    status: 'pending'
  };

  window.FTECHDB.saveComment(newComment);
  renderComments();
  showCommentNotice('Bình luận của bạn đã được gửi và đang chờ admin duyệt.');
  input.value = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  currentPostId = urlParams.get('id') || 'post-1';
  const post = window.FTECHDB.getPost(currentPostId);

  if (post) {
    document.title = `FTECH - Đánh giá ${post.title}`;

    const breadcrumbSpan = document.querySelector('.breadcrumb span:last-child');
    if (breadcrumbSpan) breadcrumbSpan.textContent = `Đánh giá ${post.title}`;

    const metaRow = document.querySelector('.hero-main .meta-row');
    if (metaRow) {
      metaRow.innerHTML = `
        <span class="meta-chip">Đánh giá chuyên sâu</span>
        <span class="meta-chip">${post.category}</span>
        <span class="meta-chip">${post.brand}</span>
        <span class="meta-chip">Cập nhật: ${post.date}</span>
      `;
    }

    const titleEl = document.querySelector('.hero-main .title');
    if (titleEl) titleEl.textContent = post.title;

    const subtitleEl = document.querySelector('.hero-main .subtitle');
    if (subtitleEl) subtitleEl.textContent = post.excerpt;

    const statsEl = document.querySelector('.author-row .author-stats');
    if (statsEl) {
      const commCount = window.FTECHDB.getComments(currentPostId, { status: 'approved' }).length;
      const revCount = window.FTECHDB.getReviews(currentPostId).length;
      statsEl.textContent = `${(post.views || 0).toLocaleString('vi-VN')} lượt xem - ${commCount} bình luận - ${revCount} đánh giá`;
    }

    const imgEl = document.querySelector('.hero-image img');
    if (imgEl) {
      imgEl.src = post.image || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80';
      imgEl.alt = post.title;
    }

    const specBody = document.querySelector('.spec-table tbody');
    if (specBody) {
      specBody.innerHTML = `
        <tr><td>Sản phẩm</td><td>${post.title}</td></tr>
        <tr><td>Thương hiệu</td><td>${post.brand}</td></tr>
        <tr><td>Giá ưu đãi</td><td><strong style="color: var(--red); font-size: 16px;">${window.FTECHDB.formatMoney(post.price)}</strong></td></tr>
        <tr><td>Giá gốc</td><td><del>${post.oldPrice ? window.FTECHDB.formatMoney(post.oldPrice) : ''}</del> ${post.discount ? `-${post.discount}%` : ''}</td></tr>
        <tr><td>Đánh giá sao</td><td>${'*'.repeat(Math.round(post.stars || 5))}</td></tr>
        <tr><td>Nổi bật</td><td>${post.label || 'new'}</td></tr>
        <tr><td>Cập nhật</td><td>${post.date}</td></tr>
      `;
    }

    const contentEl = document.querySelector('.article-content');
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="section-title">Nội dung đánh giá chi tiết</div>
        <h3>1. Thiết kế và cảm giác sử dụng thực tế</h3>
        <p>${post.excerpt || 'Đang cập nhật đánh giá chi tiết...'}</p>
        <h3>2. Đánh giá hiệu năng hoạt động</h3>
        <p>${post.content || 'Nội dung phân tích cấu hình và trải nghiệm thực tế từ đội ngũ đánh giá FTECH.'}</p>
        <div class="note">Nhận định nhanh từ FTECH: Sản phẩm đại diện tốt của dòng ${post.brand} với độ ổn định cao trong phân khúc giá trị sử dụng.</div>
      `;
    }

    const partnersList = document.querySelector('.partner-list');
    if (partnersList) {
      const activeAffiliates = window.FTECHDB.getAffiliates(currentPostId).filter(a => a.status === 'active');
      if (activeAffiliates.length > 0) {
        partnersList.innerHTML = activeAffiliates.map(aff => {
          const partner = window.FTECHDB.getPartner(aff.partnerId) || { name: aff.partner, desc: 'Đối tác bán hàng uy tín' };
          return `
            <div class="partner-item">
              <div>
                <strong>${partner.name}</strong>
                <span>${partner.desc || aff.type || 'Hàng chính hãng - Hỗ trợ tốt'}</span>
              </div>
              <div class="partner-price">${window.FTECHDB.formatMoney(post.price)}</div>
              <button class="partner-btn" onclick="partnerClick('${aff.id}')">Đi đến nơi bán</button>
            </div>
          `;
        }).join('');
      } else {
        partnersList.innerHTML = '<div class="comment-empty">Chưa có liên kết tiếp thị đang hoạt động cho bài viết này.</div>';
      }
    }

    const scoreVal = document.querySelector('.score-value strong');
    if (scoreVal) scoreVal.textContent = (Number(post.stars || 0) * 2.0).toFixed(1);

    const scoreStars = document.querySelector('.score-card .stars');
    if (scoreStars) scoreStars.textContent = '*'.repeat(Math.round(post.stars || 5));

    document.querySelectorAll('a[href="reviewModule.html"]').forEach(link => {
      link.href = `reviewModule.html?postId=${encodeURIComponent(currentPostId)}`;
    });
  }

  renderComments();
});
