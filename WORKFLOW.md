# Quy trình cập nhật dự án NLKT

Tài liệu này dùng làm quy trình lặp lại khi chỉnh giao diện, luồng làm bài hoặc nội dung của trang trắc nghiệm Nguyên lý Kế toán.

## 1. Xác định phạm vi trước khi sửa

- Đọc `index.html`, `style.css`, `script.js` và chỉ đọc `questions.js` khi yêu cầu liên quan đến ngân hàng câu hỏi.
- Ghi rõ thay đổi thuộc lớp nào:
  - Cấu trúc, nhãn, vị trí phần tử: `index.html`.
  - Trạng thái, lựa chọn câu, tính điểm, đồng hồ, nộp bài: `script.js`.
  - Kích thước, màu sắc, responsive, vị trí cố định: `style.css`.
  - Nội dung hoặc đáp án câu hỏi: `questions.js`.
- Không thay đổi các phần ngoài phạm vi yêu cầu. Giữ nguyên font stack tiếng Việt trong CSS: `Inter, "Segoe UI", sans-serif`.

## 2. Giữ các quy ước giao diện và hành vi

- Trang chính chứa thanh `.mode-bar` và danh sách câu hỏi; không tạo thêm trang điều hướng nếu không được yêu cầu.
- Duy trì các ID đang được JavaScript sử dụng, không để trùng ID:
  - `timer-box`, `time-remaining`.
  - `question-tools`, `question-select`.
  - `submit-button`, `submit-button-bottom`.
  - `back-to-top`.
- Các điều khiển cố định nằm trong `.floating-controls`. Thứ tự hiển thị từ trên xuống:
  1. Đồng hồ thi thử.
  2. Bộ chọn câu hỏi.
  3. Nút **Đầu trang**.
- Đồng hồ chỉ hiện khi thi thử. Bộ chọn câu chỉ hiện ở các chế độ ôn tập. Nút **Đầu trang** vẫn hiện khi cuộn.
- Nút **Nộp bài** trên `.mode-bar` và cuối danh sách dùng chung `submitQuiz()`; cả hai chỉ hiện trong thi thử.
- Thi thử hiện dùng 60 câu trong 60 phút; 5 câu được chọn ngẫu nhiên trong nhóm ID `125, 105, 104, 103, 102, 101, 100, 96, 95, 93, 92`.
- **Làm lại từ đầu** sau kết quả phải khởi động một đề thi thử mới. **Xem lại bài làm** phải hiện lựa chọn của người thi, đáp án đúng và giải thích cho cả câu bỏ trống.

## 3. Thực hiện thay đổi

1. Sửa phần HTML nhỏ nhất có thể; giữ cấu trúc rõ ràng và ghi chú cho các khu vực chính.
2. Với thay đổi hành vi, cập nhật hàm quản lý trạng thái tương ứng trong `script.js` (thường là `setupUIMode`, `renderQuestion`, `submitQuiz`, `closeResults`, `startNewExam`).
3. Với thay đổi hiển thị, cập nhật CSS nền và breakpoint mobile; kiểm tra thứ tự ưu tiên để không che các nút nổi.
4. Sau khi sửa CSS, kiểm tra cặp ngoặc `{}` cân bằng và bảo đảm quy tắc desktop không vô tình nằm trong `@media`.
5. Lưu file dạng UTF-8; không đổi font stack hoặc mã hóa nội dung tiếng Việt.
6. Nếu stylesheet bị trình duyệt lưu cache, tăng giá trị query trong link `style.css?v=...` ở `index.html`.

## 4. Quy tắc hiệu năng

