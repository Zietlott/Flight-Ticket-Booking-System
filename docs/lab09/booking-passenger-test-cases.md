
# Lab09 - Booking & Passenger Test Report

## Thành viên phụ trách: TV3

- Module: Booking & Passenger
- Loại kiểm thử: Unit Test
- Framework: Jest
- Nguồn mã kiểm thử: origin/feature/lab09-integration
- File nghiệp vụ: services/bookingService.js
- File kiểm thử: tests/booking.test.js

## 1. Kết quả kiểm thử

| ID | Test Case | Status |
|---|---|---|
| BK01 | Đặt vé với thông tin hợp lệ | PASS |
| BK02 | Thiếu họ tên hành khách | PASS |
| BK03 | Thiếu số hộ chiếu | PASS |
| BK04 | Số hộ chiếu sai định dạng | PASS |
| BK05 | Chuyến bay hết chỗ | PASS |
| BK06 | Danh sách hành khách rỗng | PASS |
| BK07 | Chuẩn hóa thông tin hành khách hợp lệ | PASS |
| BK08 | Đặt vé khi còn đúng một chỗ | PASS |
| BK09 | Số hành khách vượt số ghế còn lại | PASS |
| BK10 | Tính tổng tiền cho nhiều hành khách | PASS |
| BK11 | Giá chuyến bay không hợp lệ | PASS |
| BK12 | Kiểu dữ liệu hành khách không hợp lệ | PASS |

## 2. Tổng hợp kết quả

- Tổng số Test Case: 12
- PASS: 12
- FAIL: 0
- BLOCKED: 0
- Test Suites: 1 passed

## 3. Code Coverage

| Metric | Coverage |
|---|---|
| Statements | 91.17% |
| Branches | 92.85% |
| Functions | 100% |
| Lines | 91.17% |

Các dòng chưa được bao phủ: 35, 40, 48
trong services/bookingService.js.

## 4. Lệnh thực thi

npm test -- --coverage --runInBand \
  --modulePathIgnorePatterns='<rootDir>/backend/' \
  --runTestsByPath tests/booking.test.js \
  --collectCoverageFrom=services/bookingService.js

## 5. Kết luận

Đã thực thi thành công 12 Unit Test cho
Booking & Passenger Service.

Tất cả Test Case BK01-BK12 đều PASS.

Code Coverage đạt 91.17% Statements,
92.85% Branches, 100% Functions và
91.17% Lines.

Kết quả được xác nhận trên mã nguồn của
branch feature/lab09-integration.
