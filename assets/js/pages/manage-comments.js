document.addEventListener('DOMContentLoaded', function () {
  let selectedStatus = 'all';
  let currentRejectCommentId = null;

  window.setCommentChip = function (el) {
    document.querySelectorAll('.fchip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    selectedStatus = el.getAttribute('data-status') || 'all';
    renderAll();
  };

  window.closeModal = function (id) {
    document.getElementById(id).classList.remove('open');
  };

  document.getElementById('btnSearch').addEventListener('click', renderAll);
  document.getElementById('searchQuery').addEventListener('keyup', function (e) {
    if (e.key === 'Enter') renderAll();
  });

  document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('open');
  }));

  function commentStatusLabel(status) {
    if (status === 'approved') return 'Đã duyệt';
    if (status === 'rejected') return 'Từ chối';
    return 'Chờ duyệt';
  }

  window.approveComment = function (id) {
    FTECHDB.approveComment(id);
    renderAll();
  };

  window.openRejectComment = function (id) {
    const comment = FTECHDB.getComments().find(c => String(c.id) === String(id));
    if (!comment) return;
    currentRejectCommentId = id;
    const ref = document.getElementById('rejectCommentRef');
    if (ref) ref.textContent = comment.text;
    const reason = document.getElementById('rejectCommentReason');
    if (reason) reason.value = '';
    document.getElementById('rejectCommentModal').classList.add('open');
  };

  window.confirmRejectComment = function () {
    const reason = document.getElementById('rejectCommentReason').value.trim();
    if (!reason) {
      alert('Vui lòng nhập lý do từ chối bình luận.');
      return;
    }
    FTECHDB.rejectComment(currentRejectCommentId, reason);
    window.closeModal('rejectCommentModal');
    renderAll();
  };

  window.renderAll = function () {
    const summary = FTECHDB.getCommentSummary();
    const pendingEl = document.getElementById('statPending');
    const approvedEl = document.getElementById('statApproved');
    const rejectedEl = document.getElementById('statRejected');
    const summaryEl = document.getElementById('commentSummary');
    if (pendingEl) pendingEl.textContent = summary.pending;
    if (approvedEl) approvedEl.textContent = summary.approved;
    if (rejectedEl) rejectedEl.textContent = summary.rejected;
    if (summaryEl) {
      summaryEl.textContent = `${summary.pending} chờ duyệt · ${summary.approved} đã duyệt · ${summary.rejected} từ chối`;
    }

    const searchQuery = document.getElementById('searchQuery').value.toLowerCase().trim();
    const posts = FTECHDB.getPosts();
    let comments = FTECHDB.getComments();

    if (selectedStatus !== 'all') {
      comments = comments.filter(c => (c.status || 'pending') === selectedStatus);
    }

    if (searchQuery) {
      comments = comments.filter(comment => {
        const post = posts.find(p => p.id === comment.postId);
        const haystack = [
          comment.name,
          comment.text,
          post ? post.title : '',
          comment.postId
        ].join(' ').toLowerCase();
        return haystack.includes(searchQuery);
      });
    }

    const list = document.getElementById('commentModerationList');
    if (!list) return;

    const sorted = comments.slice().sort((a, b) => {
      const weight = { pending: 0, approved: 1, rejected: 2 };
      return (weight[a.status] || 9) - (weight[b.status] || 9);
    });

    if (sorted.length === 0) {
      list.innerHTML = '<div class="cm-empty">Không có bình luận nào khớp bộ lọc.</div>';
      return;
    }

    list.innerHTML = sorted.map(comment => {
      const post = posts.find(p => p.id === comment.postId);
      const statusClass = `cm-${comment.status || 'pending'}`;
      const actions = comment.status === 'pending' ? `
        <button class="act act-approve" type="button" onclick="approveComment('${comment.id}')" title="Duyệt bình luận">✓</button>
        <button class="act act-reject" type="button" onclick="openRejectComment('${comment.id}')" title="Từ chối bình luận">×</button>
      ` : '';
      return `
        <div class="cm-item">
          <div>
            <div class="cm-meta"><strong>${comment.name}</strong> · ${comment.date} · ${post ? post.title : comment.postId}</div>
            <div class="cm-text">${comment.text}</div>
            ${comment.rejectReason ? `<div class="cm-reason">Lý do từ chối: ${comment.rejectReason}</div>` : ''}
          </div>
          <div class="cm-actions">
            <span class="cm-status ${statusClass}">${commentStatusLabel(comment.status)}</span>
            ${actions}
          </div>
        </div>
      `;
    }).join('');
  };

  renderAll();
});
