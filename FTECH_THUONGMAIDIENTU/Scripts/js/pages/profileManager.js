function sw(id) {
  document.querySelectorAll('.tab-pane').forEach(p => p.className = 'tab-pane');
  const targetTab = document.getElementById('tab-' + id);
  if (targetTab) targetTab.className = 'tab-pane active';
  
  const order = ['info','orders','reviews','comments','saved','wishlist','addresses','password','notifications'];
  document.querySelectorAll('.menu button').forEach((btn, index) => {
    btn.className = order[index] === id ? 'active' : '';
  });
}

let editing = false;
function toggleEdit() {
  editing = !editing;
  document.querySelectorAll('#tab-info input, #tab-info select, #tab-info textarea').forEach(el => {
    el.disabled = !editing;
  });
  document.getElementById('saveWrap').style.display = editing ? 'block' : 'none';
  document.querySelector('.edit-btn').textContent = editing ? 'Hủy' : 'Chỉnh sửa';
}

// Get current account
function getCurrentAccount() {
  const username = localStorage.getItem('ftech_user');
  if (username) {
    const acc = window.FTECHDB.getAccount(username);
    if (acc) return acc;
  }
  
  // If not logged in, return null
  const isLoggedIn = localStorage.getItem('ftech_logged_in') === 'true';
  if (!isLoggedIn) {
    return null;
  }

  // Fallback to role mapping if logged in but ftech_user is missing
  const role = localStorage.getItem('ftech_role') || 'customer';
  const usernameMap = {
    admin: 'admin',
    content: 'content',
    partner: 'partner',
    customer: 'customer'
  };
  const uKey = usernameMap[role] || 'customer';
  return window.FTECHDB.getAccount(uKey);
}

function renderProfileData() {
  const account = getCurrentAccount();
  
  if (!account) {
    // Render Guest View if not logged in
    const nameEl = document.querySelector('.sidebar-card .name');
    if (nameEl) nameEl.textContent = 'Khách viếng thăm';
    
    const subEl = document.querySelector('.sidebar-card .sub');
    if (subEl) subEl.textContent = '@guest · Chưa đăng nhập';

    const roleEl = document.querySelector('.sidebar-card .role');
    if (roleEl) roleEl.textContent = '👤 Khách hàng';

    const inputs = document.querySelectorAll('#tab-info input');
    if (inputs.length >= 4) {
      inputs[0].value = 'Khách';
      inputs[1].value = 'Chưa đăng nhập';
      inputs[2].value = 'guest@ftech.vn';
      inputs[3].value = 'guest';
    }
    const textarea = document.querySelector('#tab-info textarea');
    if (textarea) {
      textarea.value = 'Đăng ký hoặc đăng nhập tài khoản để viết review, gửi nhận xét và theo dõi liên kết thương mại điện tử.';
    }
    
    // Hide stats
    const stats = document.querySelectorAll('.stats .stat strong');
    if (stats.length >= 3) {
      stats[0].textContent = '0';
      stats[1].textContent = '0';
      stats[2].textContent = '0';
    }
    return;
  }

  // Fill Sidebar card
  const nameEl = document.querySelector('.sidebar-card .name');
  if (nameEl) nameEl.textContent = account.name;
  
  const subEl = document.querySelector('.sidebar-card .sub');
  if (subEl) subEl.textContent = `@${account.username} · ftech_user`;

  const roleEl = document.querySelector('.sidebar-card .role');
  if (roleEl) {
    const roleNames = { admin: 'Super Admin', content: 'Content Manager', partner: 'Affiliate Manager', customer: 'Người dùng FTECH' };
    const roleIcons = { admin: '⚙️', content: '✍️', partner: '🤝', customer: '👤' };
    roleEl.textContent = `${roleIcons[account.role] || '👤'} ${roleNames[account.role] || 'Thành viên'}`;
  }

  // Fill Inputs in Info tab
  const inputs = document.querySelectorAll('#tab-info input');
  if (inputs.length >= 4) {
    const names = (account.name || '').split(' ');
    const lastName = names[0] || '';
    const firstName = names.slice(1).join(' ') || '';
    
    inputs[0].value = lastName;
    inputs[1].value = firstName;
    inputs[2].value = account.email || `${account.username}@ftech.vn`;
    inputs[3].value = account.username;
  }

  const textarea = document.querySelector('#tab-info textarea');
  if (textarea) {
    textarea.value = account.bio || 'Mình thường xem review laptop, tai nghe và các bài so sánh giá trước khi mua.';
  }

  // Stats counting
  const allReviews = window.FTECHDB.getReviews();
  const userReviews = allReviews.filter(r => r.name === account.name || r.name === 'Nguyễn Minh Vỹ');
  const allComments = window.FTECHDB.getComments();
  const userComments = allComments.filter(c => c.userId === account.username || c.name === account.name);

  const stats = document.querySelectorAll('.stats .stat strong');
  if (stats.length >= 3) {
    stats[0].textContent = userReviews.length;
    stats[1].textContent = userComments.length;
    // article saves simulation count
    stats[2].textContent = '11'; 
  }

  // Dynamic reviews count badges
  const badges = document.querySelectorAll('.menu button .badge');
  if (badges.length >= 4) {
    badges[0].textContent = userReviews.length;
    badges[1].textContent = userComments.length;
  }

  // Render Reviews tab list
  const reviewsList = document.querySelector('#tab-reviews .list');
  if (reviewsList) {
    if (userReviews.length === 0) {
      reviewsList.innerHTML = '<div class="item" style="color:var(--muted);text-align:center;">Bạn chưa viết đánh giá nào.</div>';
    } else {
      reviewsList.innerHTML = userReviews.map(r => `
        <div class="item">
          <div class="item-head">
            <div class="item-title">${r.title || 'Đánh giá MacBook M3'}</div>
            <div class="item-date">${r.date}</div>
          </div>
          <div class="item-text">${r.text}</div>
          <div class="chips">
            <span class="chip">${r.stars} sao</span>
            <span class="chip">Đã duyệt</span>
            <span class="chip">${r.helpful} lượt hữu ích</span>
          </div>
          <div class="item-actions">
            <a href="reviewModule.html">Xem lại đánh giá</a>
            <button onclick="deleteMyReview(${r.id})">Xóa</button>
          </div>
        </div>
      `).join('');
    }
  }

  // Render Comments tab list
  const commentsList = document.querySelector('#tab-comments .list');
  if (commentsList) {
    if (userComments.length === 0) {
      commentsList.innerHTML = '<div class="item" style="color:var(--muted);text-align:center;">Bạn chưa gửi bình luận nào.</div>';
    } else {
      commentsList.innerHTML = userComments.map(c => {
        const statusLabel = c.status === 'approved' ? 'Da duyet' : c.status === 'rejected' ? 'Tu choi' : 'Cho duyet';
        const statusClass = c.status === 'approved' ? 'done' : c.status === 'rejected' ? 'rejected' : 'processing';
        return `
        <div class="item">
          <div class="item-head">
            <div class="item-title">Bình luận bài viết</div>
            <div class="item-date">${c.date}</div>
          </div>
          <div class="item-text">${c.text}</div>
          <div class="chips">
            <span class="chip status ${statusClass}">${statusLabel}</span>
            ${c.rejectReason ? `<span class="chip">Ly do: ${c.rejectReason}</span>` : ''}
          </div>
          <div class="item-actions">
            <a href="product.html?id=${encodeURIComponent(c.postId || 'post-1')}">Xem bài viết</a>
            <button onclick="deleteMyComment(${c.id})">Xóa</button>
          </div>
        </div>
      `;
      }).join('');
    }
  }
}

