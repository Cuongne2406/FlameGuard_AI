# HƯỚNG DẪN CẢI THIỆN UI/UX

## NGỮ CẢNH
Tài liệu này mô tả những phần cần GIỮ NGUYÊN, CHỈNH SỬA hoặc THẢO LUẬN thêm dựa trên đánh giá UI/UX của ứng dụng.

---

## 1. Thứ tự ưu tiên nội dung (Hierarchy)

### Vấn đề
- Các thành phần hiển thị ngang nhau → người dùng không biết nên tập trung vào đâu.

### Hành động
- THẢO LUẬN: Cần xác định lại thứ tự ưu tiên nội dung.

### Thứ tự đề xuất
1. Sự kiện  
2. Check-in  
3. Thông tin cá nhân  

---

## 2. Nút hành động (CTA - Check-in)

### Vấn đề
- Nút Check-in chưa rõ ngữ cảnh sử dụng.

### Quyết định
- GIỮ NGUYÊN concept “check-in nhanh”.

### Hành động
- KHÔNG thêm ngữ cảnh (ví dụ: “Check-in sự kiện ABC”).
- GIỮ chức năng quét QR nhanh.
- ĐẢM BẢO nút xuất hiện ngay trang chủ.

### Cải tiến
- TĂNG độ nổi bật (màu sắc, kích thước, vị trí).

---

## 3. Empty State (màn hình trống)

### Vấn đề
- Chỉ hiển thị thông báo “không có dữ liệu”.

### Quyết định
- KHÔNG cần thêm gợi ý hành động.

### Hành động
- GIỮ đơn giản.
- TÙY CHỌN: Có thể thêm nút điều hướng cơ bản nếu cần.

---

## 4. Tìm kiếm & Bộ lọc

### Vấn đề
- Tìm kiếm còn đơn giản.

### Hành động (BẮT BUỘC SỬA)
- THÊM bộ lọc:
  - Thời gian  
  - Địa điểm  
  - Loại hoạt động  
- THÊM gợi ý tìm kiếm:
  - Tìm kiếm gần đây  
  - Từ khóa phổ biến  

---

## 5. Tính tương tác (Interactivity)

### Vấn đề
- Biểu đồ, thành tích chỉ để xem, không tương tác.

### Hành động (BẮT BUỘC SỬA)
- CHO PHÉP click để xem chi tiết.  
- THÊM hiệu ứng khi người dùng thao tác (animation nhẹ).

---

## 6. Micro-interaction

### Vấn đề
- Giao diện tĩnh, thiếu cảm giác phản hồi.

### Hành động (BẮT BUỘC SỬA)
- THÊM animation:
  - Chuyển tab  
  - Nhấn nút  
- THÊM loading skeleton.

---

## 7. Tính nhất quán (Consistency)

### Vấn đề
- Bo góc, shadow, khoảng cách chưa đồng đều.

### Hành động (BẮT BUỘC SỬA)
- XÂY DỰNG design system thống nhất:
  - Bo góc  
  - Spacing  
  - Shadow  

---

## 8. Thông báo

### Vấn đề
- Chưa phân loại, chưa nổi bật.

### Hành động (BẮT BUỘC SỬA)
- PHÂN LOẠI:
  - Sự kiện  
  - Hệ thống  
  - Điểm  
- LÀM NỔI BẬT thông báo chưa đọc.

---

## TỔNG KẾT

### GIỮ NGUYÊN
- Check-in nhanh (QR)
- Empty state đơn giản

### CẦN SỬA (ƯU TIÊN CAO)
- Tìm kiếm & bộ lọc  
- Tính tương tác  
- Micro-interaction  
- Tính nhất quán  
- Thông báo  

### CẦN THẢO LUẬN
- Thứ tự ưu tiên nội dung (Home screen)