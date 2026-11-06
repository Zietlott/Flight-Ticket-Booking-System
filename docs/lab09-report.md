# BÁO CÁO LAB 09 - SOFTWARE TESTING & UNIT TESTING

## 1. Phạm vi và cách chạy

Phạm vi kiểm thử gồm API Authentication hiện có và các service nghiệp vụ Flight Search, Booking/Passenger, Payment, Ticket được bổ sung trong Lab 09. Test service dùng dữ liệu fixture, không cần database hoặc gọi dịch vụ thanh toán bên ngoài.

```powershell
npm.cmd ci
npm.cmd test -- --runInBand
npm.cmd run test:coverage -- --runInBand
```

`npm test` chạy toàn bộ suite trong `tests/`. Coverage được cấu hình cho `services/**/*.js`; không đại diện cho coverage toàn bộ API, server hoặc frontend.

## 2. Kết quả thực thi

| Chỉ số | Kết quả |
|---|---:|
| Test suites | 6 passed / 6 |
| Test cases | 60 passed / 60 |
| Failed / chưa chạy | 0 / 0 |
| Statements | 94.19% |
| Branches | 92.30% |
| Functions | 91.30% |
| Lines | 94.55% |

Coverage theo service (Statements / Branches / Functions / Lines):

| Module | Statements | Branches | Functions | Lines |
|---|---:|---:|---:|---:|
| `authService.js` | 92.72% | 77.77% | 83.33% | 93.87% |
| `flightSearchService.js` | 100% | 100% | 100% | 100% |
| `bookingService.js` | 91.17% | 92.85% | 100% | 91.17% |
| `paymentService.js` | 90.47% | 94.44% | 100% | 90.47% |
| `ticketService.js` | 100% | 100% | 100% | 100% |

Một số nhánh chưa được bao phủ trong `authService.js` (các dòng 37, 94, 98), `bookingService.js` (35, 40, 48) và `paymentService.js` (14, 40). Ngưỡng Jest hiện đặt ở mức tối thiểu 60% branches và 70% cho statements, functions, lines; kết quả trên vượt các ngưỡng này.

## 3. Danh sách test cases và kết quả

### Authentication API

| Mã | Đầu vào / tình huống | Kết quả mong đợi | Thực tế |
|---|---|---|---|
| TC01 | Đăng ký `testuser` với mật khẩu hợp lệ | HTTP 201; không lộ mật khẩu | PASS |
| TC02 | Đăng ký lại cùng username | HTTP 409, `USERNAME_TAKEN` | PASS |
| TC03 | Đăng nhập đúng tài khoản | HTTP 200 | PASS |
| TC04 | Sai mật khẩu | HTTP 401, `INVALID_CREDENTIALS` | PASS |
| TC05 | Mật khẩu `123` | HTTP 400, `PASSWORD_TOO_SHORT` | PASS |
| TC06 | Username rỗng | HTTP 400, `EMPTY_FIELD` | PASS |
| TC07 | Thiếu mật khẩu | HTTP 400, `INVALID_TYPE` | PASS |
| TC08 | Username chỉ có dấu cách | HTTP 400, `EMPTY_FIELD` | PASS |
| TC09 | Đăng ký `" TestUser "` rồi đăng nhập `"TESTUSER"` | Chuẩn hóa username; đăng nhập HTTP 200 | PASS |
| TC10 | Đăng ký không truyền username | HTTP 400, `INVALID_TYPE` | PASS |
| TC11 | Username là mảng | HTTP 400, `INVALID_TYPE` | PASS |
| TC12 | Đăng nhập username không tồn tại | HTTP 401, `INVALID_CREDENTIALS` | PASS |
| TC13 | JSON sai cú pháp | HTTP 400, `INVALID_JSON` | PASS |
| TC14 | Body lớn hơn 10 KB | HTTP 413, `PAYLOAD_TOO_LARGE` | PASS |
| TC15 | Gọi endpoint không tồn tại | HTTP 404, `NOT_FOUND` | PASS |

### Flight Search

| Mã | Đầu vào / tình huống | Kết quả mong đợi | Thực tế |
|---|---|---|---|
| FS01 | HAN → SGN, ngày `2026-12-01` | Trả các chuyến bay phù hợp | PASS |
| FS02 | Thiếu sân bay đi | `MISSING_AIRPORT` | PASS |
| FS03 | Thiếu sân bay đến | `MISSING_AIRPORT` | PASS |
| FS04 | Điểm đi và đến giống nhau | `SAME_AIRPORT` | PASS |
| FS05 | Thiếu ngày bay | `INVALID_DEPARTURE_DATE` | PASS |
| FS06 | Ngày `2026-02-30` | `INVALID_DEPARTURE_DATE` | PASS |
| FS07 | Không có chuyến phù hợp | Thành công, danh sách rỗng | PASS |
| FS08 | Nhiều chuyến phù hợp, có chuyến hết chỗ | Trả đủ chuyến còn chỗ, loại chuyến hết chỗ | PASS |
| FS09 | Tiêu chí tìm kiếm là `null` | `INVALID_SEARCH_CRITERIA` | PASS |
| FS10 | Danh sách chuyến bay không phải mảng | `INVALID_FLIGHT_LIST` | PASS |

### Booking & Passenger

