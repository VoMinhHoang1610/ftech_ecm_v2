(function() {
  const db = window.FTECHDB;
  const allPosts = db.getPosts().filter(p => p.status === 'approved');
  const state = { query: '', category: 'all', brand: 'all', sort: 'newest' };

  const CATEGORY_MAP = {
    'dien-thoai': { label: 'Điện thoại', keywords: ['iphone', 'dien thoai', 'samsung', 'xiaomi', 'galaxy', 'phone'] },
    'laptop': { label: 'Laptop & PC', keywords: ['laptop', 'macbook', 'asus', 'dell', 'lenovo', 'pc', 'notebook'] },
    'man-hinh': { label: 'Màn hình', keywords: ['man hinh', 'monitor', 'display'] },
    'tv': { label: 'TV & giải trí', keywords: ['tv', 'giai tri', 'oled', 'lg', 'tivi'] },
    'tai-nghe': { label: 'Tai nghe', keywords: ['tai nghe', 'headphone', 'airpods', 'sony', 'jbl', 'wh-1000', 'wf-1000', 'earbuds'] },
    'may-anh': { label: 'Máy ảnh', keywords: ['may anh', 'camera', 'canon', 'nikon', 'fuji', 'eos'] },
    'dong-ho': { label: 'Đồng hồ', keywords: ['dong ho', 'watch', 'garmin', 'apple watch'] },
    'gaming': { label: 'Gaming', keywords: ['gaming', 'rog', 'game', 'ps5', 'xbox'] },
    'loa': { label: 'Loa & âm thanh', keywords: ['loa', 'speaker', 'am thanh', 'soundbar'] },
    'smarthome': { label: 'Smarthome', keywords: ['smarthome', 'smart home', 'iot'] }
  };

  function normalizeText(value) {
    return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function getProductText(p) {
    return normalizeText([p.title, p.name, p.brand, p.category, p.excerpt, p.content, (p.tags || []).join(' ')].join(' '));
  }

  function matchesCategory(product) {
    if (state.category === 'all') return true;
    const catConfig = CATEGORY_MAP[state.category];
    if (!catConfig) return true;
    const text = getProductText(product);
    const tags = (product.tags || []).map(t => normalizeText(t));
    if (tags.includes(state.category)) return true;
    return catConfig.keywords.some(kw => text.includes(kw));
  }

  function matchesBrand(product) {
    if (state.brand === 'all') return true;
    return normalizeText(product.brand) === normalizeText(state.brand);
  }

  function matchesQuery(product) {
    if (!state.query) return true;
    return getProductText(product).includes(normalizeText(state.query));
  }

  function sortProducts(products) {
    const sorted = products.slice();
    switch(state.sort) {
      case 'views': return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
      case 'rating': return sorted.sort((a, b) => (b.stars || 0) - (a.stars || 0));
      case 'price-low': return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high': return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      default:
        return sorted.sort((a, b) => {
          const dateA = new Date(String(a.date || '').split('/').reverse().join('-'));
          const dateB = new Date(String(b.date || '').split('/').reverse().join('-'));
          return dateB - dateA;
        });
    }
  }

  function makeLabel(t) {
    if (!t) return '';
    const map = {sale:'label-sale', new:'label-new', hot:'label-hot'};
    const txt = {sale:'SALE', new:'MỚI', hot:'HOT'};
    return `<div class="prod-labels"><span class="label ${map[t]}">${txt[t]}</span></div>`;
  }

  function makeCard(p) {
    const displayName = p.title || p.name || 'Sản phẩm công nghệ';
    const displayPrice = p.price ? db.formatMoney(p.price) : '';
    const displayOldPrice = p.oldPrice ? db.formatMoney(p.oldPrice) : '';
    const displayDiscount = typeof p.discount === 'number' ? `-${p.discount}%` : (p.discount || '');

    return `<div class="prod-card">
      <div class="prod-img">${makeLabel(p.label)}<div class="prod-fav">♡</div><img src="${p.image}" alt="${displayName}"></div>
      <div class="prod-body">
        <div class="prod-brand">${p.brand || 'FTECH'}</div>
        <div class="prod-category">${p.category || ''}</div>
        <div class="prod-name">${displayName}</div>
        <div class="prod-excerpt">${p.excerpt || ''}</div>
        <div class="prod-stars"><span class="stars">${'⭐'.repeat(Math.round(p.stars || 5))}</span>${p.reviews ? `<span class="reviews">(${p.reviews.toLocaleString()} đánh giá)</span>` : ''}</div>
        <div class="prod-price-row">
          ${displayPrice ? `<span class="prod-price-new">${displayPrice}</span>` : '<span class="prod-price-new" style="color:var(--body);font-size:14px">Xem chi tiết</span>'}
          ${displayOldPrice ? `<span class="prod-price-old">${displayOldPrice}</span>` : ''}
          ${displayDiscount ? `<span class="prod-discount">${displayDiscount}</span>` : ''}
        </div>
        <a class="prod-add" href="product.html?id=${p.id}">Xem đánh giá & nơi mua</a>
      </div>
    </div>`;
  }

  function render() {
    const filtered = sortProducts(allPosts.filter(p => matchesCategory(p) && matchesBrand(p) && matchesQuery(p)));
    const grid = document.getElementById('productsGrid');
    const count = document.getElementById('resultsCount');

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="product-empty">
        <div class="empty-icon">🔍</div>
        <strong>Không tìm thấy sản phẩm phù hợp</strong>
        <span>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</span>
      </div>`;
    } else {
      grid.innerHTML = filtered.map(makeCard).join('');
    }

    if (count) {
      count.innerHTML = `Hiển thị <strong>${filtered.length}</strong> / ${allPosts.length} sản phẩm${state.query ? ` cho "${state.query}"` : ''}`;
    }

    // update stats
    const statEls = document.querySelectorAll('.page-hero-stat strong');
    if (statEls.length >= 3) {
      statEls[0].textContent = allPosts.length + '+';
      const brands = [...new Set(allPosts.map(p => p.brand).filter(Boolean))];
      statEls[1].textContent = brands.length + '+';
    }
  }

  function initFromURL() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (category && CATEGORY_MAP[category]) {
      state.category = category;
      // Set active tab
      document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.cat === category);
      });
      // Update page title
      const heroTitle = document.querySelector('.page-hero h1');
      if (heroTitle) heroTitle.textContent = CATEGORY_MAP[category].label;
    }
  }

  // Build category tabs dynamically
  function buildTabs() {
    const container = document.getElementById('categoryTabs');
    if (!container) return;
    let html = `<button class="filter-tab${state.category === 'all' ? ' active' : ''}" data-cat="all">Tất cả</button>`;
    for (const [key, val] of Object.entries(CATEGORY_MAP)) {
      html += `<button class="filter-tab${state.category === key ? ' active' : ''}" data-cat="${key}">${val.label}</button>`;
    }
    container.innerHTML = html;

    container.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', function() {
        container.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        state.category = this.dataset.cat;
        render();
      });
    });
  }

  // Build brand select
  function buildBrandSelect() {
    const select = document.getElementById('brandFilter');
    if (!select) return;
    const brands = [...new Set(allPosts.map(p => p.brand).filter(Boolean))].sort();
    let html = '<option value="all">Tất cả thương hiệu</option>';
    brands.forEach(b => { html += `<option value="${b}">${b}</option>`; });
    select.innerHTML = html;
  }

  // Event listeners
  function bindEvents() {
    const searchInput = document.getElementById('searchInput');
    const brandFilter = document.getElementById('brandFilter');
    const sortFilter = document.getElementById('sortFilter');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput) {
      searchInput.addEventListener('keypress', e => { if (e.key === 'Enter') { state.query = searchInput.value.trim(); render(); } });
    }
    if (searchBtn) {
      searchBtn.addEventListener('click', () => { state.query = (searchInput || {}).value?.trim() || ''; render(); });
    }
    if (brandFilter) {
      brandFilter.addEventListener('change', () => { state.brand = brandFilter.value; render(); });
    }
    if (sortFilter) {
      sortFilter.addEventListener('change', () => { state.sort = sortFilter.value; render(); });
    }
  }

  // Init
  initFromURL();
  buildTabs();
  buildBrandSelect();
  bindEvents();
  render();
})();
