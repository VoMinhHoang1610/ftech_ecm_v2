(function () {
  const TOKEN_KEYS = [
    'ftech_access_token',
    'ftech_refresh_token',
    'accessToken',
    'refreshToken',
    'token',
    'role',
    'ftech_role',
    'ftech_user',
    'ftech_username',
    'ftech_avatar'
  ];

  function clearAuthStorage() {
    TOKEN_KEYS.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  function getTargetUrl(staticPage) {
    if (!staticPage) return '';
    // If not running in a static HTML environment (e.g. MVC)
    const isMvc = !window.location.pathname.endsWith('.html') && !window.location.pathname.includes('.html') && !window.location.port.includes('8888');
    if (!isMvc) return staticPage;

    // Map static pages to MVC routing paths
    const mvcMap = {
      'trangchu.html': '/Home/Index',
      'product.html': '/Product/Index',
      'reviewmodule.html': '/Review/Index',
      'login.html': '/Account/Login',
      'register.html': '/Account/Register',
      'reset-password.html': '/Account/ResetPassword',
      'profilemanager.html': '/Account/Profile',
      'content-manager.html': '/ContentManager/Post/Index',
      'postmanager.html': '/ContentManager/Post/Create',
      'manage-affiliates.html': '/AffiliateManager/Affiliate/Index',
      'dashboard.html': '/Admin/Dashboard/Index',
      'manage-accounts.html': '/Admin/Account/Accounts',
      'manage-partners.html': '/Admin/Partner/Index',
      'manage-posts.html': '/SuperAdmin/Post/Index'
    };

    // Extract basename and hash/search params
    let pageOnly = staticPage.toLowerCase();
    let suffix = '';

    // Handle hash
    const hashIndex = pageOnly.indexOf('#');
    if (hashIndex !== -1) {
      suffix = staticPage.substring(hashIndex);
      pageOnly = pageOnly.substring(0, hashIndex);
    }

    // Handle search query params
    const queryIndex = pageOnly.indexOf('?');
    if (queryIndex !== -1) {
      suffix = staticPage.substring(queryIndex) + suffix;
      pageOnly = pageOnly.substring(0, queryIndex);
    }

    if (mvcMap[pageOnly]) {
      return mvcMap[pageOnly] + suffix;
    }
    return staticPage;
  }

  function logout() {
    clearAuthStorage();
    window.location.href = getTargetUrl('login.html');
  }

  // --- CLIENT-SIDE ROUTE GUARD (AUTH GATE) ---
  const currentPage = window.location.pathname.split('/').pop().toLowerCase();
  const pathname = window.location.pathname.toLowerCase();
  const role = localStorage.getItem('ftech_role');
  const currentUser = localStorage.getItem('ftech_user');

  function enforceActiveAccount() {
    if (!currentUser || !window.FTECHDB) return;
    const account = window.FTECHDB.getAccount(currentUser);
    if (!account || account.status === 'locked') {
      alert('⚠️ Phiên đăng nhập đã bị vô hiệu hóa vì tài khoản bị khóa hoặc không còn tồn tại.');
      clearAuthStorage();
      window.location.href = getTargetUrl('login.html');
    }
  }

  const adminPages = ['dashboard.html', 'manage-accounts.html', 'manage-partners.html', 'manage-posts.html'];
  const contentPages = ['content-manager.html', 'postmanager.html'];
  const partnerPages = ['manage-affiliates.html'];

  const isAdminArea = adminPages.includes(currentPage) || pathname.includes('/admin/') || pathname.includes('/superadmin/');
  const isContentArea = contentPages.includes(currentPage) || pathname.includes('/contentmanager/');
  const isPartnerArea = partnerPages.includes(currentPage) || pathname.includes('/affiliatemanager/');

  enforceActiveAccount();

  if (isAdminArea && role !== 'admin') {
    alert('⚠️ Khu vực hạn chế: Chỉ Super Admin mới có quyền truy cập trang này.');
    clearAuthStorage();
    window.location.href = getTargetUrl('login.html');
  } else if (isContentArea && role !== 'content' && role !== 'admin') {
    alert('⚠️ Khu vực hạn chế: Chỉ Content Manager hoặc Super Admin mới có quyền truy cập.');
    clearAuthStorage();
    window.location.href = getTargetUrl('login.html');
  } else if (isPartnerArea && role !== 'partner' && role !== 'admin') {
    alert('⚠️ Khu vực hạn chế: Chỉ Affiliate Manager hoặc Super Admin mới có quyền truy cập.');
    clearAuthStorage();
    window.location.href = getTargetUrl('login.html');
  }

  // --- DYNAMIC HEADER AUTH STATE ---
  function updateDynamicHeader() {
    const role = localStorage.getItem('ftech_role');
    if (!role) return;

    const username = localStorage.getItem('ftech_username') || 'Nguyễn Minh Vỹ';
    let avatar = localStorage.getItem('ftech_avatar') || '👤';
    
    if (avatar.startsWith('http')) {
      avatar = `<img src="${avatar}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    }

    const roleNames = {
      customer: 'Thành viên',
      content: 'Content Manager',
      partner: 'Affiliate Manager',
      admin: 'Super Admin'
    };

    const dashboardHrefs = {
      customer: 'profileManager.html',
      content: 'content-manager.html',
      partner: 'manage-affiliates.html',
      admin: 'dashboard.html'
    };

    const roleName = roleNames[role] || 'Thành viên';
    const targetHref = getTargetUrl(dashboardHrefs[role] || 'profileManager.html');

    const headerActions = document.querySelectorAll('.header-actions, .hdr-right');
    headerActions.forEach(container => {
      if (container.querySelector('.account-chip-dynamic') || container.closest('.modal')) {
        return;
      }

      container.innerHTML = `
        <div class="account-chip account-chip-dynamic" title="${username} - ${roleName}" onclick="window.location.href='${targetHref}'" style="cursor: pointer; display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px; border-radius: 99px; background: rgba(74, 125, 255, 0.1); border: 1px solid rgba(74, 125, 255, 0.22); margin-right: 12px;">
          <div class="account-avatar" style="font-size: 15px; width: 22px; height: 22px; display: grid; place-items: center; border-radius: 50%; overflow: hidden;">${avatar}</div>
          <div class="account-meta" style="text-align: left; display: flex; flex-direction: column;">
            <span class="account-name" style="font-weight: 700; font-size: 12px; color: #303a75; line-height: 1.2;">${username}</span>
            <span class="account-role" style="font-size: 10px; color: #5d6897; font-weight: 500;">${roleName}</span>
          </div>
        </div>
        <button class="btn-ghost" data-logout style="cursor: pointer; padding: 6px 12px; font-size: 12px; border-radius: 9px; font-weight: 700; border: 1px solid rgba(76, 84, 170, 0.24); background: transparent; color: #5d6897;">Đăng xuất</button>
      `;

      container.querySelector('[data-logout]').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    });
  }

  function updateSidebarUser() {
    const role = localStorage.getItem('ftech_role');
    if (!role) return;

    const username = localStorage.getItem('ftech_username');
    const avatar = localStorage.getItem('ftech_avatar');

    // Update names
    document.querySelectorAll('.sb-user-name, .sb-name').forEach(el => {
      if (username) el.textContent = username;
    });

    // Update roles
    const roleNames = {
      customer: 'Người dùng FTECH',
      content: 'Content Manager',
      partner: 'Affiliate Manager',
      admin: 'Super Admin'
    };
    const roleName = roleNames[role] || 'Thành viên';
    document.querySelectorAll('.sb-user-role, .sb-role-tag').forEach(el => {
      el.textContent = roleName;
    });

    // Update avatars
    document.querySelectorAll('.sb-avatar img').forEach(el => {
      if (avatar && avatar.startsWith('http')) {
        el.src = avatar;
        if (username) el.alt = username;
      }
    });
  }

  function ensureAdminLogoutButton() {
    const sidebarBottom = document.querySelector('.sidebar .sb-bottom');

    if (!sidebarBottom || sidebarBottom.querySelector('[data-logout]')) {
      return;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sb-logout';
    button.dataset.logout = 'true';
    button.textContent = 'Đăng xuất';
    sidebarBottom.appendChild(button);
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensureAdminLogoutButton();
    updateDynamicHeader();
    updateSidebarUser();

    document.querySelectorAll('[data-logout]').forEach((element) => {
      element.addEventListener('click', (event) => {
        event.preventDefault();
        logout();
      });
    });
  });

  // Listen for include.js loaded events (for dynamic component inclusion)
  document.addEventListener('component:loaded', () => {
    updateDynamicHeader();
    updateSidebarUser();
  });

  window.FTECHAuth = {
    logout,
    clearAuthStorage,
    updateDynamicHeader,
    getTargetUrl
  };
})();
