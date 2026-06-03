# 🎬 KỊCH BẢN DEMO - HỆ THỐNG FTECH AFFILIATE E-COMMERCE

> **Mục tiêu:** Quay video demo mượt mà, trình bày TẤT CẢ chức năng chính của đề tài Thương mại điện tử liên kết (Affiliate).
> **Thời lượng dự kiến:** 20–25 phút
> **Lưu ý quan trọng:** Trước mỗi scene, mở DevTools → Application → Local Storage → xóa tất cả key `ftech_*` để reset data mẫu về trạng thái ban đầu.

---

## 🚀 CÁCH KHỞI CHẠY CHƯƠNG TRÌNH

### Bước 1: Cài đặt HTTP Server (chỉ cần 1 lần)
```bash
npm install -g http-server
```

### Bước 2: Chạy server
```bash
cd d:\5_ThuongMaiDTu\webTMDT\ftech_ecm_v2
http-server -p 8080 -c-1 --cors
```

### Bước 3: Mở trình duyệt
```
http://localhost:8080/trangchu.html
```

### Bước 4: Reset dữ liệu (nếu cần)
Mở DevTools (F12) → Console → chạy:
```js
localStorage.clear(); sessionStorage.clear(); location.reload();
```

---

## 📋 TỔNG QUAN CÁC SCENE

| Scene | Vai trò | Nội dung | Thời gian |
|-------|---------|----------|-----------|
| 1 | Khách | Đăng ký tài khoản mới | 2 phút |
| 2 | Customer | Đăng nhập + Trang chủ + Duyệt sản phẩm | 3 phút |
| 3 | Customer | Xem sản phẩm + Click affiliate + Bình luận | 3 phút |
| 4 | Customer | Đánh giá sản phẩm + Profanity filter | 3 phút |
| 5 | Content Manager | Tạo bài viết + Gắn affiliate link + Gửi duyệt | 3 phút |
| 6 | Affiliate Manager | Quản lý link + Đối tác + Sửa link lỗi + Hoa hồng | 3 phút |
| 7 | Super Admin | Dashboard + Duyệt bài viết + Từ chối bài viết | 3 phút |
| 8 | Super Admin | Duyệt bình luận + Quản lý tài khoản + Khóa tài khoản | 3 phút |
| 9 | Đa vai trò | Xác nhận luồng end-to-end liên kết affiliate | 2 phút |

---

