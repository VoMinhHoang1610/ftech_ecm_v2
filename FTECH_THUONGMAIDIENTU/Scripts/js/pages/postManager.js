function toggleChip(el) { el.classList.toggle('active'); }

let previewVisible = false;
function togglePreview() {
  previewVisible = !previewVisible;
  document.getElementById('previewCard').style.display = previewVisible ? 'block' : 'none';
}

function updatePreview() {
  const title = document.getElementById('postTitle').value || 'Tiêu đề bài viết...';
  const excerpt = document.getElementById('postExcerpt').value || 'Mô tả bài viết sẽ hiển thị ở đây...';
  document.getElementById('pv-title').textContent = title;
  document.getElementById('pv-excerpt').textContent = excerpt;
}

function updateSEO() {
  const t = document.getElementById('seoTitle');
  const d = document.getElementById('seoDesc');
  document.getElementById('seoTitleCount').textContent = `${t.value.length}/60`;
  document.getElementById('seoDescCount').textContent = `${d.value.length}/160`;
  if (t.value) document.getElementById('seo-pv-title').textContent = t.value;
  if (d.value) document.getElementById('seo-pv-desc').textContent = d.value;
}

function updateStatus(val) {
  const map = { draft: 'si-draft', pending: 'si-pending', published: 'si-published', approved: 'si-published' };
  const text = { draft: 'Bản nháp', pending: 'Chờ duyệt', published: 'Đã đăng', approved: 'Đã đăng' };
  const el = document.querySelector('.status-indicator');
  if (el) {
    el.className = `status-indicator ${map[val] || 'si-draft'}`;
    el.textContent = text[val] || 'Bản nháp';
  }
}

let tempAffiliates = [];

function renderAffiliates() {
  const container = document.getElementById('affListContainer');
  const countEl = document.getElementById('affLinkCount');
  if (!container) return;

  if (countEl) {
    countEl.textContent = `${tempAffiliates.length} link${tempAffiliates.length !== 1 ? 's' : ''}`;
  }

  if (tempAffiliates.length === 0) {
    container.innerHTML = '<div style="font-size: 12px; color: var(--muted); text-align: center; padding: 10px;">Chưa có link affiliate nào được gắn.</div>';
    return;
  }

  const iconMap = {
    'Shopee Affiliate': '🛒',
    'Lazada Partner': '📦',
    'Tiki Trading': '🚀'
  };

  container.innerHTML = tempAffiliates.map(aff => {
    const icon = iconMap[aff.partner] || '🔗';
    const shortUrl = aff.url.length > 30 ? aff.url.substring(0, 27) + '...' : aff.url;
    return `
      <div class="aff-item" id="aff-item-${aff.id}">
        <div class="aff-icon">${icon}</div>
        <div class="aff-info">
          <div class="aff-name">${aff.partner}</div>
          <div class="aff-url" title="${aff.url}">${shortUrl}</div>
        </div>
        <button type="button" class="aff-remove" onclick="removeAffiliateLink('${aff.id}')">✕</button>
      </div>
    `;
  }).join('');
}

function getPartnerIdByName(name) {
  const partnerMap = {
    'Shopee Affiliate': 'partner-shopee',
    'Lazada Partner': 'partner-lazada',
    'Tiki Trading': 'partner-tiki'
  };
  return partnerMap[name] || 'partner-shopee';
}

function validateUrl(url) {
  if (!url) return false;
  const trimmed = url.trim();
  return trimmed.startsWith('http://') || trimmed.startsWith('https://');
}

window.addSideAffiliateLink = function() {
  const partnerSelect = document.getElementById('sideAffPartner');
  const urlInput = document.getElementById('sideAffUrl');
  const validationEl = document.getElementById('sideAffValidationMsg');
  
  if (!partnerSelect || !urlInput) return;
  
  const partner = partnerSelect.value;
  const url = urlInput.value.trim();
  
  if (!validateUrl(url)) {
    if (validationEl) {
      validationEl.textContent = 'URL không hợp lệ. Vui lòng nhập link bắt đầu bằng http:// hoặc https://';
      validationEl.style.display = 'block';
    }
    urlInput.classList.add('input-error');
    return;
  }
  
  if (validationEl) validationEl.style.display = 'none';
  urlInput.classList.remove('input-error');
  
  tempAffiliates.push({
    id: 'temp-aff-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    partner: partner,
    partnerId: getPartnerIdByName(partner),
    type: 'Link mua chính',
    url: url,
    clicks: 0,
    status: 'active'
  });
  
  renderAffiliates();
  urlInput.value = '';
};

window.addMainAffiliateLink = function() {
  const partnerSelect = document.getElementById('mainAffPartner');
  const typeSelect = document.getElementById('mainAffType');
  const urlInput = document.getElementById('mainAffUrl');
  const checkStatusEl = document.getElementById('mainAffCheckStatus');
  const validationEl = document.getElementById('mainAffValidationMsg');
  
  if (!partnerSelect || !typeSelect || !urlInput) return;
  
  const partner = partnerSelect.value;
  const type = typeSelect.value;
  const url = urlInput.value.trim();
  
  if (!validateUrl(url)) {
    if (validationEl) {
      validationEl.textContent = 'URL không hợp lệ. Vui lòng nhập link bắt đầu bằng http:// hoặc https://';
      validationEl.style.display = 'block';
    }
    urlInput.classList.add('input-error');
    if (checkStatusEl) {
      checkStatusEl.textContent = 'Lỗi định dạng';
      checkStatusEl.className = 'status-indicator si-draft';
    }
    return;
  }
  
  if (validationEl) validationEl.style.display = 'none';
  urlInput.classList.remove('input-error');
  if (checkStatusEl) {
    checkStatusEl.textContent = '✓ Hợp lệ';
    checkStatusEl.className = 'status-indicator si-published';
  }
  
  tempAffiliates.push({
    id: 'temp-aff-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    partner: partner,
    partnerId: getPartnerIdByName(partner),
    type: type,
    url: url,
    clicks: 0,
    status: 'active'
  });
  
  renderAffiliates();
  urlInput.value = '';
};

