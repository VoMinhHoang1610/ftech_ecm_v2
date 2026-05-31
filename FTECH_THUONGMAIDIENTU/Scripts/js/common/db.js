(function () {
  // --- DEFAULT SEED DATA ---
  const DEFAULT_ACCOUNTS = [
    { username: 'admin', password: '123', role: 'admin', name: 'Nguyễn Minh Vỹ', avatar: '⚙️' },
    { username: 'content', password: '123', role: 'content', name: 'Trương Thị Kiều Nhi', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
    { username: 'partner', password: '123', role: 'partner', name: 'Võ Minh Hoàng', avatar: '🤝' },
    { username: 'customer', password: '123', role: 'customer', name: 'Nguyễn Minh Vỹ', avatar: '👨' }
  ];

  const DEFAULT_POSTS = [
    {
      id: 'post-1',
      title: 'Review iPhone 16 Pro Max: Đáng mua không năm 2026?',
      category: 'Review',
      status: 'approved',
      views: 12400,
      date: '14/03/2026',
      author: 'Trương Thị Kiều Nhi',
      excerpt: 'Sau 3 tháng trải nghiệm thực tế với công việc đồ hoạ nặng, chúng tôi tổng hợp đánh giá toàn diện về iPhone 16 Pro Max...',
      content: 'Nội dung chi tiết review sản phẩm iPhone 16 Pro Max với camera đột phá, hiệu năng chip A18 Pro mạnh mẽ và thời lượng pin được cải thiện rõ rệt so với đời trước.',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80',
      brand: 'Apple',
      price: '34.990.000₫',
      old: '39.900.000₫',
      discount: '-12%',
      label: 'new',
      stars: 5,
      reviews: 1240
    },
    {
      id: 'post-2',
      title: 'So sánh AirPods Pro 2 vs Sony WH-1000XM5: Chọn cái nào?',
      category: 'So sánh',
      status: 'approved',
      views: 8100,
      date: '10/03/2026',
      author: 'Trương Thị Kiều Nhi',
      excerpt: 'Nên chọn tai nghe in-ear chống ồn tốt của Apple hay mẫu chụp tai đẳng cấp của Sony ở tầm giá này?',
      content: 'Bài viết phân tích ưu nhược điểm của hai đối thủ nặng ký trong thế giới âm thanh chống ồn di động cao cấp.',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
      brand: 'Apple',
      price: '6.490.000₫',
      old: null,
      discount: null,
      label: 'new',
      stars: 5,
      reviews: 920
    },
    {
      id: 'post-3',
      title: 'Top 5 Laptop Gaming tầm trung tốt nhất 2026',
      category: 'Top list',
      status: 'pending',
      views: 0,
      date: '18/03/2026',
      author: 'Trương Thị Kiều Nhi',
      excerpt: 'Danh sách 5 mẫu laptop gaming cấu hình cực mạnh, tản mát, giá dưới 30 triệu đáng cân nhắc.',
      content: 'Tổng hợp danh sách các laptop gaming từ Asus, Acer, MSI, Lenovo có hiệu năng tản nhiệt tốt nhất và giá trị sử dụng cao.',
      image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=900&q=80',
      brand: 'Asus',
      price: '28.990.000₫',
      old: '31.500.000₫',
      discount: '-8%',
      label: 'sale',
      stars: 4,
      reviews: 380
    },
    {
      id: 'post-4',
      title: 'Apple Watch Series 10 — Có gì mới? Có nên nâng cấp không?',
      category: 'Review',
      status: 'pending',
      views: 0,
      date: '19/03/2026',
      author: 'Trương Thị Kiều Nhi',
      excerpt: 'Đánh giá chi tiết mẫu đồng hồ mới của Apple với thiết kế mỏng hơn và màn hình rộng hơn.',
      content: 'Nội dung phân tích các cảm biến sức khỏe mới và công nghệ sạc siêu nhanh của Apple Watch Series 10.',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80',
      brand: 'Apple',
      price: '10.990.000₫',
      old: null,
      discount: null,
      label: 'new',
      stars: 5,
      reviews: 160
    },
    {
      id: 'post-5',
      title: 'Hướng dẫn chọn tai nghe gaming 2026 — bản nháp',
      category: 'Hướng dẫn',
      status: 'draft',
      views: 0,
      date: '21/03/2026',
      author: 'Trương Thị Kiều Nhi',
      excerpt: 'Cách lựa chọn tai nghe gaming có âm trường tốt, độ trễ thấp và micro đàm thoại rõ nét.',
      content: 'Hướng dẫn từ A đến Z giúp game thủ lựa chọn dòng tai nghe có dây và không dây phù hợp nhất cho nhu cầu bắn súng FPS và chơi game AAA.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      brand: 'Sony',
      price: '3.490.000₫',
      old: null,
      discount: null,
      label: 'new',
      stars: 5,
      reviews: 120
    },
    {
      id: 'post-6',
      title: 'MacBook Air M3 so với Dell XPS 13 — bản nháp',
      category: 'So sánh',
      status: 'draft',
      views: 0,
      date: '25/03/2026',
      author: 'Trương Thị Kiều Nhi',
      excerpt: 'Đối chiếu hai mẫu laptop Ultrabook mỏng nhẹ, pin trâu và màn hình xuất sắc nhất năm 2026.',
      content: 'So sánh hiệu năng chip M3 và Intel Core Ultra 7 trên hai đối thủ nặng ký nhất của dòng laptop siêu di động.',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
      brand: 'Dell',
      price: '38.990.000₫',
      old: '42.000.000₫',
      discount: '-7%',
      label: 'sale',
      stars: 4,
      reviews: 240
    },
    {
      id: 'post-7',
      title: 'Gaming PC Build dưới 15 triệu — Cấu hình mạnh nhất 2026',
      category: 'Hướng dẫn',
      status: 'rejected',
      views: 0,
      date: '17/03/2026',
      author: 'Trương Thị Kiều Nhi',
      excerpt: 'Cấu hình PC gaming lắp ráp giá cực rẻ nhưng cân tốt mọi game eSports và văn phòng.',
      content: 'Nội dung hướng dẫn lựa chọn linh kiện cũ và mới để xây dựng một dàn máy tính bàn giá cực tiết kiệm mà vẫn chiến mượt Valorant, Liên Minh Huyền Thoại.',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
      brand: 'Custom PC',
      price: '14.500.000₫',
      old: '16.000.000₫',
      discount: '-9%',
      label: 'sale',
      stars: 5,
      reviews: 80,
      rejectReason: 'Lý do từ chối: nội dung chưa đầy đủ, thiếu affiliate link — cần chỉnh sửa và gửi lại'
    }
  ];

  const DEFAULT_REVIEWS = [
    {
      id: 1,
      name: 'Nguyễn Tuấn Anh',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
      date: '12/03/2026',
      stars: 5,
      score: 5,
      title: 'Pin 18 giờ thật sự ấn tượng!',
      text: 'Dùng cả ngày làm việc 10 tiếng vẫn còn 30% pin. Máy mỏng nhẹ, build chắc chắn và phù hợp với học tập, văn phòng. Mình thấy nội dung review của FTECH khá sát trải nghiệm thực tế.',
      helpful: 47,
      hasPhotos: true,
      verified: true,
      criteria: { perf: 5, build: 5, value: 4, service: 5 }
    },
    {
      id: 2,
      name: 'Trương Thị Kiều Nhi',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      date: '08/03/2026',
      stars: 5,
      score: 5,
      title: 'Phù hợp cho học tập và thiết kế nhẹ',
      text: 'Mình dùng Figma và Photoshop cơ bản thấy rất ổn. Máy nhẹ, pin tốt và màn hình đẹp. Điểm trừ là cần thêm hub nếu dùng nhiều thiết bị ngoại vi.',
      helpful: 31,
      hasPhotos: true,
      verified: true,
      criteria: { perf: 5, build: 5, value: 4, service: 5 }
    },
    {
      id: 3,
      name: 'Phạm Thái Bảo',
      avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=120&q=80',
      date: '02/03/2026',
      stars: 4,
      score: 4.2,
      title: 'Tốt nhưng nên lên 16GB RAM nếu làm dev',
      text: 'Máy chạy nhanh và rất yên tĩnh. Tuy nhiên nếu dùng Docker, IntelliJ hoặc workflow nặng hơn thì mình nghĩ nên chọn bản 16GB để thoải mái hơn.',
      helpful: 18,
      hasPhotos: false,
      verified: true,
      criteria: { perf: 4, build: 5, value: 4, service: 5 }
    }
  ];

  const DEFAULT_COMMENTS = [
    {
      id: 1,
      name: 'Lê Hoàng Nam',
      date: '20/03/2026',
      text: 'Bài viết rất rõ ở phần hiệu năng. Nếu được, mình muốn có thêm so sánh giữa bản 8GB và 16GB cho người làm lập trình.'
    },
    {
      id: 2,
      name: 'FTECH Review Team',
      date: '20/03/2026',
      text: 'Bọn mình sẽ bổ sung phần này ở bản cập nhật tiếp theo. Hiện tại nếu bạn code thường xuyên với Docker hoặc nhiều service nền, nên ưu tiên bản 16GB.'
    }
  ];

  const DEFAULT_PARTNERS = [
    { name: 'CellphoneS', desc: 'Đề xuất · Hàng chính hãng · Trả góp 0%', logo: '📱', active: true },
    { name: 'Thế Giới Di Động', desc: 'Chuỗi lớn · Dễ trải nghiệm máy · Hỗ trợ tốt', logo: '🛒', active: true },
    { name: 'Shopee Mall - Apple Store', desc: 'Campaign linh hoạt · Deal tốt săn voucher', logo: '📦', active: true },
    { name: 'Lazada Partner', desc: 'Campaign ngày đôi · Miễn phí vận chuyển', logo: '📘', active: true },
    { name: 'Tiki Trading', desc: 'Hàng chính hãng 100% · Giao siêu nhanh', logo: '🚀', active: true }
  ];

  const DEFAULT_AFFILIATES = [
    { id: 'aff-1', partner: 'Shopee Affiliate', type: 'Link mua chính', url: 'https://shopee.vn/product/ftech-iphone16-promax', clicks: 284 },
    { id: 'aff-2', partner: 'Lazada Partner', type: 'Link so sánh giá', url: 'https://lazada.vn/products/apple-iphone-16-pro-max', clicks: 195 }
  ];

  // --- DB ENGINE INITIALIZER ---
  function initDB() {
    if (!localStorage.getItem('ftech_accounts')) {
      localStorage.setItem('ftech_accounts', JSON.stringify(DEFAULT_ACCOUNTS));
    } else {
      // Ensure that the ready-made demo accounts always exist with password '123'
      const accounts = JSON.parse(localStorage.getItem('ftech_accounts')) || [];
      DEFAULT_ACCOUNTS.forEach(da => {
        const index = accounts.findIndex(a => a.username === da.username);
        if (index === -1) {
          accounts.push(da);
        } else {
          // Keep demo credentials active
          accounts[index].password = da.password;
          accounts[index].role = da.role;
          accounts[index].name = da.name;
          if (!accounts[index].avatar) accounts[index].avatar = da.avatar;
          if (!accounts[index].status) accounts[index].status = 'active';
        }
      });
      localStorage.setItem('ftech_accounts', JSON.stringify(accounts));
    }
    if (!localStorage.getItem('ftech_posts')) {
      localStorage.setItem('ftech_posts', JSON.stringify(DEFAULT_POSTS));
    }
    if (!localStorage.getItem('ftech_reviews')) {
      localStorage.setItem('ftech_reviews', JSON.stringify(DEFAULT_REVIEWS));
    }
    if (!localStorage.getItem('ftech_comments')) {
      localStorage.setItem('ftech_comments', JSON.stringify(DEFAULT_COMMENTS));
    }
    if (!localStorage.getItem('ftech_partners')) {
      localStorage.setItem('ftech_partners', JSON.stringify(DEFAULT_PARTNERS));
    }
    if (!localStorage.getItem('ftech_affiliates')) {
      localStorage.setItem('ftech_affiliates', JSON.stringify(DEFAULT_AFFILIATES));
    }
  }
  initDB();

  // --- API DEFINITIONS ---
  const db = {
    // --- ACCOUNTS ---
    getAccounts() {
      return JSON.parse(localStorage.getItem('ftech_accounts')) || [];
    },
    getAccount(identifier) {
      if (!identifier) return null;
      return this.getAccounts().find(a => 
        (a.username && a.username.toLowerCase() === identifier.toLowerCase()) ||
        (a.email && a.email.toLowerCase() === identifier.toLowerCase())
      );
    },
    saveAccount(account) {
      const accounts = this.getAccounts();
      const index = accounts.findIndex(a => a.username === account.username);
      if (index >= 0) {
        accounts[index] = { ...accounts[index], ...account };
      } else {
        accounts.push(account);
      }
      localStorage.setItem('ftech_accounts', JSON.stringify(accounts));
      return account;
    },
    deleteAccount(username) {
      const accounts = this.getAccounts().filter(a => a.username !== username);
      localStorage.setItem('ftech_accounts', JSON.stringify(accounts));
    },

    // --- POSTS (ARTICLES) ---
    getPosts() {
      return JSON.parse(localStorage.getItem('ftech_posts')) || [];
    },
    getPost(id) {
      return this.getPosts().find(p => p.id === id);
    },
    savePost(post) {
      const posts = this.getPosts();
      if (!post.id) {
        post.id = 'post-' + Date.now();
        post.views = 0;
        post.date = new Date().toLocaleDateString('vi-VN');
      }
      const index = posts.findIndex(p => p.id === post.id);
      if (index >= 0) {
        posts[index] = { ...posts[index], ...post };
      } else {
        posts.unshift(post);
      }
      localStorage.setItem('ftech_posts', JSON.stringify(posts));
      return post;
    },
    deletePost(id) {
      const posts = this.getPosts().filter(p => p.id !== id);
      localStorage.setItem('ftech_posts', JSON.stringify(posts));
    },
    updateStatus(id, status, rejectReason = '') {
      const posts = this.getPosts();
      const index = posts.findIndex(p => p.id === id);
      if (index >= 0) {
        posts[index].status = status;
        if (rejectReason) {
          posts[index].rejectReason = rejectReason;
        } else {
          delete posts[index].rejectReason;
        }
        localStorage.setItem('ftech_posts', JSON.stringify(posts));
      }
    },

    // --- REVIEWS ---
    getReviews() {
      return JSON.parse(localStorage.getItem('ftech_reviews')) || [];
    },
    saveReview(review) {
      const reviews = this.getReviews();
      if (!review.id) {
        review.id = Date.now();
        review.date = new Date().toLocaleDateString('vi-VN');
        review.helpful = 0;
      }
      reviews.unshift(review);
      localStorage.setItem('ftech_reviews', JSON.stringify(reviews));
      return review;
    },
    deleteReview(id) {
      const reviews = this.getReviews().filter(r => r.id !== id);
      localStorage.setItem('ftech_reviews', JSON.stringify(reviews));
    },
    voteHelpful(id, isUp = true) {
      const reviews = this.getReviews();
      const index = reviews.findIndex(r => r.id === id);
      if (index >= 0) {
        if (isUp) reviews[index].helpful++;
        else reviews[index].helpful = Math.max(0, reviews[index].helpful - 1);
        localStorage.setItem('ftech_reviews', JSON.stringify(reviews));
      }
    },

    // --- COMMENTS ---
    getComments() {
      return JSON.parse(localStorage.getItem('ftech_comments')) || [];
    },
    saveComment(comment) {
      const comments = this.getComments();
      if (!comment.id) {
        comment.id = Date.now();
        comment.date = new Date().toLocaleDateString('vi-VN');
      }
      comments.push(comment);
      localStorage.setItem('ftech_comments', JSON.stringify(comments));
      return comment;
    },
    deleteComment(id) {
      const comments = this.getComments().filter(c => c.id !== id);
      localStorage.setItem('ftech_comments', JSON.stringify(comments));
    },

    // --- PARTNERS ---
    getPartners() {
      return JSON.parse(localStorage.getItem('ftech_partners')) || [];
    },
    savePartner(partner) {
      const partners = this.getPartners();
      const index = partners.findIndex(p => p.name === partner.name);
      if (index >= 0) {
        partners[index] = { ...partners[index], ...partner };
      } else {
        partners.push(partner);
      }
      localStorage.setItem('ftech_partners', JSON.stringify(partners));
      return partner;
    },
    deletePartner(name) {
      const partners = this.getPartners().filter(p => p.name !== name);
      localStorage.setItem('ftech_partners', JSON.stringify(partners));
    },

    // --- AFFILIATES ---
    getAffiliates() {
      return JSON.parse(localStorage.getItem('ftech_affiliates')) || [];
    },
    saveAffiliate(aff) {
      const affiliates = this.getAffiliates();
      if (!aff.id) {
        aff.id = 'aff-' + Date.now();
        aff.clicks = 0;
      }
      const index = affiliates.findIndex(a => a.id === aff.id);
      if (index >= 0) {
        affiliates[index] = { ...affiliates[index], ...aff };
      } else {
        affiliates.push(aff);
      }
      localStorage.setItem('ftech_affiliates', JSON.stringify(affiliates));
      return aff;
    },
    deleteAffiliate(id) {
      const affiliates = this.getAffiliates().filter(a => a.id !== id);
      localStorage.setItem('ftech_affiliates', JSON.stringify(affiliates));
    },
    incrementClicks(id) {
      const affiliates = this.getAffiliates();
      const index = affiliates.findIndex(a => a.id === id);
      if (index >= 0) {
        affiliates[index].clicks++;
        localStorage.setItem('ftech_affiliates', JSON.stringify(affiliates));
      }
    }
  };

  // Bind to global window scope
  window.FTECHDB = db;
})();
