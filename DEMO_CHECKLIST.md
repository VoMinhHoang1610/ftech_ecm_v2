# 📝 KỊCH BẢN DEMO & HƯỚNG DẪN NGHIỆM THU HỆ THỐNG FTECH

Tài liệu này hướng dẫn chi tiết kịch bản chạy demo thực tế từ đầu đến cuối (End-to-End) của dự án **FTECH - Website Thương mại Điện tử Tiếp thị Liên kết (Affiliate)**. 

Hệ thống đã được đồng bộ hóa dữ liệu 100% bằng cơ chế Mock Database (`db.js`) và lưu trữ thông qua `localStorage`.

---

## 👥 1. DANH SÁCH TÀI KHOẢN MẪU (MOCK ACCOUNTS)

Để thuận tiện cho quá trình kiểm tra, hệ thống đã cài sẵn các tài khoản demo tương ứng với 4 vai trò chính:

| Vai trò | Username | Mật khẩu | Tên hiển thị | Giao diện chính |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `123` | Nguyễn Minh Vỹ | `dashboard.html` / `manage-comments.html` |
| **Content Manager** | `content` | `123` | Trương Thị Kiều Nhi | `content-manager.html` |
| **Affiliate Manager** | `partner` | `123` | Võ Minh Hoàng | `manage-affiliates.html` |
| **Người dùng (Customer)** | `customer` | `123` | Nguyễn Minh Vỹ (User) | `trangchu.html` / `profileManager.html` |

---

## 🚀 2. KỊCH BẢN DEMO 12 BƯỚC CHI TIẾT (DEMO SCENARIO)

