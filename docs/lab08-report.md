# BÁO CÁO LAB 08

## Coding Standards, Best Practices và Code Review

### 1. Thông tin chung

| Nội dung | Chi tiết |
|---|---|
| Dự án | Flight Ticket Booking System |
| Nội dung thực hành | Xây dựng và kiểm thử API đăng ký, đăng nhập |
| Nhánh thực hiện | `feature/auth-integration` |
| Ngày thực hiện | 30/10/2026 |
| Công nghệ của module | Node.js, Express, Jest, Supertest, bcryptjs |

> Repository hiện mô tả hệ thống đặt vé máy bay, trong khi module thực hành của Lab 08 là API xác thực. Cần xác nhận với giảng viên/nhóm rằng module này được chấp nhận trong phạm vi bài nộp và thống nhất mô tả công nghệ giữa README với mã nguồn.

### 2. Mục tiêu

- Xây dựng API đăng ký và đăng nhập tài khoản.
- Chuẩn hóa dữ liệu đầu vào, phản hồi HTTP và xử lý ngoại lệ.
- Không lưu mật khẩu dạng văn bản thuần và không gửi thông tin xác thực nhạy cảm trong phản hồi.
- Viết kiểm thử API bằng Jest và Supertest; đo độ bao phủ mã nguồn.
- Thực hiện quy trình Pull Request và Peer Code Review theo yêu cầu Lab.

### 3. Chức năng đã thực hiện

API được triển khai trong `app.js`, nghiệp vụ xác thực nằm trong `services/authService.js`.

| API | Mô tả | Kết quả chính |
|---|---|---|
| `POST /api/auth/register` | Đăng ký tài khoản với `username`, `password` | Trả HTTP 201 khi thành công; HTTP 400 khi dữ liệu không hợp lệ; HTTP 409 nếu username đã tồn tại |
| `POST /api/auth/login` | Xác thực tài khoản với `username`, `password` | Trả HTTP 200 khi thành công; HTTP 400 khi thiếu/sai kiểu dữ liệu; HTTP 401 khi thông tin xác thực không hợp lệ |

Username được loại bỏ khoảng trắng ở hai đầu và chuyển thành chữ thường. Mật khẩu đăng ký phải có tối thiểu 8 ký tự. Dữ liệu tài khoản được lưu trong tệp JSON; mật khẩu được băm bằng bcrypt với 10 salt rounds. Kết quả trả về chỉ gồm thông tin công khai của tài khoản.

### 4. Quy chuẩn và xử lý lỗi

- Sử dụng tên biến/hàm theo camelCase; hằng cấu hình theo UPPER_SNAKE_CASE.
- Tách phần xử lý HTTP khỏi nghiệp vụ xác thực.
- Dùng mã lỗi ổn định để ánh xạ sang HTTP status, không dựa vào so sánh nội dung thông báo.
- Bắt lỗi bất ngờ, ghi log phía máy chủ và trả thông báo chung cho client.
- Giới hạn JSON request ở `10kb`; xử lý riêng JSON sai định dạng, request quá lớn và đường dẫn không tồn tại.
- Loại bỏ `password` và `passwordHash` khỏi thông tin người dùng trả về.

### 5. Rà soát bảo mật cơ bản

- Mật khẩu được băm bằng bcrypt; không lưu mật khẩu gốc.
- Tài khoản không tồn tại và mật khẩu sai dùng cùng thông báo đăng nhập thất bại.
- API kiểm tra kiểu dữ liệu, trường rỗng và độ dài mật khẩu ở phía máy chủ.
- Hiện module dùng tệp JSON, không thực thi truy vấn SQL; do đó SQL Injection chưa áp dụng trực tiếp. Nếu chuyển sang MySQL, cần dùng truy vấn tham số và ràng buộc duy nhất cho username.
- Chưa có giao diện hiển thị dữ liệu người dùng trong phạm vi module này; khi tích hợp frontend, cần hiển thị văn bản bằng `textContent`/cơ chế escape của framework, không đưa dữ liệu chưa tin cậy vào `innerHTML`.
- Tệp JSON phù hợp cho bài thực hành, nhưng chưa phù hợp làm kho dữ liệu production hoặc nhiều tiến trình đồng thời. Nên chuyển sang cơ sở dữ liệu trước khi triển khai thực tế.

