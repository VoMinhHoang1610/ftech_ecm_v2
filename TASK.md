# TASK.md - Ke hoach hoan thien demo FTECH trong 2 ngay

Ngay danh gia: 01/06/2026  
Nhanh kiem tra: `develop`  
Trang thai pull: `git pull --ff-only origin develop` tra ve `Already up to date`.

## 1. Tinh trang hien tai

### Ket luan nhanh

Repo hien tai co the demo bang static frontend va mock DB trong `assets/js/common/db.js`. Backend `backend/Fintech.sln` build thanh cong nhung moi la skeleton, API chinh chi tra `Hello World`, nen demo thuc te dang dua vao localStorage/mockdata.

Root frontend va ban mirror `FTECH_THUONGMAIDIENTU` dang dong bo voi cac file chinh da so sanh: `db.js`, `product.js`, `trangchu.html`. Khi sua can tiep tuc dong bo hai ben.

### Da kiem tra

- Nhanh hien tai: `develop`.
- Remote: `origin` tro den GitHub repo `VoMinhHoang1610/ftech_ecm_v2`.
- Pull tu `origin/develop`: thanh cong, da moi nhat.
- Static server: `python -m http.server 8888`, `trangchu.html` tra HTTP 200.
- JS syntax: `node --check` thanh cong voi cac file chinh.
- Backend: `dotnet build backend/Fintech.sln --no-restore` thanh cong, 0 loi.

### Module da co nen giu lai

| Module | File chinh | Trang thai |
| --- | --- | --- |
| Mock DB | `assets/js/common/db.js` | Co accounts, posts, reviews, comments, partners, affiliates, click logs, commission logs. Can bo sung moderation cho comments. |
| Auth/Login | `login.html`, `assets/js/pages/login.js`, `assets/js/common/auth.js` | Dang nhap theo role hoat dong bang mock DB. Account locked bi chan login va bi logout khi reload/chuyen trang. Con dung alert o guard. |
| Trang chu | `trangchu.html`, `assets/js/pages/trangchu.js` | Render bai approved tu mock DB. Tim kiem van la alert, chua loc that. |
| Product detail | `product.html`, `assets/js/pages/product.js` | Doc post theo query id, render affiliate active, comment hien thi tu DB. Chua co duyet comment. |
| Review module | `reviewModule.html`, `assets/js/pages/reviewModule.js` | Luu review vao DB, tinh lai diem post. Chua bat buoc dang nhap, chua chan danh gia trung. |
| Dashboard | `dashboard.html`, `assets/js/pages/dashboard.js` | Doc posts/accounts/partners/click logs, tinh KPI va commission. Con refresh bang alert. |
| Content Manager | `content-manager.html`, `postManager.html`, JS tuong ung | Co draft/pending/approved/rejected. Loi tac gia moi: `postManager.js` luu `author` bang ten hien thi, trong khi `content-manager.js` loc theo username. |
| Manage Posts | `manage-posts.html`, `assets/js/pages/manage-posts.js` | Co duyet/tu choi bai viet. Chua co khu duyet comment. Dang dem affiliate sai theo toan bo DB thay vi theo bai. |
| Manage Accounts | `manage-accounts.html`, `assets/js/pages/manage-accounts.js` | Co them/sua/khoa/mo khoa/xoa account. UI noi "admin" nhung thuc te quan ly ca customer/content/partner. |
| Manage Affiliates | `manage-affiliates.html`, `assets/js/pages/manage-affiliates.js` | Co tao/sua/xoa/sua link loi/commission. KPI tong click dang dua tren `affiliate.clicks`, khong phai log thuc. |
| Manage Partners | `manage-partners.html`, `assets/js/pages/manage-partners.js` | Co tao doi tac pending, duyet/tu choi/tam dung/kich hoat. KPI click/commission phan lon la seed/hardcode, chua tinh tu click logs. |
| Profile Manager | `profileManager.html`, `assets/js/pages/profileManager.js` | Hien thong tin user, review/comment cua user. Comment chua co status/reject reason. |

