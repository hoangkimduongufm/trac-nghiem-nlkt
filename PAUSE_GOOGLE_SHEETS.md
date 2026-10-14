# Trạng thái tích hợp Google Sheets NLKT

## Đã cấu hình trong workspace

- `Code.gs` hiện dùng Sheet ID `1P2yiwlF4J7eX3R6OK_SLu2-uU4C9nKWrGQMaso-vivA`.
- `Code.gs` nhận lô lượt thi thử, tự tạo `ExamAttempts` và `QuestionStats`, lưu thống kê chương và câu sai/bỏ trống, và cung cấp lịch sử JSONP theo learner ID.
- `script.js` đã đặt URL Web App, tạo learner ID ngẫu nhiên cho trình duyệt, gửi lượt thi thử theo form, giữ hàng đợi local và chờ JSONP xác nhận trước khi báo lưu thành công.
- `GOOGLE_SHEETS_SETUP.md` ghi lại bước thay mã trên Apps Script và triển khai phiên bản mới.

## Còn cần thao tác trong tài khoản Google

1. Dán nội dung `Code.gs` workspace vào dự án Apps Script gắn với Sheet.
2. Cấp quyền truy cập Sheet và triển khai phiên bản mới của Web App.
3. Làm một lượt thi thử để xác nhận hai tab được tạo và dữ liệu được ghi.

Apps Script trên tài khoản Google không thể được cập nhật từ workspace này; URL `/exec` đang cấu hình sẽ chỉ chạy giao thức mới sau khi bạn triển khai mã mới.
