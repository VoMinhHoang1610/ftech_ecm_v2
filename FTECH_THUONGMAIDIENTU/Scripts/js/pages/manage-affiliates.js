// --- ADMIN AFFILIATES MANAGEMENT LOGIC ---

document.addEventListener('DOMContentLoaded', function () {
  let selectedFilter = 'all';
  let editMode = 'create'; // 'create', 'edit', 'repair'
  let currentEditAffId = null;

  // Enrich default seeds to include rich metadata
  enrichSeedAffiliates();

  // Render everything on load
  renderAll();

  // Search listeners
  document.getElementById('btnSearch').addEventListener('click', renderAll);
  document.getElementById('searchQuery').addEventListener('keyup', function (e) {
    if (e.key === 'Enter') renderAll();
  });

  // Filter select listeners
  document.getElementById('filterPartner').addEventListener('change', renderAll);
  document.getElementById('filterSort').addEventListener('change', renderAll);

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('open');
  }));

  document.querySelectorAll('.sidebar .sb-item').forEach(item => {
    item.addEventListener('click', function () {
      document.querySelectorAll('.sidebar .sb-item').forEach(link => link.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Filter chips
  window.setF = function (el) {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    selectedFilter = el.getAttribute('data-filter') || 'all';
    renderAll();
  };

  // --- ACTIONS ---

  window.openAddPartnerModal = function () {
    document.getElementById('partnerEditTitle').textContent = 'Đăng ký đối tác mới';
    document.getElementById('partnerNameField').value = '';
    document.getElementById('partnerEmailField').value = '';
    document.getElementById('partnerCategoryField').value = 'TMĐT';
    document.getElementById('partnerCommissionField').value = '5-10% / đơn';
    document.getElementById('partnerDomainField').value = '';
    document.getElementById('partnerNoteField').value = '';
    document.getElementById('partnerEditModal').classList.add('open');
  };

  window.saveNewPartner = function () {
    const name = document.getElementById('partnerNameField').value.trim();
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
    if (partners.find(x => x.name === name)) {
      showToast('Tên đối tác này đã tồn tại!', 'error');
      return;
    }

    FTECHDB.savePartner({
      name,
      logo: '🤝',
      clicks: 0,
      cvr: '0%',
      date: new Date().toLocaleDateString('vi-VN').substring(3),
      status: 'pending',
      email,
      category,
      commission,
      domain,
      note
    });

    showToast('Đã thêm đối tác mới vào danh sách chờ duyệt.', 'success');
    window.closeAffiliateModal('partnerEditModal');
  };

  window.openAffiliateModal = function (mode, id = '') {
    editMode = mode;
    currentEditAffId = id;
    const title = document.getElementById('affiliateModalTitle');
    
    // Clear / reset fields
    document.getElementById('affiliateNameField').value = '';
    document.getElementById('affiliatePartnerField').value = 'Shopee Affiliate';
    document.getElementById('affiliatePostField').value = '';
    document.getElementById('affiliateStatusField').value = 'active';
    document.getElementById('affiliateUrlField').value = '';
    document.getElementById('affiliateImageField').value = '';
    document.getElementById('affiliateNoteField').value = '';

    if (mode === 'create') {
      title.textContent = 'Tạo link affiliate mới';
    } else {
      const aff = FTECHDB.getAffiliates().find(a => a.id === id);
      if (!aff) return;

      if (mode === 'repair') {
        title.textContent = 'Sửa link affiliate bị lỗi';
      } else {
        title.textContent = 'Cập nhật affiliate link';
      }

      document.getElementById('affiliateNameField').value = aff.name || '';
      document.getElementById('affiliatePartnerField').value = aff.partner || 'Shopee Affiliate';
      document.getElementById('affiliatePostField').value = aff.attachedPost || '';
      document.getElementById('affiliateStatusField').value = aff.status || 'active';
      document.getElementById('affiliateUrlField').value = aff.url || '';
      document.getElementById('affiliateImageField').value = aff.image || '';
      document.getElementById('affiliateNoteField').value = aff.note || '';
    }

    document.getElementById('affiliateModal').classList.add('open');
  };

  window.saveAffiliateLink = function () {
    const name = document.getElementById('affiliateNameField').value.trim();
    const partner = document.getElementById('affiliatePartnerField').value;
    const attachedPost = document.getElementById('affiliatePostField').value.trim();
    const status = document.getElementById('affiliateStatusField').value;
    const url = document.getElementById('affiliateUrlField').value.trim();
    const image = document.getElementById('affiliateImageField').value.trim();
    const note = document.getElementById('affiliateNoteField').value.trim();

    if (!name || !url) {
      showToast('Vui lòng nhập tên link/sản phẩm và đường dẫn affiliate.', 'warn');
      return;
    }

    const affiliates = FTECHDB.getAffiliates();
    let affData = {};

    if (editMode === 'create') {
      affData = {
        id: 'aff-' + Date.now(),
        clicks: 0,
        cvr: '5.0%',
        date: new Date().toLocaleDateString('vi-VN'),
        commission: partner === 'Shopee Affiliate' ? '4-8%' : partner === 'Lazada Partner' ? '3-6%' : '2-5%'
      };
    } else {
      const existing = affiliates.find(a => a.id === currentEditAffId);
      if (!existing) return;
      affData = { ...existing };
      if (editMode === 'repair' && affData.status === 'error') {
        affData.status = 'active'; // repaired!
      }
    }

    affData.name = name;
    affData.partner = partner;
    affData.attachedPost = attachedPost;
    affData.status = status;
    affData.url = url;
    affData.image = image || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=120&q=80';
    affData.note = note;

    FTECHDB.saveAffiliate(affData);
    showToast(editMode === 'create' ? 'Đã tạo link affiliate mới thành công.' : 'Đã cập nhật link affiliate thành công.', 'success');
    window.closeAffiliateModal('affiliateModal');
    renderAll();
  };

  window.doDeleteAffiliate = function (id) {
    showConfirm(
      'Bạn có chắc chắn muốn xóa link affiliate này không?',
      function () {
        FTECHDB.deleteAffiliate(id);
        showToast('Đã xóa link affiliate thành công.', 'info');
        renderAll();
      },
      { title: 'Xóa Affiliate Link', icon: '🗑️', okText: 'Xóa' }
    );
  };

  window.openCommissionModal = function (partner = '') {
    if (partner) {
      document.getElementById('commissionPartnerField').value = partner;
    }
    document.getElementById('commissionModal').classList.add('open');
  };

  window.saveCommission = function () {
    const partnerName = document.getElementById('commissionPartnerField').value;
    const modal = document.getElementById('commissionModal');
    const inputs = modal.querySelectorAll('.input-field');
    const minRate = parseFloat(String(inputs[0].value || '').replace(',', '.')) || 0;
    const maxRate = parseFloat(String(inputs[1].value || '').replace(',', '.')) || minRate;
    const commissionRate = (Math.max(minRate, maxRate) || 0) / 100;
    const partner = FTECHDB.getPartners().find(p => p.name === partnerName);

    if (!partner || commissionRate <= 0) {
      showToast('Vui lòng chọn đối tác và nhập tỷ lệ hoa hồng hợp lệ.', 'warn');
      return;
    }

    partner.commissionRate = commissionRate;
    partner.commission = `${minRate}-${maxRate}%`;
    FTECHDB.savePartner(partner);
    showToast('Đã lưu tỷ lệ hoa hồng mới và ghi log thay đổi commission.', 'success');
    window.closeAffiliateModal('commissionModal');
    renderAll();
  };

  window.closeAffiliateModal = function (id) {
    document.getElementById(id).classList.remove('open');
  };

  // --- BUSINESS LOGIC ---

  function enrichSeedAffiliates() {
    const affiliates = FTECHDB.getAffiliates();
    let hasChanges = false;

    // Enrich aff-1
    const a1 = affiliates.find(a => a.id === 'aff-1');
    if (a1 && !a1.name) {
      a1.name = 'iPhone 16 Pro Max - Shopee';
      a1.attachedPost = 'Review iPhone 16 Pro Max: Đáng mua không năm 2026?';
      a1.status = 'active';
      a1.cvr = '6.8%';
      a1.commission = '4-8%';
      a1.date = '21/03/2026';
      a1.image = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=120&q=80';
      a1.author = 'Nguyễn Tuấn Anh';
      FTECHDB.saveAffiliate(a1);
      hasChanges = true;
    }

    // Enrich aff-2
    const a2 = affiliates.find(a => a.id === 'aff-2');
    if (a2 && !a2.name) {
      a2.name = 'Laptop ASUS ROG - Lazada';
      a2.attachedPost = 'Top 5 Laptop Gaming tầm trung tốt nhất 2026';
      a2.status = 'active';
      a2.cvr = '5.2%';
      a2.commission = '3-6%';
      a2.date = '18/03/2026';
      a2.image = 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=120&q=80';
      a2.author = 'Trương Thị Kiều Nhi';
      FTECHDB.saveAffiliate(a2);
      hasChanges = true;
    }

    // Seed aff-3 (error link)
    if (!affiliates.find(a => a.id === 'aff-3')) {
      FTECHDB.saveAffiliate({
        id: 'aff-3',
        partner: 'Tiki Trading',
        type: 'Link lỗi',
        url: 'https://tiki.vn/go/sony-xm5-404-error',
        clicks: 320,
        name: 'Sony WH-1000XM5 - Tiki',
        attachedPost: 'So sánh AirPods Pro 2 vs Sony WH-1000XM5: Chọn cái nào?',
        status: 'error',
        cvr: '0%',
        commission: '2-5%',
        date: '02/03/2026',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=120&q=80',
        author: 'Võ Minh Hoàng',
        note: 'Link trỏ đến trang sản phẩm đã bị gỡ'
      });
      hasChanges = true;
    }

    // Seed aff-4 (active link)
    if (!affiliates.find(a => a.id === 'aff-4')) {
      FTECHDB.saveAffiliate({
        id: 'aff-4',
        partner: 'Shopee Affiliate',
        type: 'Link mua chính',
        url: 'https://shopee.vn/product/airpods-pro-2',
        clicks: 654,
        name: 'AirPods Pro 2 - Shopee',
        attachedPost: 'So sánh AirPods Pro 2 vs Sony WH-1000XM5: Chọn cái nào?',
        status: 'active',
        cvr: '5.8%',
        commission: '4-8%',
        date: '16/03/2026',
        image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=120&q=80',
        author: 'Phạm Thái Bảo'
      });
      hasChanges = true;
    }

    // Seed aff-5 (inactive link)
    if (!affiliates.find(a => a.id === 'aff-5')) {
      FTECHDB.saveAffiliate({
        id: 'aff-5',
        partner: 'Lazada Partner',
        type: 'Link nháp',
        url: 'https://lazada.vn/s24-ultra',
        clicks: 0,
        name: 'Samsung S24 Ultra - Lazada',
        attachedPost: 'Apple Watch Series 10 — Có gì mới? Có nên nâng cấp không?',
        status: 'inactive',
        cvr: '0%',
        commission: '3-6%',
        date: '05/03/2026',
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=120&q=80',
        author: 'Super Admin'
      });
      hasChanges = true;
    }
  }

  function renderAll() {
    const affiliates = FTECHDB.getAffiliates();
    const clickLogs = FTECHDB.getClickLogs();
    const posts = FTECHDB.getPosts();
    const partners = FTECHDB.getPartners();

    // 1. Stats and metrics calculations
    const totalCount = affiliates.length;
    const errorCount = affiliates.filter(a => a.status === 'error').length;
    const activeCount = affiliates.filter(a => a.status === 'active').length;
    const productCount = affiliates.length; // all are products
    const postAttachedCount = affiliates.filter(a => a.attachedPost).length;
    
    let totalClicks = 0;
    let sumCtr = 0;
    let ctrCount = 0;
    let totalComm = 0;

    affiliates.forEach(a => {
      const affClicks = clickLogs.filter(log => log.linkId === a.id && log.status === 'valid').length;
      totalClicks += affClicks;

      const post = posts.find(p => p.id === a.postId);
      const partner = partners.find(p => p.id === a.partnerId);
      totalComm += affClicks * (post ? Number(post.price) || 0 : 0) * (partner ? Number(partner.commissionRate) || 0 : 0);

      // Tính CVR realtime từ click logs thay vì hardcoded value
      const postViews = post ? Number(post.views) || 0 : 0;
      if (postViews > 0) {
        sumCtr += (affClicks / postViews) * 100;
        ctrCount++;
      }
    });

    const displayClicks = totalClicks >= 1000 ? `${(totalClicks / 1000).toFixed(1)}K` : totalClicks;
    const displayComm = FTECHDB.formatMoney(totalComm);
    const avgCtr = ctrCount > 0 ? `${(sumCtr / ctrCount).toFixed(1)}%` : '5.0%';

    document.querySelector('.sv-total-links').textContent = totalCount;
    document.querySelector('.sv-total-clicks').textContent = displayClicks;
    document.querySelector('.sv-avg-ctr').textContent = avgCtr;
    document.querySelector('.sv-total-comm').textContent = displayComm;

    // Update filter chips count dynamically
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
      const type = chip.getAttribute('data-filter');
      if (type === 'all') chip.textContent = `Tất cả (${totalCount})`;
      else if (type === 'product') chip.textContent = `Theo sản phẩm (${productCount})`;
      else if (type === 'post') chip.textContent = `Theo bài viết (${postAttachedCount})`;
      else if (type === 'partner') chip.textContent = `Theo đối tác (${totalCount})`;
      else if (type === 'error') chip.textContent = `Lỗi (${errorCount})`;
    });

    // Toggle error warning banner
    const banner = document.querySelector('.warning-banner');
    if (banner) {
      if (errorCount > 0) {
        banner.style.display = 'flex';
        banner.querySelector('.wb-text').innerHTML = `<strong>${errorCount} link affiliate bị lỗi</strong> — Liên kết trỏ đến trang không tồn tại hoặc đã hết hạn. Kiểm tra và cập nhật để tránh mất doanh thu.`;
        banner.querySelector('button').onclick = function () {
          const errChip = Array.from(chips).find(c => c.getAttribute('data-filter') === 'error');
          if (errChip) window.setF(errChip);
        };
      } else {
        banner.style.display = 'none';
      }
    }

    // 2. Filters
    const searchQuery = document.getElementById('searchQuery').value.toLowerCase().trim();
    const filterPartner = document.getElementById('filterPartner').value;
    const filterSort = document.getElementById('filterSort').value;

    let filtered = affiliates.filter(a => {
      // Chip filters
      if (selectedFilter === 'error' && a.status !== 'error') return false;
      if (selectedFilter === 'post' && !a.attachedPost) return false;

      // Partner dropdown filter
      if (filterPartner && a.partner !== filterPartner) return false;

      // Search Query
      if (searchQuery) {
        const nameMatch = (a.name || '').toLowerCase().includes(searchQuery);
        const postMatch = (a.attachedPost || '').toLowerCase().includes(searchQuery);
        const partnerMatch = (a.partner || '').toLowerCase().includes(searchQuery);
        if (!nameMatch && !postMatch && !partnerMatch) return false;
      }

      return true;
    });

    // 3. Sort list
    if (filterSort === 'clicks') {
      filtered.sort((a, b) => b.clicks - a.clicks);
    } else if (filterSort === 'newest') {
      filtered.sort((a, b) => {
        const da = new Date(a.date.split('/').reverse().join('-'));
        const db = new Date(b.date.split('/').reverse().join('-'));
        return db - da;
      });
    }

    // 4. Render Table
    const tbody = document.getElementById('affiliatesTableBody');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <div class="t-row t-empty">
          <div class="empty-cell">📭 Không tìm thấy link affiliate nào khớp bộ lọc.</div>
        </div>
      `;
      document.querySelector('.pag-info').textContent = `Hiển thị 0 / ${affiliates.length} links`;
      return;
    }

    tbody.innerHTML = filtered.map(a => {
      const isError = a.status === 'error';
      const isInactive = a.status === 'inactive';
      
      const rowClass = isError ? 't-row u-style-048' : isInactive ? 't-row u-style-050' : 't-row';
      const statusLabel = isError ? 'Link 404' : isInactive ? 'Tắt' : 'Hoạt động';
      const statusClass = isError ? 's-error' : isInactive ? 's-inactive' : 's-active';
      const titleSpan = isError ? `${a.name} <span class="u-style-049">LINK LỖI</span>` : a.name;
      const urlClass = isError ? 'link-url u-style-046' : 'link-url';
      
      const affClicks = clickLogs.filter(log => log.linkId === a.id && log.status === 'valid').length;
      const clicksDisplay = affClicks.toLocaleString();
      const conversions = isError || isInactive ? '-' : `${(affClicks * 0.05).toFixed(1)}%`;

      // Tính CVR realtime từ click logs
      const postForCvr = posts.find(p => p.id === a.postId);
      const postViewsForCvr = postForCvr ? Number(postForCvr.views) || 0 : 0;
      const computedCvr = (isError || isInactive || postViewsForCvr === 0) ? '0%' : `${((affClicks / postViewsForCvr) * 100).toFixed(1)}%`;

      // Actions buttons
      let actionButtons = '';
      if (isError) {
        actionButtons = `
          <button class="act" onclick="openAffiliateModal('repair', '${a.id}')" title="Sửa lỗi link">🔧</button>
          <button class="act" onclick="openAffiliateModal('edit', '${a.id}')" title="Sửa chi tiết">✏️</button>
          <button class="act" onclick="doDeleteAffiliate('${a.id}')" title="Xóa">🗑️</button>
        `;
      } else {
        actionButtons = `
          <button class="act" onclick="openAffiliateModal('edit', '${a.id}')" title="Sửa chi tiết">✏️</button>
          <button class="act" onclick="openCommissionModal('${a.partner}')" title="Cấu hình hoa hồng">⚙</button>
          <button class="act" onclick="doDeleteAffiliate('${a.id}')" title="Xóa">🗑️</button>
        `;
      }

      return `
        <div class="${rowClass}">
          <div>
            <div class="link-title">
              <a class="product-link" href="product.html">
                <img class="product-thumb" src="${a.image || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=120&q=80'}" alt="${a.name}">
                <span>${titleSpan}</span>
              </a>
            </div>
            <div class="${urlClass}">${a.url}</div>
            <div class="link-tags">
              <span class="ltag">${a.partner}</span>
              <span class="ltag">Tác giả: ${a.author || 'Super Admin'}</span>
            </div>
          </div>
          <div class="cell-muted">${a.partner.split(' ')[0]}</div>
          <div class="cell-muted">${a.attachedPost ? a.attachedPost.substring(0, 30) + '...' : '-'}</div>
          <div class="metric-g">${clicksDisplay}</div>
          <div class="metric-a">${computedCvr}</div>
          <div class="cell-muted">${a.date}</div>
          <div class="metric-a">${a.commission}</div>
          <div><span class="${statusClass}">${statusLabel}</span></div>
          <div class="row-acts">${actionButtons}</div>
        </div>
      `;
    }).join('');

    document.querySelector('.pag-info').textContent = `Hiển thị 1-${filtered.length} / ${filtered.length} links`;
  }
});