## 2. Cac loi con ton tai

| Muc do | Chuc nang | File lien quan | Van de | Anh huong demo |
| --- | --- | --- | --- | --- |
| P0 | Duyet binh luan | `assets/js/common/db.js`, `assets/js/pages/product.js`, `assets/js/pages/manage-posts.js`, `assets/js/pages/profileManager.js`, `product.html`, `manage-posts.html`, `profileManager.html` | Comment khong co `status`, khong co `approveComment/rejectComment`; product render tat ca comment va comment moi hien ngay. | Giang vien kiem tra luong binh luan se thay khong co kiem duyet. |
| P0 | Tim kiem trang chu | `assets/js/pages/trangchu.js`, `trangchu.html` | Header search chi `alert('Tim: ...')`, khong loc card/ket qua. | Luong user "tim kiem - loc" trong file Word bi fail. |
| P0 | Content tao bai va xem lai | `assets/js/pages/postManager.js`, `assets/js/pages/content-manager.js` | `postManager.js` luu `author` bang `ftech_username` la ten hien thi; `content-manager.js` loc theo `ftech_user` la username. Bai moi co the khong hien trong workspace cua content. | Demo tao bai/lua nhap/gui duyet de bi dut luong. |
| P0 | Kiem tra affiliate link truoc gui duyet | `assets/js/pages/postManager.js`, `assets/js/pages/content-manager.js`, `assets/js/common/db.js` | Gui duyet/tung tao bai khong bat buoc co affiliate link. | Khong khop tai lieu va workflow "bai review phai co link affiliate". |
| P0 | Duyet bai hien affiliate sai | `assets/js/pages/manage-posts.js` | Preview va row dung `FTECHDB.getAffiliates()` toan bo DB, khong filter theo `post.id`. | Admin co the duyet bai khong co link nhung UI van bao co link. |
| P0 | Product comment count | `assets/js/pages/product.js` | Dem tat ca comments cua post, ve sau can chi dem approved. | Sau khi them moderation, so lieu public co the lech. |
| P1 | Review module | `assets/js/pages/reviewModule.js` | Chua bat buoc dang nhap; neu chua login van lay fallback user. Chua chan duplicate review theo user/post. | Demo co cam giac khong co phan quyen nguoi dung. |
| P1 | Affiliate dashboard/link tracking | `assets/js/pages/manage-affiliates.js`, `assets/js/pages/dashboard.js`, `redirect.html`, `assets/js/common/db.js` | Redirect co ghi click log, dashboard co doc log; nhung manage-affiliates KPI tong click van tinh tu field `affiliate.clicks`, chua doc log thuc. | Sau click, dashboard co the tang nhung man affiliate khong phan anh cung logic. |
| P1 | Partner dashboard | `assets/js/pages/manage-partners.js`, `assets/js/common/db.js` | KPI click/commission cua partner chu yeu dua vao seed `partner.clicks`, khong tinh tu `ftech_click_logs`. | Luong affiliate/partner khong dong bo het. |
| P1 | Alert/confirm/prompt tho | Nhieu file trong `assets/js/pages`, `assets/js/common/auth.js` | Con nhieu `alert()`, `confirm()`, `prompt()` trong luong chinh: admin duyet, refresh dashboard, comment, review, account, affiliate, partner. | Demo kem chuyen nghiep. |
| P1 | Backend | `backend/src/Fintech.Api/Program.cs` | API moi co `MapGet("/", () => "Hello World!")`. | Neu giang vien yeu cau backend that, hien tai chua dap ung; can noi ro demo dung mockdata. |
| P2 | Empty state/table HTML | `manage-posts.js`, `manage-affiliates.js`, `manage-partners.js`, `manage-accounts.js` | Khi rong, mot so noi chen `<div>` truc tiep vao vung table-like body, co the vo layout. | Anh huong giao dien nhung khong chan luong chinh. |
| P2 | Responsive polish | `assets/css/pages/*.css` | Chua co test visual day du tren mobile; bang admin co nguy co tran ngang. | Anh huong diem trinh bay. |
| P2 | Encoding/noi dung hien thi | Nhieu HTML/JS dang co tieng Viet UTF-8, PowerShell mac dinh hien thi sai nhung file co ve dung UTF-8 | Can mo browser de xac nhan khong loi dau tieng Viet. | Neu browser loi font/encoding thi anh huong tham my. |