### 6. Kiểm thử

Kiểm thử API được viết trong `tests/auth.test.js`, sử dụng Supertest gửi request tới ứng dụng Express. Dữ liệu kiểm thử dùng tệp riêng trong thư mục tạm và được dọn sau khi chạy.

| Mã | Trường hợp kiểm thử | Kết quả mong đợi | Kết quả |
|---|---|---|---|
| TC01 | Đăng ký hợp lệ | HTTP 201; không trả mật khẩu hoặc passwordHash | Đạt |
| TC02 | Đăng ký username đã tồn tại | HTTP 409, mã `USERNAME_TAKEN` | Đạt |
| TC03 | Đăng nhập đúng tài khoản và mật khẩu | HTTP 200 | Đạt |
| TC04 | Đăng nhập với mật khẩu sai | HTTP 401 | Đạt |
| TC05 | Đăng ký với mật khẩu ngắn | HTTP 400, mã `PASSWORD_TOO_SHORT` | Đạt |
| TC06 | Đăng ký với username rỗng | HTTP 400, mã `EMPTY_FIELD` | Đạt |
| TC07 | Đăng ký thiếu mật khẩu | HTTP 400, mã `INVALID_TYPE` | Đạt |

Lệnh kiểm thử:

```powershell
npm.cmd test -- --runInBand
```

Kết quả ghi nhận: **1 test suite passed, 7/7 tests passed**.

### 7. Kết quả coverage

Coverage được tạo bằng lệnh:

```powershell
npm.cmd test -- --coverage --runInBand
```

| Chỉ số | Coverage |
|---|---:|
| Statements | 83.65% |
| Branches | 67.85% |
| Functions | 76.19% |
| Lines | 84.69% |

Các nhánh chưa được bao phủ đầy đủ gồm một số trường hợp lỗi hệ thống/parser, dữ liệu sai kiểu và các nhánh phụ trợ. Có thể cải thiện bằng cách bổ sung test cho JSON sai định dạng, body vượt giới hạn, đăng nhập tài khoản không tồn tại, username có khoảng trắng/khác hoa thường, lỗi đọc/ghi tệp và đăng ký đồng thời.

### 8. Quy trình Git và Peer Code Review

- Mã nguồn và kiểm thử được tổng hợp trên nhánh `feature/auth-integration`.
- Tại thời điểm lập báo cáo, commit mới nhất được xác nhận là `c3339ef` (`chore: ignore local files and lock dependencies`); working tree sạch và nhánh đã đồng bộ với upstream.
- Nhánh tích hợp đích cần theo quyết định của nhóm. Lab ghi `develop`, trong khi repository có nhánh `dev`; cần xác nhận rõ trước khi tạo/hoàn tất PR.
- **Link Pull Request:** [Bổ sung link PR sau khi xác nhận PR tích hợp chính thức]
- **Peer review:** [Bổ sung tối thiểu 3 nhận xét cụ thể của thành viên và minh chứng sau khi hoàn thành]
- **Trạng thái sửa góp ý/merge:** [Cập nhật sau khi review và merge]

Không ghi nhận Peer Code Review hoặc merge là đã hoàn thành khi chưa có link PR và minh chứng review tương ứng.

### 9. Kết luận

Module đăng ký/đăng nhập đã có API, xử lý lỗi cơ bản và kiểm thử tự động. Kết quả hiện tại đạt 7/7 test với coverage Statements 83.65%, Branches 67.85%, Functions 76.19% và Lines 84.69%. Để hoàn tất yêu cầu quy trình Lab 08, cần xác nhận nhánh đích, hoàn tất PR, thu thập ít nhất 3 nhận xét review, xử lý góp ý và lưu minh chứng trước khi nộp.

### 10. Minh chứng cần đính kèm khi nộp

- Link repository và nhánh thực hiện.
- Link Pull Request vào nhánh tích hợp đã thống nhất.
- Ảnh/chụp kết quả `7/7 tests passed` và bảng coverage.
- Minh chứng tối thiểu 3 nhận xét Peer Code Review.
- Minh chứng xử lý góp ý và trạng thái merge PR.
