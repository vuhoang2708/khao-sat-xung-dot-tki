# Hệ Thống Khảo Sát Phong Cách Ứng Xử Khi Có Xung Đột Theo Chuẩn TKI (Thomas-Kilmann)

Ứng dụng Web Single Page Application (SPA) cao cấp được phát triển dựa trên kiến trúc chuẩn của **Lam-Sep** và **Khao-Sat-Tinh-Cach**, số hóa 100% tài liệu **"Cẩm nang trắc nghiệm TKI (Thomas-Kilmann) - 30 cặp phát biểu lựa chọn bắt buộc & tự chấm điểm"** kết hợp Trí tuệ cảm xúc (EI) và Giao tiếp trắc ẩn (NVC).

---

## 🚀 Tính Năng Cốt Lõi

1. **Bộ câu hỏi 30 cặp phát biểu chuẩn xác 100% từ PDF gốc**:
   - Triệt tiêu thiên lệch mong muốn xã hội (*Social Desirability Bias*) xuống 17%.
   - Người làm bài lựa chọn giữa Phương án A và Phương án B.
   - Hỗ trợ phím tắt cực nhanh: Phím `A`/`1` chọn A, `B`/`2` chọn B, mũi tên Trái/Phải để chuyển câu.
   - Tự động chuyển câu sau 250ms khi click chọn.

2. **Scoring Engine Toán học Cân Bằng Tuyệt Đối**:
   - Mỗi phương thức (Cạnh tranh, Hợp tác, Thỏa hiệp, Né tránh, Nhượng bộ) xuất hiện chính xác 12 lần (6 lần ở A, 6 lần ở B).
   - Tổng điểm thô toàn bài luôn bằng chính xác 30 điểm.
   - Điểm tối đa mỗi phương thức: 12 điểm.

3. **Trực Quan Hóa Đa Chiều Hiện Đại**:
   - **Ma trận 2 chiều TKI (Thomas-Kilmann 2D Grid)**: Định vị tọa độ hành vi của người làm bài trên 2 trục: Sự quyết đoán (*Assertiveness* - Tung) $\\times$ Sự hợp tác (*Cooperativeness* - Hoành) kèm điểm tâm xung động (pulsing pin).
   - **Biểu đồ Radar 5 trục ngũ giác (SVG thuần)**: Trực quan hóa cấu trúc cân bằng 5 phong cách, tải nhẹ, không phụ thuộc thư viện ngoài.
   - **Thanh đo phân vị 3 mức (Percentile Range Bars)**: Phân vị chuẩn hóa dân số từ Trang 5 PDF (Thấp: 0-25%, Trung bình: 25-75%, Cao: 75-100%).

4. **Định Hướng Tự Vấn Trí Tuệ Cảm Xúc (EI) & Giao Tiếp Trắc Ẩn (NVC)**:
   - Tự vấn khi một phong cách bị lạm dụng (>75%) hoặc thiếu hụt (<25%).
   - Hướng dẫn rèn luyện bước vào chế độ Hợp tác (Collaborating) qua 4 bước NVC: Quan sát $\\rightarrow$ Cảm xúc $\\rightarrow$ Nhu cầu $\\rightarrow$ Đề nghị.
   - Bí quyết giao tiếp và phối hợp với cả 5 phong cách.

5. **Xuất Báo Cáo PDF A4 & Bảo Mật Dữ Liệu**:
   - Xuất file PDF chất lượng cao (2x resolution) tải về máy.
   - Hỗ trợ 2 chế độ:
     + **Ẩn danh & Cục bộ (Mặc định)**: Dữ liệu lưu an toàn trong trình duyệt (`localStorage`), không gửi ra bên ngoài.
     + **Đồng bộ Đám mây**: Gửi kết quả về Google Sheets qua Apps Script Webhook khi người dùng yêu cầu.

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### 1. Cài đặt phụ thuộc:
```bash
cd C:\Users\vu.hoang\.gemini\antigravity\scratch\khao-sat-xung-dot-tki
npm install
```

### 2. Chạy máy chủ phát triển (Development):
```bash
npm run dev
# Truy cập: http://127.0.0.1:5175
```

### 3. Chạy kiểm thử Unit Tests:
```bash
npm run test
# Chạy Vitest kiểm tra toàn bộ 6 test cases của Scoring Engine
```

### 4. Đóng gói Production & Chạy Preview:
```bash
npm run build
npm run preview
# Truy cập: http://127.0.0.1:4175
```

---

## 🌐 Môi Trường Live & Dữ Liệu Trực Tuyến

### 1. Đường Dẫn Khảo Sát Công Khai (Vercel Production):
👉 **[https://khao-sat-xung-dot-tki.vercel.app](https://khao-sat-xung-dot-tki.vercel.app)**
- Ứng dụng Single Page Application (SPA) phát hành trực tiếp trên hạ tầng Vercel Edge Network.
- Tương thích 100% trên điện thoại di động, máy tính bảng và máy tính để bàn.
- Hỗ trợ đầy đủ 3 màn hình: Làm Khảo Sát (Survey), Cơ Sở Khoa Học (Research) và Ứng Dụng Thực Tiễn (Roadmap).

### 2. Bảng Tính Google Sheets Lưu Trữ Phản Hồi (51 Cột):
👉 **[Khảo Sát Xung Đột TKI - Responses](https://docs.google.com/spreadsheets/d/1P8SO3aUPCgcDXkv4EujiWBXdRGSyJml6pWMs5B10cgM/edit)**
- **Tài khoản quản trị**: `vuhoang2708@gmail.com`
- **Sheet `Danh Sách Phản Hồi` (51 Cột)**:
  * Cột 1–5: `Thời gian nộp`, `Họ và tên`, `Email`, `Vị trí / Đơn vị công tác`, `Chế độ thực hiện`
  * Cột 6–7: `Phong cách Chủ đạo (Dominant)`, `Phong cách Thứ cấp (Secondary)`
  * Cột 8–17: Điểm thô và phân vị 5 phong cách (Cạnh tranh, Hợp tác, Thỏa hiệp, Né tránh, Nhượng bộ)
  * Cột 18–19: Tọa độ 2D Quyết đoán (%) & Hợp tác (%)
  * Cột 20–21: Cảnh báo lạm dụng (>75%) & thiếu hụt (<25%)
  * Cột 22–51: Lưu trữ 100% đáp án chi tiết từ `Q1` đến `Q30` (Bảo toàn nguyên vẹn dữ liệu câu hỏi - Question-Level Data Integrity).
- **Sheet `Thống Kê Tổng Quan`**: Tự động tổng hợp tỷ lệ phân bổ người tham gia theo từng phong cách xung đột bằng công thức Google Sheets.

### 3. Google Apps Script Webhook:
- Mã nguồn đầy đủ nằm tại: `apps_script/Code.js`
- Để triển khai Webhook: Mở bảng tính Google Sheets $\rightarrow$ Chọn menu **Tiện ích mở rộng** (Extensions) $\rightarrow$ **Apps Script** $\rightarrow$ Dán nội dung `apps_script/Code.js` $\rightarrow$ Chọn **Triển khai** (Deploy) $\rightarrow$ **Tùy chọn triển khai mới** (New deployment) $\rightarrow$ Loại: **Ứng dụng web** (Web app) $\rightarrow$ Ai có quyền truy cập: **Bất kỳ ai** (Anyone).

### 5. Chạy Kiểm Thử Trình Duyệt Tự Động (Browser UAT):
```bash
python C:\Users\vu.hoang\.gemini\antigravity\brain\418101ca-f849-4eaf-bbf4-2d27953ac694\scratch\run_browser_uat.py
```