### Bước 1: Khởi động & Đăng nhập
1. Chạy dự án qua Static Server (ví dụ: `Live Server` trong VS Code hoặc `python -m http.server 8888`).
2. Truy cập [login.html](file:///e:/ftech_ecm_v2/login.html).
3. Nhấp vào các nút vai trò ở thanh demo cuối form đăng nhập (`Người dùng`, `Content Manager`, `Affiliate Manager`, `Super Admin`) để xem cơ chế tự động điền mật khẩu và phân quyền mượt mà.
4. Đăng nhập với tài khoản **Người dùng** (`customer` / `123`).

---

### Bước 2: Tìm kiếm & Lọc bài viết thực tế tại Trang chủ
1. Sau khi đăng nhập thành công, bạn được chuyển về [trangchu.html](file:///e:/ftech_ecm_v2/trangchu.html).
2. Cuộn xuống phần **"Bài Đánh Giá Mới Nhất"**.
3. Nhập từ khóa tìm kiếm `"iPhone"` hoặc `"AirPods"` vào thanh tìm kiếm ở header hoặc phần bộ lọc chính.
4. Chọn danh mục bộ lọc (ví dụ: `Laptop`, `Điện thoại`, `Tai nghe`) hoặc chọn Hãng sản xuất (`Apple`, `Sony`).
5. Giao diện tự động lọc thẻ bài viết khớp với từ khóa thực tế và cập nhật thống kê mà **không dùng hàm alert phiền hà**.
6. Nếu tìm kiếm từ khóa không tồn tại, giao diện hiển thị thông báo **Empty State** rất trực quan.

---

### Bước 3: Gửi bình luận chờ duyệt ở trang chi tiết sản phẩm
1. Trên trang chủ, nhấp vào nút **"Xem review & nơi mua"** của sản phẩm *iPhone 16 Pro Max* để chuyển sang [product.html?id=post-1](file:///e:/ftech_ecm_v2/product.html?id=post-1).
2. Cuộn xuống phần **Bình luận**.
3. Nhập một bình luận mới (ví dụ: *"Sản phẩm này hiệu năng chip A18 Pro có thực sự mát như quảng cáo không?"*) rồi nhấn **Gửi bình luận**.
4. Một thông báo toast/notice màu vàng sang trọng hiện lên dưới ô nhập: `Bình luận của bạn đã được gửi và đang chờ admin duyệt.`
5. Bình luận này **chưa xuất hiện công khai** trên trang sản phẩm để đảm bảo quy trình kiểm duyệt (Moderation).

---

### Bước 4: Trải nghiệm Affiliate Link & Ghi log Click
1. Ở trang chi tiết sản phẩm *iPhone 16 Pro Max*, nhấp vào nút **"Đi đến nơi bán"** của đối tác *Shopee Affiliate*.
2. Hệ thống chuyển hướng qua trang trung gian [redirect.html](file:///e:/ftech_ecm_v2/redirect.html) kèm hiệu ứng chuyển động Glassmorphism cao cấp.
3. Trang redirect ghi nhận click hợp lệ, tự động tăng số click của link tiếp thị đó lên 1, đồng thời ghi log chi tiết vào `ftech_click_logs`.
4. Sau 2 giây, hệ thống tự động đưa khách hàng đến trang mua sắm gốc của Shopee.

---

### Bước 5: Xem Dashboard của Super Admin cập nhật thời gian thực
1. Truy cập lại [login.html](file:///e:/ftech_ecm_v2/login.html) và đăng nhập với tư cách **Super Admin** (`admin` / `123`).
2. Giao diện báo cáo thống kê chuyên nghiệp [dashboard.html](file:///e:/ftech_ecm_v2/dashboard.html) mở ra.
3. **KPI Tổng clicks hợp lệ** và **Doanh thu hoa hồng ước tính** tự động tăng lên dựa trên click vừa thực hiện ở Bước 4.
4. Biểu đồ Chart.js tự động vẽ lại cột dữ liệu cập nhật tức thì theo thời gian thực (real-time sync).

---

### Bước 6: Đánh giá sản phẩm đa tiêu chí & Cập nhật điểm số
1. Đăng nhập lại với tư cách **Người dùng** (`customer` / `123`).
2. Truy cập [product.html?id=post-1](file:///e:/ftech_ecm_v2/product.html?id=post-1) và bấm vào **"Viết đánh giá"** để chuyển đến [reviewModule.html?postId=post-1](file:///e:/ftech_ecm_v2/reviewModule.html?postId=post-1).
3. Đánh giá đa tiêu chí gồm: *Hiệu năng, Độ hoàn thiện, Giá trị sử dụng, Dịch vụ hỗ trợ*.
4. Gửi đánh giá thành công $\rightarrow$ Hệ thống tự động tính toán lại điểm trung bình cộng của sản phẩm và cập nhật lại trường `stars` trong `ftech_posts` của Mock DB.
5. Nếu thử gửi đánh giá lần 2 cho cùng một sản phẩm, hệ thống sẽ phát hiện hành vi trùng lặp và **chặn gửi duplicate** để chống spam.

---

### Bước 7: Super Admin duyệt & từ chối bình luận (Comment Moderation)
1. Đăng nhập tài khoản **Super Admin** (`admin` / `123`).
2. Đi tới trang **Duyệt bình luận** [manage-comments.html](file:///e:/ftech_ecm_v2/manage-comments.html) qua menu sidebar.
3. Ở tab **Chờ duyệt**, bạn sẽ thấy bình luận được gửi từ Bước 3.
4. Nhấp vào nút **"✓ Duyệt bình luận"** cho một bình luận $\rightarrow$ Trạng thái chuyển thành "Đã duyệt".
5. Với bình luận khác, nhấp nút **"× Từ chối"** $\rightarrow$ Một hộp thoại modal mờ (Glassmorphism) xuất hiện yêu cầu nhập lý do. Nhập lý do (ví dụ: *"Ngôn từ không phù hợp"*) rồi nhấn gửi từ chối.

---

### Bước 8: Kiểm tra trạng thái bình luận tại Product & Profile
1. Truy cập lại [product.html?id=post-1](file:///e:/ftech_ecm_v2/product.html?id=post-1) của Độc giả $\rightarrow$ Bình luận vừa được duyệt ở Bước 7 đã xuất hiện công khai.
2. Đăng nhập tài khoản **Người dùng** (`customer`), đi tới [profileManager.html#tab-comments](file:///e:/ftech_ecm_v2/profileManager.html#tab-comments).
3. Người dùng sẽ nhìn thấy danh sách bình luận cá nhân kèm các badge màu đẹp mắt:
   - Bình luận đã được duyệt hiện badge xanh: `Đã duyệt`
   - Bình luận bị từ chối hiện badge đỏ: `Từ chối` kèm lý do chi tiết: `Lý do: Ngôn từ không phù hợp`.

---

### Bước 9: Content Manager viết bài & Kiểm tra ràng buộc Affiliate Link
1. Đăng nhập tài khoản **Content Manager** (`content` / `123`).
2. Bấm vào **"Tạo bài viết"** để mở giao diện [postManager.html](file:///e:/ftech_ecm_v2/postManager.html).
3. Nhập tiêu đề và nội dung bài viết.
4. Để trạng thái là **"Chờ duyệt"** và nhấn **"Gửi bài viết"** khi **chưa gắn link affiliate**.
5. Hệ thống kích hoạt bộ kiểm duyệt, chặn không cho gửi bài và hiển thị thông báo lỗi màu đỏ nổi bật: `Bài viết cần có ít nhất 1 liên kết tiếp thị (affiliate link) hoạt động trước khi gửi duyệt.`
6. Thêm link affiliate ở sidebar bên phải $\rightarrow$ Nhấn **"Gửi bài viết"** $\rightarrow$ Bài viết được tạo thành công và gửi lên hàng chờ duyệt ở trạng thái `pending`.

---

### Bước 10: Super Admin duyệt bài viết mới
1. Đăng nhập tài khoản **Super Admin** (`admin` / `123`).
2. Truy cập trang **Duyệt bài viết** [manage-posts.html](file:///e:/ftech_ecm_v2/manage-posts.html).
3. Nhấp vào biểu tượng con mắt `👁️` để xem trước nội dung bài viết. Trình duyệt bài hiển thị số lượng link affiliate được gắn cho riêng bài viết đó.
4. Nhấn **"✓ Duyệt bài"** $\rightarrow$ Bài viết mới lập tức hiển thị công khai ở Trang chủ.

---

### Bước 11: Affiliate Manager quản lý link tiếp thị
1. Đăng nhập tài khoản **Affiliate Manager** (`partner` / `123`).
2. Truy cập [manage-affiliates.html](file:///e:/ftech_ecm_v2/manage-affiliates.html).
3. Quản lý trạng thái các link lỗi hoặc link hoạt động tốt của đối tác để đảm bảo doanh thu cho website.

---

### Bước 12: Khóa tài khoản người dùng & Tự động đăng xuất bảo mật
1. Đăng nhập tài khoản **Super Admin** (`admin` / `123`).
2. Vào trang **Tài khoản hệ thống** [manage-accounts.html](file:///e:/ftech_ecm_v2/manage-accounts.html).
3. Nhấp nút **Khóa** tài khoản người dùng `customer` kèm nhập lý do khóa.
4. Đăng nhập tài khoản `customer` sẽ bị hệ thống báo lỗi ngay tại màn hình login kèm lý do cụ thể.
5. Nếu tài khoản `customer` đang hoạt động ở tab khác và tải lại trang hoặc chuyển hướng, **hệ thống tự động hủy phiên làm việc (session), đăng xuất và trả về trang đăng nhập kèm thông báo khóa tài khoản tinh tế**.

---

## 🏆 3. TIÊU CHÍ ĐÁNH GIÁ ĐẠT ĐIỂM TỐI ĐA (10/10)

- [x] **Đồng bộ 100%**: Mọi click, comment, review đều tác động chéo đến doanh thu dashboard, điểm số sản phẩm và lịch sử hoạt động của khách hàng.
- [x] **Tuân thủ quy chế kiểm duyệt**: Bình luận/bài viết đi qua đúng phễu kiểm duyệt của Super Admin trước khi hiển thị công khai.
- [x] **Chống click tặc & spam**: Tự động đánh dấu click khả nghi (`suspicious`) khi trùng lặp IP quá 5 lần/giờ và chặn trùng lặp đánh giá sản phẩm.
- [x] **Aesthetics sang trọng**: Trải nghiệm Glassmorphic, font Inter thanh thoát, micro-animations chuyên nghiệp.
- [x] **Mirror cấu trúc**: Đồng bộ tuyệt đối giữa mã nguồn gốc tĩnh và cấu trúc view/script trong phân hệ `FTECH_THUONGMAIDIENTU`.