## 🎬 SCENE 1: ĐĂNG KÝ TÀI KHOẢN MỚI
**Vai trò:** Khách (chưa đăng nhập)
**Trang:** [register.html](file:///d:/5_ThuongMaiDTu/webTMDT/ftech_ecm_v2/register.html)

### Bước thực hiện:

1. **Mở trang đăng ký**
   - Truy cập `http://localhost:8080/register.html`
   - **Giới thiệu:** "Đây là trang đăng ký tài khoản người dùng mới của FTECH"

2. **Nhập thông tin đăng ký**
   - Họ: `Trần`
   - Tên: `Văn Demo`
   - Email: `demo@ftech.vn`
   - Số điện thoại: `0901234567`
   - Tên đăng nhập: `demo_user`
   - Mật khẩu: `Demo1234!`
   - Xác nhận mật khẩu: `Demo1234!`

3. **Demo kiểm tra mật khẩu mạnh/yếu**
   - Khi gõ mật khẩu, chỉ cho **thanh đánh giá độ mạnh** thay đổi theo thời gian thực
   - Mật khẩu yếu → thanh đỏ, mật khẩu mạnh → thanh xanh

4. **Demo validation lỗi** (tùy chọn)
   - Thử bấm Đăng ký khi để trống 1 field → hiện thông báo lỗi validation
   - Thử nhập username `customer` (đã tồn tại) → hiện "Tên đăng nhập đã tồn tại"

5. **Đăng ký thành công**
   - Tick đồng ý điều khoản → Bấm **Đăng ký**
   - ✅ Hiện toast "Đăng ký thành công"
   - ✅ Tự động chuyển sang trang **login.html**

---

## 🎬 SCENE 2: ĐĂNG NHẬP + TRANG CHỦ + DUYỆT SẢN PHẨM
**Vai trò:** Customer (Người dùng)
**Trang:** [login.html](file:///d:/5_ThuongMaiDTu/webTMDT/ftech_ecm_v2/login.html) → [trangchu.html](file:///d:/5_ThuongMaiDTu/webTMDT/ftech_ecm_v2/trangchu.html)

### 2.1 Đăng nhập vai Customer

1. **Mở trang đăng nhập**
   - Truy cập `http://localhost:8080/login.html`
   - **Giới thiệu:** "Hệ thống FTECH hỗ trợ 4 vai trò: Customer, Content Manager, Affiliate Manager, Super Admin"

2. **Chọn vai trò demo**
   - Click vào nút **"👤 Customer"** trong phần Demo Quick Role
   - Tự động điền: username = `customer`, password = `123`

3. **Bấm Đăng nhập**
   - ✅ Hiện toast "Xác thực thành công"
   - ✅ Hiện modal xác nhận vai trò: "Xin chào, Nguyễn Minh Vỹ!"
   - ✅ Hiển thị vai trò: "Thành viên" và mô tả quyền truy cập
   - Bấm **"Vào trang chủ FTECH"**

### 2.2 Khám phá trang chủ

4. **Giới thiệu trang chủ**
   - **Header:** Logo FTECH, nav (Trang chủ, Sản phẩm, Bài review, Đối tác, Hỗ trợ)
   - **Tên tài khoản:** Góc trên bên phải hiển thị "Nguyễn Minh Vỹ - Thành viên"
   - **Hero Banner:** "Đánh giá công nghệ trung thực"

5. **Demo tìm kiếm sản phẩm**
   - Cuộn xuống phần **"Sản phẩm được quan tâm nhiều"**
   - Gõ `iPhone` vào ô tìm kiếm → danh sách lọc ra sản phẩm chứa "iPhone"
   - Xóa tìm kiếm → hiện lại tất cả
   - Click tab **Apple** → lọc theo thương hiệu
   - Click tab **Samsung** → lọc theo thương hiệu khác
   - Click **Tất cả** → quay lại toàn bộ

6. **Demo Khám phá chủ đề công nghệ**
   - Cuộn lên phần **"Khám phá chủ đề công nghệ"**
   - Chỉ ra 4 danh mục: Review điện thoại, Laptop & PC, Âm thanh, Đồng hồ
   - Click vào **"Review điện thoại"** → chuyển sang trang `san-pham.html?category=dien-thoai`

### 2.3 Trang Sản phẩm riêng

7. **Trang san-pham.html**
   - ✅ Trang riêng biệt (KHÔNG cuộn xuống nội dung trang chủ)
   - Hero section + thanh tìm kiếm + bộ lọc
   - **Tab danh mục:** Tất cả, Điện thoại, Laptop, Âm thanh, Đồng hồ
   - Click từng tab → sản phẩm lọc theo danh mục
   - **Sắp xếp:** Thay đổi dropdown "Mới nhất" / "Giá thấp" / "Đánh giá cao"
   - ✅ Hiển thị grid sản phẩm với ảnh, tên, giá, sao, brand

8. **Quay về trang chủ** → Bấm nav "Trang chủ" hoặc logo FTECH

### 2.4 Trang Bài review riêng

9. **Mở trang bai-review.html**
   - Từ trang chủ → click **"Bài review"** trên nav, hoặc bấm **"Xem tất cả bài viết"** ở mục "Bài review & hướng dẫn nổi bật"
   - ✅ Trang riêng biệt với hero, tab lọc, bài viết nổi bật, grid bài viết
   - **Tab:** Tất cả, Review sản phẩm, So sánh, Hướng dẫn, Tips
   - Click từng tab → bài viết lọc theo danh mục

---

## 🎬 SCENE 3: XEM SẢN PHẨM + CLICK AFFILIATE + BÌNH LUẬN
**Vai trò:** Customer (đang đăng nhập)
**Trang:** [product.html](file:///d:/5_ThuongMaiDTu/webTMDT/ftech_ecm_v2/product.html)

### 3.1 Xem chi tiết sản phẩm

1. **Mở trang sản phẩm**
   - Từ trang chủ hoặc trang sản phẩm → Click vào bài **"Review iPhone 16 Pro Max"**
   - URL: `http://localhost:8080/product.html?id=post-1`

2. **Giới thiệu trang chi tiết**
   - **Breadcrumb:** Trang chủ › Đánh giá iPhone 16 Pro Max
   - **Meta:** Category, Brand, Ngày cập nhật
   - **Tiêu đề + Mô tả:** Nội dung review chi tiết
   - **Ảnh sản phẩm:** Hiển thị hình ảnh lớn
   - **Bảng thông số:** Sản phẩm, Thương hiệu, Giá ưu đãi, Giá gốc, Giảm giá, Sao

3. **Nội dung review chuyên sâu**
   - Cuộn xuống phần **"Nội dung review chi tiết"**
   - Phần 1: Thiết kế và cảm giác sử dụng
   - Phần 2: Đánh giá hiệu năng hoạt động
   - Box nhận định nhanh từ FTECH

### 3.2 Click link Affiliate (quan trọng!)

4. **Cuộn đến phần "Nơi mua uy tín"**
   - Hiển thị danh sách đối tác: **Shopee Affiliate**, **Lazada Partner**
   - Mỗi đối tác có: Tên, Mô tả, Giá, Nút **"Đi đến nơi bán"**

5. **Click vào nút "Đi đến nơi bán" (Shopee)**
   - ✅ Chuyển sang trang `redirect.html?linkId=aff-1`
   - ✅ Hiện spinner + thông báo "Đang ghi nhận lượt click"
   - ✅ Thông báo: "Đang chuyển đến Shopee Affiliate. Lượt click hợp lệ đã được đồng bộ vào dashboard."
   - ✅ Hệ thống gọi `trackClick()` → ghi log click vào `ftech_click_logs`
   - ✅ Tăng `clicks` của affiliate link + partner
   - ✅ Kiểm tra IP trùng lặp → nếu >5 click/giờ cùng IP → đánh dấu "suspicious"
   - Sau 0.9s → chuyển hướng đến URL đối tác (shopee.vn)

6. **Quay lại trang sản phẩm** (bấm Back hoặc link "Quay về trang chủ")

### 3.3 Gửi bình luận (Comment Moderation)

7. **Cuộn đến phần bình luận**
   - Hiển thị danh sách bình luận **đã duyệt** (approved)
   - Các bình luận "pending" sẽ KHÔNG hiện ở đây

8. **Gửi bình luận mới**
   - Nhập nội dung: `Bài review rất chi tiết, mình đang phân vân giữa iPhone 16 và Samsung S24. Cảm ơn FTECH!`
   - Bấm **Gửi bình luận**
   - ✅ Hiện thông báo: "Bình luận của bạn đã được gửi và đang chờ admin duyệt."
   - ✅ Bình luận có status = `pending` → KHÔNG hiển thị public ngay
   - ✅ Bình luận sẽ xuất hiện trong trang Admin duyệt bình luận (Scene 8)

9. **Demo trường hợp chưa đăng nhập** (tùy chọn)
   - Mở tab ẩn danh → vào product.html → thử gửi bình luận
   - ✅ Hiện thông báo yêu cầu đăng nhập → chuyển hướng login.html

---

## 🎬 SCENE 4: ĐÁNH GIÁ SẢN PHẨM + PROFANITY FILTER
**Vai trò:** Customer (đang đăng nhập)
**Trang:** [reviewModule.html](file:///d:/5_ThuongMaiDTu/webTMDT/ftech_ecm_v2/reviewModule.html)

### 4.1 Trang đánh giá sản phẩm

1. **Mở trang đánh giá**
   - Từ trang product.html → click link **"Xem & gửi đánh giá"**
   - URL: `http://localhost:8080/reviewModule.html?postId=post-1`

2. **Giới thiệu trang**
   - **Thông tin sản phẩm:** Tên, thương hiệu, giá, sao hiện tại
   - **Thống kê tổng:** Điểm trung bình, tổng đánh giá, biểu đồ phân bố sao
   - **Tiêu chí chi tiết:** Hiệu năng, Độ bền, Giá trị, Dịch vụ (mỗi tiêu chí có sao riêng)

3. **Danh sách đánh giá hiện có**
   - 3 đánh giá mẫu với: Avatar, Tên, Ngày, Sao, Tiêu chí chi tiết, Nội dung, Ảnh
   - Badge **"✓ Đã duyệt"** cho đánh giá verified
   - Nút **"👍 Có (47)"** — bấm vote "Hữu ích"
   - Nút **"🚩 Báo cáo"**

### 4.2 Gửi đánh giá thành công

4. **Điền form đánh giá**
   - Chọn **5 sao** → hiện label "Tuyệt vời!"
   - Tiêu chí phụ: Hiệu năng 5⭐, Build 5⭐, Giá trị 4⭐, Dịch vụ 5⭐
   - Tiêu đề: `Pin trâu, máy mượt, rất đáng mua!`
   - Nội dung: `Mình đã sử dụng iPhone 16 Pro Max được 2 tuần. Pin dùng cả ngày vẫn còn 40%. Camera chụp đêm rất tốt. Hiệu năng chip A18 Pro xử lý mọi tác vụ mượt mà.`
   - Bấm thêm ảnh (📸) → hiện emoji ảnh minh họa (tối đa 5)

5. **Bấm "📤 Gửi đánh giá"**
   - ✅ Hiện loading "⏳ Đang gửi..."
   - ✅ Toast thành công
   - ✅ Đánh giá mới xuất hiện đầu danh sách
   - ✅ Thống kê tự động cập nhật (điểm trung bình, tổng đánh giá)
   - ✅ Badge "✓ Đã duyệt" vì user có click log hợp lệ (Verified Purchase)

### 4.3 Trường hợp chặn đánh giá

6. **Thử gửi đánh giá lần 2 (duplicate)**
   - Bấm "Gửi đánh giá" lần nữa
   - ✅ Hiện toast: "Bạn đã đánh giá sản phẩm này. Mỗi tài khoản chỉ được gửi một đánh giá."

7. **Demo Profanity Filter (từ ngữ không phù hợp)**
   - Đăng xuất → đăng nhập lại bằng tài khoản `customer2` (pass: `123`)
   - Quay lại reviewModule.html
   - ⚠️ Trước tiên cần tạo click log cho customer2: vào product.html → click "Đi đến nơi bán" → quay lại
   - Nhập đánh giá có từ cấm: `San pham nay ngu qua, do ngu si. Khong dang mua!`
   - Bấm Gửi
   - ✅ Hiện modal cảnh báo **"Nội dung chứa từ không phù hợp"**
   - ✅ Hiện danh sách từ vi phạm + mức độ (nghiêm trọng, trung bình)
   - ✅ Hiện số lần cảnh báo: **3/3** (customer2 đã có 2 warning sẵn)
   - ✅ Hiện thông báo **"Tài khoản đã bị khóa đến [ngày]"**
   - ✅ Gợi ý cách sửa: "Hãy thay bằng mô tả trải nghiệm cụ thể..."

8. **Demo chưa mua hàng**
   - Đăng nhập tài khoản mới chưa click affiliate
   - Thử gửi đánh giá
   - ✅ Hiện modal **"Bạn chưa mua hàng"** → "Cần mua hàng thông qua liên kết affiliate hợp lệ"
   - ✅ Nút "Quay lại bài review" → chuyển về product.html

### 4.4 Các chức năng phụ

9. **Lọc đánh giá**
   - Click tab **"5 sao"** → chỉ hiện đánh giá 5 sao
   - Click tab **"Có ảnh"** → chỉ hiện đánh giá có ảnh
   - Click tab **"Đã mua hàng"** → chỉ hiện verified review

10. **Sắp xếp đánh giá**
    - Dropdown: Mới nhất / Hữu ích nhất / Cao nhất / Thấp nhất

11. **Vote "Hữu ích"**
    - Bấm 👍 trên 1 đánh giá → số hữu ích tăng lên

---

## 🎬 SCENE 5: CONTENT MANAGER — TẠO BÀI VIẾT + GẮN AFFILIATE
**Vai trò:** Content Manager
**Trang:** [content-manager.html](file:///d:/5_ThuongMaiDTu/webTMDT/ftech_ecm_v2/content-manager.html) → [postManager.html](file:///d:/5_ThuongMaiDTu/webTMDT/ftech_ecm_v2/postManager.html)

### 5.1 Đăng nhập Content Manager

1. **Đăng nhập**
   - Vào login.html → Click nút **"✍️ Content"**
   - Username = `content`, Password = `123`
   - ✅ Modal: "Xin chào, Trương Thị Kiều Nhi!" + "Content Manager"
   - Bấm **"Vào trang Content Manager"**

### 5.2 Trang quản lý bài viết (Content Manager)

2. **Giới thiệu giao diện**
   - **Sidebar:** Avatar + tên + vai trò, menu (Bài viết của tôi, Tạo bài mới)
   - **Stats cards:** Tất cả / Nháp / Chờ duyệt / Đã duyệt / Từ chối
   - **Tab filter:** Click từng chip → lọc theo trạng thái
   - **Bảng bài viết:** Thumbnail, Tiêu đề, Danh mục, Trạng thái, Lượt xem, Ngày

3. **Xem trước bài viết (Preview)**
   - Click 👁️ trên 1 bài viết
   - ✅ Modal preview: thumbnail, tiêu đề, tag, notice trạng thái, nội dung
   - Nếu bài đã duyệt → notice xanh "đang được xuất bản công khai"
   - Nếu bài chờ duyệt → notice vàng "đang chờ Super Admin"
   - Nếu bài từ chối → notice đỏ + lý do từ chối

### 5.3 Tạo bài viết mới

4. **Bấm "Tạo bài viết mới"**
   - Chuyển sang `postManager.html`

5. **Điền nội dung**
   - Tiêu đề: `Review Samsung Galaxy S24 Ultra: Camera AI đỉnh cao`
   - Mô tả ngắn: `Đánh giá chi tiết Samsung S24 Ultra với camera AI cải tiến và S-Pen thế hệ mới.`
   - Nội dung: (nhập vài dòng mô tả)
   - **Thanh công cụ:** Bold, Italic, Link, Image, Code, List (mô phỏng)

6. **Gắn affiliate link (QUAN TRỌNG — đặc trưng đề tài)**
   - **Phần "Liên kết tiếp thị"** phía bên phải
   - Chọn đối tác: `Shopee Affiliate`
   - Loại: `Link mua chính`
   - Nhập URL: `https://shopee.vn/samsung-s24-ultra`
   - Bấm **"Thêm link"**
   - ✅ Link hiện trong danh sách với icon 🛒 + tên đối tác + URL

7. **Thêm link thứ 2**
   - Đối tác: `Lazada Partner`
   - URL: `https://lazada.vn/samsung-s24-ultra`
   - Bấm **"Thêm link"**
   - ✅ Hiện 2 affiliate links

8. **Demo validation URL lỗi**
   - Nhập URL không hợp lệ (ví dụ: `abc.com` không có http)
   - ✅ Hiện lỗi: "URL không hợp lệ. Vui lòng nhập link bắt đầu bằng http:// hoặc https://"

9. **Lưu bài viết**
   - Chọn trạng thái: **"Chờ duyệt"** (pending)
   - Bấm **"Gửi bài viết"**
   - ✅ Toast: "Đã tạo và gửi duyệt bài viết thành công!"
   - ✅ Affiliate links được lưu vào DB
   - ✅ Chuyển về content-manager.html, bài mới hiện trạng thái **"⏳ Chờ duyệt"**

10. **Demo gửi duyệt không có affiliate** (trường hợp lỗi)
    - Tạo bài mới → KHÔNG thêm affiliate link → chọn "Chờ duyệt" → Bấm Gửi
    - ✅ Hiện lỗi: "Bài viết cần có ít nhất 1 liên kết tiếp thị (affiliate link) hoạt động"

---

## 🎬 SCENE 6: AFFILIATE MANAGER — QUẢN LÝ LINK + ĐỐI TÁC + HOA HỒNG
**Vai trò:** Affiliate Manager (Partner)
**Trang:** [manage-affiliates.html](file:///d:/5_ThuongMaiDTu/webTMDT/ftech_ecm_v2/manage-affiliates.html)

### 6.1 Đăng nhập Affiliate Manager

1. **Đăng nhập**
   - Login.html → Click **"🤝 Partner"**
   - Username = `partner`, Password = `123`
   - ✅ Modal: "Xin chào, Võ Minh Hoàng!" + "Affiliate Manager"
   - Bấm **"Vào trang Affiliate Manager"**

### 6.2 Dashboard Affiliate

2. **Giới thiệu trang quản lý**
   - **4 KPI cards:** Tổng links, Tổng clicks, Avg CTR, Doanh thu hoa hồng
   - **Warning banner:** "X link affiliate bị lỗi" (nếu có)
   - **Filter chips:** Tất cả / Theo sản phẩm / Theo bài viết / Theo đối tác / Lỗi
   - **Bảng affiliate links:** Tên + ảnh, URL nội bộ + URL gốc, Đối tác, Bài viết, Click, CVR, Ngày, Hoa hồng, Trạng thái, Hành động

3. **Lọc theo trạng thái**
   - Click chip **"Lỗi"** → chỉ hiện link có status = `error`
   - ✅ Hiện link lỗi: "Sony WH-1000XM5 - Tiki" với badge **"LINK LỖI"**

### 6.3 Sửa link lỗi

4. **Sửa link bị lỗi**
   - Click 🔧 (nút sửa lỗi) trên link lỗi
   - ✅ Modal "Sửa link affiliate bị lỗi"
   - Sửa URL mới: `https://tiki.vn/sony-wh1000xm5-moi`
   - Trạng thái tự chuyển: `error` → `active`
   - Bấm **Lưu**
   - ✅ Toast: "Đã cập nhật link affiliate thành công."
   - ✅ Warning banner biến mất (nếu hết link lỗi)

### 6.4 Tạo link affiliate mới

5. **Bấm "Tạo link mới"**
   - ✅ Modal "Tạo link affiliate mới"
   - Tên: `Galaxy Tab S9 - Shopee`
   - Đối tác: `Shopee Affiliate`
   - Bài viết gắn: `Review Samsung Galaxy S24 Ultra`
   - URL: `https://shopee.vn/galaxy-tab-s9`
   - Trạng thái: `Hoạt động`
   - Bấm **Lưu**
   - ✅ Link mới hiện trong bảng

### 6.5 Cấu hình hoa hồng

6. **Mở modal Hoa hồng**
   - Click ⚙ trên bất kỳ link → modal **"Cấu hình hoa hồng"**
   - Nhập tỷ lệ mới: Min `5%`, Max `10%`
   - Bấm **Lưu**
   - ✅ Toast: "Đã lưu tỷ lệ hoa hồng mới và ghi log thay đổi commission."
   - ✅ Hệ thống lưu commission log (oldRate → newRate + changedBy + changedAt)

### 6.6 Xóa link affiliate

7. **Xóa 1 link**
   - Click 🗑️ trên link
   - ✅ Modal xác nhận xóa (showConfirm) với backdrop blur
   - Bấm **Xóa** → link biến mất

### 6.7 Đăng ký đối tác mới

8. **Bấm "Đăng ký đối tác mới"** (nếu sidebar có)
   - ✅ Modal đăng ký: Tên, Email, Ngành, Hoa hồng, Website, Ghi chú
   - Nhập: Tên `FPT Shop`, Email `partner@fptshop.com.vn`, Website `fptshop.com.vn`
   - Bấm **Lưu**
   - ✅ Toast: "Đã thêm đối tác mới vào danh sách chờ duyệt."

---

## 🎬 SCENE 7: SUPER ADMIN — DASHBOARD + DUYỆT BÀI VIẾT
**Vai trò:** Super Admin
**Trang:** [dashboard.html](file:///d:/5_ThuongMaiDTu/webTMDT/ftech_ecm_v2/dashboard.html) → [manage-posts.html](file:///d:/5_ThuongMaiDTu/webTMDT/ftech_ecm_v2/manage-posts.html)

### 7.1 Đăng nhập Super Admin

1. **Đăng nhập**
   - Login.html → Click **"⚙️ Admin"**
   - Username = `admin`, Password = `123`
   - ✅ Modal: "Xin chào, Nguyễn Minh Vỹ!" + "Super Admin"
   - Bấm **"Vào trang Admin Dashboard"**

### 7.2 Admin Dashboard

2. **Giới thiệu KPI tổng quan**
   - **4 KPI cards:** Tài khoản, Bài viết, Click affiliate, Doanh thu hoa hồng
   - ✅ Dữ liệu tính realtime từ click logs + commission rate
   - **Alert card:** "X bài viết đang chờ duyệt" → bấm để chuyển sang duyệt

3. **Biểu đồ + Top xếp hạng**
   - **Weekly Chart:** Biểu đồ cột bài viết + click theo tuần
   - **Top bài viết hiệu quả:** Xếp hạng theo lượt xem, click AFF, CTR
   - **Top đối tác:** Xếp hạng theo doanh thu + click + chuyển đổi
   - **Funnel analytics:** Views → Clicks → Conversions

4. **Hoạt động gần đây**
   - Bài viết mới nhất
   - Thành viên đăng ký mới
   - Thống kê: X bài chờ duyệt, Y bình luận chờ duyệt, Z click nghi ngờ

5. **Bấm nút "Làm mới dữ liệu"**
   - ✅ Toast: "Dữ liệu hệ thống đã được cập nhật mới nhất."

### 7.3 Duyệt bài viết

6. **Chuyển sang Quản lý bài viết**
   - Sidebar → **"Duyệt bài viết"** hoặc click alert
   - Trang `manage-posts.html`

7. **Giới thiệu giao diện**
   - **Stats:** Tất cả / Nháp / Chờ duyệt / Đã duyệt / Từ chối
   - **Filter chips:** Click "Chờ duyệt" → chỉ hiện bài pending
   - **Bộ lọc:** Danh mục, Tác giả, Sắp xếp
   - **Tìm kiếm:** Gõ tên bài viết

8. **Xem trước + Duyệt bài (Approve)**
   - Click 👁️ trên bài "Chờ duyệt"
   - ✅ Modal preview: thumbnail, tiêu đề, tác giả, ngày, trạng thái
   - ✅ Hiện phần "Affiliate links đang gắn trong bài (X links)" + partner + click
   - ✅ 2 nút: **"✕ Từ chối"** và **"✓ Duyệt bài"**
   - Bấm **"✓ Duyệt bài"**
   - ✅ Modal xác nhận (showConfirm): "Bạn có chắc muốn phê duyệt?"
   - ✅ Toast: "Bài viết đã được duyệt và xuất bản."
   - ✅ Bài chuyển trạng thái: pending → approved
   - ✅ Bài sẽ hiện trên trang chủ cho người dùng xem

9. **Từ chối bài viết (Reject)**
   - Click ✕ trên 1 bài khác
   - ✅ Modal "Từ chối bài viết" với textarea lý do
   - Nhập lý do: `Nội dung review chưa đi sâu vào phân tích hiệu năng. Vui lòng bổ sung benchmark cụ thể.`
   - Bấm **Từ chối**
   - ✅ Toast: "Đã từ chối bài viết và gửi lý do cho tác giả."
   - ✅ Lý do hiện trong bảng: "Từ chối: Nội dung review chưa đi sâu..."
   - ✅ Content Manager sẽ thấy lý do này trong trang của mình

10. **Duyệt hàng loạt (Bulk)**
    - Tick checkbox nhiều bài → hiện **Bulk Action Bar** ở dưới
    - Bấm **"Duyệt tất cả"** → xác nhận → tất cả bài được duyệt
    - Hoặc **"Từ chối tất cả"** → nhập lý do chung

11. **Chỉnh sửa bài viết**
    - Click ✏️ → modal chỉnh sửa: Tiêu đề, Tác giả, Danh mục, Trạng thái
    - Sửa → Lưu → toast thành công

---

## 🎬 SCENE 8: SUPER ADMIN — DUYỆT BÌNH LUẬN + QUẢN LÝ TÀI KHOẢN
**Vai trò:** Super Admin (đang đăng nhập)
**Trang:** [manage-comments.html](file:///d:/5_ThuongMaiDTu/webTMDT/ftech_ecm_v2/manage-comments.html) → [manage-partners.html](file:///d:/5_ThuongMaiDTu/webTMDT/ftech_ecm_v2/manage-partners.html) → [manage-accounts.html](file:///d:/5_ThuongMaiDTu/webTMDT/ftech_ecm_v2/manage-accounts.html)

### 8.1 Duyệt bình luận

1. **Mở trang duyệt bình luận**
   - Sidebar → **"Duyệt bình luận"**
   - `manage-comments.html`

2. **Giới thiệu giao diện**
   - **Stats:** X chờ duyệt · Y đã duyệt · Z từ chối
   - **Filter chips:** Tất cả / Chờ duyệt / Đã duyệt / Từ chối
   - **Tìm kiếm:** Tìm theo tên, nội dung, bài viết

3. **Duyệt bình luận (Approve)**
   - Click ✓ trên bình luận "Chờ duyệt" (bình luận từ Scene 3)
   - ✅ Trạng thái chuyển: pending → **"Đã duyệt"**
   - ✅ Bình luận giờ sẽ hiện trên trang product.html cho mọi người xem

4. **Từ chối bình luận (Reject)**
   - Click ✕ trên bình luận khác
   - ✅ Modal "Từ chối bình luận": hiện nội dung bình luận + textarea lý do
   - Nhập lý do: `Bình luận không liên quan đến sản phẩm.`
   - Bấm **Xác nhận từ chối**
   - ✅ Trạng thái: pending → **"Từ chối"** + hiện lý do

5. **Lọc theo trạng thái**
   - Click "Đã duyệt" → chỉ hiện bình luận approved
   - Click "Từ chối" → hiện bình luận rejected + lý do

### 8.2 Quản lý đối tác

6. **Mở trang quản lý đối tác**
   - Sidebar → **"Quản lý đối tác"**
   - `manage-partners.html`

7. **Giới thiệu giao diện**
   - **Stats:** Tổng đối tác, Chờ duyệt, Tổng click, Doanh thu, Top đối tác
   - **Grid View:** Mỗi đối tác = 1 card với logo, tên, danh mục, domain, email, click, CVR, hoa hồng

8. **Duyệt đối tác mới**
   - Đối tác **"GearVN Affiliate"** đang ở trạng thái **"Chờ duyệt"**
   - Bấm **"Duyệt đối tác"**
   - ✅ Modal xác nhận + ghi chú
   - Bấm **Duyệt** → trạng thái chuyển active
   - ✅ Toast thành công

9. **Tạm dừng đối tác**
   - Trên 1 đối tác hoạt động → bấm **"Tạm dừng"**
   - ✅ Modal xác nhận → trạng thái: active → paused
   - Card đối tác chuyển style mờ

10. **Kích hoạt lại đối tác**
    - Trên đối tác đang paused (ví dụ Tiki Trading) → bấm **"Kích hoạt lại"**
    - ✅ Trạng thái: paused → active

### 8.3 Quản lý tài khoản

11. **Mở trang quản lý tài khoản**
    - Sidebar → **"Quản lý tài khoản"**
    - `manage-accounts.html`

12. **Giới thiệu giao diện**
    - **Stats:** Tổng TK, Hoạt động, Affiliate, Bị khóa
    - **2 bảng:** Tài khoản Admin + Tài khoản Người dùng
    - Mỗi hàng: Avatar, Tên, Email, Vai trò, Trạng thái, Phạm vi, Ngày, Actions

13. **Thêm tài khoản admin mới**
    - Bấm **"Thêm tài khoản"**
    - ✅ Modal: Username, Mật khẩu, Họ tên, Vai trò, Trạng thái, Phạm vi, Avatar
    - Nhập: username `editor01`, password `123456`, tên `Lê Minh Editor`, vai trò `Content Manager`
    - Bấm **Lưu**
    - ✅ Toast: "Đã thêm tài khoản admin thành công."

14. **Khóa tài khoản (Lock Account)**
    - Click 🔑 trên tài khoản `customer2`
    - ✅ Modal "Khóa tài khoản" + trường lý do
    - Nhập lý do: `Vi phạm chính sách bình luận. Sử dụng ngôn từ không phù hợp nhiều lần.`
    - Bấm **Khóa**
    - ✅ Trạng thái: active → **"Bị khóa"**
    - ✅ Nếu user đó đang đăng nhập ở tab khác → bị đá ra login.html với thông báo lý do

15. **Mở khóa tài khoản**
    - Click 🔑 lần nữa trên tài khoản đã khóa
    - ✅ Toggle: locked → active
    - ✅ Toast: "Đã mở khóa tài khoản"

16. **Xóa tài khoản**
    - Click 🗑 trên 1 tài khoản (trừ admin tối cao)
    - ✅ Modal xác nhận (showConfirm) → xóa thành công
    - Thử xóa tài khoản `admin` → ✅ "Không thể xóa tài khoản Super Admin tối cao!"

---

## 🎬 SCENE 9: LUỒNG END-TO-END LIÊN KẾT AFFILIATE
**Vai trò:** Đa vai trò (tổng kết)
**Mục tiêu:** Chứng minh toàn bộ hệ thống liên kết hoạt động đồng bộ.

### Kịch bản luồng hoàn chỉnh:

1. **Content Manager tạo bài → gắn affiliate → gửi duyệt**
   - (Đã demo ở Scene 5)

2. **Super Admin duyệt bài → bài xuất bản lên trang chủ**
   - (Đã demo ở Scene 7)

3. **Customer đọc bài → click affiliate → ghi nhận click**
   - Đăng nhập customer → vào trang chủ → tìm bài vừa duyệt
   - Click vào bài → xem chi tiết → click "Đi đến nơi bán"
   - ✅ Redirect page ghi nhận click
   - ✅ Click log: linkId, partnerId, postId, username, timestamp, IP, status

4. **Customer gửi bình luận → Admin duyệt**
   - Customer gửi bình luận ở product.html → status = pending
   - Admin mở manage-comments → duyệt → bình luận hiện public

5. **Customer gửi đánh giá (vì đã mua hàng qua affiliate)**
   - Customer vào reviewModule → gửi đánh giá
   - ✅ Hệ thống xác minh "Verified Purchase" = true (vì có click log)
   - ✅ Đánh giá hiện badge "✓ Đã duyệt"

6. **Affiliate Manager xem click tăng**
   - Đăng nhập partner → manage-affiliates
   - ✅ Tổng click đã tăng (từ bước 3)
   - ✅ CVR, Doanh thu hoa hồng cập nhật realtime

7. **Super Admin xem Dashboard**
   - Đăng nhập admin → dashboard
   - ✅ KPI click tăng, doanh thu tăng
   - ✅ Top bài viết cập nhật
   - ✅ Funnel analytics phản ánh chuyển đổi mới

---

## 📌 CÁC TRƯỜNG HỢP ĐẶC BIỆT CẦN DEMO (NẾU CÒN THỜI GIAN)

| STT | Trường hợp | Cách demo | Kết quả |
|-----|------------|-----------|---------|
| 1 | Đăng nhập sai mật khẩu | Login → nhập password sai | Hiện lỗi "Mật khẩu không chính xác" |
| 2 | Tài khoản không tồn tại | Login → nhập username `xyz` | Hiện lỗi "Tài khoản không tồn tại" |
| 3 | Tài khoản bị khóa | Login → nhập tài khoản đã bị lock | Hiện cảnh báo tài khoản bị khóa + lý do |
| 4 | Đăng nhập Social (mô phỏng) | Click Google/Facebook | Toast mô phỏng luồng xác thực |
| 5 | Click affiliate nghi ngờ | Click cùng link >5 lần/giờ | Log status = "suspicious", không tăng click |
| 6 | Trang hồ sơ cá nhân | Login customer → click avatar | Hiện profile: thông tin, review, comment, đổi mật khẩu |
| 7 | Reset mật khẩu | Truy cập reset-password.html | Form nhập email → xác nhận |

---

## 🎯 CHECKLIST TRƯỚC KHI QUAY

- [ ] Chạy `localStorage.clear(); sessionStorage.clear();` để reset dữ liệu
- [ ] Mở DevTools → kiểm tra Console không có lỗi đỏ
- [ ] Test nhanh: login → trang chủ → product → review → dashboard
- [ ] Đảm bảo server HTTP đang chạy (`http-server -p 8080`)
- [ ] Tắt thông báo hệ thống / popup không liên quan
- [ ] Phóng to trình duyệt 100-110% cho dễ xem
- [ ] Chuẩn bị sẵn 4 tab cho 4 vai trò (nếu cần demo đa session)

---

## 🔑 TÀI KHOẢN DEMO

| Username | Password | Vai trò | Trang chính |
|----------|----------|---------|-------------|
| `customer` | `123` | 👤 Customer (Người dùng) | trangchu.html |
| `content` | `123` | ✍️ Content Manager | content-manager.html |
| `partner` | `123` | 🤝 Affiliate Manager | manage-affiliates.html |
| `admin` | `123` | ⚙️ Super Admin | dashboard.html |
| `customer2` | `123` | 👤 Customer (có 2 warning) | trangchu.html |

---

> **Ghi chú cho người quay:** Nên quay theo đúng thứ tự Scene 1→9 để luồng dữ liệu liên tục (bình luận Scene 3 → duyệt Scene 8, bài viết Scene 5 → duyệt Scene 7). Tốc độ thao tác vừa phải, di chuột chậm để viewer theo dõi được. Mỗi khi có toast/modal hiện ra → dừng 2-3 giây cho viewer đọc.