## 3. Danh sach task uu tien

### P0 - Bat buoc xong truoc demo

1. Bo sung comment moderation vao mock DB.
2. Product chi hien comment approved, comment moi vao pending.
3. Manage Posts them khu duyet/tu choi comment.
4. Profile hien trang thai comment va ly do tu choi.
5. Trang chu tim kiem/loc that, khong alert.
6. Sua author consistency trong `postManager.js`/`content-manager.js`.
7. Gui duyet bai phai kiem tra co affiliate link.
8. Manage Posts filter affiliate theo tung bai.

### P1 - Nen xong de demo thuyet phuc

1. Review module yeu cau dang nhap, chan duplicate review theo user/post.
2. Dong bo manage-affiliates/manage-partners KPI theo click logs.
3. Thay alert/confirm/prompt o cac luong chinh bang toast/modal co san.
4. Dashboard them thong tin comment pending/suspicious clicks ro rang.
5. Account lock co thong bao dep thay vi alert trong auth guard.

### P2 - Neu con thoi gian

1. Empty state dep cho cac man list/table.
2. Responsive polish cho mobile/tablet.
3. Demo script rieng `DEMO_CHECKLIST.md`.
4. Giam hardcode metric phu.

## 4. Phan cong Nhi

### Ngay 1 - UI cho comment moderation va luong content

| Thoi gian | File can sua | Muc tieu | Ket qua mong doi |
| --- | --- | --- | --- |
| 2h | `manage-posts.html`, `assets/css/pages/manage-posts.css` | Them section "Duyet binh luan" trong trang admin. | Co list comment pending/approved/rejected, nut Duyet/Tu choi, modal nhap ly do tu choi. |
| 1.5h | `product.html`, `assets/css/pages/product.css` | Nang cap comment area. | Gui comment co notice "dang cho duyet"; public co empty state khi chua co comment approved. |
| 1.5h | `profileManager.html`, `assets/css/pages/profileManager.css` | Hien trang thai comment cua user. | Tab comment co badge Cho duyet/Da duyet/Tu choi va ly do neu bi tu choi. |
| 1h | `postManager.html`, `content-manager.html`, CSS tuong ung | Bo sung hint/validation UI cho affiliate link khi gui duyet. | Content user biet bai chua du dieu kien gui duyet. |

### Ngay 2 - UI polish va checklist demo

| Thoi gian | File can sua | Muc tieu | Ket qua mong doi |
| --- | --- | --- | --- |
| 2h | `trangchu.html`, `assets/js/pages/trangchu.js`, `assets/css/pages/trangchu.css` | Tim kiem/loc trang chu that, co empty state. | Search theo title/brand/category/excerpt, khong dung alert. |
| 2h | `product.html`, `reviewModule.html`, `dashboard.html`, CSS tuong ung | Polish man demo chinh. | Khong tran text, spacing gon, nut/notice dep hon. |
| 1.5h | `manage-posts.html`, `manage-affiliates.html`, `manage-partners.html`, `manage-accounts.html` | Empty state va table/card polish. | Man admin khong vo layout khi filter rong. |
| 1h | `DEMO_CHECKLIST.md` | Viet kich ban demo. | Co tai khoan, thu tu thao tac, du lieu can reset/chuan bi. |