window.removeAffiliateLink = function(id) {
  tempAffiliates = tempAffiliates.filter(aff => aff.id !== id);
  renderAffiliates();
};

function submitPost() {
  const title = document.getElementById('postTitle').value.trim();
  const content = document.getElementById('postContent').value.trim();
  const excerpt = document.getElementById('postExcerpt').value.trim();
  const status = document.getElementById('statusSelect').value;
  const normalizedStatus = status === 'published' ? 'approved' : status;

  const mainValidationMsg = document.getElementById('mainAffValidationMsg');
  const sideValidationMsg = document.getElementById('sideAffValidationMsg');

  if (!title) {
    alert('Vui lòng nhập tiêu đề bài viết.');
    return;
  }

  // Hide validation errors initially
  if (mainValidationMsg) mainValidationMsg.style.display = 'none';
  if (sideValidationMsg) sideValidationMsg.style.display = 'none';

  // Parse ID if editing
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');
  const existingPost = editId ? window.FTECHDB.getPost(editId) : null;

  if (normalizedStatus !== 'draft') {
    if (tempAffiliates.length === 0) {
      const errorMsg = 'Bài viết cần có ít nhất 1 liên kết tiếp thị (affiliate link) hoạt động trước khi gửi duyệt.';
      if (mainValidationMsg) {
        mainValidationMsg.textContent = errorMsg;
        mainValidationMsg.style.display = 'block';
      }
      if (sideValidationMsg) {
        sideValidationMsg.textContent = errorMsg;
        sideValidationMsg.style.display = 'block';
      }
      // Scroll to error
      const errorAnchor = mainValidationMsg || document.getElementById('postTitle');
      if (errorAnchor) errorAnchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  }

  const postData = {
    title: title,
    content: content,
    excerpt: excerpt,
    status: status === 'published' ? 'approved' : status, // map published to approved
    category: 'Review',
    brand: 'FTECH',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    stars: 5
  };

  if (editId) {
    postData.id = editId;
  }
  postData.status = normalizedStatus;
  postData.author = (existingPost && existingPost.author) || localStorage.getItem('ftech_user') || 'content';

  const savedPost = window.FTECHDB.savePost(postData);

  // Sync tempAffiliates to database
  const currentDbAffiliates = window.FTECHDB.getAffiliates(savedPost.id);
  currentDbAffiliates.forEach(aff => window.FTECHDB.deleteAffiliate(aff.id));

  tempAffiliates.forEach(aff => {
    window.FTECHDB.saveAffiliate({
      ...aff,
      id: aff.id.startsWith('temp-aff-') ? `aff-${Date.now()}-${Math.floor(Math.random() * 1000)}` : aff.id,
      postId: savedPost.id,
      attachedPost: savedPost.title
    });
  });

  alert(editId ? '✅ Đã lưu thay đổi bài viết thành công!' : '✅ Đã tạo và gửi duyệt bài viết thành công!');
  window.location.href = 'content-manager.html';
}

// Check if we are editing an existing post
function checkEditMode() {
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');
  if (!editId) {
    renderAffiliates();
    return;
  }

  const post = window.FTECHDB.getPost(editId);
  if (!post) {
    renderAffiliates();
    return;
  }

  // Fill Inputs
  document.getElementById('postTitle').value = post.title;
  document.getElementById('postContent').value = post.content || '';
  document.getElementById('postExcerpt').value = post.excerpt || '';
  
  const statusSelect = document.getElementById('statusSelect');
  const mappedStatus = post.status === 'approved' ? 'published' : post.status;
  if (statusSelect) {
    statusSelect.value = mappedStatus;
    updateStatus(mappedStatus);
  }

  // Load existing affiliates
  const dbAffs = window.FTECHDB.getAffiliates(editId);
  tempAffiliates = dbAffs.map(aff => ({
    id: aff.id,
    partner: aff.partner,
    partnerId: aff.partnerId,
    type: aff.type || 'Link mua chính',
    url: aff.url,
    clicks: aff.clicks || 0,
    status: aff.status || 'active'
  }));
  renderAffiliates();

  // Change page titles
  const pageTitleEl = document.querySelector('.page-title');
  if (pageTitleEl) pageTitleEl.textContent = 'Chỉnh sửa bài viết';
  
  const submitBtn = document.querySelector('.btn-primary');
  if (submitBtn) submitBtn.textContent = 'Lưu thay đổi';

  updatePreview();
}

document.querySelectorAll('.tool-btn').forEach(b => b.addEventListener('click', () => b.classList.toggle('active')));

document.addEventListener('DOMContentLoaded', () => {
  checkEditMode();
});
