// --- ADMIN ACCOUNTS MANAGEMENT LOGIC ---

document.addEventListener('DOMContentLoaded', function () {
  let editMode = 'add'; // 'add' or 'edit'
  let currentLockUsername = null;

  renderAll();

  // Search listeners
  document.getElementById('btnSearch').addEventListener('click', renderAll);
  document.getElementById('searchQuery').addEventListener('keyup', function (e) {
    if (e.key === 'Enter') renderAll();
  });

  // Filter dropdowns
  document.getElementById('filterStatus').addEventListener('change', renderAll);
  document.getElementById('filterSort').addEventListener('change', renderAll);

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('open');
  }));

  // --- ACTIONS ---

  window.openAddUserModal = function () {
    editMode = 'add';
    document.getElementById('userModalTitle').textContent = 'Thêm tài khoản quản trị';
    document.getElementById('userModalUsername').disabled = false;
    
    // Clear fields
    document.getElementById('userModalUsername').value = '';
    document.getElementById('userModalPassword').value = '';
    document.getElementById('userModalName').value = '';
    document.getElementById('userModalRole').value = 'content';
    document.getElementById('userModalStatus').value = 'active';
    document.getElementById('userModalScope').value = 'Kiểm duyệt nội dung bài viết';
    document.getElementById('userModalAvatar').value = '';

    document.getElementById('userModal').classList.add('open');
  };

  window.openUserModal = function (username) {
    editMode = 'edit';
    const acc = FTECHDB.getAccount(username);
    if (!acc) return;

    document.getElementById('userModalTitle').textContent = 'Cập nhật tài khoản admin';
    document.getElementById('userModalUsername').disabled = true;

    document.getElementById('userModalUsername').value = acc.username;
    document.getElementById('userModalPassword').value = acc.password || '123';
    document.getElementById('userModalName').value = acc.name || '';
    document.getElementById('userModalRole').value = acc.role || 'content';
    document.getElementById('userModalStatus').value = acc.status || 'active';
    document.getElementById('userModalScope').value = acc.scope || 'Phân quyền mặc định';
    document.getElementById('userModalAvatar').value = acc.avatar || '';

    document.getElementById('userModal').classList.add('open');
  };

  window.saveUserProcess = function () {
    const username = document.getElementById('userModalUsername').value.trim();
    const password = document.getElementById('userModalPassword').value.trim();
    const name = document.getElementById('userModalName').value.trim();
    const role = document.getElementById('userModalRole').value;
    const status = document.getElementById('userModalStatus').value;
    const scope = document.getElementById('userModalScope').value.trim();
    const avatar = document.getElementById('userModalAvatar').value.trim();

    if (!username || !password || !name) {
      alert('Vui lòng nhập đầy đủ Username, Mật khẩu và Họ tên.');
      return;
    }

    if (editMode === 'add') {
      // Check if username already exists
      const existing = FTECHDB.getAccount(username);
      if (existing) {
        alert('Tên đăng nhập đã tồn tại trong hệ thống!');
        return;
      }
    }

    const accData = {
      username,
      password,
      name,
      role,
      status,
      scope,
      avatar: avatar || '👤'
    };

    FTECHDB.saveAccount(accData);
    alert(editMode === 'add' ? 'Đã thêm tài khoản admin thành công.' : 'Đã cập nhật thông tin tài khoản admin.');
    window.closeAccountModal('userModal');
    renderAll();
  };

  window.openLockModal = function (username) {
    const acc = FTECHDB.getAccount(username);
    if (!acc) return;
    currentLockUsername = username;

    document.getElementById('lockModalName').textContent = acc.name;
    document.getElementById('lockReasonField').value = acc.lockReason || '';
    document.getElementById('lockModal').classList.add('open');
  };

  window.submitLockAction = function () {
    const acc = FTECHDB.getAccount(currentLockUsername);
    if (!acc) return;

    const reason = document.getElementById('lockReasonField').value.trim();
    
    // Toggle lock state
    acc.status = acc.status === 'locked' ? 'active' : 'locked';
    acc.lockReason = reason;

    FTECHDB.saveAccount(acc);
    alert(acc.status === 'locked' ? `Đã khóa tài khoản ${acc.name}.` : `Đã mở khóa tài khoản ${acc.name}.`);
    window.closeAccountModal('lockModal');
    renderAll();
  };

  window.doDeleteAccount = function (username) {
    if (username === 'admin') {
      alert('Không thể xóa tài khoản Super Admin tối cao!');
      return;
    }
    if (confirm(`Bạn có chắc chắn muốn xóa tài khoản "${username}" không? Hành động này không thể phục hồi.`)) {
      FTECHDB.deleteAccount(username);
      alert('Đã xóa tài khoản thành công.');
      renderAll();
    }
  };

  window.closeAccountModal = function (id) {
    document.getElementById(id).classList.remove('open');
  };

  function filterAccounts(accounts) {
    const searchQuery = document.getElementById('searchQuery').value.toLowerCase().trim();
    const filterStatus = document.getElementById('filterStatus').value;
    const filterSort = document.getElementById('filterSort').value;

    let filtered = accounts.filter(a => {
      if (filterStatus) {
        if (filterStatus === 'locked' && a.status !== 'locked') return false;
        if (filterStatus === 'active' && a.status === 'locked') return false;
      }

      if (searchQuery) {
        const nameMatch = (a.name || '').toLowerCase().includes(searchQuery);
        const userMatch = (a.username || '').toLowerCase().includes(searchQuery);
        const roleMatch = (a.role || '').toLowerCase().includes(searchQuery);
        if (!nameMatch && !userMatch && !roleMatch) return false;
      }

      return true;
    });

    if (filterSort === 'alphabetical') {
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return filtered;
  }

  function renderAccountRows(accounts) {
    return accounts.map(acc => {
      const isLocked = acc.status === 'locked';
      const statusLabel = isLocked ? 'Bị khóa' : 'Hoạt động';
      const statusClass = isLocked ? 'pending' : 'active'; // pending has yellow/orange, active has green style
      
      let roleLabel = 'Customer';
      if (acc.role === 'admin') roleLabel = 'Super Admin';
      else if (acc.role === 'content') roleLabel = 'Content Manager';
      else if (acc.role === 'partner') roleLabel = 'Affiliate Partner';

      const scopeText = acc.scope || (acc.role === 'admin' ? 'Quyền tối cao hệ thống' : 'Quản lý và cập nhật nội dung');
      const avatarHtml = acc.avatar && acc.avatar.startsWith('http') 
        ? `<img src="${acc.avatar}" alt="${acc.name}">` 
        : `<div style="font-size: 20px; text-align: center;">${acc.avatar || '👤'}</div>`;

      // Mock date and details
      const updateDate = acc.date || '30/05/2026';

      return `
        <div class="t-row">
          <div><input type="checkbox"></div>
          <div class="user-cell" onclick="openUserModal('${acc.username}')">
            <div class="user-av">${avatarHtml}</div>
            <div>
              <div class="user-name">${acc.name}</div>
              <div class="user-email">${acc.username}@ftech.vn · Mật khẩu: ${acc.password}</div>
            </div>
          </div>
          <div><span class="role-badge">${roleLabel}</span></div>
          <div><span class="status ${statusClass}">${statusLabel}</span></div>
          <div class="cell-muted">${scopeText}</div>
          <div class="cell-muted">${updateDate}</div>
          <div class="row-actions">
            <button class="act view" type="button" onclick="openUserModal('${acc.username}')" title="Xem chi tiết">👁</button>
            <button class="act edit" type="button" onclick="openUserModal('${acc.username}')" title="Chỉnh sửa">✏</button>
            <button class="act key" type="button" onclick="openLockModal('${acc.username}')" title="${isLocked ? 'Mở khóa' : 'Khóa'}">🔑</button>
            <button class="act edit" style="color: var(--red); border-color: rgba(239, 68, 68, 0.2);" type="button" onclick="doDeleteAccount('${acc.username}')" title="Xóa tài khoản">🗑</button>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderAll() {
    const accounts = FTECHDB.getAccounts();
    const adminAccounts = accounts.filter(a => a.role !== 'customer');
    const userAccounts = accounts.filter(a => a.role === 'customer');

    const totalCount = accounts.length;
    const activeCount = accounts.filter(a => a.status !== 'locked').length;
    const partnerCount = accounts.filter(a => a.role === 'partner').length;
    const lockedCount = accounts.filter(a => a.status === 'locked').length;

    document.querySelector('.sv-total').textContent = totalCount;
    document.querySelector('.sv-active').textContent = activeCount;
    document.querySelector('.sv-partner').textContent = partnerCount;
    document.querySelector('.sv-locked').textContent = lockedCount;

    const filteredAdmin = filterAccounts(adminAccounts);
    const filteredUsers = filterAccounts(userAccounts);

    const adminBody = document.getElementById('adminAccountsTableBody');
    const userBody = document.getElementById('userAccountsTableBody');
    const pagInfo = document.getElementById('accountsPagInfo');

    if (adminBody) {
      adminBody.innerHTML = filteredAdmin.length
        ? renderAccountRows(filteredAdmin)
        : '<div class="t-row t-empty"><div class="empty-cell">Không có tài khoản admin khớp bộ lọc.</div></div>';
    }

    if (userBody) {
      userBody.innerHTML = filteredUsers.length
        ? renderAccountRows(filteredUsers)
        : '<div class="t-row t-empty"><div class="empty-cell">Không có tài khoản người dùng khớp bộ lọc.</div></div>';
    }

    if (pagInfo) {
      pagInfo.textContent = `Admin: ${filteredAdmin.length} · Người dùng: ${filteredUsers.length}`;
    }
  }
});
