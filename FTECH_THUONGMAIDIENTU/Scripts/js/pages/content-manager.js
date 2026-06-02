let currentPreviewId = '';
let currentDeleteId = '';
let currentSendId = '';
let currentEditId = '';

function showSendFeedback(message, isError = false) {
  const sendModal = document.getElementById('sendModal');
  if (!sendModal) return;
  const sub = sendModal.querySelector('.ms-sub');
  if (!sub) return;
  sub.textContent = message;
  sub.style.color = isError ? '#b91c1c' : 'var(--body)';
}

/* ── RENDER DYNAMIC POST ROWS ── */
function renderPostRows(statusFilter = 'all') {
  const posts = window.FTECHDB.getPosts();
  const currentAuthor = localStorage.getItem('ftech_user') || 'content';
  
  // Filter by author to simulate private creator workspace
  const myPosts = posts.filter(p => p.author === currentAuthor);
  
  // Filter by status if selected
  const filtered = statusFilter === 'all' ? myPosts : myPosts.filter(p => p.status === statusFilter);

  // Update Stats Cards
  const stats = {
    all: myPosts.length,
    draft: myPosts.filter(p => p.status === 'draft').length,
    pending: myPosts.filter(p => p.status === 'pending').length,
    approved: myPosts.filter(p => p.status === 'approved').length,
    rejected: myPosts.filter(p => p.status === 'rejected').length
  };

  const svAll = document.querySelector('.sv-all');
  if (svAll) svAll.textContent = stats.all;
  const svDraft = document.querySelector('.sv-draft');
  if (svDraft) svDraft.textContent = stats.draft;
  const svPending = document.querySelector('.sv-pending');
  if (svPending) svPending.textContent = stats.pending;
  const svApproved = document.querySelector('.sv-approved');
  if (svApproved) svApproved.textContent = stats.approved;
  const svRejected = document.querySelector('.sv-rejected');
  if (svRejected) svRejected.textContent = stats.rejected;

  // Render Rows
  const container = document.getElementById('dynamicRows');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `<div style="padding:40px; text-align:center; color:var(--muted); font-size:14px;">Không có bài viết nào ở trạng thái này.</div>`;
    return;
  }

  const statusConfigLocal = {
    draft: { cls: 'sp-draft', label: '📝 Bản nháp' },
    pending: { cls: 'sp-pending', label: '⏳ Chờ duyệt' },
    approved: { cls: 'sp-approved', label: '✓ Đã duyệt' },
    rejected: { cls: 'sp-rejected', label: '✕ Từ chối' }
  };

  container.innerHTML = filtered.map(p => {
    const st = statusConfigLocal[p.status] || statusConfigLocal.draft;
    const isPending = p.status === 'pending';
    const isApproved = p.status === 'approved';
    const isRejected = p.status === 'rejected';

    return `
      <div class="t-row" data-status="${p.status}">
        <div><input type="checkbox" class="rck" data-id="${p.id}" onchange="updBulk()"></div>
        <div class="post-cell">
          <div class="post-thumb">
            ${p.image ? `<img src="${p.image}" alt="">` : '<div style="font-size:18px;">📝</div>'}
          </div>
          <div>
            <div class="post-title">${p.title}</div>
            <div class="post-meta">${isApproved ? 'Bài đã xuất bản' : isPending ? 'Đang chờ Super Admin xét duyệt' : isRejected ? 'Bài bị từ chối' : 'Bản nháp'} · 5 phút đọc</div>
            ${isRejected && p.rejectReason ? `<div class="rejected-reason" style="margin-top:4px; font-size:11px; color:#ff5a5a; font-weight:600;">⚠️ Lý do từ chối: ${p.rejectReason}</div>` : ''}
          </div>
        </div>
        <div><span class="cat-tag">${p.category}</span></div>
        <div><span class="sp ${st.cls}">${st.label}</span></div>
        <div class="metric">${isApproved ? (p.views || 0).toLocaleString() : '—'}</div>
        <div class="u-style-006">${p.date}</div>
        <div class="row-acts">
          <button class="act" onclick="openPreview('${p.id}')" title="Xem trước">👁️</button>
          <button class="act act-edit" onclick="goToEdit('${p.id}')" ${isPending ? 'disabled title="Đang chờ duyệt — không thể sửa" style="opacity:0.4; cursor:not-allowed;"' : ''} title="Chỉnh sửa">✏️</button>
          ${(p.status === 'draft' || p.status === 'rejected') ? `<button class="act act-send" onclick="openSend('${p.id}')" title="Gửi duyệt">📤</button>` : ''}
          <button class="act act-del" onclick="openDelete('${p.id}')" title="Xóa">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

/* ── CHIP FILTER ── */
function setChip(el, status) {
  document.querySelectorAll('.fchip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderPostRows(status);
}

/* ── CHECKBOX BULK ACTIONS ── */
function toggleAll(cb) {
  document.querySelectorAll('.rck').forEach(c => c.checked = cb.checked);
  updBulk();
}

function updBulk() {
  const n = document.querySelectorAll('.rck:checked').length;
  const bar = document.getElementById('bulkBar');
  if (bar) bar.classList.toggle('show', n > 0);
  const info = document.getElementById('bulkInfo');
  if (info) info.textContent = `${n} bài được chọn`;
}

function clearSel() {
  document.querySelectorAll('.rck').forEach(c => c.checked = false);
  const ckAll = document.getElementById('ckAll');
  if (ckAll) ckAll.checked = false;
  updBulk();
}

/* ── REDIRECT TO EDITOR (UPDATE) ── */
function goToEdit(id) {
  window.location.href = `postManager.html?id=${id}`;
}

/* ── PREVIEW MODAL ── */
function openPreview(id) {
  const post = window.FTECHDB.getPost(id);
  if (!post) return;
  currentPreviewId = id;

  document.getElementById('pvHeadTitle').textContent = post.title;
  document.getElementById('pvTitle').textContent = post.title;
  document.getElementById('pvTag').textContent = post.category;
  
  const thumbEl = document.getElementById('pvThumb');
  if (thumbEl) {
    thumbEl.src = post.image || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80';
    thumbEl.style.display = 'block';
  }

  // Status Badge in Preview
  const statusConfigLocal = {
    draft: { cls: 'pill-draft', label: '📝 Bản nháp' },
    pending: { cls: 'pill-pending', label: '⏳ Chờ duyệt' },
    approved: { cls: 'pill-approved', label: '✓ Đã duyệt' },
    rejected: { cls: 'pill-rejected', label: '✕ Từ chối' }
  };
  const st = statusConfigLocal[post.status] || statusConfigLocal.draft;
  document.getElementById('pvStatus').innerHTML = `<span class="status-pill ${st.cls}" style="font-size:11px;padding:3px 9px;">${st.label}</span>`;

  // Dynamic Notice Box in Preview
  const noticeMap = {
    draft: { bg: 'rgba(138,147,184,.08)', border: 'rgba(138,147,184,.2)', color: '#5d6897', text: 'Bài viết ở dạng bản nháp. Bấm chỉnh sửa hoặc gửi duyệt để Super Admin kiểm tra.' },
    pending: { bg: 'rgba(245,158,11,.07)', border: 'rgba(245,158,11,.2)', color: '#92640a', text: 'Bài viết đang chờ Super Admin duyệt. Bạn sẽ tạm thời không thể sửa trong lúc này.' },
    approved: { bg: 'rgba(27,207,138,.07)', border: 'rgba(27,207,138,.2)', color: '#0a6644', text: 'Bài viết đã duyệt thành công và đang được xuất bản công khai lên trang chủ.' },
    rejected: { bg: 'rgba(239,68,68,.07)', border: 'rgba(239,68,68,.2)', color: '#8b1a1a', text: `Bài viết bị từ chối duyệt: "${post.rejectReason || 'Nội dung chưa đạt yêu cầu'}"` }
  };

  const n = noticeMap[post.status] || noticeMap.draft;
  const noticeEl = document.getElementById('pvNotice');
  if (noticeEl) {
    noticeEl.style.background = n.bg;
    noticeEl.style.borderColor = n.border;
    noticeEl.style.color = n.color;
    document.getElementById('pvNoticeText').textContent = n.text;
  }

  // Footer action button rendering
  const editBtn = document.getElementById('pvEditBtn');
  if (editBtn) {
    editBtn.style.display = post.status === 'pending' ? 'none' : '';
    editBtn.onclick = () => { closeModal('previewModal'); goToEdit(post.id); };
  }
  const sendBtn = document.getElementById('pvSendBtn');
  if (sendBtn) {
    sendBtn.style.display = (post.status === 'draft' || post.status === 'rejected') ? '' : 'none';
  }

  document.getElementById('previewModal').classList.add('open');
}

/* ── SEND FOR REVIEW MODAL ── */
function openSend(id) {
  const post = window.FTECHDB.getPost(id);
  if (!post) return;
  currentSendId = id;
  document.getElementById('sendPostName').textContent = post.title;
  showSendFeedback('Bài viết sẽ được gửi đến Super Admin để xét duyệt trước khi xuất bản. Bạn sẽ không thể chỉnh sửa khi đang chờ duyệt.');
  document.getElementById('sendModal').classList.add('open');
}

function confirmSend() {
  if (!currentSendId) return;
  const activeAffiliates = window.FTECHDB.getAffiliates(currentSendId).filter(a => a.status === 'active');
  if (activeAffiliates.length === 0) {
    showSendFeedback('Bài viết cần có ít nhất 1 liên kết tiếp thị (affiliate link) hoạt động trước khi gửi duyệt.', true);
    return;
  }
  window.FTECHDB.updateStatus(currentSendId, 'pending');
  showSendFeedback('Gửi duyệt thành công. Bài viết đã chuyển sang trạng thái "Chờ duyệt".');
  closeModal('sendModal');
  closeModal('previewModal');
  renderPostRows();
}

/* ── DELETE MODAL ── */
function openDelete(id) {
  const post = window.FTECHDB.getPost(id);
  if (!post) return;
  currentDeleteId = id;
  document.getElementById('deletePostName').textContent = post.title;
  document.getElementById('deleteModal').classList.add('open');
}

function confirmDelete() {
  if (!currentDeleteId) return;
  window.FTECHDB.deletePost(currentDeleteId);
  closeModal('deleteModal');
  renderPostRows();
  showToast('Bài viết đã được xóa vĩnh viễn khỏi hệ thống.', 'info');
}

/* ── CLOSE MODALS ── */
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}

// Click overlay to close
document.querySelectorAll('.modal-overlay').forEach(m =>
  m.addEventListener('click', function (e) {
    if (e.target === this) closeModal(this.id);
  })
);

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  renderPostRows();
});
