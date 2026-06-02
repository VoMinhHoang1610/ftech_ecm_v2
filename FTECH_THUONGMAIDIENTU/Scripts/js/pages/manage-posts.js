// --- ADMIN POSTS MANAGEMENT LOGIC ---

document.addEventListener('DOMContentLoaded', function () {
  let selectedStatus = 'all';
  let currentRejectPostId = null;
  let currentEditPostId = null;
  // Render metrics and list on load
  renderAll();

  // Search listeners
  document.getElementById('btnSearch').addEventListener('click', renderAll);
  document.getElementById('searchQuery').addEventListener('keyup', function (e) {
    if (e.key === 'Enter') renderAll();
  });

  // Filter dropdown change listeners
  document.getElementById('filterCategory').addEventListener('change', renderAll);
  document.getElementById('filterAuthor').addEventListener('change', renderAll);
  document.getElementById('filterSort').addEventListener('change', renderAll);

  // Expose setChip globally
  window.setChip = function (el) {
    document.querySelectorAll('.fchip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    selectedStatus = el.getAttribute('data-status') || 'all';
    renderAll();
  };

  // Bulk selectors logic
  window.toggleAll = function (cb) {
    document.querySelectorAll('.rck').forEach(c => {
      c.checked = cb.checked;
    });
    window.updBulk();
  };

  window.updBulk = function () {
    const checked = document.querySelectorAll('.rck:checked');
    const n = checked.length;
    const bar = document.getElementById('bulkBar');
    if (bar) {
      bar.classList.toggle('show', n > 0);
    }
    const info = document.getElementById('bulkInfo');
    if (info) {
      info.textContent = `${n} bài được chọn`;
    }
  };

  window.clearSel = function () {
    document.querySelectorAll('.rck').forEach(c => c.checked = false);
    const ckAll = document.getElementById('ckAll');
    if (ckAll) ckAll.checked = false;
    window.updBulk();
  };

  // Bulk actions
  const btnBulkApprove = document.querySelector('.bulk-bar button.u-style-062');
  if (btnBulkApprove) {
    btnBulkApprove.addEventListener('click', function () {
      const checked = document.querySelectorAll('.rck:checked');
      if (checked.length === 0) return;
      showConfirm(
        `Bạn có chắc chắn muốn duyệt hàng loạt ${checked.length} bài viết không?`,
        function () {
          checked.forEach(cb => {
            const id = cb.getAttribute('data-id');
            if (id) FTECHDB.updateStatus(id, 'approved');
          });
          showToast('Đã duyệt hàng loạt bài viết thành công.', 'success');
          window.clearSel();
          renderAll();
        },
        { title: 'Duyệt hàng loạt', icon: '✅', okText: 'Duyệt tất cả', okClass: 'green' }
      );
    });
  }

  const btnBulkReject = document.querySelector('.bulk-bar button.u-style-063');
  if (btnBulkReject) {
    btnBulkReject.addEventListener('click', function () {
      const checked = document.querySelectorAll('.rck:checked');
      if (checked.length === 0) return;
      showPromptModal(
        'Từ chối hàng loạt',
        'Nhập lý do từ chối chung...',
        function (reason) {
          if (!reason) {
            showToast('Lý do từ chối không được để trống.', 'warn');
            return;
          }
          checked.forEach(cb => {
            const id = cb.getAttribute('data-id');
            if (id) FTECHDB.updateStatus(id, 'rejected', reason);
          });
          showToast('Đã từ chối hàng loạt bài viết thành công.', 'info');
          window.clearSel();
          renderAll();
        },
        { icon: '✕', message: `Sẽ áp dụng cho ${checked.length} bài viết đang chọn.` }
      );
    });
  }

  // --- ACTIONS ---

  window.doApprove = function (id) {
    showConfirm(
      'Bạn có chắc muốn phê duyệt bài viết này để xuất bản công khai không?',
      function () {
        FTECHDB.updateStatus(id, 'approved');
        showToast('Bài viết đã được duyệt và xuất bản.', 'success');
        renderAll();
        window.closeModal('previewModal');
      },
      { title: 'Duyệt bài viết', icon: '✅', okText: 'Duyệt & Xuất bản', okClass: 'green' }
    );
  };

  window.openReject = function (id) {
    const post = FTECHDB.getPost(id);
    if (!post) return;
    currentRejectPostId = id;
    document.getElementById('rejectPostName').textContent = post.title;
    const modal = document.getElementById('rejectModal');
    modal.querySelector('textarea').value = '';
    modal.classList.add('open');
  };

  window.confirmReject = function () {
    const modal = document.getElementById('rejectModal');
    const reason = modal.querySelector('textarea').value.trim();
    if (!reason) {
      showToast('Vui lòng nhập lý do từ chối.', 'warn');
      return;
    }
    FTECHDB.updateStatus(currentRejectPostId, 'rejected', reason);
    showToast('Đã từ chối bài viết và gửi lý do cho tác giả.', 'info');
    window.closeModal('rejectModal');
    renderAll();
  };

  window.doDelete = function (id) {
    showConfirm(
      'Bạn có chắc chắn muốn xóa bài viết này không? Thao tác này không thể hoàn tác.',
      function () {
        FTECHDB.deletePost(id);
        showToast('Đã xóa bài viết thành công.', 'info');
        renderAll();
      },
      { title: 'Xóa bài viết', icon: '🗑️', okText: 'Xóa vĩnh viễn' }
    );
  };

  window.openPreview = function (id) {
    const post = FTECHDB.getPost(id);
    if (!post) return;

    const modal = document.getElementById('previewModal');
    modal.querySelector('.pv-thumb').textContent = post.brand || 'FTECH';
    modal.querySelector('.pv-thumb').style.backgroundImage = `url('${post.image || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80'}')`;
    modal.querySelector('.pv-tag').textContent = `${post.category} · ${post.brand || 'Sản phẩm'}`;
    modal.querySelector('.pv-post-title').textContent = post.title;
    modal.querySelector('.pv-meta').innerHTML = `
      <span>Tác giả: <strong>${post.author}</strong></span>
      <span>Ngày cập nhật: ${post.date}</span>
      <span>Trạng thái: <strong style="text-transform: capitalize;">${post.status}</strong></span>
      <span>${post.views.toLocaleString('vi-VN')} lượt xem</span>
    `;
    modal.querySelector('.pv-content').innerHTML = `
      <p><em>Mô tả ngắn: ${post.excerpt || ''}</em></p><br>
      <p>${post.content || ''}</p>
    `;

    // Render affiliate links dynamically
    const affiliates = FTECHDB.getAffiliates(post.id);
    const affSection = modal.querySelector('.pv-aff-section');
    if (affSection) {
      if (affiliates.length > 0) {
        affSection.innerHTML = `
          <div class="pv-aff-title">Affiliate links đang gắn trong bài (${affiliates.length} links)</div>
          ${affiliates.map(aff => `
            <div class="pv-aff-item">
              🛒 <strong>${aff.partner}</strong> - ${aff.type} 
              <span class="u-style-075">${aff.clicks} clicks</span>
            </div>
          `).join('')}
        `;
      } else {
        affSection.innerHTML = `<div class="pv-aff-title" style="color: #ef4444;">Không có link Affiliate nào trong bài viết này.</div>`;
      }
    }

    // Foot action buttons setup
    const foot = modal.querySelector('.pv-foot');
    if (foot) {
      if (post.status === 'pending') {
        foot.innerHTML = `
          <button class="modal-btn-cancel" onclick="closeModal('previewModal')">Đóng</button>
          <button class="act act-reject u-style-076" onclick="closeModal('previewModal'); openReject('${post.id}')">✕ Từ chối</button>
          <button class="btn-primary u-style-077" onclick="doApprove('${post.id}')">✓ Duyệt bài</button>
        `;
      } else {
        foot.innerHTML = `
          <button class="modal-btn-cancel" onclick="closeModal('previewModal')">Đóng</button>
        `;
      }
    }

    modal.classList.add('open');
  };

  window.openEditPost = function (id) {
    const post = FTECHDB.getPost(id);
    if (!post) return;
    currentEditPostId = id;

    document.getElementById('editPostRef').textContent = post.title;
    document.getElementById('editPostTitle').value = post.title;
    document.getElementById('editPostAuthor').value = post.author;
    document.getElementById('editPostCategory').value = post.category;
    document.getElementById('editPostStatus').value = post.status === 'approved' ? 'Đã duyệt' : post.status === 'pending' ? 'Chờ duyệt' : post.status === 'rejected' ? 'Từ chối' : 'Bản nháp';
    
    document.getElementById('editPostModal').classList.add('open');
  };

  window.savePostUpdate = function () {
    const post = FTECHDB.getPost(currentEditPostId);
    if (!post) return;

    post.title = document.getElementById('editPostTitle').value.trim();
    post.author = document.getElementById('editPostAuthor').value.trim();
    post.category = document.getElementById('editPostCategory').value;

    const statusVal = document.getElementById('editPostStatus').value;
    post.status = statusVal === 'Đã duyệt' ? 'approved' : statusVal === 'Chờ duyệt' ? 'pending' : statusVal === 'Từ chối' ? 'rejected' : 'draft';

    if (!post.title || !post.author) {
      showToast('Vui lòng điền đầy đủ Tiêu đề và Tác giả.', 'warn');
      return;
    }

    FTECHDB.savePost(post);
    showToast('Đã lưu cập nhật bài viết thành công.', 'success');
    window.closeModal('editPostModal');
    renderAll();
  };

  window.closeModal = function (id) {
    document.getElementById(id).classList.remove('open');
  };

  // Setup modal close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('open');
  }));

  // Render everything: statistics, filter chips count, and the posts table rows
  function renderAll() {
    const posts = FTECHDB.getPosts();
    const accounts = FTECHDB.getAccounts();
    const authorName = username => {
      const account = accounts.find(a => a.username === username || a.name === username);
      return account ? account.name : username;
    };

    // 1. Calculate and update KPI Stats
    const totalCount = posts.length;
    const draftCount = posts.filter(p => p.status === 'draft').length;
    const pendingCount = posts.filter(p => p.status === 'pending').length;
    const approvedCount = posts.filter(p => p.status === 'approved').length;
    const rejectedCount = posts.filter(p => p.status === 'rejected').length;

    document.querySelector('.sv-all').textContent = totalCount;
    document.querySelector('.sv-draft').textContent = draftCount;
    document.querySelector('.sv-pending').textContent = pendingCount;
    document.querySelector('.sv-approved').textContent = approvedCount;
    document.querySelector('.sv-rejected').textContent = rejectedCount;

    // Update filter chips counts
    const chips = document.querySelectorAll('.fchip');
    chips.forEach(chip => {
      const status = chip.getAttribute('data-status');
      if (status === 'all') chip.textContent = `Tất cả (${totalCount})`;
      else if (status === 'draft') chip.textContent = `Nháp (${draftCount})`;
      else if (status === 'pending') chip.textContent = `Chờ duyệt (${pendingCount})`;
      else if (status === 'approved') chip.textContent = `Đã duyệt (${approvedCount})`;
      else if (status === 'rejected') chip.textContent = `Từ chối (${rejectedCount})`;
    });

    // Update Sidebar menu item active pending badge count
    const sbBadge = document.querySelector('.sb-menu .sb-badge');
    if (sbBadge) {
      sbBadge.textContent = pendingCount;
      sbBadge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
    }

    // 2. Filter list
    const searchQuery = document.getElementById('searchQuery').value.toLowerCase().trim();
    const filterCategory = document.getElementById('filterCategory').value;
    const filterAuthor = document.getElementById('filterAuthor').value;
    const filterSort = document.getElementById('filterSort').value;

    let filtered = posts.filter(p => {
      // Status filter
      if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;

      // Category filter
      if (filterCategory && p.category !== filterCategory) return false;

      // Author filter
      if (filterAuthor && p.author !== filterAuthor && authorName(p.author) !== filterAuthor) return false;

      // Search query
      if (searchQuery) {
        const titleMatch = p.title.toLowerCase().includes(searchQuery);
        const authorMatch = `${p.author} ${authorName(p.author)}`.toLowerCase().includes(searchQuery);
        const catMatch = p.category.toLowerCase().includes(searchQuery);
        if (!titleMatch && !authorMatch && !catMatch) return false;
      }

      return true;
    });

    // 3. Sort list
    if (filterSort === 'newest') {
      filtered.sort((a, b) => {
        const da = new Date(a.date.split('/').reverse().join('-'));
        const db = new Date(b.date.split('/').reverse().join('-'));
        return db - da;
      });
    } else if (filterSort === 'pendingFirst') {
      filtered.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        // fallback to date newest
        const da = new Date(a.date.split('/').reverse().join('-'));
        const db = new Date(b.date.split('/').reverse().join('-'));
        return db - da;
      });
    } else if (filterSort === 'views') {
      filtered.sort((a, b) => b.views - a.views);
    }

    // 4. Render Table
    const tbody = document.getElementById('postsTableBody');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <div class="t-row t-empty">
          <div class="empty-cell">📭 Không tìm thấy bài viết nào khớp với bộ lọc.</div>
        </div>
      `;
      document.querySelector('.pag-info').textContent = `Hiển thị 0 bài viết`;
      return;
    }

    tbody.innerHTML = filtered.map(post => {
      const statusLabel = post.status === 'approved' ? 'Đã duyệt' : post.status === 'pending' ? 'Chờ duyệt' : post.status === 'rejected' ? 'Từ chối' : 'Bản nháp';
      const statusClass = `sp-${post.status}`;
      const hasPhoto = post.image ? `<img src="${post.image}" alt="${post.title}">` : '📝';
      const viewsDisplay = post.views >= 1000 ? `${(post.views / 1000).toFixed(1)}K` : post.views;
      
      const postAffiliates = FTECHDB.getAffiliates(post.id);
      const affCount = postAffiliates.length;
      const affClicks = postAffiliates.reduce((sum, affiliate) => sum + (Number(affiliate.clicks) || 0), 0);
      
      // Action buttons depending on state
      let actions = '';
      if (post.status === 'pending') {
        actions = `
          <button class="act act-preview" onclick="openPreview('${post.id}')" title="Xem trước & Duyệt">👁️</button>
          <button class="act act-approve" onclick="doApprove('${post.id}')" title="Duyệt bài">✓</button>
          <button class="act act-reject" onclick="openReject('${post.id}')" title="Từ chối">✕</button>
          <button class="act" onclick="openEditPost('${post.id}')" title="Chỉnh sửa">✏️</button>
        `;
      } else if (post.status === 'rejected') {
        actions = `
          <button class="act act-preview" onclick="openPreview('${post.id}')" title="Xem trước">👁️</button>
          <button class="act act-approve" onclick="doApprove('${post.id}')" title="Duyệt lại">✓</button>
          <button class="act" onclick="openEditPost('${post.id}')" title="Chỉnh sửa">✏️</button>
          <button class="act u-style-066" onclick="doDelete('${post.id}')" title="Xóa">🗑️</button>
        `;
      } else {
        actions = `
          <button class="act act-preview" onclick="openPreview('${post.id}')" title="Xem trước">👁️</button>
          <button class="act" onclick="openEditPost('${post.id}')" title="Chỉnh sửa">✏️</button>
          <button class="act u-style-066" onclick="doDelete('${post.id}')" title="Xóa">🗑️</button>
        `;
      }

      const metaText = post.status === 'approved' ? `Bài đã xuất bản · ${affCount} affiliate links` :
                       post.status === 'pending' ? `Đang chờ kiểm duyệt · ${affCount} affiliate links cần rà soát` :
                       post.status === 'rejected' ? `<span style="color: var(--red); font-weight: 500;">Từ chối: ${post.rejectReason || 'nội dung chưa đạt yêu cầu'}</span>` :
                       `Bản nháp nội bộ · Chưa xuất bản`;

      return `
        <div class="t-row">
          <div><input type="checkbox" class="rck" data-id="${post.id}" onchange="updBulk()"/></div>
          <div class="post-cell" onclick="openPreview('${post.id}')">
            <div class="post-thumb">${hasPhoto}</div>
            <div>
              <div class="post-title">${post.title}</div>
              <div class="post-meta">${metaText}</div>
            </div>
          </div>
          <div class="u-style-064">${authorName(post.author)}</div>
          <div><span class="cat-tag">${post.category}</span></div>
          <div><span class="sp ${statusClass}">${statusLabel}</span></div>
          <div class="metric">${viewsDisplay}</div>
          <div class="metric metric-g">${affCount > 0 ? affClicks.toLocaleString('vi-VN') : '-'}</div>
          <div class="u-style-065">${post.date}</div>
          <div class="row-acts">${actions}</div>
        </div>
      `;
    }).join('');

    document.querySelector('.pag-info').textContent = `Hiển thị 1-${filtered.length} / ${filtered.length} bài viết`;
  }
});
