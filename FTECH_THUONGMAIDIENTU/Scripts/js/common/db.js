(function () {
  const STORAGE_KEYS = {
    accounts: 'ftech_accounts',
    posts: 'ftech_posts',
    reviews: 'ftech_reviews',
    comments: 'ftech_comments',
    partners: 'ftech_partners',
    affiliates: 'ftech_affiliates',
    clickLogs: 'ftech_click_logs',
    commissionLogs: 'ftech_commission_logs',
    reviewWarnings: 'ftech_review_warnings'
  };

  const DEFAULT_ACCOUNTS = [
    {
      username: 'admin',
      password: '123',
      passwordHash: btoa('123'),
      role: 'admin',
      name: 'Nguyễn Minh Vỹ',
      email: 'admin@ftech.vn',
      avatar: '⚙️',
      status: 'active',
      createdAt: '01/03/2026'
    },
    {
      username: 'content',
      password: '123',
      passwordHash: btoa('123'),
      role: 'content',
      name: 'Trương Thị Kiều Nhi',
      email: 'content@ftech.vn',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      status: 'active',
      createdAt: '01/03/2026'
    },
    {
      username: 'partner',
      password: '123',
      passwordHash: btoa('123'),
      role: 'partner',
      name: 'Võ Minh Hoàng',
      email: 'partner@ftech.vn',
      avatar: '🤝',
      status: 'active',
      createdAt: '01/03/2026'
    },
    {
      username: 'customer',
      password: '123',
      passwordHash: btoa('123'),
      role: 'customer',
      name: 'Nguyễn Minh Vỹ',
      email: 'customer@ftech.vn',
      avatar: '👨',
      status: 'active',
      createdAt: '01/03/2026'
    },
    {
      username: 'customer2',
      password: '123',
      passwordHash: btoa('123'),
      role: 'customer',
      name: 'Khach hang canh bao',
      email: 'customer2@ftech.vn',
      avatar: 'KH',
      status: 'active',
      createdAt: '02/03/2026'
    },
    {
      username: 'admin2',
      password: '123',
      passwordHash: btoa('123'),
      role: 'customer',
      name: 'Tai khoan dang khoa',
      email: 'admin2@ftech.vn',
      avatar: 'LK',
      status: 'active',
      createdAt: '02/03/2026'
    }
  ];

  const DEFAULT_POSTS = [
    {
      id: 'post-1',
      title: 'Review iPhone 16 Pro Max: Đáng mua không năm 2026?',
      category: 'Review',
      tags: ['review', 'dien-thoai', 'apple'],
      status: 'approved',
      views: 12400,
      date: '14/03/2026',
      author: 'content',
      excerpt: 'Sau 3 tháng trải nghiệm thực tế với công việc đồ hoạ nặng, chúng tôi tổng hợp đánh giá toàn diện về iPhone 16 Pro Max...',
      content: 'Nội dung chi tiết review sản phẩm iPhone 16 Pro Max với camera đột phá, hiệu năng chip A18 Pro mạnh mẽ và thời lượng pin được cải thiện rõ rệt so với đời trước.',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80',
      brand: 'Apple',
      price: 34990000,
      oldPrice: 39900000,
      discount: 12,
      label: 'new',
      stars: 4.8,
      reviews: 3
    },
    {
      id: 'post-2',
      title: 'So sánh AirPods Pro 2 vs Sony WH-1000XM5: Chọn cái nào?',
      category: 'So sánh',
      tags: ['so-sanh', 'tai-nghe', 'apple', 'sony'],
      status: 'approved',
      views: 8100,
      date: '10/03/2026',
      author: 'content',
      excerpt: 'Nên chọn tai nghe in-ear chống ồn tốt của Apple hay mẫu chụp tai đẳng cấp của Sony ở tầm giá này?',
      content: 'Bài viết phân tích ưu nhược điểm của hai đối thủ nặng ký trong thế giới âm thanh chống ồn di động cao cấp.',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
      brand: 'Apple',
      price: 6490000,
      oldPrice: null,
      discount: null,
      label: 'new',
      stars: 5,
      reviews: 0
    },
    {
      id: 'post-3',
      title: 'Top 5 Laptop Gaming tầm trung tốt nhất 2026',
      category: 'Top list',
      tags: ['top-list', 'laptop', 'gaming'],
      status: 'approved',
      views: 9500,
      date: '18/03/2026',
      author: 'content',
      excerpt: 'Danh sách 5 mẫu laptop gaming cấu hình cực mạnh, tản mát, giá dưới 30 triệu đáng cân nhắc.',
      content: 'Tổng hợp danh sách các laptop gaming từ Asus, Acer, MSI, Lenovo có hiệu năng tản nhiệt tốt nhất và giá trị sử dụng cao.',
      image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=900&q=80',
      brand: 'Asus',
      price: 28990000,
      oldPrice: 31500000,
      discount: 8,
      label: 'sale',
      stars: 4,
      reviews: 0
    },
    {
      id: 'post-4',
      title: 'Apple Watch Series 10 — Có gì mới? Có nên nâng cấp không?',
      category: 'Review',
      tags: ['review', 'dong-ho', 'apple'],
      status: 'approved',
      views: 6200,
      date: '19/03/2026',
      author: 'content',
      excerpt: 'Đánh giá chi tiết mẫu đồng hồ mới của Apple với thiết kế mỏng hơn và màn hình rộng hơn.',
      content: 'Nội dung phân tích các cảm biến sức khỏe mới và công nghệ sạc siêu nhanh của Apple Watch Series 10.',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80',
      brand: 'Apple',
      price: 10990000,
      oldPrice: null,
      discount: null,
      label: 'new',
      stars: 5,
      reviews: 0
    },
    {
      id: 'post-5',
      title: 'Hướng dẫn chọn tai nghe gaming 2026',
      category: 'Hướng dẫn',
      tags: ['huong-dan', 'tai-nghe', 'gaming'],
      status: 'approved',
      views: 4800,
      date: '21/03/2026',
      author: 'content',
      excerpt: 'Cách lựa chọn tai nghe gaming có âm trường tốt, độ trễ thấp và micro đàm thoại rõ nét.',
      content: 'Hướng dẫn từ A đến Z giúp game thủ lựa chọn dòng tai nghe có dây và không dây phù hợp nhất cho nhu cầu bắn súng FPS và chơi game AAA.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      brand: 'Sony',
      price: 3490000,
      oldPrice: null,
      discount: null,
      label: 'new',
      stars: 5,
      reviews: 0
    },
    {
      id: 'post-6',
      title: 'MacBook Air M3 so với Dell XPS 13 — Nên chọn mẫu nào?',
      category: 'So sánh',
      tags: ['so-sanh', 'laptop', 'apple', 'dell'],
      status: 'approved',
      views: 7300,
      date: '25/03/2026',
      author: 'content',
      excerpt: 'Đối chiếu hai mẫu laptop Ultrabook mỏng nhẹ, pin trâu và màn hình xuất sắc nhất năm 2026.',
      content: 'So sánh hiệu năng chip M3 và Intel Core Ultra 7 trên hai đối thủ nặng ký nhất của dòng laptop siêu di động.',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
      brand: 'Dell',
      price: 38990000,
      oldPrice: 42000000,
      discount: 7,
      label: 'sale',
      stars: 4,
      reviews: 0
    },
    {
      id: 'post-7',
      title: 'Gaming PC Build dưới 15 triệu — Cấu hình mạnh nhất 2026',
      category: 'Hướng dẫn',
      tags: ['huong-dan', 'gaming', 'pc'],
      status: 'rejected',
      views: 0,
      date: '17/03/2026',
      author: 'content',
      excerpt: 'Cấu hình PC gaming lắp ráp giá cực rẻ nhưng cân tốt mọi game eSports và văn phòng.',
      content: 'Nội dung hướng dẫn lựa chọn linh kiện cũ và mới để xây dựng một dàn máy tính bàn giá cực tiết kiệm mà vẫn chiến mượt Valorant, Liên Minh Huyền Thoại.',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
      brand: 'Custom PC',
      price: 14500000,
      oldPrice: 16000000,
      discount: 9,
      label: 'sale',
      stars: 5,
      reviews: 0,
      rejectReason: 'Lý do từ chối: nội dung chưa đầy đủ, thiếu affiliate link — cần chỉnh sửa và gửi lại'
    },
    {
      id: 'post-8',
      title: 'Review Samsung Galaxy S25 Ultra: Camera AI đỉnh nhất Android?',
      category: 'Review',
      tags: ['review', 'dien-thoai', 'samsung'],
      status: 'approved',
      views: 15800,
      date: '28/03/2026',
      author: 'content',
      excerpt: 'Samsung Galaxy S25 Ultra mang đến cụm camera 200MP kết hợp AI xử lý ảnh mạnh mẽ, nhưng liệu có đủ để vượt mặt iPhone 16 Pro Max?',
      content: 'Bài đánh giá toàn diện Galaxy S25 Ultra từ thiết kế titan, camera AI Galaxy Enhance-X cho đến hiệu năng Snapdragon 8 Gen 4 và thời lượng pin 5000mAh.',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=80',
      brand: 'Samsung',
      price: 33990000,
      oldPrice: 36900000,
      discount: 8,
      label: 'hot',
      stars: 4.7,
      reviews: 5
    },
    {
      id: 'post-9',
      title: 'Review ASUS ROG Zephyrus G16: Laptop gaming mỏng nhất 2026',
      category: 'Review',
      tags: ['review', 'laptop', 'gaming', 'asus'],
      status: 'approved',
      views: 11200,
      date: '02/04/2026',
      author: 'content',
      excerpt: 'ROG Zephyrus G16 với màn hình OLED 240Hz và RTX 5070 trong thiết kế chưa đầy 2cm — laptop gaming mỏng nhẹ nhất hiện tại.',
      content: 'Đánh giá chi tiết về khả năng gaming, tản nhiệt, màn hình OLED và hiệu năng GPU RTX 5070 trên thiết kế siêu mỏng của Asus.',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80',
      brand: 'Asus',
      price: 45990000,
      oldPrice: 49900000,
      discount: 8,
      label: 'hot',
      stars: 4.6,
      reviews: 2
    },
    {
      id: 'post-10',
      title: 'Sony WF-1000XM6: Tai nghe chống ồn in-ear tốt nhất?',
      category: 'Review',
      tags: ['review', 'tai-nghe', 'sony'],
      status: 'approved',
      views: 7600,
      date: '05/04/2026',
      author: 'content',
      excerpt: 'Sony WF-1000XM6 nhỏ gọn hơn, chống ồn mạnh hơn và chất âm vẫn đỉnh — liệu có xứng đáng nâng cấp từ XM5?',
      content: 'Review chi tiết tai nghe true wireless cao cấp nhất của Sony với driver 8.4mm mới, chip V2, pin 8 giờ ANC và chất âm Hi-Res Wireless.',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&w=900&q=80',
      brand: 'Sony',
      price: 6990000,
      oldPrice: 7490000,
      discount: 7,
      label: 'new',
      stars: 4.9,
      reviews: 4
    },
    {
      id: 'post-11',
      title: 'So sánh Samsung Galaxy Tab S10 Ultra vs iPad Pro M4',
      category: 'So sánh',
      tags: ['so-sanh', 'samsung', 'apple', 'tablet'],
      status: 'approved',
      views: 5400,
      date: '08/04/2026',
      author: 'content',
      excerpt: 'Hai mẫu tablet cao cấp nhất 2026 đọ sức: Snapdragon 8 Gen 3 vs Apple M4, màn hình AMOLED vs Tandem OLED.',
      content: 'Bài so sánh toàn diện hai tablet flagship từ hiệu năng, màn hình, bút stylus, hệ sinh thái đến giá trị sử dụng thực tế cho từng nhóm người dùng.',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80',
      brand: 'Samsung',
      price: 28990000,
      oldPrice: null,
      discount: null,
      label: 'new',
      stars: 4.5,
      reviews: 1
    },
    {
      id: 'post-12',
      title: 'LG OLED C4 65 inch — TV tốt nhất cho phòng khách 2026?',
      category: 'Review',
      tags: ['review', 'tv', 'lg', 'giai-tri'],
      status: 'approved',
      views: 4100,
      date: '12/04/2026',
      author: 'content',
      excerpt: 'LG OLED C4 với chip α9 Gen7, Dolby Vision IQ và tần số 144Hz — TV OLED giá tốt nhất cho cả phim lẫn gaming.',
      content: 'Đánh giá LG OLED C4 từ chất lượng hình ảnh OLED evo, khả năng gaming 4K 144Hz, hệ thống webOS 24 đến thiết kế siêu mỏng và giá trị so với dòng G4.',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80',
      brand: 'LG',
      price: 32990000,
      oldPrice: 38900000,
      discount: 15,
      label: 'sale',
      stars: 4.8,
      reviews: 3
    },
    {
      id: 'post-13',
      title: '5 mẹo tiết kiệm pin iPhone cực hiệu quả mà ít ai biết',
      category: 'Hướng dẫn',
      tags: ['meo-hay', 'dien-thoai', 'apple'],
      status: 'approved',
      views: 18200,
      date: '15/04/2026',
      author: 'content',
      excerpt: 'Những thiết lập ẩn trên iOS 18 giúp iPhone của bạn kéo dài thời lượng pin thêm 2-3 giờ mỗi ngày.',
      content: 'Hướng dẫn chi tiết 5 mẹo bao gồm tối ưu Background App Refresh, Focus Mode thông minh, và cách giảm OLED burn-in đồng thời tiết kiệm pin.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80',
      brand: 'Apple',
      price: null,
      oldPrice: null,
      discount: null,
      label: null,
      stars: 4.9,
      reviews: 8
    },
    {
      id: 'post-14',
      title: 'Canon EOS R50 — Máy ảnh mirrorless tốt nhất cho người mới?',
      category: 'Review',
      tags: ['review', 'may-anh', 'canon'],
      status: 'approved',
      views: 3200,
      date: '18/04/2026',
      author: 'content',
      excerpt: 'Canon EOS R50 gọn nhẹ, lấy nét nhanh và quay video 4K — liệu có phải lựa chọn hoàn hảo cho người mới bắt đầu chụp ảnh?',
      content: 'Đánh giá chi tiết Canon EOS R50 từ chất lượng ảnh với cảm biến APS-C 24.2MP, hệ thống AF Dual Pixel, quay video 4K 30fps đến pin và hệ sinh thái ống kính RF-S.',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
      brand: 'Canon',
      price: 18490000,
      oldPrice: 19290000,
      discount: 4,
      label: 'sale',
      stars: 4.7,
      reviews: 2
    },
    {
      id: 'post-15',
      title: 'Review Samsung Galaxy S24 Ultra: Flagship Android vẫn rất đáng mua',
      category: 'Review',
      tags: ['review', 'dien-thoai', 'samsung'],
      status: 'approved',
      views: 13200,
      date: '20/04/2026',
      author: 'content',
      excerpt: 'Galaxy S24 Ultra vẫn là lựa chọn Android cao cấp đáng tiền với khung titan, camera 200MP, S Pen và Galaxy AI hỗ trợ làm việc hằng ngày.',
      content: 'Bài review đánh giá Galaxy S24 Ultra qua các tình huống chụp đêm, zoom xa, ghi chú bằng S Pen và xử lý tác vụ nặng. Máy phù hợp với người cần một điện thoại bền, màn hình đẹp, camera linh hoạt và hiệu năng ổn định trong nhiều năm.',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=80',
      brand: 'Samsung',
      price: 18390000,
      oldPrice: 29450000,
      discount: 38,
      label: 'sale',
      stars: 4.7,
      reviews: 2
    },
    {
      id: 'post-16',
      title: 'Asus ROG Zephyrus G14: Laptop gaming gọn nhẹ cho sinh viên kỹ thuật',
      category: 'Review',
      tags: ['review', 'laptop', 'gaming', 'asus'],
      status: 'approved',
      views: 9800,
      date: '22/04/2026',
      author: 'content',
      excerpt: 'ROG Zephyrus G14 cân bằng tốt giữa hiệu năng gaming, thiết kế nhỏ gọn và màn hình OLED 3K cho cả học tập lẫn làm đồ họa.',
      content: 'Bài viết tập trung vào trải nghiệm thực tế với Ryzen AI, GPU RTX, độ ồn quạt khi render, thời lượng pin khi đi học và chất lượng màn hình khi chỉnh ảnh. Điểm mạnh là tính di động, điểm cần cân nhắc là giá bán cao.',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80',
      brand: 'Asus',
      price: 69990000,
      oldPrice: 71690000,
      discount: 2,
      label: 'hot',
      stars: 4.6,
      reviews: 2
    },
    {
      id: 'post-17',
      title: 'Apple Watch Ultra 2: Đồng hồ thể thao cao cấp cho người dùng iPhone',
      category: 'Review',
      tags: ['review', 'dong-ho', 'apple'],
      status: 'approved',
      views: 8700,
      date: '24/04/2026',
      author: 'content',
      excerpt: 'Apple Watch Ultra 2 nổi bật với vỏ titanium, màn hình sáng, pin tốt hơn dòng Series và các tính năng luyện tập ngoài trời chuyên sâu.',
      content: 'Bài review đi vào độ bền khi tập luyện, độ chính xác GPS, tính năng cellular, khả năng theo dõi sức khỏe và mức độ đáng mua nếu bạn đang dùng Apple Watch Series cũ. Sản phẩm phù hợp với người tập thể thao và cần đồng hồ pin khỏe.',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80',
      brand: 'Apple',
      price: 21990000,
      oldPrice: 23990000,
      discount: 8,
      label: 'new',
      stars: 4.8,
      reviews: 2
    },
    {
      id: 'post-18',
      title: 'Sony WH-1000XM5: Tai nghe chống ồn cho làm việc và di chuyển',
      category: 'Review',
      tags: ['review', 'tai-nghe', 'sony'],
      status: 'approved',
      views: 10400,
      date: '26/04/2026',
      author: 'content',
      excerpt: 'WH-1000XM5 vẫn là mẫu headphone chống ồn đáng tin cậy với chất âm ấm, micro đàm thoại tốt và đeo thoải mái trong nhiều giờ.',
      content: 'Bài đánh giá tập trung vào khả năng chống ồn trên xe buýt, chất lượng đàm thoại trong phòng ồn, pin thực tế và trải nghiệm kết nối đa điểm. Nếu ưu tiên làm việc tập trung và di chuyển nhiều, WH-1000XM5 vẫn rất đáng cân nhắc.',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
      brand: 'Sony',
      price: 6990000,
      oldPrice: 8490000,
      discount: 18,
      label: 'sale',
      stars: 4.9,
      reviews: 2
    },
    {
      id: 'post-19',
      title: 'MacBook Air M3: Laptop mỏng nhẹ cho văn phòng, sinh viên và sáng tạo nội dung',
      category: 'Hướng dẫn',
      tags: ['huong-dan', 'laptop', 'apple'],
      status: 'approved',
      views: 9100,
      date: '28/04/2026',
      author: 'content',
      excerpt: 'Hướng dẫn chọn MacBook Air M3 theo RAM, dung lượng SSD và kích thước 13/15 inch để tránh mua thiếu cấu hình.',
      content: 'Bài viết phân tích người dùng nên chọn bản 13 inch hay 15 inch, 16GB hay 24GB RAM, SSD 256GB hay 512GB. MacBook Air M3 phù hợp với học tập, lập trình nhẹ, thiết kế 2D và công việc văn phòng cần pin lâu.',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
      brand: 'Apple',
      price: 26990000,
      oldPrice: 32990000,
      discount: 18,
      label: 'new',
      stars: 4.6,
      reviews: 2
    }
  ];

  const DEFAULT_REVIEWS = [
    {
      id: 1,
      postId: 'post-1',
      name: 'Nguyễn Tuấn Anh',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
      date: '12/03/2026',
      stars: 5,
      score: 5,
      title: 'Pin 18 giờ thật sự ấn tượng!',
      text: 'Dùng cả ngày làm việc 10 tiếng vẫn còn 30% pin. Máy mỏng nhẹ, build chắc chắn và phù hợp với học tập, văn phòng.',
      helpful: 47,
      hasPhotos: true,
      verified: true,
      criteria: { perf: 5, build: 5, value: 4, service: 5 }
    },
    {
      id: 2,
      postId: 'post-1',
      name: 'Trương Thị Kiều Nhi',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      date: '08/03/2026',
      stars: 5,
      score: 5,
      title: 'Phù hợp cho học tập và thiết kế nhẹ',
      text: 'Mình dùng Figma và Photoshop cơ bản thấy rất ổn. Máy nhẹ, pin tốt và màn hình đẹp.',
      helpful: 31,
      hasPhotos: true,
      verified: true,
      criteria: { perf: 5, build: 5, value: 4, service: 5 }
    },
    {
      id: 3,
      postId: 'post-1',
      name: 'Phạm Thái Bảo',
      avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=120&q=80',
      date: '02/03/2026',
      stars: 4,
      score: 4.2,
      title: 'Tốt nhưng nên lên 16GB RAM nếu làm dev',
      text: 'Máy chạy nhanh và rất yên tĩnh. Nếu dùng workflow nặng hơn thì nên chọn bản RAM cao hơn.',
      helpful: 18,
      hasPhotos: false,
      verified: true,
      criteria: { perf: 4, build: 5, value: 4, service: 5 }
    },
    {
      id: 4,
      postId: 'post-15',
      userId: 'customer',
      name: 'Nguyễn Minh Vỹ',
      avatar: '👨',
      date: '21/04/2026',
      stars: 5,
      score: 4.8,
      title: 'Camera zoom và S Pen rất đáng tiền',
      text: 'Mình dùng S24 Ultra để ghi chú khi họp và chụp sản phẩm, zoom xa vẫn giữ chi tiết tốt. Máy hơi nặng nhưng đổi lại cảm giác rất chắc chắn.',
      helpful: 22,
      hasPhotos: false,
      verified: true,
      criteria: { perf: 5, build: 5, value: 4, service: 5 }
    },
    {
      id: 5,
      postId: 'post-16',
      userId: 'customer',
      name: 'Lê Quốc Huy',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      date: '23/04/2026',
      stars: 4,
      score: 4.5,
      title: 'Gọn hơn nhiều laptop gaming cùng cấu hình',
      text: 'G14 mang đi học khá tiện, màn OLED đẹp và chạy đồ họa ổn. Khi render lâu quạt vẫn nghe rõ nên nên dùng ở nơi thoáng.',
      helpful: 15,
      hasPhotos: true,
      verified: true,
      criteria: { perf: 5, build: 4, value: 4, service: 4 }
    },
    {
      id: 6,
      postId: 'post-17',
      userId: 'customer2',
      name: 'Trần Mai Anh',
      avatar: 'KH',
      date: '25/04/2026',
      stars: 5,
      score: 4.8,
      title: 'Pin và GPS tốt cho chạy bộ',
      text: 'Mình dùng Ultra 2 để chạy trail cuối tuần, GPS ổn định và màn hình ngoài nắng rất dễ nhìn. Giá cao nhưng hợp với người tập luyện nghiêm túc.',
      helpful: 11,
      hasPhotos: false,
      verified: true,
      criteria: { perf: 5, build: 5, value: 4, service: 5 }
    },
    {
      id: 7,
      postId: 'post-18',
      userId: 'customer',
      name: 'Đặng Hoàng Long',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      date: '27/04/2026',
      stars: 5,
      score: 4.9,
      title: 'Chống ồn vẫn thuộc nhóm tốt nhất',
      text: 'WH-1000XM5 dùng làm việc ở quán cà phê rất ổn, micro gọi meeting rõ hơn đời cũ. Điểm trừ là không gập gọn như XM4.',
      helpful: 19,
      hasPhotos: false,
      verified: true,
      criteria: { perf: 5, build: 4, value: 5, service: 5 }
    },
    {
      id: 8,
      postId: 'post-19',
      userId: 'customer2',
      name: 'Phạm Gia Hân',
      avatar: 'KH',
      date: '29/04/2026',
      stars: 4,
      score: 4.4,
      title: 'Nên lên 16GB RAM nếu dùng lâu dài',
      text: 'MacBook Air M3 rất nhẹ và pin tốt. Mình đồng ý với bài viết là bản 16GB RAM hợp lý hơn cho sinh viên IT hoặc người hay mở nhiều tab.',
      helpful: 13,
      hasPhotos: false,
      verified: true,
      criteria: { perf: 4, build: 5, value: 4, service: 4 }
    }
  ];

  const DEFAULT_COMMENTS = [
    { id: 1, postId: 'post-1', name: 'Lê Hoàng Nam', date: '20/03/2026', text: 'Bài viết rất rõ ở phần hiệu năng. Nếu được, mình muốn có thêm so sánh giữa bản 8GB và 16GB cho người làm lập trình.' },
    { id: 2, postId: 'post-1', name: 'FTECH Review Team', date: '20/03/2026', text: 'Bọn mình sẽ bổ sung phần này ở bản cập nhật tiếp theo.' },
    { id: 3, postId: 'post-15', name: 'Hoàng Anh', date: '21/04/2026', text: 'S24 Ultra dùng bút S Pen ghi chú có bị trễ nhiều không? Mình đang cân nhắc đổi từ Note 20 Ultra.' },
    { id: 4, postId: 'post-16', name: 'Minh Khang', date: '23/04/2026', text: 'G14 có nóng phần kê tay khi chơi game lâu không? Bài viết có phần nhiệt độ rất hữu ích.' },
    { id: 5, postId: 'post-17', name: 'FTECH Review Team', date: '25/04/2026', text: 'Ultra 2 phù hợp hơn Series 10 nếu bạn cần pin dài, GPS chính xác và vỏ bền cho hoạt động ngoài trời.' },
    { id: 6, postId: 'post-18', name: 'Thanh Trúc', date: '27/04/2026', text: 'Mình đang dùng XM4, đọc xong thấy XM5 đáng nâng cấp nhất ở micro và chống ồn khi đi làm.' },
    { id: 7, postId: 'post-19', name: 'Quang Huy', date: '29/04/2026', text: 'Phần tư vấn RAM/SSD rất thực tế, nên thêm bảng chọn cấu hình theo ngành học nữa.' }
  ];

  const DEFAULT_PARTNERS = [
    { id: 'partner-cellphones', name: 'CellphoneS', desc: 'Đề xuất · Hàng chính hãng · Trả góp 0%', logo: '📱', active: true, status: 'active', commissionRate: 0.03, clicks: 1420, category: 'Điện tử' },
    { id: 'partner-tgdd', name: 'Thế Giới Di Động', desc: 'Chuỗi lớn · Dễ trải nghiệm máy · Hỗ trợ tốt', logo: '🛒', active: true, status: 'active', commissionRate: 0.025, clicks: 2840, category: 'Điện tử' },
    { id: 'partner-shopee', name: 'Shopee Affiliate', desc: 'Campaign linh hoạt · Deal tốt săn voucher', logo: '📦', active: true, status: 'active', commissionRate: 0.04, clicks: 4820, category: 'TMĐT' },
    { id: 'partner-lazada', name: 'Lazada Partner', desc: 'Campaign ngày đôi · Miễn phí vận chuyển', logo: '📘', active: true, status: 'active', commissionRate: 0.035, clicks: 1950, category: 'TMĐT' },
    { id: 'partner-tiki', name: 'Tiki Trading', desc: 'Hàng chính hãng 100% · Giao siêu nhanh', logo: '🚀', active: false, status: 'paused', commissionRate: 0.02, clicks: 890, category: 'TMĐT' },
    { id: 'partner-sony', name: 'Sony Store', desc: 'Cửa hàng hãng · Thông tin sản phẩm chính thức', logo: '🎧', active: true, status: 'active', commissionRate: 0.02, clicks: 620, category: 'Hãng sản xuất' },
    { id: 'partner-samsung', name: 'Samsung Store', desc: 'Cửa hàng hãng · Sản phẩm Samsung chính hãng', logo: '📱', active: true, status: 'active', commissionRate: 0.02, clicks: 720, category: 'Hãng sản xuất' }
  ];

  const DEFAULT_AFFILIATES = [
    { id: 'aff-1', postId: 'post-1', partnerId: 'partner-cellphones', partner: 'CellphoneS', type: 'Link mua chính', url: 'https://cellphones.com.vn/iphone-16-pro-max.html', clicks: 284, status: 'active', name: 'iPhone 16 Pro Max - CellphoneS', attachedPost: 'Review iPhone 16 Pro Max: Đáng mua không năm 2026?', date: '21/03/2026', commission: '3%', cvr: '6.8%' },
    { id: 'aff-2', postId: 'post-1', partnerId: 'partner-cellphones', partner: 'CellphoneS', type: 'Link so sánh giá', url: 'https://cellphones.com.vn/iphone-16-pro-max.html?product_id=90172', clicks: 195, status: 'active', name: 'iPhone 16 Pro Max 256GB - CellphoneS', attachedPost: 'Review iPhone 16 Pro Max: Đáng mua không năm 2026?', date: '21/03/2026', commission: '3%', cvr: '5.2%' },
    { id: 'aff-3', postId: 'post-2', partnerId: 'partner-tiki', partner: 'Tiki Trading', type: 'Link mua chính', url: 'https://tiki.vn/tai-nghe-bluetooth-chup-tai-sony-wh-1000xm5-hi-res-noise-canceling-hang-chinh-hang-p181772131.html?spid=263559718', clicks: 320, status: 'active', name: 'Sony WH-1000XM5 - Tiki', attachedPost: 'So sánh AirPods Pro 2 vs Sony WH-1000XM5: Chọn cái nào?', date: '02/03/2026', commission: '2%', cvr: '4.4%' },
    { id: 'aff-4', postId: 'post-2', partnerId: 'partner-sony', partner: 'Sony Store', type: 'Link so sánh giá', url: 'https://store.sony.com.vn/products/wh-1000xm5', clicks: 654, status: 'active', name: 'Sony WH-1000XM5 - Sony Store', attachedPost: 'So sánh AirPods Pro 2 vs Sony WH-1000XM5: Chọn cái nào?', date: '16/03/2026', commission: '3%', cvr: '5.8%' },
    { id: 'aff-5', postId: 'post-3', partnerId: 'partner-cellphones', partner: 'CellphoneS', type: 'Link danh sách sản phẩm', url: 'https://cellphones.com.vn/laptop/gaming.html', clicks: 142, status: 'active', name: 'Laptop gaming - CellphoneS', attachedPost: 'Top 5 Laptop Gaming tầm trung tốt nhất 2026', date: '05/03/2026', commission: '3%', cvr: '3.6%' },
    { id: 'aff-6', postId: 'post-4', partnerId: 'partner-cellphones', partner: 'CellphoneS', type: 'Link mua chính', url: 'https://cellphones.com.vn/apple-watch-series-10-46mm-4g.html?product_id=90230', clicks: 108, status: 'active', name: 'Apple Watch Series 10 - CellphoneS', attachedPost: 'Apple Watch Series 10 — Có gì mới? Có nên nâng cấp không?', date: '08/03/2026', commission: '3%', cvr: '3.9%' },
    { id: 'aff-7', postId: 'post-5', partnerId: 'partner-cellphones', partner: 'CellphoneS', type: 'Link mua chính', url: 'https://cellphones.com.vn/tai-nghe-chup-tai-logitech-rgb-g733.html', clicks: 91, status: 'active', name: 'Logitech G733 - CellphoneS', attachedPost: 'Hướng dẫn chọn tai nghe gaming 2026', date: '10/03/2026', commission: '3%', cvr: '3.2%' },
    { id: 'aff-8', postId: 'post-6', partnerId: 'partner-cellphones', partner: 'CellphoneS', type: 'Link MacBook tham khảo', url: 'https://cellphones.com.vn/macbook-air-m3-13-inch-2024.html?product_id=78121', clicks: 126, status: 'active', name: 'MacBook Air M3 13 inch - CellphoneS', attachedPost: 'MacBook Air M3 so với Dell XPS 13 — Nên chọn mẫu nào?', date: '12/03/2026', commission: '3%', cvr: '3.7%' },
    { id: 'aff-9', postId: 'post-6', partnerId: 'partner-tiki', partner: 'Tiki Trading', type: 'Link Dell tham khảo', url: 'https://tiki.vn/laptop-dell-xps-13-9310-i5-1135g7-8gb-512gb-13-4-f-cap-officehs-win11-70273578-bac-hang-chinh-hang-p163871463.html?spid=163871465', clicks: 64, status: 'active', name: 'Dell XPS 13 - Tiki', attachedPost: 'MacBook Air M3 so với Dell XPS 13 — Nên chọn mẫu nào?', date: '12/03/2026', commission: '2%', cvr: '2.4%' },
    { id: 'aff-10', postId: 'post-7', partnerId: 'partner-cellphones', partner: 'CellphoneS', type: 'Link danh sách sản phẩm', url: 'https://cellphones.com.vn/bo-loc/may-tinh-pc-10-15-trieu', clicks: 83, status: 'active', name: 'PC 10-15 triệu - CellphoneS', attachedPost: 'Gaming PC Build dưới 15 triệu — Cấu hình mạnh nhất 2026', date: '15/03/2026', commission: '3%', cvr: '2.9%' },
    { id: 'aff-11', postId: 'post-8', partnerId: 'partner-cellphones', partner: 'CellphoneS', type: 'Link mua chính', url: 'https://cellphones.com.vn/dien-thoai-samsung-galaxy-s25-ultra.html?product_id=98488', clicks: 174, status: 'active', name: 'Samsung Galaxy S25 Ultra - CellphoneS', attachedPost: 'Review Samsung Galaxy S25 Ultra: Camera AI đỉnh nhất Android?', date: '18/03/2026', commission: '3%', cvr: '4.1%' },
    { id: 'aff-12', postId: 'post-9', partnerId: 'partner-cellphones', partner: 'CellphoneS', type: 'Link mua chính', url: 'https://cellphones.com.vn/laptop-asus-rog-zephyrus-g16-gu605cx-qr083w.html', clicks: 118, status: 'active', name: 'ASUS ROG Zephyrus G16 - CellphoneS', attachedPost: 'Review ASUS ROG Zephyrus G16: Laptop gaming mỏng nhất 2026', date: '20/03/2026', commission: '3%', cvr: '3.5%' },
    { id: 'aff-13', postId: 'post-10', partnerId: 'partner-cellphones', partner: 'CellphoneS', type: 'Link mua chính', url: 'https://cellphones.com.vn/tai-nghe-khong-day-sony-wf-1000xm6.html?product_id=124846', clicks: 137, status: 'active', name: 'Sony WF-1000XM6 - CellphoneS', attachedPost: 'Sony WF-1000XM6: Tai nghe chống ồn in-ear tốt nhất?', date: '22/03/2026', commission: '3%', cvr: '4.2%' },
    { id: 'aff-14', postId: 'post-11', partnerId: 'partner-shopee', partner: 'Shopee Affiliate', type: 'Link Samsung tham khảo', url: 'https://shopee.vn/M%C3%A1y-t%C3%ADnh-b%E1%BA%A3ng-SAMSUNG-Galaxy-Tab-S10-Ultra-256GB-H%C3%A0ng-ch%C3%ADnh-h%C3%A3ng-i.843663249.28412441672', clicks: 89, status: 'active', name: 'Galaxy Tab S10 Ultra - Shopee', attachedPost: 'So sánh Samsung Galaxy Tab S10 Ultra vs iPad Pro M4', date: '24/03/2026', commission: '4%', cvr: '2.8%' },
    { id: 'aff-15', postId: 'post-11', partnerId: 'partner-samsung', partner: 'Samsung Store', type: 'Link hãng tham khảo', url: 'https://www.samsung.com/vn/tablets/galaxy-tab-s/galaxy-tab-s10-ultra-silver-256gb-sm-x926bzsaxxv/buy/', clicks: 52, status: 'active', name: 'Galaxy Tab S10 Ultra - Samsung', attachedPost: 'So sánh Samsung Galaxy Tab S10 Ultra vs iPad Pro M4', date: '24/03/2026', commission: '3%', cvr: '2.5%' },
    { id: 'aff-16', postId: 'post-12', partnerId: 'partner-cellphones', partner: 'CellphoneS', type: 'Link mua chính', url: 'https://cellphones.com.vn/smart-tivi-lg-oled-evo-65c4psa-4k-65-inch-2024.html', clicks: 97, status: 'active', name: 'LG OLED C4 65 inch - CellphoneS', attachedPost: 'LG OLED C4 65 inch — TV tốt nhất cho phòng khách 2026?', date: '26/03/2026', commission: '3%', cvr: '3.0%' },
    { id: 'aff-17', postId: 'post-13', partnerId: 'partner-cellphones', partner: 'CellphoneS', type: 'Link sản phẩm tham khảo', url: 'https://cellphones.com.vn/iphone-16-pro-max.html', clicks: 74, status: 'active', name: 'iPhone 16 Pro Max - CellphoneS', attachedPost: '5 mẹo tiết kiệm pin iPhone cực hiệu quả mà ít ai biết', date: '28/03/2026', commission: '3%', cvr: '2.6%' },
    { id: 'aff-18', postId: 'post-14', partnerId: 'partner-cellphones', partner: 'CellphoneS', type: 'Link mua chính', url: 'https://cellphones.com.vn/may-anh-canon-eos-r50.html?product_id=78227', clicks: 111, status: 'active', name: 'Canon EOS R50 - CellphoneS', attachedPost: 'Canon EOS R50 — Máy ảnh mirrorless tốt nhất cho người mới?', date: '30/03/2026', commission: '3%', cvr: '3.8%' },
    { id: 'aff-19', postId: 'post-15', partnerId: 'partner-cellphones', partner: 'CellphoneS', type: 'Link mua chính', url: 'https://cellphones.com.vn/samsung-galaxy-s24-ultra-12gb-256gb-cu-dep.html?product_id=80564', clicks: 96, status: 'active', name: 'Samsung Galaxy S24 Ultra - CellphoneS', attachedPost: 'Review Samsung Galaxy S24 Ultra: Flagship Android vẫn rất đáng mua', date: '20/04/2026', commission: '3%', cvr: '3.8%' },
    { id: 'aff-20', postId: 'post-16', partnerId: 'partner-cellphones', partner: 'CellphoneS', type: 'Link mua chính', url: 'https://cellphones.com.vn/laptop-asus-rog-zephyrus-g14-ga403wr-qs156ws.html?product_id=107098', clicks: 74, status: 'active', name: 'ASUS ROG Zephyrus G14 - CellphoneS', attachedPost: 'Asus ROG Zephyrus G14: Laptop gaming gọn nhẹ cho sinh viên kỹ thuật', date: '22/04/2026', commission: '3%', cvr: '3.1%' },
    { id: 'aff-21', postId: 'post-17', partnerId: 'partner-cellphones', partner: 'CellphoneS', type: 'Link mua chính', url: 'https://cellphones.com.vn/apple-watch-ultra-2-49mm-4g.html?product_id=70832', clicks: 68, status: 'active', name: 'Apple Watch Ultra 2 - CellphoneS', attachedPost: 'Apple Watch Ultra 2: Đồng hồ thể thao cao cấp cho người dùng iPhone', date: '24/04/2026', commission: '3%', cvr: '3.4%' },
    { id: 'aff-22', postId: 'post-18', partnerId: 'partner-tiki', partner: 'Tiki Trading', type: 'Link mua chính', url: 'https://tiki.vn/tai-nghe-bluetooth-chup-tai-sony-wh-1000xm5-hi-res-noise-canceling-hang-chinh-hang-p181772131.html?spid=263559718', clicks: 88, status: 'active', name: 'Sony WH-1000XM5 - Tiki Trading', attachedPost: 'Sony WH-1000XM5: Tai nghe chống ồn cho làm việc và di chuyển', date: '26/04/2026', commission: '2%', cvr: '3.9%' },
    { id: 'aff-23', postId: 'post-18', partnerId: 'partner-sony', partner: 'Sony Store', type: 'Link hãng tham khảo', url: 'https://store.sony.com.vn/products/wh-1000xm5', clicks: 42, status: 'active', name: 'Sony WH-1000XM5 - Sony Store', attachedPost: 'Sony WH-1000XM5: Tai nghe chống ồn cho làm việc và di chuyển', date: '26/04/2026', commission: '3%', cvr: '2.7%' },
    { id: 'aff-24', postId: 'post-19', partnerId: 'partner-cellphones', partner: 'CellphoneS', type: 'Link mua chính', url: 'https://cellphones.com.vn/bo-loc/macbook-air-m3/', clicks: 77, status: 'active', name: 'MacBook Air M3 - CellphoneS', attachedPost: 'MacBook Air M3: Laptop mỏng nhẹ cho văn phòng, sinh viên và sáng tạo nội dung', date: '28/04/2026', commission: '3%', cvr: '3.0%' }
  ];

  const DEFAULT_REVIEW_WARNINGS = [
    { userId: 'customer2', warningCount: 2, isLocked: false, lockedUntil: '' },
    { userId: 'admin2', warningCount: 3, isLocked: true, lockedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() }
  ];

  function read(key, fallback = []) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getAuthItem(key) {
    if (window.FTECHAuth && window.FTECHAuth.getItem) {
      return window.FTECHAuth.getItem(key);
    }
    const sessionValue = sessionStorage.getItem(key);
    return sessionValue !== null ? sessionValue : localStorage.getItem(key);
  }

  function getCurrentUsername(fallback = '') {
    return getAuthItem('ftech_user') || fallback;
  }

  function toSlugId(prefix, text) {
    return `${prefix}-${String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || Date.now()}`;
  }

  function parseMoney(value) {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    return Number(String(value).replace(/[^\d]/g, '')) || 0;
  }

  function formatMoney(value) {
    const amount = Number(value) || 0;
    return `${amount.toLocaleString('vi-VN')}₫`;
  }

  function normalizeAccount(account) {
    const fallback = DEFAULT_ACCOUNTS.find(a => a.username === account.username) || {};
    const password = account.password || fallback.password || '123';
    return {
      ...fallback,
      ...account,
      password,
      passwordHash: account.passwordHash || btoa(password),
      email: account.email || fallback.email || `${account.username}@ftech.vn`,
      status: account.status || 'active',
      createdAt: account.createdAt || account.date || '01/03/2026'
    };
  }

  function normalizePost(post) {
    const authorMap = {
      'Trương Thị Kiều Nhi': 'content',
      'Võ Minh Hoàng': 'partner',
      'Nguyễn Minh Vỹ': 'customer',
      'Super Admin': 'admin'
    };
    const normalized = {
      ...post,
      author: authorMap[post.author] || post.author || 'content',
      price: parseMoney(post.price),
      oldPrice: parseMoney(post.oldPrice || post.old) || null,
      discount: post.discount ? Number(String(post.discount).replace(/[^\d]/g, '')) || post.discount : null
    };
    normalized.priceText = formatMoney(normalized.price);
    normalized.old = normalized.oldPrice ? formatMoney(normalized.oldPrice) : null;
    return normalized;
  }

  function normalizePartner(partner) {
    const seed = DEFAULT_PARTNERS.find(p => p.name === partner.name || p.id === partner.id) || {};
    const id = partner.id || seed.id || toSlugId('partner', partner.name);
    const commissionRate = Number(partner.commissionRate) || Number(String(partner.commission || '').match(/\d+(\.\d+)?/)?.[0]) / 100 || seed.commissionRate || 0.03;
    return {
      ...seed,
      ...partner,
      id,
      active: partner.active !== undefined ? partner.active : partner.status !== 'paused' && partner.status !== 'rejected',
      status: partner.status || (partner.active === false ? 'paused' : 'active'),
      commissionRate,
      commission: partner.commission || `${(commissionRate * 100).toFixed(1).replace('.0', '')}%`
    };
  }

  function getPartnerIdByName(name) {
    const partners = read(STORAGE_KEYS.partners, DEFAULT_PARTNERS.map(normalizePartner));
    const partner = partners.find(p => p.name === name || p.name.toLowerCase().includes(String(name || '').toLowerCase()));
    return partner ? partner.id : '';
  }

  function getPostIdByTitle(title) {
    const posts = read(STORAGE_KEYS.posts, DEFAULT_POSTS.map(normalizePost));
    const post = posts.find(p => p.title === title || String(title || '').includes(p.title) || p.title.includes(String(title || '')));
    return post ? post.id : 'post-1';
  }

  function buildInternalAffiliateUrl(id) {
    return `redirect.html?linkId=${encodeURIComponent(id)}`;
  }

  function normalizeAffiliate(affiliate) {
    const partnerId = affiliate.partnerId || getPartnerIdByName(affiliate.partner);
    const postId = affiliate.postId || getPostIdByTitle(affiliate.attachedPost);
    const partner = read(STORAGE_KEYS.partners, []).find(p => p.id === partnerId);
    const post = read(STORAGE_KEYS.posts, []).find(p => p.id === postId);
    const id = affiliate.id || `aff-${Date.now()}`;
    const originalUrl = affiliate.originalUrl || affiliate.url || '';
    return {
      ...affiliate,
      id,
      code: affiliate.code || toSlugId('link', affiliate.name || id),
      postId,
      partnerId,
      partner: affiliate.partner || (partner && partner.name) || 'Shopee Affiliate',
      attachedPost: affiliate.attachedPost || (post && post.title) || '',
      originalUrl,
      url: originalUrl,
      internalUrl: affiliate.internalUrl || buildInternalAffiliateUrl(id),
      clicks: Number(affiliate.clicks) || 0,
      status: affiliate.status || 'active'
    };
  }

  function normalizeComment(comment) {
    const userId = comment.userId || comment.username || '';
    return {
      ...comment,
      id: comment.id || Date.now(),
      postId: comment.postId || 'post-1',
      userId,
      name: comment.name || userId || 'Khach hang FTECH',
      date: comment.date || new Date().toLocaleDateString('vi-VN'),
      status: comment.status || 'approved',
      approvedBy: comment.approvedBy || (comment.status === 'approved' ? 'admin' : ''),
      approvedAt: comment.approvedAt || '',
      rejectedBy: comment.rejectedBy || '',
      rejectedAt: comment.rejectedAt || '',
      rejectReason: comment.rejectReason || ''
    };
  }

  function normalizeReviewWarning(record) {
    return {
      userId: record.userId || record.username || '',
      warningCount: Number(record.warningCount || 0),
      isLocked: Boolean(record.isLocked),
      lockedUntil: record.lockedUntil || ''
    };
  }

  function initCollection(key, seed, normalizer) {
    const current = read(key, null);
    const base = current && current.length ? current : seed;
    write(key, base.map(normalizer));
  }

  function mergeSeedCollection(key, seed, normalizer, options = {}) {
    const current = read(key, []);
    const normalized = current.map(normalizer);
    const idKey = options.idKey || 'id';

    seed.forEach(seedItem => {
      const item = normalizer(seedItem);
      const index = normalized.findIndex(record => record[idKey] === item[idKey]);
      if (index >= 0) {
        if (options.updateExisting) normalized[index] = item;
      } else {
        normalized.push(item);
      }
    });

    write(key, normalized);
  }

  function seedClickLogsFromAffiliates() {
    const logs = read(STORAGE_KEYS.clickLogs, []);
    const affiliates = read(STORAGE_KEYS.affiliates, []);
    const seeded = logs.slice();
    if (!logs.length) {
      affiliates.forEach(affiliate => {
        const safeCount = Math.min(Number(affiliate.clicks) || 0, 8);
        for (let index = 0; index < safeCount; index++) {
          seeded.push({
            id: `click-seed-${affiliate.id}-${index + 1}`,
            linkId: affiliate.id,
            partnerId: affiliate.partnerId,
            postId: affiliate.postId,
            timestamp: new Date(Date.now() - (index + 1) * 3600000).toISOString(),
            ipAddress: `10.0.0.${index + 10}`,
            status: 'valid'
          });
        }
      });
    }

    const testLogs = [
      { id: 'click-test-customer-post-1-1', linkId: 'aff-1', postId: 'post-1', username: 'customer', ipAddress: '10.1.0.11' },
      { id: 'click-test-customer-post-1-2', linkId: 'aff-2', postId: 'post-1', username: 'customer', ipAddress: '10.1.0.12' },
      { id: 'click-test-customer-post-2-1', linkId: 'aff-4', postId: 'post-2', username: 'customer', ipAddress: '10.1.0.21' },
      { id: 'click-test-customer-post-2-2', linkId: 'aff-4', postId: 'post-2', username: 'customer', ipAddress: '10.1.0.22' },
      { id: 'click-test-customer-post-3-1', linkId: 'aff-1', postId: 'post-3', username: 'customer', ipAddress: '10.1.0.31' },
      { id: 'click-test-customer2-post-1-1', linkId: 'aff-1', postId: 'post-1', username: 'customer2', ipAddress: '10.1.0.41' }
    ];
    testLogs.forEach((log, index) => {
      if (seeded.some(item => item.id === log.id)) return;
      const affiliate = affiliates.find(item => item.id === log.linkId) || affiliates.find(item => item.postId === log.postId) || {};
      seeded.push({
        ...log,
        partnerId: affiliate.partnerId || 'partner-shopee',
        timestamp: new Date(Date.now() - (index + 2) * 1800000).toISOString(),
        status: 'valid'
      });
    });
    write(STORAGE_KEYS.clickLogs, seeded);
  }

  function seedReviewWarnings() {
    const warnings = read(STORAGE_KEYS.reviewWarnings, []).map(normalizeReviewWarning);
    DEFAULT_REVIEW_WARNINGS.forEach(seed => {
      if (!warnings.some(record => record.userId === seed.userId)) {
        warnings.push(normalizeReviewWarning(seed));
      }
    });
    write(STORAGE_KEYS.reviewWarnings, warnings);
  }

  function initDB() {
    initCollection(STORAGE_KEYS.accounts, DEFAULT_ACCOUNTS, normalizeAccount);
    const accounts = read(STORAGE_KEYS.accounts, []);
    DEFAULT_ACCOUNTS.forEach(seedAccount => {
      const index = accounts.findIndex(account => account.username === seedAccount.username);
      if (index >= 0) accounts[index] = normalizeAccount({ ...accounts[index], password: '123', passwordHash: btoa('123') });
      else accounts.push(normalizeAccount(seedAccount));
    });
    write(STORAGE_KEYS.accounts, accounts);

    initCollection(STORAGE_KEYS.posts, DEFAULT_POSTS, normalizePost);
    mergeSeedCollection(STORAGE_KEYS.posts, DEFAULT_POSTS, normalizePost);
    initCollection(STORAGE_KEYS.reviews, DEFAULT_REVIEWS, review => ({ postId: 'post-1', helpful: 0, ...review }));
    mergeSeedCollection(STORAGE_KEYS.reviews, DEFAULT_REVIEWS, review => ({ postId: 'post-1', helpful: 0, ...review }));
    initCollection(STORAGE_KEYS.comments, DEFAULT_COMMENTS, normalizeComment);
    mergeSeedCollection(STORAGE_KEYS.comments, DEFAULT_COMMENTS, normalizeComment);
    initCollection(STORAGE_KEYS.partners, DEFAULT_PARTNERS, normalizePartner);
    mergeSeedCollection(STORAGE_KEYS.partners, DEFAULT_PARTNERS, normalizePartner);
    initCollection(STORAGE_KEYS.affiliates, DEFAULT_AFFILIATES, normalizeAffiliate);
    mergeSeedCollection(STORAGE_KEYS.affiliates, DEFAULT_AFFILIATES, normalizeAffiliate, { updateExisting: true });
    if (!localStorage.getItem(STORAGE_KEYS.commissionLogs)) write(STORAGE_KEYS.commissionLogs, []);
    seedClickLogsFromAffiliates();
    seedReviewWarnings();
  }

  initDB();

  const db = {
    formatMoney,
    parseMoney,

    getAccounts() {
      return read(STORAGE_KEYS.accounts).map(normalizeAccount);
    },
    getAccount(identifier) {
      if (!identifier) return null;
      return this.getAccounts().find(a =>
        (a.username && a.username.toLowerCase() === identifier.toLowerCase()) ||
        (a.email && a.email.toLowerCase() === identifier.toLowerCase())
      );
    },
    saveAccount(account) {
      const normalized = normalizeAccount(account);
      const accounts = this.getAccounts();
      const index = accounts.findIndex(a => a.username === normalized.username);
      if (index >= 0) accounts[index] = { ...accounts[index], ...normalized };
      else accounts.push(normalized);
      write(STORAGE_KEYS.accounts, accounts);
      return normalized;
    },
    deleteAccount(username) {
      write(STORAGE_KEYS.accounts, this.getAccounts().filter(a => a.username !== username));
    },

    getPosts() {
      return read(STORAGE_KEYS.posts).map(normalizePost);
    },
    getPost(id) {
      return this.getPosts().find(p => p.id === id);
    },
    savePost(post) {
      const posts = this.getPosts();
      const normalized = normalizePost({
        ...post,
        id: post.id || `post-${Date.now()}`,
        views: post.views || 0,
        date: post.date || new Date().toLocaleDateString('vi-VN')
      });
      const index = posts.findIndex(p => p.id === normalized.id);
      if (index >= 0) posts[index] = { ...posts[index], ...normalized };
      else posts.unshift(normalized);
      write(STORAGE_KEYS.posts, posts);
      return normalized;
    },
    deletePost(id) {
      write(STORAGE_KEYS.posts, this.getPosts().filter(p => p.id !== id));
    },
    updateStatus(id, status, rejectReason = '') {
      const post = this.getPost(id);
      if (!post) return;
      post.status = status;
      if (rejectReason) post.rejectReason = rejectReason;
      else delete post.rejectReason;
      this.savePost(post);
    },
    recalculatePostStars(postId) {
      const reviews = this.getReviews(postId);
      const post = this.getPost(postId);
      if (!post || !reviews.length) return post;
      const avg = reviews.reduce((sum, review) => sum + Number(review.stars || 0), 0) / reviews.length;
      post.stars = Number(avg.toFixed(1));
      post.reviews = reviews.length;
      return this.savePost(post);
    },

    getReviews(postId = '') {
      const reviews = read(STORAGE_KEYS.reviews).map(review => ({ postId: 'post-1', helpful: 0, ...review }));
      return postId ? reviews.filter(r => r.postId === postId) : reviews;
    },
    hasUserReviewedPost(postId, username = '') {
      if (!postId || !username) return false;
      const account = this.getAccount(username);
      const displayName = account ? account.name : '';
      return this.getReviews(postId).some(review =>
        review.userId === username ||
        (displayName && review.name === displayName)
      );
    },
    saveReview(review) {
      const reviews = this.getReviews();
      const currentUser = getCurrentUsername(review.userId || 'customer');
      const postId = review.postId || 'post-1';
      if (this.hasUserReviewedPost(postId, currentUser)) {
        return null;
      }
      const account = this.getAccount(currentUser);
      const normalized = {
        ...review,
        id: review.id || Date.now(),
        postId,
        userId: review.userId || currentUser,
        name: review.name || (account ? account.name : currentUser),
        avatar: review.avatar || (account ? account.avatar : '👤'),
        date: review.date || new Date().toLocaleDateString('vi-VN'),
        helpful: review.helpful || 0,
        stars: Number(review.stars || 0),
        verified: review.verified !== undefined ? review.verified : this.hasValidClickLog(currentUser, postId),
        hasValidPurchase: review.hasValidPurchase !== undefined ? review.hasValidPurchase : this.hasValidClickLog(currentUser, postId)
      };
      reviews.unshift(normalized);
      write(STORAGE_KEYS.reviews, reviews);
      this.recalculatePostStars(postId);
      return normalized;
    },
    deleteReview(id) {
      const reviews = this.getReviews();
      const deleted = reviews.find(r => r.id === id);
      write(STORAGE_KEYS.reviews, reviews.filter(r => r.id !== id));
      if (deleted) this.recalculatePostStars(deleted.postId);
    },
    voteHelpful(id, isUp = true) {
      const reviews = this.getReviews();
      const index = reviews.findIndex(r => r.id === id);
      if (index >= 0) {
        reviews[index].helpful = isUp ? reviews[index].helpful + 1 : Math.max(0, reviews[index].helpful - 1);
        write(STORAGE_KEYS.reviews, reviews);
      }
    },

    getComments(postId = '', filter = {}) {
      const comments = read(STORAGE_KEYS.comments).map(normalizeComment);
      return comments.filter(comment =>
        (!postId || comment.postId === postId) &&
        (!filter.status || comment.status === filter.status) &&
        (!filter.userId || comment.userId === filter.userId) &&
        (!filter.name || comment.name === filter.name)
      );
    },
    saveComment(comment) {
      const comments = this.getComments();
      const currentUser = getCurrentUsername('');
      const currentAccount = currentUser ? this.getAccount(currentUser) : null;
      const normalized = {
        ...comment,
        id: comment.id || Date.now(),
        postId: comment.postId || 'post-1',
        userId: comment.userId || currentUser,
        name: comment.name || (currentAccount && currentAccount.name) || getAuthItem('ftech_username') || 'Khach hang FTECH',
        date: comment.date || new Date().toLocaleDateString('vi-VN'),
        status: comment.status || 'pending',
        approvedBy: comment.approvedBy || '',
        approvedAt: comment.approvedAt || '',
        rejectedBy: comment.rejectedBy || '',
        rejectedAt: comment.rejectedAt || '',
        rejectReason: comment.rejectReason || ''
      };
      comments.push(normalized);
      write(STORAGE_KEYS.comments, comments);
      return normalized;
    },
    approveComment(id, approvedBy = getCurrentUsername('admin')) {
      const comments = this.getComments();
      const index = comments.findIndex(c => String(c.id) === String(id));
      if (index < 0) return null;
      comments[index] = {
        ...comments[index],
        status: 'approved',
        approvedBy,
        approvedAt: new Date().toISOString(),
        rejectedBy: '',
        rejectedAt: '',
        rejectReason: ''
      };
      write(STORAGE_KEYS.comments, comments);
      return comments[index];
    },
    rejectComment(id, rejectReason, rejectedBy = getCurrentUsername('admin')) {
      const comments = this.getComments();
      const index = comments.findIndex(c => String(c.id) === String(id));
      if (index < 0) return null;
      comments[index] = {
        ...comments[index],
        status: 'rejected',
        rejectedBy,
        rejectedAt: new Date().toISOString(),
        rejectReason: rejectReason || 'Noi dung chua phu hop'
      };
      write(STORAGE_KEYS.comments, comments);
      return comments[index];
    },
    deleteComment(id) {
      write(STORAGE_KEYS.comments, this.getComments().filter(c => c.id !== id));
    },
    getCommentSummary(postId = '') {
      const comments = this.getComments(postId);
      return comments.reduce((summary, comment) => {
        summary.total += 1;
        summary[comment.status] = (summary[comment.status] || 0) + 1;
        return summary;
      }, { total: 0, pending: 0, approved: 0, rejected: 0 });
    },

    getPartners() {
      return read(STORAGE_KEYS.partners).map(normalizePartner);
    },
    getPartner(id) {
      return this.getPartners().find(p => p.id === id || p.name === id);
    },
    savePartner(partner) {
      const normalized = normalizePartner(partner);
      const partners = this.getPartners();
      const index = partners.findIndex(p => p.id === normalized.id || p.name === normalized.name);
      if (index >= 0) {
        const oldRate = Number(partners[index].commissionRate) || 0;
        partners[index] = { ...partners[index], ...normalized };
        if (oldRate !== normalized.commissionRate) this.saveCommissionLog(normalized.id, oldRate, normalized.commissionRate);
      } else {
        partners.push(normalized);
      }
      write(STORAGE_KEYS.partners, partners);
      return normalized;
    },
    deletePartner(nameOrId) {
      write(STORAGE_KEYS.partners, this.getPartners().filter(p => p.name !== nameOrId && p.id !== nameOrId));
    },

    getAffiliates(postId = '') {
      const affiliates = read(STORAGE_KEYS.affiliates).map(normalizeAffiliate);
      return postId ? affiliates.filter(a => a.postId === postId) : affiliates;
    },
    getAffiliate(id) {
      return this.getAffiliates().find(a => a.id === id);
    },
    saveAffiliate(affiliate) {
      const normalized = normalizeAffiliate(affiliate);
      const affiliates = this.getAffiliates();
      const index = affiliates.findIndex(a => a.id === normalized.id);
      if (index >= 0) affiliates[index] = { ...affiliates[index], ...normalized };
      else affiliates.push(normalized);
      write(STORAGE_KEYS.affiliates, affiliates);
      return normalized;
    },
    deleteAffiliate(id) {
      write(STORAGE_KEYS.affiliates, this.getAffiliates().filter(a => a.id !== id));
    },
    incrementClicks(id) {
      return this.trackClick(id).affiliate;
    },
    trackClick(linkId, options = {}) {
      const affiliates = this.getAffiliates();
      const index = affiliates.findIndex(a => a.id === linkId);
      if (index < 0) return { affiliate: null, log: null };

      const now = new Date();
      const ipAddress = options.ipAddress || localStorage.getItem('ftech_mock_ip') || '127.0.0.1';
      const logs = this.getClickLogs();
      const oneHourAgo = now.getTime() - 60 * 60 * 1000;
      const recentSameIp = logs.filter(log =>
        log.linkId === linkId &&
        log.ipAddress === ipAddress &&
        new Date(log.timestamp).getTime() >= oneHourAgo
      );
      const status = recentSameIp.length >= 5 ? 'suspicious' : 'valid';
      const affiliate = affiliates[index];
      const log = {
        id: `click-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        linkId,
        partnerId: affiliate.partnerId,
        postId: affiliate.postId,
        timestamp: now.toISOString(),
        ipAddress,
        status,
        username: getCurrentUsername('guest')
      };

      logs.push(log);
      if (status === 'valid') {
        affiliates[index].clicks = Number(affiliates[index].clicks || 0) + 1;
        const partners = this.getPartners();
        const pIndex = partners.findIndex(p => p.id === affiliate.partnerId);
        if (pIndex >= 0) {
          partners[pIndex].clicks = Number(partners[pIndex].clicks || 0) + 1;
          write(STORAGE_KEYS.partners, partners);
        }
      }
      write(STORAGE_KEYS.clickLogs, logs);
      write(STORAGE_KEYS.affiliates, affiliates);
      return { affiliate: affiliates[index], log };
    },
    getClickLogs(filter = {}) {
      const logs = read(STORAGE_KEYS.clickLogs);
      return logs.filter(log =>
        (!filter.postId || log.postId === filter.postId) &&
        (!filter.partnerId || log.partnerId === filter.partnerId) &&
        (!filter.linkId || log.linkId === filter.linkId) &&
        (!filter.username || log.username === filter.username) &&
        (!filter.status || log.status === filter.status)
      );
    },
    hasValidClickLog(userId, postId) {
      if (!userId || !postId) return false;
      return this.getClickLogs({ postId, username: userId, status: 'valid' }).length > 0;
    },
    hasValidClickForUser(postId, username) {
      return this.hasValidClickLog(username, postId);
    },
    getReviewWarnings(userId) {
      if (!userId) return { userId: '', warningCount: 0, isLocked: false, lockedUntil: '' };
      const warnings = read(STORAGE_KEYS.reviewWarnings, []).map(normalizeReviewWarning);
      const record = warnings.find(item => item.userId === userId) || { userId, warningCount: 0, isLocked: false, lockedUntil: '' };
      if (record.isLocked && record.lockedUntil && new Date(record.lockedUntil).getTime() <= Date.now()) {
        return this.clearWarnings(userId);
      }
      return record;
    },
    isReviewLocked(userId) {
      const record = this.getReviewWarnings(userId);
      return Boolean(record.isLocked && record.lockedUntil && new Date(record.lockedUntil).getTime() > Date.now());
    },
    addWarning(userId) {
      if (!userId) return null;
      const warnings = read(STORAGE_KEYS.reviewWarnings, []).map(normalizeReviewWarning);
      const index = warnings.findIndex(item => item.userId === userId);
      const record = index >= 0 ? warnings[index] : { userId, warningCount: 0, isLocked: false, lockedUntil: '' };
      record.warningCount = Number(record.warningCount || 0) + 1;
      if (record.warningCount >= 3) {
        record.warningCount = 3;
        record.isLocked = true;
        record.lockedUntil = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
      }
      if (index >= 0) warnings[index] = record;
      else warnings.push(record);
      write(STORAGE_KEYS.reviewWarnings, warnings);
      return record;
    },
    clearWarnings(userId) {
      const warnings = read(STORAGE_KEYS.reviewWarnings, []).map(normalizeReviewWarning);
      const index = warnings.findIndex(item => item.userId === userId);
      const record = { userId, warningCount: 0, isLocked: false, lockedUntil: '' };
      if (index >= 0) warnings[index] = record;
      else warnings.push(record);
      write(STORAGE_KEYS.reviewWarnings, warnings);
      return record;
    },
    getCommissionLogs() {
      return read(STORAGE_KEYS.commissionLogs);
    },
    saveCommissionLog(partnerId, oldRate, newRate) {
      const logs = this.getCommissionLogs();
      logs.unshift({
        id: `comm-${Date.now()}`,
        partnerId,
        oldRate,
        newRate,
        changedBy: getCurrentUsername('admin'),
        changedAt: new Date().toISOString(),
        effectiveDate: new Date().toLocaleDateString('vi-VN')
      });
      write(STORAGE_KEYS.commissionLogs, logs);
    },
    calculateCommissionSummary() {
      const validLogs = this.getClickLogs({ status: 'valid' });
      const posts = this.getPosts();
      const partners = this.getPartners();
      const revenue = validLogs.reduce((sum, log) => {
        const post = posts.find(p => p.id === log.postId);
        const partner = partners.find(p => p.id === log.partnerId);
        return sum + ((post ? Number(post.price) || 0 : 0) * (partner ? Number(partner.commissionRate) || 0 : 0));
      }, 0);
      return {
        validClicks: validLogs.length,
        suspiciousClicks: this.getClickLogs({ status: 'suspicious' }).length,
        revenue
      };
    }
  };

  window.FTECHDB = db;
})();
