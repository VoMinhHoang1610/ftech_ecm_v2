const flashProducts = [
  { image:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80', brand:'Shopee Mall', name:'iPhone 16 Pro Max - gia tham khao hom nay', price:'29.990.000d', old:'31.490.000d', discount:'-5%', label:'hot', stars:5 },
  { image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', brand:'Lazada Mall', name:'WH-1000XM5 - doi tac co voucher tot', price:'6.490.000d', old:'6.990.000d', discount:'-7%', label:'new', stars:5 },
  { image:'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80', brand:'FTECH Picks', name:'ROG Zephyrus G14 - deal tot cho gaming', price:'31.990.000d', old:'33.500.000d', discount:'-4%', label:'sale', stars:4 },
  { image:'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80', brand:'Tiki Trading', name:'Apple Watch Series 10 - doi tac con hang', price:'10.990.000d', old:'11.590.000d', discount:'-5%', label:'new', stars:5 },
  { image:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80', brand:'CameraHouse', name:'EOS R50 - uu dai combo phu kien', price:'18.490.000d', old:'19.290.000d', discount:'-4%', label:'sale', stars:5 },
];

const mainProducts = window.FTECHDB.getPosts().filter(p => p.status === 'approved');
const brands = ['Apple','Samsung','Sony','Asus','Dell','LG','Xiaomi','Lenovo','JBL','Logitech','Canon','Garmin'];
const searchState = { query: '', tab: 'all', brand: '', sort: 'newest' };

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function makeLabel(t) {
  if (!t) return '';
  const map = {sale:'label-sale',new:'label-new',hot:'label-hot'};
  const txt = {sale:'SALE',new:'MOI',hot:'HOT'};
  return `<div class="prod-labels"><span class="label ${map[t]}">${txt[t]}</span></div>`;
}

function makeCard(p) {
  const displayName = p.name || p.title || 'San pham cong nghe';
  const displayId = p.id || 'post-1';
  const displayPrice = typeof p.price === 'number' ? window.FTECHDB.formatMoney(p.price) : p.price;
  const displayOldPrice = p.old || (p.oldPrice ? window.FTECHDB.formatMoney(p.oldPrice) : '');
  const displayDiscount = typeof p.discount === 'number' ? `-${p.discount}%` : p.discount;
  return `<div class="prod-card">
    <div class="prod-img">${makeLabel(p.label)}<div class="prod-fav">*</div><img src="${p.image}" alt="${displayName}"></div>
    <div class="prod-body">
      <div class="prod-brand">${p.brand || 'FTECH'}</div>
      <div class="prod-name">${displayName}</div>
      <div class="prod-stars"><span class="stars">${'*'.repeat(Math.round(p.stars || 5))}</span>${p.reviews?`<span class="reviews">(${p.reviews.toLocaleString()})</span>`:''}</div>
      <div class="prod-price-row">
        <span class="prod-price-new">${displayPrice}</span>
        ${displayOldPrice?`<span class="prod-price-old">${displayOldPrice}</span>`:''}
        ${displayDiscount?`<span class="prod-discount">${displayDiscount}</span>`:''}
      </div>
      <a class="prod-add" href="product.html?id=${displayId}">Xem review & noi mua</a>
    </div>
  </div>`;
}

function getProductText(product) {
  return normalizeText([
    product.title,
    product.name,
    product.brand,
    product.category,
    product.excerpt,
    product.content
  ].join(' '));
}

function matchesTab(product) {
  if (searchState.tab === 'all') return true;
  const text = getProductText(product);
  const brand = normalizeText(product.brand);
  const rules = {
    phone: ['iphone', 'dien thoai', 'apple', 'samsung', 'xiaomi'],
    laptop: ['laptop', 'macbook', 'asus', 'dell', 'lenovo'],
    headphone: ['tai nghe', 'airpods', 'sony', 'jbl', 'wh-1000xm5'],
    gaming: ['gaming', 'rog', 'game'],
    watch: ['watch', 'dong ho', 'garmin']
  };
  return (rules[searchState.tab] || []).some(keyword => text.includes(keyword) || brand.includes(keyword));
}

function sortProducts(products) {
  const sorted = products.slice();
  if (searchState.sort === 'views') return sorted.sort((a, b) => Number(b.views || 0) - Number(a.views || 0));
  if (searchState.sort === 'rating') return sorted.sort((a, b) => Number(b.stars || 0) - Number(a.stars || 0));
  if (searchState.sort === 'comparison') {
    return sorted.sort((a, b) => Number(normalizeText(b.category).includes('so sanh')) - Number(normalizeText(a.category).includes('so sanh')));
  }
  return sorted.sort((a, b) => {
    const dateA = new Date(String(a.date || '').split('/').reverse().join('-'));
    const dateB = new Date(String(b.date || '').split('/').reverse().join('-'));
    return dateB - dateA;
  });
}

function renderMainProducts() {
  const grid = document.getElementById('mainGrid');
  if (!grid) return;

  const query = normalizeText(searchState.query);
  const brand = normalizeText(searchState.brand);
  const filtered = sortProducts(mainProducts.filter(product => {
    const text = getProductText(product);
    const matchesQuery = !query || text.includes(query);
    const matchesBrand = !brand || normalizeText(product.brand).includes(brand);
    return matchesQuery && matchesBrand && matchesTab(product);
  }));

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="product-empty">
        <strong>Khong tim thay bai review phu hop.</strong>
        <span>Thu tim theo ten san pham, thuong hieu, danh muc hoac mo ta khac.</span>
      </div>
    `;
  } else {
    grid.innerHTML = filtered.map(makeCard).join('');
  }

  const result = document.getElementById('searchResultText');
  if (result) {
    const suffix = searchState.query ? ` cho "${searchState.query}"` : '';
    result.textContent = `Dang hien thi ${filtered.length}/${mainProducts.length} bai review${suffix}.`;
  }
}

function scrollToProducts() {
  document.getElementById('s-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function runHeaderSearch() {
  const input = document.querySelector('.header-search input');
  searchState.query = input ? input.value.trim() : '';
  renderMainProducts();
  scrollToProducts();
}

function runFinderSearch() {
  const finderInput = document.querySelector('.finder-input');
  const selects = document.querySelectorAll('.finder-select');
  const brandValue = selects[0] && selects[0].selectedIndex > 0 ? selects[0].value : '';
  const sortValue = selects[1] ? selects[1].selectedIndex : 0;
  searchState.query = finderInput ? finderInput.value.trim() : '';
  searchState.brand = brandValue;
  searchState.sort = ['newest', 'views', 'rating', 'comparison'][sortValue] || 'newest';
  renderMainProducts();
  scrollToProducts();
}

document.getElementById('flashGrid').innerHTML = flashProducts.map(makeCard).join('');
renderMainProducts();
document.getElementById('brandsTrack').innerHTML = [...brands,...brands].map(b=>`<div class="brand-item">${b}</div>`).join('');

document.querySelectorAll('.tab').forEach((tab, index) => tab.addEventListener('click', function() {
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  this.classList.add('active');
  searchState.tab = ['all', 'phone', 'laptop', 'headphone', 'gaming', 'watch'][index] || 'all';
  renderMainProducts();
}));

let secs = 8*3600+24*60+55;
function updateTimer() {
  const h=String(Math.floor(secs/3600)).padStart(2,'0');
  const m=String(Math.floor((secs%3600)/60)).padStart(2,'0');
  const s=String(secs%60).padStart(2,'0');
  const el=document.getElementById('flash-timer');
  if(el) el.textContent=`${h}:${m}:${s}`;
  if(secs>0) secs--;
}
setInterval(updateTimer, 1000); updateTimer();

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);} });
}, {threshold:0.08});
document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

const si = document.querySelector('.header-search input');
if (si) si.addEventListener('keypress', e => { if(e.key==='Enter') runHeaderSearch(); });
document.querySelector('.header-search button')?.addEventListener('click', runHeaderSearch);
document.querySelector('.finder-go')?.addEventListener('click', runFinderSearch);
document.querySelector('.finder-input')?.addEventListener('keypress', e => { if(e.key==='Enter') runFinderSearch(); });
document.querySelectorAll('.finder-select').forEach(select => select.addEventListener('change', runFinderSearch));
