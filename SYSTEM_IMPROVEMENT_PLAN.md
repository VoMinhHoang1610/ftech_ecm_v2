# Kế Hoạch Chi Tiết Hoàn Thiện Hệ Thống FTECH - Đạt Chuẩn Báo Cáo Học Thuật & Đồng Bộ Dữ Liệu 100%

Kế hoạch này thiết lập lộ trình tối ưu và chi tiết nhất để nâng cấp dự án FTECH thành một **Website Thương mại Điện tử Tiếp thị Liên kết (Affiliate)** chuyên nghiệp, đạt đầy đủ các tiêu chuẩn khắt khe phục vụ việc chấm điểm đồ án học phần môn Thương mại Điện tử. 

Trọng tâm cốt lõi của kế hoạch này là **đồng bộ hóa và thống nhất dữ liệu hoàn toàn 100% giữa tất cả các phân hệ** (Admin, Tác giả, Đối tác, và Khách hàng) bằng cơ chế Mock Database đồng bộ hóa sự kiện, loại bỏ mọi điểm rời rạc của hệ thống web tĩnh.

---

## 📌 PHÂN TÍCH RÀNG BUỘC ĐỒNG BỘ DỮ LIỆU (DATA CONSISTENCY SCHEMAS)

Để đảm bảo dữ liệu tương tác qua lại rõ ràng, không bị mâu thuẫn giữa các trang, hệ thống Mock Database trong `assets/js/common/db.js` sẽ được xây dựng dựa trên các ràng buộc quan hệ chặt chẽ thông qua các "Khóa Ngoại" (Foreign Keys) giả lập như sau:

* **`ftech_accounts` (Tài khoản người dùng)**
  - `username`: Khóa chính
  - `passwordHash`: Mật khẩu được mã hóa Base64
  - `role`: admin | content | partner | customer
  - `name`: Tên hiển thị
  - `email`: Địa chỉ email
  - `avatar`: Ảnh đại diện
  - `status`: active | locked
  - `createdAt`: Ngày đăng ký

* **`ftech_posts` (Bài viết / Sản phẩm)**
  - `id`: Khóa chính
  - `title`: Tiêu đề
  - `category`: Review | So sánh | Top list | Hướng dẫn
  - `status`: draft | pending | approved | rejected
  - `views`: Lượt xem
  - `date`: Ngày đăng
  - `author`: Khóa ngoại -> ftech_accounts.username
  - `excerpt`: Mô tả ngắn
  - `content`: Nội dung chính
  - `image`: URL ảnh sản phẩm
  - `brand`: Thương hiệu
  - `price`: Giá số nguyên (dùng tính hoa hồng)
  - `oldPrice`: Giá cũ
  - `discount`: % giảm giá
  - `label`: Nhãn (new/sale)
  - `stars`: Điểm trung bình cộng (tính từ ftech_reviews)
  - `rejectReason`: Lý do từ chối (nếu có)

* **`ftech_reviews` (Đánh giá đa tiêu chí từ khách hàng)**
  - `id`: Khóa chính
  - `postId`: Khóa ngoại -> ftech_posts.id
  - `name`: Tên khách hàng
  - `avatar`: URL ảnh đại diện
  - `date`: Ngày đánh giá
  - `stars`: Điểm trung bình của 4 tiêu chí
  - `title`: Tiêu đề đánh giá
  - `text`: Nội dung nhận xét
  - `helpful`: Số lượt bầu chọn hữu ích
  - `verified`: Trạng thái mua hàng (tự động khớp qua ftech_click_logs)
  - `criteria`: { perf (Hiệu năng), build (Độ hoàn thiện), value (Giá trị), service (Dịch vụ) }

* **`ftech_partners` (Đối tác nhà bán lẻ)**
  - `id`: Khóa chính
  - `name`: Tên đối tác
  - `desc`: Mô tả ngắn
  - `logo`: Biểu tượng logo
  - `active`: Trạng thái hoạt động (true/false)
  - `commissionRate`: Tỷ lệ hoa hồng (ví dụ: 0.03 cho 3%)

* **`ftech_affiliates` (Liên kết tiếp thị gắn trong bài viết)**
  - `id`: Khóa chính
  - `postId`: Khóa ngoại -> ftech_posts.id
  - `partnerId`: Khóa ngoại -> ftech_partners.id
  - `type`: Link mua chính | Link so sánh giá
  - `url`: Đường dẫn gốc đến trang đối tác
  - `clicks`: Tổng số click (đồng bộ từ ftech_click_logs)

* **`ftech_click_logs` (Nhật ký click tiếp thị - Lưu vết thời gian thực)**
  - `id`: Khóa chính
  - `linkId`: Khóa ngoại -> ftech_affiliates.id
  - `partnerId`: Khóa ngoại -> ftech_partners.id
  - `postId`: Khóa ngoại -> ftech_posts.id
  - `timestamp`: Thời gian xảy ra click
  - `ipAddress`: IP giả lập
  - `status`: valid | suspicious

