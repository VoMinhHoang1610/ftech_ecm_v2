# AGENTS.md - Quy tac lam viec du an FTECH

## 1. Quy tac git

- Luon cap nhat code moi nhat tu `develop` truoc khi lam viec.
- Luon kiem tra `git status` va nhanh hien tai truoc khi sua.
- Chi tao nhanh moi tu `develop`, khong tao nhanh tu nhanh cu hoac nhanh chua cap nhat.
- Tạo nhánh riêng để làm đúng task
- Ten nhanh phai la tieng Viet khong dau, ngan gon, de hieu.
- Vi du ten nhanh:
  - `feat/hoan-thien-binh-luan`
  - `fix/sua-giao-dien-trang-chu`
  - `update/dong-bo-mockdata`
- Khong dung ten nhanh dai, kho hieu, hoac khong co y nghia.

## 2. Quy tac code

- Code phai bam sat chuc nang thuc te trong repo.
- Uu tien file `TASK.md` va trang thai code moi nhat.
- Khong sua lan man.
- Khong pha luong hien co.
- Neu co mockdata, phai giu dong bo du lieu giua cac man hinh lien quan.
- Khi sua frontend root, can kiem tra va dong bo ban mirror trong `FTECH_THUONGMAIDIENTU` neu file tuong ung ton tai.

## 3. Quy tac commit
- commit từng file đúng task
- Commit message phai viet bang tieng Viet.
- Commit message phai ngan gon, dung noi dung thay doi, de hieu.
- Vi du:
  - `Hoan thien duyet binh luan`
  - `Sua tim kiem trang chu`
  - `Dong bo du lieu mock`
  - `Cap nhat giao dien demo`

## 4. Quy tac push, PR va merge

- Push nhanh lam viec len remote sau khi da commit va kiem tra.
- Neu can PR, tao PR tu nhanh feature ve `develop`.
- Neu can merge, base phai la `develop`.
- Thu tu lam viec an toan:
  1. `pull develop`
  2. tao nhanh moi
  3. code
  4. kiem tra
  5. commit
  6. push
  7. PR
  8. merge vao `develop`

## 5. Lenh git tham khao

```bash
git checkout develop
git pull --ff-only origin develop
git checkout -b feat/hoan-thien-binh-luan
git status
git add .
git commit -m "Hoan thien duyet binh luan"
git push -u origin feat/hoan-thien-binh-luan
```