## 5. Phan cong Hoang

### Ngay 1 - Logic loi va dong bo du lieu

| Thoi gian | File can sua | Muc tieu | Ket qua mong doi |
| --- | --- | --- | --- |
| 2h | `assets/js/common/db.js` | Chuan hoa `ftech_comments`. | Comment co `status`, `userId`, `approvedBy`, `approvedAt`, `rejectedBy`, `rejectedAt`, `rejectReason`; them `getComments(postId, filter)`, `approveComment`, `rejectComment`, `getCommentSummary`. |
| 1.5h | `assets/js/pages/product.js` | Logic comment public/pending. | Chi render approved; user chua login thi yeu cau login; submit luu pending; count dung approved. |
| 1.5h | `assets/js/pages/manage-posts.js` | Logic admin duyet comment. | Render comments pending, duyet/tu choi cap nhat DB, badge pending cap nhat. |
| 1h | `assets/js/pages/profileManager.js` | Profile doc status comment. | User thay duoc comment dang cho duyet/da duyet/tu choi. |
| 1h | `assets/js/pages/postManager.js`, `assets/js/pages/content-manager.js` | Sua author consistency va check affiliate khi gui duyet. | Bai moi cua content hien lai dung workspace; khong gui duyet neu chua co affiliate link. |

### Ngay 2 - Dong bo KPI, phan quyen, mirror MVC

| Thoi gian | File can sua | Muc tieu | Ket qua mong doi |
| --- | --- | --- | --- |
| 1.5h | `assets/js/pages/reviewModule.js`, `assets/js/common/db.js` | Bat buoc login va chan duplicate review. | Review dung user, khong spam duplicate, diem san pham cap nhat. |
| 1.5h | `assets/js/pages/manage-affiliates.js`, `assets/js/pages/manage-partners.js`, `assets/js/pages/dashboard.js` | Dong bo KPI theo click logs. | Click redirect phan anh nhat quan tren dashboard/affiliate/partner. |
| 1h | `assets/js/common/auth.js`, `assets/js/pages/manage-accounts.js` | Account lock flow muot hon. | Account locked bi chan, session bi logout; thong bao dep hon neu kip. |
| 1.5h | `FTECH_THUONGMAIDIENTU/Scripts/js/**`, `FTECH_THUONGMAIDIENTU/Views/**`, `FTECH_THUONGMAIDIENTU/Content/css/**` | Dong bo root frontend sang MVC mirror. | Hai ban chay cung logic va UI. |
| 1h | Toan bo file JS chinh | Kiem tra ky thuat. | `node --check` pass; `dotnet build` pass; luong demo pass bang tay. |

## 6. Checklist nghiem thu

- [ ] `git branch --show-current` dung branch lam viec, base tu `develop`.
- [ ] `git pull origin develop` truoc khi bat dau.
- [ ] `node --check assets/js/common/db.js` pass.
- [ ] `node --check assets/js/pages/product.js` pass.
- [ ] `node --check assets/js/pages/manage-posts.js` pass.
- [ ] `node --check assets/js/pages/reviewModule.js` pass.
- [ ] `node --check assets/js/pages/trangchu.js` pass.
- [ ] `dotnet build backend/Fintech.sln --no-restore` pass.
- [ ] Root frontend va `FTECH_THUONGMAIDIENTU` da dong bo.
- [ ] Khong sua mat thay doi cua nguoi khac.

## 7. Checklist demo

