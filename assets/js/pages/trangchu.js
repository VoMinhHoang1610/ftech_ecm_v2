const flashProducts = [
  { image:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80', brand:'Shopee Mall', name:'iPhone 16 Pro Max - giá tham khảo hôm nay', price:'29.990.000₫', old:'31.490.000₫', discount:'-5%', label:'hot', stars:5 },
  { image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', brand:'Lazada Mall', name:'WH-1000XM5 - đối tác có voucher tốt', price:'6.490.000₫', old:'6.990.000₫', discount:'-7%', label:'new', stars:5 },
  { image:'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80', brand:'FTECH Picks', name:'ROG Zephyrus G14 - deal tốt cho gaming', price:'31.990.000₫', old:'33.500.000₫', discount:'-4%', label:'sale', stars:4 },
  { image:'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80', brand:'Tiki Trading', name:'Apple Watch Series 10 - đối tác còn hàng', price:'10.990.000₫', old:'11.590.000₫', discount:'-5%', label:'new', stars:5 },
  { image:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80', brand:'CameraHouse', name:'EOS R50 - ưu đãi combo phụ kiện', price:'18.490.000₫', old:'19.290.000₫', discount:'-4%', label:'sale', stars:5 },
];
const mainProducts = window.FTECHDB.getPosts().filter(p => p.status === 'approved');
const brands = ['Apple','Samsung','Sony','Asus','Dell','LG','Xiaomi','Lenovo','JBL','Logitech','Canon','Garmin'];

function makeLabel(t) {
  if (!t) return '';
  const map = {sale:'label-sale',new:'label-new',hot:'label-hot'};
  const txt = {sale:'SALE',new:'MỚI',hot:'HOT'};
  return `<div class="prod-labels"><span class="label ${map[t]}">${txt[t]}</span></div>`;
}
function makeCard(p) {
  const displayName = p.name || p.title || 'Sản phẩm công nghệ';
  const displayId = p.id || 'post-1';
  const displayPrice = typeof p.price === 'number' ? window.FTECHDB.formatMoney(p.price) : p.price;
  const displayOldPrice = p.old || (p.oldPrice ? window.FTECHDB.formatMoney(p.oldPrice) : '');
  const displayDiscount = typeof p.discount === 'number' ? `-${p.discount}%` : p.discount;
  return `<div class="prod-card">
    <div class="prod-img">${makeLabel(p.label)}<div class="prod-fav">🤍</div><img src="${p.image}" alt="${displayName}"></div>
    <div class="prod-body">
      <div class="prod-brand">${p.brand || 'FTECH'}</div>
      <div class="prod-name">${displayName}</div>
      <div class="prod-stars"><span class="stars">${'⭐'.repeat(Math.round(p.stars || 5))}</span>${p.reviews?`<span class="reviews">(${p.reviews.toLocaleString()})</span>`:''}</div>
      <div class="prod-price-row">
        <span class="prod-price-new">${displayPrice}</span>
        ${displayOldPrice?`<span class="prod-price-old">${displayOldPrice}</span>`:''}
        ${displayDiscount?`<span class="prod-discount">${displayDiscount}</span>`:''}
      </div>
      <a class="prod-add" href="product.html?id=${displayId}">Xem review & nơi mua</a>
    </div>
  </div>`;
}

document.getElementById('flashGrid').innerHTML = flashProducts.map(makeCard).join('');
document.getElementById('mainGrid').innerHTML  = mainProducts.map(makeCard).join('');
document.getElementById('brandsTrack').innerHTML = [...brands,...brands].map(b=>`<div class="brand-item">${b}</div>`).join('');

document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', function() {
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  this.classList.add('active');
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
si.addEventListener('keypress', e => { if(e.key==='Enter'&&si.value.trim()) alert('Tìm: '+si.value); });
document.querySelector('.header-search button').addEventListener('click', () => { if(si.value.trim()) alert('Tìm: '+si.value); });
