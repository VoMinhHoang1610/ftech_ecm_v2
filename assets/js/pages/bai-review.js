(function() {
  const db = window.FTECHDB;
  const allPosts = db.getPosts().filter(p => p.status === 'approved');
  let currentFilter = 'all';

  const TAG_STYLES = {
    'Review': 'tag-review',
    'So sánh': 'tag-so-sanh',
    'Hướng dẫn': 'tag-huong-dan',
    'Top list': 'tag-top-list',
    'Mẹo hay': 'tag-meo-hay',
    'Tin tức': 'tag-tin-tuc'
  };

  function getTagClass(category) {
    return TAG_STYLES[category] || 'tag-review';
  }

  function formatViews(views) {
    if (!views) return '0';
    if (views >= 1000) return (views / 1000).toFixed(1).replace('.0', '') + 'K';
    return String(views);
  }

  function estimateReadTime(content) {
    if (!content) return '3 phút đọc';
    const words = content.split(/\s+/).length;
    const minutes = Math.max(3, Math.ceil(words / 200));
    return `${minutes} phút đọc`;
  }

  function filterPosts() {
    if (currentFilter === 'all') return allPosts;
    return allPosts.filter(p => p.category === currentFilter);
  }

  function renderFeatured() {
    const posts = filterPosts();
    const featured = posts[0];
    const container = document.getElementById('featuredCard');
    if (!featured || !container) return;

    container.innerHTML = `
      <a href="product.html?id=${featured.id}" class="featured-card">
        <div class="featured-img"><img src="${featured.image}" alt="${featured.title}"></div>
        <div class="featured-body">
          <span class="featured-tag ${getTagClass(featured.category)}">${featured.category}</span>
          <div class="featured-title">${featured.title}</div>
          <div class="featured-excerpt">${featured.excerpt || featured.content || ''}</div>
          <div class="featured-meta">
            <span>${featured.brand || 'FTECH'}</span>
            <span>${featured.date || ''}</span>
            <span>${estimateReadTime(featured.content)}</span>
            <span>${formatViews(featured.views)} lượt xem</span>
          </div>
        </div>
      </a>
    `;
  }

  function renderArticles() {
    const posts = filterPosts();
    const rest = posts.slice(1); // skip featured
    const grid = document.getElementById('articlesGrid');
    if (!grid) return;

    if (rest.length === 0) {
      grid.innerHTML = `<div class="articles-empty">
        <div class="empty-icon">📝</div>
        <strong>Chưa có bài viết trong danh mục này</strong>
        <span>Hãy thử chọn danh mục khác hoặc quay lại "Tất cả".</span>
      </div>`;
      return;
    }

    grid.innerHTML = rest.map(p => `
      <div class="article-card" onclick="window.location='product.html?id=${p.id}'">
        <div class="article-img">
          <img src="${p.image}" alt="${p.title}">
          <span class="article-tag ${getTagClass(p.category)}">${p.category}</span>
        </div>
        <div class="article-body">
          <div class="article-brand">${p.brand || 'FTECH'}</div>
          <div class="article-title">${p.title}</div>
          <div class="article-excerpt">${p.excerpt || ''}</div>
          <div class="article-footer">
            <span class="article-meta">${p.date || ''} · ${estimateReadTime(p.content)}</span>
            <span class="article-views">${formatViews(p.views)} views</span>
          </div>
          <a class="article-cta" href="product.html?id=${p.id}">Đọc bài viết →</a>
        </div>
      </div>
    `).join('');
  }

  function render() {
    renderFeatured();
    renderArticles();
    // Update count
    const count = document.getElementById('articlesCount');
    if (count) {
      const filtered = filterPosts();
      count.textContent = `${filtered.length} bài viết`;
    }
  }

  function buildTabs() {
    const container = document.getElementById('reviewTabs');
    if (!container) return;

    const categories = ['all', ...new Set(allPosts.map(p => p.category).filter(Boolean))];
    const labels = { 'all': 'Tất cả', 'Review': 'Review', 'So sánh': 'So sánh', 'Hướng dẫn': 'Hướng dẫn', 'Top list': 'Top list', 'Mẹo hay': 'Mẹo hay', 'Tin tức': 'Tin tức' };

    container.innerHTML = categories.map(cat => {
      const count = cat === 'all' ? allPosts.length : allPosts.filter(p => p.category === cat).length;
      return `<button class="filter-tab${currentFilter === cat ? ' active' : ''}" data-cat="${cat}">${labels[cat] || cat} (${count})</button>`;
    }).join('');

    container.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', function() {
        container.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.cat;
        render();
      });
    });
  }

  // Init
  buildTabs();
  render();

  // Update hero stats
  const statEls = document.querySelectorAll('.page-hero-stat strong');
  if (statEls.length >= 3) {
    statEls[0].textContent = allPosts.length + '+';
    const cats = [...new Set(allPosts.map(p => p.category).filter(Boolean))];
    statEls[1].textContent = cats.length + '+';
    const totalViews = allPosts.reduce((s, p) => s + (p.views || 0), 0);
    statEls[2].textContent = formatViews(totalViews);
  }
})();