- [ ] Dang nhap `admin/123`, `content/123`, `partner/123`, `customer/123` dung role.
- [ ] Trang chu chi hien bai approved va search/loc ra ket qua that.
- [ ] Click card sang `product.html?id=...` dung san pham.
- [ ] Product hien affiliate active theo dung post.
- [ ] Click affiliate qua `redirect.html?linkId=...` ghi log.
- [ ] Dashboard tang valid click/commission theo click log.
- [ ] Customer gui review, diem trung binh cua product cap nhat.
- [ ] Customer gui comment, comment vao pending va chua hien public.
- [ ] Admin duyet comment, product hien comment.
- [ ] Admin tu choi comment, profile user hien ly do.
- [ ] Content tao bai, luu draft, gui duyet.
- [ ] Gui duyet bi chan neu bai khong co affiliate link.
- [ ] Admin duyet/tu choi bai, trang chu chi hien bai approved.
- [ ] Affiliate Manager sua link loi ve active.
- [ ] Admin duyet/tam dung/kich hoat lai partner.
- [ ] Admin khoa customer, customer bi chan login/bi logout khi reload.
- [ ] Khong con alert tho o cac luong chinh neu da co toast/modal.
- [ ] Desktop va mobile co layout chap nhan duoc, khong tran text nghiem trong.

## 8. Tieu chi hoan thanh

- Demo chay on dinh bang mockdata/localStorage.
- Du lieu nhat quan giua trang chu, product, review, comment, admin, dashboard.
- Comment co duyet/tu choi dung workflow.
- Click affiliate co log va dashboard/affiliate/partner doc cung nguon du lieu.
- Review cap nhat diem san pham.
- Bai viet di dung workflow `draft -> pending -> approved/rejected`.
- Account locked mat quyen truy cap.
- Root frontend va `FTECH_THUONGMAIDIENTU` dong bo.
- Giao dien du dep de trinh bay, khong co nut chet o luong demo chinh.

## 9. Thu tu trien khai an toan nhat

1. Tao branch moi tu `develop`.
2. Hoang sua `db.js` truoc de co contract du lieu comment/review/click.
3. Hoang sua `product.js`, `manage-posts.js`, `profileManager.js`.
4. Nhi sua UI tuong ung cho product/manage-posts/profile.
5. Test end-to-end luong comment.
6. Hoang sua author consistency va affiliate validation.
7. Nhi sua tim kiem trang chu.
8. Hoang dong bo KPI click/partner/affiliate/dashboard.
9. Nhi polish dashboard/product/review/admin tables.
10. Dong bo sang `FTECH_THUONGMAIDIENTU`.
11. Chay node check, dotnet build, checklist demo.
12. Commit theo cum nho va push.

## 10. Huong dan Git commit va push

### Nhi

```bash
git checkout develop
git pull origin develop
git checkout -b feat/demo-ui-polish
git add manage-posts.html product.html profileManager.html trangchu.html assets/css/pages assets/js/pages/trangchu.js DEMO_CHECKLIST.md
git commit -m "Hoan thien UI va checklist demo"
git push -u origin feat/demo-ui-polish
```

### Hoang

```bash
git checkout develop
git pull origin develop
git checkout -b feat/demo-data-workflows
git add assets/js/common/db.js assets/js/pages/product.js assets/js/pages/manage-posts.js assets/js/pages/profileManager.js assets/js/pages/postManager.js assets/js/pages/content-manager.js assets/js/pages/reviewModule.js assets/js/pages/dashboard.js assets/js/pages/manage-affiliates.js assets/js/pages/manage-partners.js assets/js/common/auth.js
git commit -m "Hoan thien luong du lieu demo chinh"
git push -u origin feat/demo-data-workflows
```

### Sau khi merge/pull ve branch chung

```bash
git checkout develop
git pull origin develop
git checkout -b feat/hoan-thien-demo-ftech
git merge feat/demo-data-workflows
git merge feat/demo-ui-polish
git add FTECH_THUONGMAIDIENTU
git commit -m "Dong bo giao dien MVC cho demo"
git push -u origin feat/hoan-thien-demo-ftech
```

PR de xuat:

- Base: `develop`
- Title: `Hoan thien demo FTECH`
- Mo ta: neu ro da test static server, node check, dotnet build, va checklist demo.
