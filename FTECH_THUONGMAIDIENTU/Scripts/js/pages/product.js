// --- DYNAMIC PRODUCT DETAIL LOGIC ---

function partnerClick(name) {
  // Track affiliate click in virtual database
  const affiliates = window.FTECHDB.getAffiliates();
  const aff = affiliates.find(a => a.partner.toLowerCase().includes(name.toLowerCase()));
  if (aff) {
    window.FTECHDB.incrementClicks(aff.id);
  }
  alert("Điều hướng đến đối tác: " + name + ". Lượt click của liên kết đã được ghi nhận trong cơ sở dữ liệu hệ thống!");
}

function renderComments() {
  const comments = window.FTECHDB.getComments();
  const list = document.getElementById("commentList");
  if (!list) return;
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

function submitComment() {
  const input = document.getElementById("commentInput");
  const value = input.value.trim();

  if (!value) {
    alert("Vui lòng nhập nội dung bình luận.");
    return;
  }

  // Retrieve current logged in user
  const currentUser = localStorage.getItem('ftech_username') || 'Nguyễn Minh Vỹ';

  const newComment = {
    name: currentUser,
    text: value
  };

  window.FTECHDB.saveComment(newComment);
  renderComments();
  input.value = "";
}

// Initial render & product query
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id') || 'post-1';
  const post = window.FTECHDB.getPost(postId);

  if (post) {
    // 1. Update document title
    document.title = `FTECH - Đánh giá ${post.title}`;

    // 2. Dynamic breadcrumb
    const breadcrumbSpan = document.querySelector('.breadcrumb span:last-child');
    if (breadcrumbSpan) breadcrumbSpan.textContent = `Đánh giá ${post.title}`;

    // 3. Meta chips
    const metaRow = document.querySelector('.hero-main .meta-row');
    if (metaRow) {
      metaRow.innerHTML = `
        <span class="meta-chip">Review chuyên sâu</span>
        <span class="meta-chip">${post.category}</span>
        <span class="meta-chip">${post.brand}</span>
        <span class="meta-chip">Cập nhật: ${post.date}</span>
      `;
    }

    // 4. Title & subtitle
    const titleEl = document.querySelector('.hero-main .title');
    if (titleEl) titleEl.textContent = post.title;

    const subtitleEl = document.querySelector('.hero-main .subtitle');
    if (subtitleEl) subtitleEl.textContent = post.excerpt;

    // 5. Author row stats
    const statsEl = document.querySelector('.author-row .author-stats');
    if (statsEl) {
      const commCount = window.FTECHDB.getComments().length;
      const revCount = window.FTECHDB.getReviews().length;
      statsEl.textContent = `${(post.views || 0).toLocaleString('vi-VN')} lượt xem · ${commCount} bình luận · ${revCount} đánh giá`;
    }

    // 6. Hero Image
    const imgEl = document.querySelector('.hero-image img');
    if (imgEl) {
      imgEl.src = post.image || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80';
      imgEl.alt = post.title;
    }

    // 7. Dynamic specs table
    const specBody = document.querySelector('.spec-table tbody');
    if (specBody) {
      specBody.innerHTML = `
        <tr><td>Sản phẩm</td><td>${post.title}</td></tr>
        <tr><td>Thương hiệu</td><td>${post.brand}</td></tr>
        <tr><td>Giá ưu đãi</td><td><strong style="color: var(--red); font-size: 16px;">${post.price}</strong></td></tr>
        <tr><td>Giá gốc</td><td><del>${post.old || ''}</del> ${post.discount || ''}</td></tr>
        <tr><td>Đánh giá sao</td><td>${'⭐'.repeat(post.stars || 5)}</td></tr>
        <tr><td>Nổi bật</td><td>${post.label || 'new'}</td></tr>
        <tr><td>Cập nhật</td><td>${post.date}</td></tr>
      `;
    }

    // 8. Dynamic article content
    const contentEl = document.querySelector('.article-content');
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="section-title">Nội dung review chi tiết</div>
        <h3>1. Thiết kế và cảm giác sử dụng thực tế</h3>
        <p>${post.excerpt || 'Đang cập nhật đánh giá chi tiết...'}</p>
        <h3>2. Đánh giá hiệu năng hoạt động</h3>
        <p>${post.content || 'Nội dung phân tích cấu hình chip mạnh mẽ, ưu nhược điểm thực tế từ trải nghiệm FTECH Review Team.'}</p>
        <div class="note">Nhận định nhanh từ FTECH: Sản phẩm đại diện ưu tú của dòng ${post.brand} với độ ổn định rất cao trong phân khúc giá trị sử dụng.</div>
      `;
    }

    // 9. Buy partners list from FTECHDB
    const partnersList = document.querySelector('.partner-list');
    if (partnersList) {
      const activePartners = window.FTECHDB.getPartners().filter(p => p.status !== 'paused');
      if (activePartners.length > 0) {
        partnersList.innerHTML = activePartners.map(p => `
          <div class="partner-item">
            <div>
              <strong>${p.name}</strong>
              <span>${p.desc || 'Hàng chính hãng · Trả góp 0% · Hỗ trợ tốt'}</span>
            </div>
            <div class="partner-price">${post.price}</div>
            <button class="partner-btn" onclick="partnerClick('${p.name}')">Đi đến nơi bán</button>
          </div>
        `).join('');
      }
    }

    // 10. Score Card
    const scoreVal = document.querySelector('.score-value strong');
    if (scoreVal) scoreVal.textContent = (post.stars * 2.0).toFixed(1);
    const scoreStars = document.querySelector('.score-card .stars');
    if (scoreStars) scoreStars.textContent = '⭐'.repeat(post.stars || 5);
  }

  // Load and render comments
  renderComments();
});