- Giữ việc dựng danh sách câu hỏi theo từng lát ngắn qua `requestAnimationFrame`; không dựng toàn bộ danh sách lớn trong một tác vụ đồng bộ dài.
- Dùng một listener ủy quyền trên `#question-container` cho lựa chọn đáp án thay vì gắn listener riêng cho từng nút.
- Cache tham chiếu DOM dùng lặp lại trong `script.js`; cập nhật số câu đã trả lời và số câu đúng theo thay đổi thay vì quét lại toàn bộ ngân hàng câu hỏi.
- Chỉ thêm Web Worker khi có phép tính hoặc xử lý dữ liệu đủ nặng để tạo độ trễ thấy được. Ngân hàng 185 câu hiện tại nhỏ và thao tác chính phụ thuộc DOM, nên Worker không phù hợp.
- Ưu tiên chuyển động `transform`/`opacity`; tôn trọng `prefers-reduced-motion` và tránh hiệu ứng gây reflow liên tục.
- Chỉ trì hoãn công việc nền khi có công việc không thiết yếu thực sự. Không trì hoãn nội dung câu hỏi mà người dùng cần tương tác ngay.
- Giữ ngân hàng câu hỏi tĩnh; mỗi câu có `chapter: { id, title }` tương ứng mapping 1–185. Không clone sâu hoặc tái tạo dữ liệu nếu không cần thiết.

## Lưu lịch sử thi thử lên Google Sheets

- `Code.gs` nhận theo lô tối đa 10 lượt, tạo tab `ExamAttempts` và `QuestionStats`, thống kê theo chương và upsert an toàn theo Session ID.
- `script.js` lưu mã người thi ngẫu nhiên trong `localStorage`, xếp hàng lượt thi thử chưa đồng bộ và gửi qua URL `/exec` đã cấu hình.
- Popup sau khi nộp hiển thị so sánh số câu đúng/tỷ lệ với lượt trước, điểm từng chương và tối đa 5 câu sai/bỏ trống lặp lại nhiều nhất.
- Dùng `no-cors` cho POST để gửi form không cần preflight; xác nhận lượt đã ghi qua JSONP `doGet?action=history`. Không báo thành công trước khi lịch sử trả về mã lượt.
- Khi cập nhật Apps Script trong Google, phải dán `Code.gs` mới và triển khai **phiên bản mới**; URL `/exec` thường được giữ nguyên khi sửa deployment hiện có.
- Mã người thi chỉ tồn tại trên một trình duyệt/thiết bị. Endpoint public chỉ nên nhận dữ liệu luyện tập không nhạy cảm.
## 5. Kiểm tra thủ công trên Live Server

Mở `http://127.0.0.1:5500/Workspace/NLKT/index.html` và kiểm tra:

- Trang tải đủ câu hỏi, tiếng Việt hiển thị đúng và không có nút trôi khỏi màn hình.
- Ô chọn câu và nút **Đầu trang** có cùng chiều rộng, nằm trong cụm điều khiển nổi; cuộn trang để xác nhận vị trí cố định.
- Ở chế độ ôn tập: bộ chọn câu hiện; đồng hồ và nút nộp bài ẩn.
- Ở chế độ thi thử: đồng hồ đếm lùi, hai nút nộp bài hiện và bộ chọn câu ẩn.
- Sau khi nộp: xem lại có đáp án/giải thích cho mọi câu, kể cả câu chưa chọn.
- Chọn làm lại: bài thi thử mới được tạo và thời gian được đặt lại.
- Kiểm tra lại bố cục ở màn hình hẹp và rộng. Nếu sửa CSS mà preview không đổi, kiểm tra URL stylesheet và tải lại trang.

## 6. Đồng bộ GitHub khi được yêu cầu

Repository: `hoangkimduongufm/trac-nghiem-nlkt`, nhánh `main`.

1. Chỉ chọn các file đã thay đổi cho yêu cầu hiện tại.
2. Đọc phiên bản mới nhất trên `main` trước khi ghi, lấy SHA hiện tại của từng file.
3. Cập nhật tuần tự để tránh ghi đè commit mới trên cùng nhánh.
4. Đọc lại các file sau cập nhật và so sánh với bản local.
5. Báo rõ file đã cập nhật, nhánh và commit cuối cùng. Không nói đã upload nếu bước xác minh chưa thành công.

## Checklist hoàn tất

- [ ] Chỉ sửa đúng file cần thiết.
- [ ] ID HTML/JavaScript không thiếu hoặc trùng.
- [ ] CSS cân bằng ngoặc; font stack được giữ nguyên.
- [ ] Các chế độ ôn tập, thi thử, xem lại và làm lại khớp yêu cầu.
- [ ] Live Server phục vụ HTML/CSS mới.
- [ ] Nếu được yêu cầu, GitHub đã được cập nhật và xác minh.



