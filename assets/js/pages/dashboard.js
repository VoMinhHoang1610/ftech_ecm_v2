// --- ADMIN DASHBOARD REAL-TIME LOGIC ---

document.addEventListener('DOMContentLoaded', () => {
  // Update dashboard data initially
  updateDashboardData();

  // Handle period selector change
  const periodSel = document.getElementById('periodSel');
  if (periodSel) {
    periodSel.addEventListener('change', updateDashboardData);
  }

  // Warning card click routing
  const warnBtn = document.querySelector('.alert-card.warn button');
  if (warnBtn) {
    warnBtn.onclick = () => {
      window.location.href = 'manage-posts.html';
    };
  }

  // Refresh button trigger
  const btnPrimary = document.querySelector('.topbar-actions .btn-primary, .u-style-020 .btn-primary');
  if (btnPrimary) {
    btnPrimary.addEventListener('click', () => {
      updateDashboardData();
      showToast('Dữ liệu hệ thống đã được cập nhật mới nhất.', 'success');
    });
  }
});

function updateDashboardData() {
  const posts = window.FTECHDB.getPosts();
  const accounts = window.FTECHDB.getAccounts();
  const partners = window.FTECHDB.getPartners();
  const clickLogs = window.FTECHDB.getClickLogs();
  const commissionSummary = window.FTECHDB.calculateCommissionSummary();
  
  const pendingCount = posts.filter(p => p.status === 'pending').length;
  const approvedCount = posts.filter(p => p.status === 'approved').length;

  // 1. Calculate click and commission metrics from click logs.
  const totalClicks = commissionSummary.validClicks;
  const displayClicks = totalClicks >= 1000 ? `${(totalClicks / 1000).toFixed(1)}K` : totalClicks;
  const displayRevenue = `${(commissionSummary.revenue / 1000000).toFixed(1)}Mđ`;

  // 2. Map KPIs
  document.getElementById('kpi-users').textContent = accounts.length.toLocaleString('vi-VN');
  document.getElementById('kpi-posts').textContent = posts.length.toLocaleString('vi-VN');
  document.getElementById('kpi-clicks').textContent = displayClicks;
  document.getElementById('kpi-revenue').textContent = displayRevenue;

  // 3. Update Pending Posts Alert Card
  const warnEl = document.querySelector('.alert-card.warn .alert-title');
  const warnDesc = document.querySelector('.alert-card.warn .alert-desc');
  if (warnEl) {
    warnEl.textContent = `${pendingCount} bài viết đang chờ duyệt`;
    if (pendingCount > 0) {
      warnDesc.textContent = `Có bài viết đang chờ Super Admin phê duyệt. Vui lòng kiểm tra sớm để hiển thị lên Trang chủ.`;
      document.querySelector('.alert-card.warn').style.display = 'flex';
    } else {
      warnDesc.textContent = `Tất cả bài viết đã được xử lý xong. Hệ thống không có hàng chờ kiểm duyệt.`;
    }
  }

  // 4. Render top performing posts dynamically
  const sortedPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);
  const postRankContainer = document.querySelector('.bottom-grid .card:first-child');
  if (postRankContainer) {
    let html = `<div class="card-title">Top bài viết hiệu quả</div><div class="card-sub">Xếp hạng theo lượt xem thực tế từ CSDL</div>`;
    
    if (sortedPosts.length === 0) {
      html += `<div style="padding: 20px; text-align: center; color: var(--muted);">Chưa có bài viết nào được duyệt.</div>`;
    } else {
      sortedPosts.forEach((p, idx) => {
        const viewsDisplay = p.views >= 1000 ? `${(p.views / 1000).toFixed(1)}K` : p.views;
        const affClicks = clickLogs.filter(log => log.postId === p.id && log.status === 'valid').length;
        const ctr = p.views ? `${((affClicks / p.views) * 100).toFixed(1)}%` : '0%';
        const widthPercent = idx === 0 ? '100%' : idx === 1 ? '70%' : '50%';
        
        html += `
          <div class="rank-item">
            <div class="rank-num">${idx + 1}</div>
            <div class="rank-info">
              <div class="rank-name">${p.title}</div>
              <div class="rank-meta">${viewsDisplay} lượt xem · ${affClicks} click AFF · Trạng thái: ${p.status}</div>
              <div class="rank-bar-wrap"><div class="rank-bar-fill" style="width: ${widthPercent}; background: var(--accent);"></div></div>
            </div>
            <div class="rank-val">CTR ${ctr}</div>
          </div>
        `;
      });
    }
    postRankContainer.innerHTML = html;
  }

  // 5. Render top partners dynamically
  const partnerMetrics = partners.map(partner => {
    const logs = clickLogs.filter(log => log.partnerId === partner.id && log.status === 'valid');
    const revenue = logs.reduce((sum, log) => {
      const post = posts.find(p => p.id === log.postId);
      return sum + ((post ? Number(post.price) || 0 : 0) * (Number(partner.commissionRate) || 0));
    }, 0);
    return { ...partner, validClicks: logs.length, revenue };
  });
  const sortedPartners = partnerMetrics.sort((a, b) => b.revenue - a.revenue).slice(0, 3);
  const partnerRankContainer = document.querySelector('.bottom-grid .card:nth-child(2)');
  if (partnerRankContainer) {
    let html = `<div class="card-title">Top đối tác</div><div class="card-sub">Xếp hạng theo doanh thu affiliate và click thực tế</div>`;
    
    if (sortedPartners.length === 0) {
      html += `<div style="padding: 20px; text-align: center; color: var(--muted);">Chưa có đối tác hoạt động.</div>`;
    } else {
      sortedPartners.forEach((p, idx) => {
        const clicks = p.validClicks || 0;
        const convs = Math.floor(clicks * 0.06);
        const revenue = `${(p.revenue / 1000000).toFixed(1)}Mđ`;
        const widthPercent = idx === 0 ? '100%' : idx === 1 ? '70%' : '50%';
        
        html += `
          <div class="rank-item">
            <div class="rank-num">${idx + 1}</div>
            <div class="rank-info">
              <div class="rank-name">${p.name}</div>
              <div class="rank-meta">${clicks.toLocaleString()} click · ${convs} chuyển đổi · Ngành: ${p.category || 'TMĐT'}</div>
              <div class="rank-bar-wrap"><div class="rank-bar-fill" style="width: ${widthPercent}; background: var(--green);"></div></div>
            </div>
            <div class="rank-val">${revenue}</div>
          </div>
        `;
      });
    }
    partnerRankContainer.innerHTML = html;
  }

  // 6. Funnel analytics updating
  const funnelViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
  const displayFunnelViews = funnelViews >= 1000 ? `${(funnelViews / 1000).toFixed(0)}K` : funnelViews;
  
  const funnelViewsVal = document.querySelector('.funnel-bar:nth-child(1) .funnel-val');
  if (funnelViewsVal) funnelViewsVal.textContent = displayFunnelViews;
  
  const funnelClicksVal = document.querySelector('.funnel-bar:nth-child(2) .funnel-val');
  if (funnelClicksVal) funnelClicksVal.textContent = displayClicks;
  
  const funnelConvsVal = document.querySelector('.funnel-bar:nth-child(3) .funnel-val');
  if (funnelConvsVal) {
    const convCount = Math.floor(totalClicks * 0.05);
    funnelConvsVal.textContent = convCount.toLocaleString();
  }

  // 7. Recent activities update dynamically
  const actList = document.querySelector('.activity-list');
  if (actList) {
    const lastPost = posts[0] || { title: 'Review iPhone 16 Pro Max', date: 'vừa qua' };
    const lastUser = accounts[accounts.length - 1] || { name: 'Thành viên mới' };
    
    const pendingCommCount = window.FTECHDB.getCommentSummary ? window.FTECHDB.getCommentSummary().pending : 0;
    
    actList.innerHTML = `
      <div class="act-item"><div class="act-dot" style="background: var(--accent);"></div><div class="act-text">Bài viết mới nhất: <strong>${lastPost.title}</strong> (${lastPost.status})</div><div class="act-time">${lastPost.date}</div></div>
      <div class="act-item"><div class="act-dot" style="background: var(--green);"></div><div class="act-text">Thành viên đăng ký mới: <strong>${lastUser.name}</strong> (vai trò: ${lastUser.role})</div><div class="act-time">Vừa đăng ký</div></div>
      <div class="act-item"><div class="act-dot" style="background: var(--orange);"></div><div class="act-text">Hiện có <strong>${pendingCount} bài viết</strong> và <strong>${pendingCommCount} bình luận chờ duyệt</strong>, cùng <strong>${commissionSummary.suspiciousClicks} click nghi ngờ</strong>.</div><div class="act-time">Cần kiểm duyệt</div></div>
    `;
  }

  // 8. Weekly Chart rendering
  const weekData = [
    { label: 'W1', posts: Math.floor(approvedCount * 0.3), clicks: Math.floor(totalClicks * 0.2) },
    { label: 'W2', posts: Math.floor(approvedCount * 0.5), clicks: Math.floor(totalClicks * 0.3) },
    { label: 'W3', posts: Math.floor(approvedCount * 0.8), clicks: Math.floor(totalClicks * 0.6) },
    { label: 'W4', posts: approvedCount, clicks: totalClicks }
  ];

  const maxP = Math.max(...weekData.map(d => d.posts)) || 1;
  const maxC = Math.max(...weekData.map(d => d.clicks)) || 1;

  const chart = document.getElementById('mainChart');
  if (chart) {
    chart.innerHTML = weekData.map(d => `
      <div class="bar-col">
        <div class="bar-stack">
          <div class="b-clicks" style="height:${(d.clicks / maxC) * 80}%;min-height:4px;"></div>
          <div class="b-posts" style="height:${(d.posts / maxP) * 70}%;min-height:4px;"></div>
        </div>
        <div class="b-label">${d.label}</div>
      </div>
    `).join('');
  }
}
