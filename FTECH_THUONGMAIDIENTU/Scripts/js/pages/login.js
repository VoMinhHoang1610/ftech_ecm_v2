let selectedRole = 'customer';
let selectedRedirect = 'trangchu.html';

const roleConfig = {
  customer: {
    icon: '👤',
    title: 'Xin chào, Người dùng!',
    desc: 'Bạn có thể truy cập khu vực người dùng để đọc review, lưu nội dung và theo dõi hoạt động cá nhân.',
    role: 'customer',
    href: 'trangchu.html'
  },
  content: {
    icon: '✍️',
    title: 'Xin chào, Content Manager!',
    desc: 'Bạn đã được cấp quyền truy cập khu vực Content để tạo, chỉnh sửa và quản lý bài viết.',
    role: 'content',
    href: 'content-manager.html'
  },
  partner: {
    icon: '🤝',
    title: 'Xin chào, Affiliate Manager!',
    desc: 'Bạn đã được cấp quyền truy cập khu vực Affiliate để quản lý đối tác, link và hiệu suất chuyển đổi.',
    role: 'partner',
    href: 'manage-affiliates.html'
  },
  admin: {
    icon: '⚙️',
    title: 'Xin chào, Super Admin!',
    desc: 'Bạn có toàn quyền giám sát hệ thống, duyệt nội dung, duyệt đối tác và quản lý tài khoản admin.',
    role: 'admin',
    href: 'dashboard.html'
  }
};

// Autofill fields on load for customer demo role
document.addEventListener('DOMContentLoaded', () => {
  const identifierInput = document.getElementById('identifier');
  const passwordInput = document.getElementById('loginPassword');
  
  const urlParams = new URLSearchParams(window.location.search);
  const reason = urlParams.get('reason');
  const username = urlParams.get('username');
  const lockReason = urlParams.get('lockReason') || 'Vi phạm chính sách cộng đồng.';

  if (reason === 'locked' && username) {
    const errorToast = document.getElementById('toastError');
    if (errorToast) {
      errorToast.innerHTML = `⚠️ Tài khoản <strong>@${username}</strong> hiện đang bị khóa.<br><span style="font-size: 12px; font-weight: 500; opacity: 0.9; display: inline-block; margin-top: 4px;">Lý do: ${lockReason}</span>`;
      errorToast.classList.add('show');
    }
    if (identifierInput) identifierInput.value = username;
    if (passwordInput) passwordInput.value = '';
  } else {
    if (identifierInput && passwordInput) {
      identifierInput.value = 'customer';
      passwordInput.value = '123';
    }
  }
});

function setDemo(button, role) {
  selectedRole = role;
  document.querySelectorAll('.demo-role').forEach(el => el.classList.remove('active'));
  button.classList.add('active');

  const identifierInput = document.getElementById('identifier');
  const passwordInput = document.getElementById('loginPassword');
  if (identifierInput && passwordInput) {
    identifierInput.value = role;
    passwordInput.value = '123';
  }
}

function togglePw() {
  const input = document.getElementById('loginPassword');
  input.type = input.type === 'password' ? 'text' : 'password';
}

function socialAuth(provider) {
  const toast = document.getElementById('toastSuccess');
  const error = document.getElementById('toastError');
  error.classList.remove('show');
  toast.textContent = `Đăng nhập bằng ${provider} đang được mô phỏng. Ở bản đầy đủ, hệ thống sẽ mở luồng xác thực và gán quyền truy cập theo ${provider}.`;
  toast.classList.add('show');
}

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const identifier = document.getElementById('identifier').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errIdentifier = document.getElementById('errIdentifier');
  const errPassword = document.getElementById('errPassword');
  const toast = document.getElementById('toastSuccess');
  const error = document.getElementById('toastError');
  let invalid = false;

  errIdentifier.classList.remove('show');
  errPassword.classList.remove('show');
  toast.classList.remove('show');
  error.classList.remove('show');

  if (!identifier) {
    errIdentifier.textContent = 'Vui lòng nhập tài khoản hoặc email.';
    errIdentifier.classList.add('show');
    invalid = true;
  }

  if (!password) {
    errPassword.textContent = 'Vui lòng nhập mật khẩu.';
    errPassword.classList.add('show');
    invalid = true;
  }

  if (invalid) {
    error.classList.add('show');
    return;
  }

  // --- VIRTUAL DB AUTHENTICATION ---
  const user = FTECHDB.getAccount(identifier);

  if (!user) {
    errIdentifier.textContent = 'Tài khoản hoặc email không tồn tại trong hệ thống.';
    errIdentifier.classList.add('show');
    error.classList.add('show');
    return;
  }

  if (user.status === 'locked') {
    errIdentifier.textContent = 'Tài khoản này đang bị khóa. Lý do: ' + (user.lockReason || 'Không có lý do.');
    errIdentifier.classList.add('show');
    error.classList.add('show');
    return;
  }

  if (user.password !== password) {
    errPassword.textContent = 'Mật khẩu không chính xác.';
    errPassword.classList.add('show');
    error.classList.add('show');
    return;
  }

  // Successful login!
  const btn = document.getElementById('loginBtn');
  btn.disabled = true;
  btn.textContent = 'Đang xác thực...';

  setTimeout(() => {
    btn.textContent = '✅ Thành công!';
    toast.textContent = 'Xác thực thành công. Hệ thống đang điều hướng theo quyền truy cập của bạn.';
    toast.classList.add('show');
    
    // Save login state in localStorage
    localStorage.setItem('ftech_logged_in', 'true');
    localStorage.setItem('ftech_role', user.role);
    localStorage.setItem('ftech_username', user.name);
    localStorage.setItem('ftech_avatar', user.avatar || '👤');
    localStorage.setItem('ftech_user', user.username);

    showRoleModal(user.role, user.name);
  }, 600);
});

function showRoleModal(role, name) {
  const cfg = roleConfig[role] || {
    icon: '👤',
    title: 'Xin chào!',
    desc: 'Bạn đã đăng nhập thành công vào FTECH.',
    role: 'customer',
    href: 'trangchu.html'
  };

  selectedRedirect = cfg.href;

  document.getElementById('modalIcon').textContent = cfg.icon;
  document.getElementById('modalTitle').textContent = `Xin chào, ${name}!`;
  document.getElementById('modalDesc').textContent = cfg.desc;
  
  let friendlyRole = 'Người dùng';
  if (role === 'admin') friendlyRole = 'Super Admin';
  else if (role === 'content') friendlyRole = 'Content Manager';
  else if (role === 'partner') friendlyRole = 'Affiliate Manager';
  
  document.getElementById('modalRole').textContent = friendlyRole;

  // Custom text for the button directing to the targeted area
  const buttonTextMap = {
    customer: 'Vào trang chủ FTECH',
    content: 'Vào trang Content Manager',
    partner: 'Vào trang Affiliate Manager',
    admin: 'Vào trang Admin Dashboard'
  };
  const btnText = buttonTextMap[role] || 'Vào khu vực được cấp quyền';
  const modalBtn = document.querySelector('#roleModal .modal-btn');
  if (modalBtn) {
    modalBtn.textContent = btnText;
  }

  document.getElementById('roleModal').classList.add('show');
}

function closeModal() {
  const targetUrl = window.FTECHAuth && window.FTECHAuth.getTargetUrl
    ? window.FTECHAuth.getTargetUrl(selectedRedirect)
    : selectedRedirect;
  window.location.href = targetUrl;
}
