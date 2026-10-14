# Kết nối lịch sử thi thử với Google Sheets

Website NLKT gửi lịch sử bài thi thử đến Apps Script Web App. Popup sau khi nộp hiển thị điểm theo số câu đúng/tổng số câu, tỷ lệ chính xác, so sánh với lượt trước, kết quả theo chương và tối đa 5 câu sai/bỏ trống nhiều nhất. `script.js` tạo một mã người thi ngẫu nhiên trên trình duyệt, lưu tạm lượt thi trong `localStorage`, gửi theo lô và dùng JSONP để xác nhận lượt đã xuất hiện trong lịch sử.

## Cấu trúc dữ liệu

Apps Script tự tạo hai tab nếu chưa có:

- `ExamAttempts`: mỗi dòng là một lượt thi; gồm mã lượt/người thi, số lượt, điểm (số câu đúng), tổng câu, thời gian, thống kê theo chương và câu sai/bỏ trống.
- `QuestionStats`: tổng hợp số lần sai và số lượt xuất hiện của từng câu theo mã người thi.

Mã chương được tính theo ID câu hỏi, theo mapping chương 1–7 đã thống nhất. `learner_id` được lưu trong trình duyệt, nên lịch sử theo mã này chỉ nối tiếp trên cùng trình duyệt/thiết bị.

## Triển khai giao thức

1. Mở Apps Script gắn với Sheet ID `1P2yiwlF4J7eX3R6OK_SLu2-uU4C9nKWrGQMaso-vivA`.
2. Thay toàn bộ nội dung `Code.gs` trên Apps Script bằng file `Code.gs` trong thư mục NLKT.
3. Lưu và cấp quyền cho Apps Script truy cập Google Sheets.
4. Chọn **Triển khai → Quản lý bản triển khai**, bấm biểu tượng sửa tại Web App hiện có, chọn **Phiên bản mới**, rồi triển khai. Giữ quyền truy cập phù hợp để khách dùng website có thể gọi endpoint.
5. Kiểm tra URL `/exec` vẫn là URL đang cấu hình ở đầu `script.js`. Nếu URL đổi, cập nhật hằng `GOOGLE_SHEETS_WEB_APP_URL`.
6. Tải lại website, làm và nộp một bài thi thử. Trạng thái trên đầu trang chỉ báo đã lưu sau khi JSONP đọc thấy mã lượt trong lịch sử; kiểm tra thêm hai tab trong Sheet.

## Giao thức

- Gửi: `POST` dạng `application/x-www-form-urlencoded`, trường `payload` chứa JSON `{ "attempts": [...] }`.
- Nhận lịch sử/xác nhận: `GET /exec?action=history&learner_id=...&callback=...`; Apps Script trả JSONP để trình duyệt đọc được dù website và Apps Script khác origin.
- Gửi lại cùng `sessionId` không tạo thống kê câu trùng; Apps Script bỏ qua lượt đã lưu.
- Lượt thi chờ gửi được giữ trong `localStorage`, rồi thử lại khi mở trang hoặc có mạng.

## Giới hạn

- Mã người thi tự tạo chỉ định danh trên thiết bị/trình duyệt đó; xóa dữ liệu trình duyệt sẽ tạo lịch sử riêng.
- Endpoint công khai có thể bị gọi trực tiếp. Dữ liệu chỉ phục vụ ôn tập; không dùng cho thông tin nhạy cảm hoặc kết quả cần chống gian lận.
- Apps Script phía Google chưa được mình triển khai. Bạn cần dán file `Code.gs` và triển khai phiên bản mới trong tài khoản của bạn.