* **`ftech_commission_logs` (Nhật ký thay đổi hoa hồng của đối tác)**
  - `id`: Khóa chính
  - `partnerId`: Khóa ngoại -> ftech_partners.id
  - `oldRate`: Tỷ lệ cũ
  - `newRate`: Tỷ lệ mới
  - `changedBy`: Khóa ngoại -> ftech_accounts.username
  - `changedAt`: Thời gian thay đổi
  - `effectiveDate`: Ngày có hiệu lực

---

## 🔁 SỰ TƯƠNG TÁC ĐỒNG BỘ GIỮA CÁC PHÂN HỆ (BUSINESS WORKFLOWS)

### 1. Quy trình Viết bài - Duyệt bài & Xuất bản (Tác giả <-> Admin <-> Độc giả)
- Tác giả gửi bài viết mới $\rightarrow$ trạng thái chuyển thành Chờ duyệt (`pending`).
- Admin duyệt bài viết $\rightarrow$ trạng thái đổi thành `approved`, bài viết tự động hiển thị công khai ở Trang chủ và trang chi tiết sản phẩm.
- Admin từ chối bài viết $\rightarrow$ trạng thái đổi thành `rejected` kèm lý do, bài viết tự động trả về hàng đợi chỉnh sửa của Tác giả.

### 2. Quy trình Click Link -> Thống kê Click -> Tính toán Hoa hồng (Khách hàng <-> Hệ thống <-> Admin/Partner)
- Khách hàng click mua hàng $\rightarrow$ chuyển hướng qua `/redirect.html?linkId=aff-1` $\rightarrow$ Tự động tăng đếm click trong `ftech_affiliates`, ghi log click chi tiết trong `ftech_click_logs`, đồng thời kiểm tra và chặn click tặc (nếu cùng IP click quá 5 lần/giờ $\rightarrow$ đánh dấu `suspicious`).
- Dashboard quản trị tự động quét `ftech_click_logs` để tính toán doanh thu hoa hồng theo công thức: $\sum (\text{Click Hợp lệ} \times \text{Giá sản phẩm} \times \text{Tỷ lệ hoa hồng đối tác})$. Biểu đồ Chart.js tự động vẽ lại cột dữ liệu cập nhật tức thì.

### 3. Quy trình Đánh giá sản phẩm -> Tự động đồng bộ điểm số
- Khách hàng đăng đánh giá đa tiêu chí $\rightarrow$ hệ thống lưu vào `ftech_reviews` $\rightarrow$ Tự động quét toàn bộ đánh giá của sản phẩm đó để tính lại điểm trung bình và cập nhật trường `stars` trong `ftech_posts`, đồng thời vẽ lại thanh biểu diễn phân bổ sao trên giao diện.

### 4. Quy trình Khóa tài khoản & Kiểm tra Quyền truy cập
- Admin khóa tài khoản người dùng vi phạm chính sách $\rightarrow$ Phiên đăng nhập người dùng lập tức bị vô hiệu hóa khi tải lại hoặc chuyển trang, hệ thống tự động đăng xuất và đẩy về trang chủ.

---

## 🎨 TIÊU CHUẨN GIAO DIỆN CHUYÊN NGHIỆP - ĐẠT CHUẨN BÁO CÁO (PREMIUM UI SPECS)

- **Mỹ thuật cao cấp**: Sử dụng bảng màu Harmonious hiện đại, thiết kế các lớp kính mờ **Glassmorphic** kết hợp viền mờ tạo chiều sâu, tích hợp Google Font **Inter** sang trọng.
- **Async Loading Skeletons**: Hiển thị khung xương xám mờ động (Skeleton Loading) khi dữ liệu đang được tải từ Mock DB để giả lập phản hồi của máy chủ thực tế.
- **Micro-animations**: Các thẻ bài viết và nút bấm có chuyển động `scale` nhẹ khi di chuột, thông báo lỗi/thành công (Toasts) có hiệu ứng trượt góc phải màn hình (`slide-in`).

---

## 🚀 LỘ TRÌNH TRIỂN KHAI CHI TIẾT (STEP-BY-STEP ROADMAP)

* **Giai đoạn 1**: Nâng cấp Mock Database & Cơ chế Bất đồng bộ (Tệp `db.js`).
* **Giai đoạn 2**: Thiết lập Xác thực, Phân quyền truy cập nâng cao (Tệp `auth.js`) và trang chuyển hướng trung gian `redirect.html`.
* **Giai đoạn 3**: Đồng bộ nghiệp vụ Đăng bài, Phê duyệt, Đánh giá đa tiêu chí & Bình luận (Tác giả <-> Admin <-> Khách hàng).
* **Giai đoạn 4**: Hoàn thiện Dashboard thống kê trực quan với biểu đồ Chart.js cập nhật trực tiếp theo click.