function saveInfo() {
  const account = getCurrentAccount();
  if (!account) return;

  const inputs = document.querySelectorAll('#tab-info input');
  if (inputs.length >= 3) {
    const lastName = inputs[0].value.trim();
    const firstName = inputs[1].value.trim();
    account.name = lastName + ' ' + firstName;
    account.email = inputs[2].value.trim();
  }
  
  const textarea = document.querySelector('#tab-info textarea');
  if (textarea) {
    account.bio = textarea.value.trim();
  }
  
  window.FTECHDB.saveAccount(account);
  localStorage.setItem('ftech_username', account.name);
  
  toggleEdit();
  renderProfileData();
  
  if (window.FTECHAuth && window.FTECHAuth.updateDynamicHeader) {
    window.FTECHAuth.updateDynamicHeader();
  }
  showToast('Đã cập nhật thông tin cá nhân thành công!', 'success');
}

function deleteMyReview(id) {
  showConfirm(
    'Bạn có chắc chắn muốn xóa đánh giá này?',
    function () {
      window.FTECHDB.deleteReview(id);
      renderProfileData();
      showToast('Đã xóa đánh giá.', 'info');
    },
    { title: 'Xóa đánh giá', icon: '🗑️', okText: 'Xóa' }
  );
}

function deleteMyComment(id) {
  showConfirm(
    'Bạn có chắc chắn muốn xóa bình luận này?',
    function () {
      window.FTECHDB.deleteComment(id);
      renderProfileData();
      showToast('Đã xóa bình luận.', 'info');
    },
    { title: 'Xóa bình luận', icon: '🗑️', okText: 'Xóa' }
  );
}

function changePw() {
  const oldPw = document.getElementById('oldPw').value.trim();
  const newPw = document.getElementById('newPw').value.trim();
  const confirmPw = document.getElementById('confirmPw').value.trim();
  
  if (!oldPw || !newPw || !confirmPw) {
    showToast('Vui lòng điền đầy đủ các trường mật khẩu.', 'warn');
    return;
  }
  
  const account = getCurrentAccount();
  if (oldPw !== account.password) {
    showToast('Mật khẩu cũ không chính xác.', 'error');
    return;
  }
  
  if (newPw.length < 8) {
    showToast('Mật khẩu mới phải có ít nhất 8 ký tự.', 'warn');
    return;
  }
  if (newPw !== confirmPw) {
    showToast('Xác nhận mật khẩu mới không khớp.', 'warn');
    return;
  }
  
  account.password = newPw;
  window.FTECHDB.saveAccount(account);
  
  showToast('Đổi mật khẩu thành công!', 'success');
  document.getElementById('oldPw').value = '';
  document.getElementById('newPw').value = '';
  document.getElementById('confirmPw').value = '';
}

document.addEventListener('DOMContentLoaded', () => {
  renderProfileData();
  const tabId = window.location.hash.replace('#tab-', '');
  if (tabId && document.getElementById('tab-' + tabId)) {
    sw(tabId);
  }
});
