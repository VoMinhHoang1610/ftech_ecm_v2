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

function submitPost() {
  const title = document.getElementById('postTitle').value.trim();
  const content = document.getElementById('postContent').value.trim();
  const excerpt = document.getElementById('postExcerpt').value.trim();
  const status = document.getElementById('statusSelect').value;

  if (!title) {
    alert('Vui lòng nhập tiêu đề bài viết.');
    return;
  }

  // Parse ID if editing
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');

  const targetStatus = status === 'published' ? 'approved' : status;

  // Ràng buộc kiểm tra affiliate link nếu gửi duyệt hoặc phê duyệt ngay
  if (targetStatus !== 'draft') {
    if (!editId) {
      alert('❌ Bài viết review bắt buộc phải có ít nhất một link affiliate hoạt động. Vui lòng lưu dưới dạng Bản nháp trước, sau đó thêm link affiliate trước khi gửi duyệt.');
      return;
    } else {
      const affiliates = window.FTECHDB.getAffiliates(editId);
      if (!affiliates || affiliates.length === 0) {
        alert('❌ Bài viết review bắt buộc phải có ít nhất một link affiliate hoạt động mới được gửi duyệt.');
        return;
      }
    }
  }

  const postData = {
    title: title,
    content: content,
    excerpt: excerpt,
    status: targetStatus,
    category: 'Review',
    brand: 'FTECH',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    stars: 5,
    author: localStorage.getItem('ftech_user') || 'content'
  };

  if (editId) {
    postData.id = editId;
  }

  window.FTECHDB.savePost(postData);
  alert(editId ? '✅ Đã lưu thay đổi bài viết thành công!' : '✅ Đã tạo và gửi duyệt bài viết thành công!');
  window.location.href = 'content-manager.html';
}

// Check if we are editing an existing post
function checkEditMode() {
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');
  if (!editId) return;

  const post = window.FTECHDB.getPost(editId);
  if (!post) return;

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
