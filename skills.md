# SKILLS & CODING STANDARDS
## Dự án Fullstack (React + NodeJS + Express)

Tài liệu này định nghĩa **chuẩn tư duy, kỹ thuật và quy tắc code** cho toàn bộ dự án.  
MỌI source code (kể cả sinh bởi AI/Copilot) **BẮT BUỘC** tuân thủ.

---

# 1. TƯ DUY CỐT LÕI (CORE MINDSET)

- Viết code cho **con người đọc**, không phải cho máy
- Ưu tiên:
  - Dễ đọc
  - Dễ hiểu
  - Dễ sửa
  - Dễ mở rộng
- Code chạy đúng **chưa đủ**, phải:
  - Gọn
  - Rõ
  - Có tổ chức
- Luôn tự hỏi:
  - Code này 3 tháng sau còn hiểu không?
  - Có đơn giản hơn không?
  - Có tái sử dụng được không?

---

# 2. NGUYÊN TẮC CLEAN CODE

## 2.1 Quy tắc chung
- Một file → một trách nhiệm chính
- Một hàm → một nhiệm vụ duy nhất
- Tránh logic lồng sâu
- Không copy–paste logic

## 2.2 Loại bỏ rác
- Không để:
  - Code không dùng
  - File không import
  - Comment vô nghĩa
- Xóa ngay khi không cần

---

# 3. COMMENT (BẮT BUỘC)
- Ngắn gọn 1 dòng, nếu những logic khó thì viết lại và giải thích trong readme
- Comment **100% bằng tiếng Việt**
- Comment để giải thích:
  - Ý tưởng
  - Mục đích
  - Lý do (WHY)

### ❌ Không được phép
```js
// cộng a và b
return a + b;
```