| Mã | Đầu vào / tình huống | Kết quả mong đợi | Thực tế |
|---|---|---|---|
| BK01 | Một hành khách hợp lệ, chuyến còn chỗ | Tạo booking trạng thái `PENDING_PAYMENT` | PASS |
| BK02 | Thiếu họ tên | `MISSING_PASSENGER_NAME` | PASS |
| BK03 | Thiếu số hộ chiếu | `MISSING_PASSPORT_NUMBER` | PASS |
| BK04 | Hộ chiếu sai định dạng `12-34` | `INVALID_PASSPORT_NUMBER` | PASS |
| BK05 | Chuyến bay còn 0 chỗ | `INSUFFICIENT_SEATS` | PASS |
| BK06 | Danh sách hành khách rỗng | `MISSING_PASSENGERS` | PASS |
| BK07 | Họ tên/số hộ chiếu có khoảng trắng, chữ thường | Chuẩn hóa dữ liệu hành khách | PASS |
| BK08 | Đặt đúng chỗ cuối cùng | Chấp nhận booking | PASS |
| BK09 | 3 hành khách nhưng chỉ có 2 chỗ | `INSUFFICIENT_SEATS` | PASS |
| BK10 | 2 hành khách, giá 1.250.000/người | Tổng tiền 2.500.000 | PASS |
| BK11 | Giá chuyến bay là `Infinity` | `INVALID_FLIGHT_PRICE` | PASS |
| BK12 | Hành khách sai kiểu dữ liệu | `INVALID_PASSENGER` | PASS |

### Payment

| Mã | Đầu vào / tình huống | Kết quả mong đợi | Thực tế |
|---|---|---|---|
| PAY01 | Số tiền khớp booking, lớn hơn 0 | Chấp nhận | PASS |
| PAY02 | Số tiền 0 | `INVALID_PAYMENT_AMOUNT` | PASS |
| PAY03 | Số tiền âm | `INVALID_PAYMENT_AMOUNT` | PASS |
| PAY04 | Số tiền là chuỗi `"1250000"` | `INVALID_PAYMENT_AMOUNT` | PASS |
| PAY05 | Số tiền `NaN` | `INVALID_PAYMENT_AMOUNT` | PASS |
| PAY06 | Số tiền `Infinity` | `INVALID_PAYMENT_AMOUNT` | PASS |
| PAY07 | Thiếu thông tin payment | `MISSING_PAYMENT_DETAILS` | PASS |
| PAY08 | Provider trả về thành công | Payment `PAID` | PASS |
| PAY09 | Số tiền không khớp booking | `PAYMENT_DOES_NOT_MATCH_BOOKING` | PASS |
| PAY10 | Booking ID không khớp | `PAYMENT_DOES_NOT_MATCH_BOOKING` | PASS |
| PAY11 | Provider từ chối thanh toán | `PAYMENT_DECLINED`; không chuyển sang `PAID` | PASS |
| PAY12 | Booking không ở trạng thái chờ thanh toán | `BOOKING_NOT_PAYABLE` | PASS |
| PAY13 | Provider trả trạng thái không hỗ trợ | `INVALID_PROVIDER_STATUS` | PASS |

### Ticket

| Mã | Đầu vào / tình huống | Kết quả mong đợi | Thực tế |
|---|---|---|---|
| TK01 | Booking đã thanh toán, có 2 hành khách | Phát hành 2 vé | PASS |
| TK02 | Booking `PENDING_PAYMENT` | `BOOKING_NOT_PAID` | PASS |
| TK03 | Booking `PAYMENT_FAILED` | `BOOKING_NOT_PAID` | PASS |
| TK04 | Booking đã có vé trong danh sách | `TICKET_ALREADY_ISSUED` | PASS |
| TK05 | Booking đã thanh toán nhưng không có hành khách | `INVALID_BOOKING` | PASS |
| TK06 | Danh sách vé hiện có sai kiểu | `INVALID_TICKET_LIST` | PASS |
| TK07 | Thông tin hành khách không hợp lệ | `INVALID_PASSENGER` | PASS |
| TK08 | Hộ chiếu sai định dạng | `INVALID_PASSENGER` | PASS |

### Luồng tích hợp Booking → Payment → Ticket

| Mã | Đầu vào / tình huống | Kết quả mong đợi | Thực tế |
|---|---|---|---|
| IT01 | Tạo booking hợp lệ, payment thành công | Phát hành vé cho hành khách | PASS |
| IT02 | Tạo booking hợp lệ, payment thất bại | Không phát hành vé | PASS |

## 4. Lỗi gặp trong quá trình kiểm thử

Lượt chạy Jest đầu tiên không khởi động vì `backend/package.json` là tệp rỗng và Jest không thể phân tích nó (`Unexpected end of JSON input`). Đã bổ sung metadata JSON tối thiểu hợp lệ cho package backend; sau đó toàn bộ 60 test chạy thành công.

Các trường hợp số tiền không hữu hạn (`NaN`/`Infinity`), sai kiểu, không khớp booking, hoặc kết quả payment thất bại được đưa vào test để khóa các quy tắc nghiệp vụ và ngăn phát hành vé sai điều kiện.

## 5. Giới hạn

- `processPayment` nhận trạng thái phản hồi provider làm đầu vào; đây là kiểm thử nghiệp vụ với kết quả provider giả lập, **không** gọi cổng thanh toán thật.
- Booking và ticket sử dụng dữ liệu truyền vào, chưa có database. Chống phát hành vé trùng ở đây được kiểm tra trên danh sách vé hiện có trong một lần gọi; cần ràng buộc duy nhất/giao dịch DB để bảo đảm an toàn khi chạy nhiều request đồng thời.
- Coverage chỉ bao gồm service layer được khai báo trong `package.json`, không phải coverage toàn hệ thống.
- Kết quả trên là log chạy trong môi trường phát triển; nếu giảng viên yêu cầu ảnh minh chứng, chụp màn hình terminal sau khi chạy hai lệnh ở mục 1.
