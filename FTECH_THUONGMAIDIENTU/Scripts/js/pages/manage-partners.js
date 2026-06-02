// --- ADMIN PARTNERS MANAGEMENT LOGIC ---

document.addEventListener('DOMContentLoaded', function () {
  let editMode = 'add'; // 'add' or 'edit'
  let currentApproveName = null;
  let currentApproveTargetStatus = 'active';

  // 1. Enrich existing basic seed partners if needed
  enrichSeedPartners();

  // Initial render
  renderAll();

  // Search listeners
  document.getElementById('btnSearch').addEventListener('click', renderAll);
  document.getElementById('searchQuery').addEventListener('keyup', function (e) {
    if (e.key === 'Enter') renderAll();
  });

  // Filter change listeners
  document.getElementById('filterCategory').addEventListener('change', renderAll);
  document.getElementById('filterStatus').addEventListener('change', renderAll);

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('open');
  }));

  // --- ACTIONS ---

  window.openAddPartnerModal = function () {
    editMode = 'add';
    document.getElementById('partnerEditTitle').textContent = 'Đăng ký đối tác mới';
    document.getElementById('partnerNameField').disabled = false;

    // Reset fields
    document.getElementById('partnerNameField').value = '';
    document.getElementById('partnerStatusField').value = 'pending';
    document.getElementById('partnerEmailField').value = '';
    document.getElementById('partnerCategoryField').value = 'TMĐT';
    document.getElementById('partnerCommissionField').value = '5-10% / đơn';
    document.getElementById('partnerDomainField').value = '';
    document.getElementById('partnerNoteField').value = '';

    document.getElementById('partnerEditModal').classList.add('open');
  };

  window.openPartnerEdit = function (name) {
    editMode = 'edit';
    const partners = FTECHDB.getPartners();
    const p = partners.find(x => x.name === name);
    if (!p) return;

    document.getElementById('partnerEditTitle').textContent = 'Cập nhật thông tin đối tác';
    document.getElementById('partnerNameField').disabled = true;

    document.getElementById('partnerNameField').value = p.name;
    document.getElementById('partnerStatusField').value = p.status || 'active';
    document.getElementById('partnerEmailField').value = p.email || '';
    document.getElementById('partnerCategoryField').value = p.category || 'TMĐT';
    document.getElementById('partnerCommissionField').value = p.commission || '4-8% / đơn';
    document.getElementById('partnerDomainField').value = p.domain || '';
    document.getElementById('partnerNoteField').value = p.note || '';

    document.getElementById('partnerEditModal').classList.add('open');
  };

  window.savePartnerEdit = function () {
    const name = document.getElementById('partnerNameField').value.trim();
    const status = document.getElementById('partnerStatusField').value;
    const email = document.getElementById('partnerEmailField').value.trim();
    const category = document.getElementById('partnerCategoryField').value;
    const commission = document.getElementById('partnerCommissionField').value.trim();
    const domain = document.getElementById('partnerDomainField').value.trim();
    const note = document.getElementById('partnerNoteField').value.trim();

    if (!name || !email || !domain) {
      showToast('Vui lòng nhập tên đối tác, email liên hệ và website.', 'warn');
      return;
    }

    const partners = FTECHDB.getPartners();
    let p = partners.find(x => x.name === name);

    if (editMode === 'add') {
      if (p) {
        showToast('Tên đối tác này đã tồn tại!', 'error');
        return;
      }
      p = {
        name,
        logo: '🤝',
        clicks: 0,
        cvr: '0%',
        date: new Date().toLocaleDateString('vi-VN').substring(3) // MM/YYYY
      };
    }

    p.status = status;
    p.email = email;
    p.category = category;
    p.commission = commission;
    p.domain = domain;
    p.note = note;

    FTECHDB.savePartner(p);
    showToast(editMode === 'add' ? 'Đã thêm đối tác mới vào danh sách chờ duyệt.' : 'Đã cập nhật thông tin đối tác.', 'success');
    window.closePartnerModal('partnerEditModal');
    renderAll();
  };

  window.openPartnerApprove = function (name, mode) {
    currentApproveName = name;
    document.getElementById('partnerApproveName').textContent = name;
    
    const title = document.getElementById('partnerApproveTitle');
    const actionBtn = document.getElementById('partnerApproveAction');
    
    if (mode === 'approve') {
      title.textContent = 'Duyệt đối tác mới';
      actionBtn.textContent = 'Duyệt đối tác';
      currentApproveTargetStatus = 'active';
    } else if (mode === 'reject') {
      title.textContent = 'Từ chối đối tác';
      actionBtn.textContent = 'Từ chối';
      currentApproveTargetStatus = 'rejected';
    } else if (mode === 'resume') {
      title.textContent = 'Kích hoạt lại đối tác';
      actionBtn.textContent = 'Kích hoạt lại';
      currentApproveTargetStatus = 'active';
    } else if (mode === 'pause') {
      title.textContent = 'Tạm dừng đối tác';
      actionBtn.textContent = 'Tạm dừng';
      currentApproveTargetStatus = 'paused';
    }

    document.getElementById('partnerApproveNote').value = '';
    document.getElementById('partnerApproveModal').classList.add('open');
  };

  window.submitPartnerAction = function () {
    const partners = FTECHDB.getPartners();
    const p = partners.find(x => x.name === currentApproveName);
    if (!p) return;

    p.status = currentApproveTargetStatus;
    const note = document.getElementById('partnerApproveNote').value.trim();
    if (note) {
      p.note = note;
    }

    FTECHDB.savePartner(p);
    showToast('Đã cập nhật trạng thái của đối tác thành công.', 'success');
    window.closePartnerModal('partnerApproveModal');
    renderAll();
  };

  window.closePartnerModal = function (id) {
    document.getElementById(id).classList.remove('open');
  };

  function enrichSeedPartners() {
    const partners = FTECHDB.getPartners();
    let hasChanges = false;
    partners.forEach(p => {
      if (!p.status) {
        p.status = p.name === 'Tiki Trading' ? 'paused' : 'active';
        p.email = p.name === 'CellphoneS' ? 'partner@cellphones.com.vn' :
                  p.name === 'Thế Giới Di Động' ? 'affiliate@tgdd.vn' :
                  p.name === 'Shopee Mall - Apple Store' ? 'partner@shopee.vn' :
                  p.name === 'Lazada Partner' ? 'lazpartner@lazada.vn' : 'partner@tiki.vn';
        p.category = p.name === 'CellphoneS' || p.name === 'Thế Giới Di Động' ? 'Điện tử' : 'TMĐT';
        p.clicks = p.name === 'CellphoneS' ? 1420 :
                   p.name === 'Thế Giới Di Động' ? 2840 :
                   p.name === 'Shopee Mall - Apple Store' ? 4820 :
                   p.name === 'Lazada Partner' ? 1950 : 890;
        p.cvr = p.name === 'CellphoneS' ? '4.5%' :
                p.name === 'Thế Giới Di Động' ? '5.2%' :
                p.name === 'Shopee Mall - Apple Store' ? '6.5%' :
                p.name === 'Lazada Partner' ? '4.8%' : '3.6%';
        p.commission = p.name === 'CellphoneS' ? '3-6%' :
                       p.name === 'Thế Giới Di Động' ? '2-5%' :
                       p.name === 'Shopee Mall - Apple Store' ? '4-8%' :
                       p.name === 'Lazada Partner' ? '4-7%' : '2-5%';
        p.domain = p.name === 'CellphoneS' ? 'cellphones.com.vn' :
                   p.name === 'Thế Giới Di Động' ? 'thegioididong.com' :
                   p.name === 'Shopee Mall - Apple Store' ? 'shopee.vn' :
                   p.name === 'Lazada Partner' ? 'lazada.vn' : 'tiki.vn';
        p.note = p.desc || 'Đối tác chiến lược liên kết tiếp thị sản phẩm của FTECH.';
        p.date = p.date || '01/2025';
        p.logo = p.name === 'CellphoneS' ? '📱' :
                 p.name === 'Thế Giới Di Động' ? '🛒' :
                 p.name === 'Shopee Mall - Apple Store' ? '📦' :
                 p.name === 'Lazada Partner' ? '📘' : '🚀';
        FTECHDB.savePartner(p);
        hasChanges = true;
      }
    });

    // Add GearVN Affiliate as a pending seed if it's not present
    if (!partners.find(x => x.name === 'GearVN Affiliate')) {
      FTECHDB.savePartner({
        name: 'GearVN Affiliate',
        logo: '💻',
        status: 'pending',
        email: 'biz@gearvn.com',
        category: 'Gaming',
        clicks: 0,
        cvr: '0%',
        commission: '5-9%',
        domain: 'gearvn.com',
        note: 'Đối tác mới chờ duyệt. Nhóm ngành máy tính, phụ kiện gaming.',
        date: '29/03/2026'
      });
      hasChanges = true;
    }
  }

  function renderAll() {
    const partners = FTECHDB.getPartners().filter(p => p.status !== 'rejected');
    const clickLogs = FTECHDB.getClickLogs();
    const posts = FTECHDB.getPosts();

    // 1. Calculate and update stats
    const totalCount = partners.length;
    const pendingCount = partners.filter(p => p.status === 'pending').length;
    
    let totalClicks = 0;
    let totalComm = 0;
    let topClicks = 0;
    let topName = 'Shopee';
    
    partners.forEach(p => {
      const pLogs = clickLogs.filter(log => log.partnerId === p.id && log.status === 'valid');
      const pClicks = pLogs.length;
      totalClicks += pClicks;
      
      const partnerComm = pLogs.reduce((sum, log) => {
        const post = posts.find(postItem => postItem.id === log.postId);
        return sum + ((post ? Number(post.price) || 0 : 0) * (Number(p.commissionRate) || 0));
      }, 0);
      totalComm += partnerComm;

      if (pClicks > topClicks) {
        topClicks = pClicks;
        topName = p.name.split(' ')[0]; // short name
      }
    });

    const displayClicks = totalClicks >= 1000 ? `${(totalClicks / 1000).toFixed(1)}K` : totalClicks;
    const displayComm = FTECHDB.formatMoney(totalComm);

    document.querySelector('.sv-total-partners').textContent = totalCount;
    document.querySelector('.sv-pending-partners').textContent = pendingCount;
    document.querySelector('.sv-total-clicks').textContent = displayClicks;
    document.querySelector('.sv-total-comm').textContent = displayComm;
    document.querySelector('.sv-top-partner').textContent = topName;

    // 2. Filters
    const searchQuery = document.getElementById('searchQuery').value.toLowerCase().trim();
    const filterCategory = document.getElementById('filterCategory').value;
    const filterStatus = document.getElementById('filterStatus').value;

    const filtered = partners.filter(p => {
      // Category
      if (filterCategory) {
        if (filterCategory === 'TMĐT' && p.category !== 'TMĐT') return false;
        if (filterCategory === 'Gaming' && p.category !== 'Gaming') return false;
        if (filterCategory === 'Phụ kiện' && p.category !== 'Phụ kiện') return false;
        if (filterCategory === 'Điện tử' && p.category !== 'Điện tử') return false;
      }

      // Status
      if (filterStatus && p.status !== filterStatus) return false;

      // Search Query
      if (searchQuery) {
        const nameMatch = p.name.toLowerCase().includes(searchQuery);
        const catMatch = (p.category || '').toLowerCase().includes(searchQuery);
        const domainMatch = (p.domain || '').toLowerCase().includes(searchQuery);
        if (!nameMatch && !catMatch && !domainMatch) return false;
      }

      return true;
    });

    // 3. Render Grid View
    const grid = document.getElementById('partnersGrid');
    if (grid) {
      if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: span 3; text-align: center; color: var(--muted); padding: 40px 0;">📭 Không tìm thấy đối tác nào.</div>`;
      } else {
        grid.innerHTML = filtered.map(p => {
          const statusClass = `pcs-${p.status}`;
          const statusLabel = p.status === 'active' ? 'Hoạt động' : p.status === 'pending' ? 'Chờ duyệt' : 'Tạm dừng';
          
          let footerButtons = '';
          if (p.status === 'pending') {
            footerButtons = `
              <button class="pc-btn u-style-058" onclick="openPartnerApprove('${p.name}', 'reject')">Từ chối</button>
              <button class="pc-btn-primary" onclick="openPartnerApprove('${p.name}', 'approve')">Duyệt đối tác</button>
            `;
          } else if (p.status === 'paused') {
            footerButtons = `
              <button class="pc-btn u-style-060" onclick="openPartnerApprove('${p.name}', 'resume')">Kích hoạt lại</button>
              <button class="pc-btn-primary" onclick="openPartnerEdit('${p.name}')">Cập nhật thông tin</button>
            `;
          } else {
            footerButtons = `
              <button class="pc-btn" onclick="openPartnerApprove('${p.name}', 'pause')">Tạm dừng</button>
              <button class="pc-btn-primary" onclick="openPartnerEdit('${p.name}')">Cập nhật thông tin</button>
            `;
          }

          const logoHtml = p.logo.length > 2 
            ? `<img src="${p.logo}" alt="${p.name}">` 
            : `<span style="font-size: 32px;">${p.logo}</span>`;

          const pClicks = clickLogs.filter(log => log.partnerId === p.id && log.status === 'valid').length;
          const conversions = Math.floor(pClicks * 0.06);

          // Tính CVR realtime từ click logs
          const partnerAffiliates = FTECHDB.getAffiliates().filter(a => a.partnerId === p.id);
          const partnerPostViews = partnerAffiliates.reduce((sum, aff) => {
            const post = posts.find(pt => pt.id === aff.postId);
            return sum + (post ? Number(post.views) || 0 : 0);
          }, 0);
          const computedCvr = partnerPostViews > 0 ? `${((pClicks / partnerPostViews) * 100).toFixed(1)}%` : '0%';

          return `
            <div class="partner-card pc-${p.status}">
              <div class="pc-head">
                <div class="pc-logo u-style-053">${logoHtml}</div>
                <span class="pc-status ${statusClass}">${statusLabel}</span>
              </div>
              <div class="pc-name">${p.name}</div>
              <div class="pc-cat"><div class="cat-dot" style="background: ${p.status === 'active' ? '#1bcf8a' : p.status === 'pending' ? '#f59e0b' : '#ef4444'};"></div>${p.category || 'Đối tác'} · ${p.domain}</div>
              <div class="pc-meta">
                <div>Liên hệ: ${p.email}</div>
                <div>Từ: ${p.date}</div>
              </div>
              <div class="pc-metrics">
                <div class="pcm">
                  <div class="pcm-val u-style-023">${pClicks.toLocaleString()}</div>
                  <div class="pcm-label">Lượt click</div>
                </div>
                <div class="pcm">
                  <div class="pcm-val u-style-054">${conversions > 0 ? conversions : '-'}</div>
                  <div class="pcm-label">Chuyển đổi</div>
                </div>
                <div class="pcm">
                  <div class="pcm-val u-style-031">${computedCvr}</div>
                  <div class="pcm-label">CVR</div>
                </div>
              </div>
              <div class="pc-commission">
                <span class="pc-comm-label">Hoa hồng cơ bản</span>
                <span class="pc-comm-val">${p.commission}</span>
              </div>
              <div class="pc-note">${p.note}</div>
              <div class="pc-footer">${footerButtons}</div>
            </div>
          `;
        }).join('');
      }
    }

    // 4. Render Table View
    const tbody = document.getElementById('partnersTableBody');
    if (tbody) {
      document.getElementById('tableTitle').textContent = `Tất cả đối tác (${filtered.length})`;

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <div class="t-row t-empty">
            <div class="empty-cell">📭 Không tìm thấy đối tác.</div>
          </div>
        `;
      } else {
        tbody.innerHTML = filtered.map(p => {
          const statusClass = `pcs-${p.status}`;
          const statusLabel = p.status === 'active' ? 'Hoạt động' : p.status === 'pending' ? 'Chờ duyệt' : 'Tạm dừng';
          const logoHtml = p.logo.length > 2 
            ? `<img src="${p.logo}" alt="${p.name}">` 
            : `<span style="font-size: 20px;">${p.logo}</span>`;

          let actionButtons = '';
          if (p.status === 'pending') {
            actionButtons = `
              <button class="act" onclick="openPartnerApprove('${p.name}', 'approve')" title="Duyệt đối tác">✓</button>
              <button class="act" onclick="openPartnerEdit('${p.name}')" title="Sửa">✏️</button>
              <button class="act u-style-046" onclick="openPartnerApprove('${p.name}', 'reject')" title="Từ chối">✕</button>
            `;
          } else if (p.status === 'paused') {
            actionButtons = `
              <button class="act" onclick="openPartnerEdit('${p.name}')" title="Sửa">✏️</button>
              <button class="act u-style-023" onclick="openPartnerApprove('${p.name}', 'resume')" title="Kích hoạt lại">▶</button>
            `;
          } else {
            actionButtons = `
              <button class="act" onclick="openPartnerEdit('${p.name}')" title="Sửa">✏️</button>
              <button class="act" onclick="openPartnerApprove('${p.name}', 'pause')" title="Tạm dừng">⏸</button>
            `;
          }

          const pClicks = clickLogs.filter(log => log.partnerId === p.id && log.status === 'valid').length;

          // Tính CVR realtime từ click logs
          const partnerAffiliates = FTECHDB.getAffiliates().filter(a => a.partnerId === p.id);
          const partnerPostViews = partnerAffiliates.reduce((sum, aff) => {
            const post = posts.find(pt => pt.id === aff.postId);
            return sum + (post ? Number(post.views) || 0 : 0);
          }, 0);
          const computedCvr = partnerPostViews > 0 ? `${((pClicks / partnerPostViews) * 100).toFixed(1)}%` : '0%';

          return `
            <div class="t-row">
              <div class="partner-cell">
                <div class="p-av">${logoHtml}</div>
                <div>
                  <div class="p-name">${p.name}</div>
                  <div class="p-domain">${p.domain} · Từ: ${p.date}</div>
                </div>
              </div>
              <div class="cell-muted">${p.category}</div>
              <div class="cell-muted">${p.email}</div>
              <div class="metric-g">${pClicks.toLocaleString()}</div>
              <div class="metric-a">${computedCvr}</div>
              <div class="metric-p">${p.commission}</div>
              <div><span class="pc-status ${statusClass}">${statusLabel}</span></div>
              <div class="u-style-061">${actionButtons}</div>
            </div>
          `;
        }).join('');
      }
    }
  }
});
