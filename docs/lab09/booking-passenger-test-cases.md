
# Lab09 - Booking & Passenger Test Cases

## Thành viên phụ trách: TV3

Module: Booking & Passenger

Loại kiểm thử dự kiến: Unit Test

## Danh sách Test Case

| ID | Test Case | Expected Result | Status |
|---|---|---|---|
| BK01 | Đặt vé với thông tin hợp lệ | Cho phép đặt vé | BLOCKED |
| BK02 | Thiếu họ tên hành khách | Báo lỗi | BLOCKED |
| BK03 | Thiếu giấy tờ tùy thân | Báo lỗi | BLOCKED |
| BK04 | Định dạng giấy tờ không hợp lệ | Báo lỗi | BLOCKED |
| BK05 | Chuyến bay hết chỗ | Từ chối đặt vé | BLOCKED |
| BK06 | Số lượng hành khách không hợp lệ | Báo lỗi | BLOCKED |
| BK07 | Thông tin hành khách hợp lệ | Chấp nhận dữ liệu | BLOCKED |
| BK08 | Chuyến bay còn đúng một chỗ | Xử lý theo quy tắc hệ thống | BLOCKED |

## Kết quả

- Tổng số test case: 8
- PASS: 0
- FAIL: 0
- BLOCKED: 8

## Nguyên nhân BLOCKED

Chưa tìm thấy mã nguồn xử lý Booking & Passenger trên
branch dev hoặc feature/booking.

Các thư mục backend hiện chỉ chứa cấu trúc ban đầu,
chưa có các hàm nghiệp vụ để thực hiện Unit Test.

## Hướng xử lý

Khi module Booking & Passenger được triển khai:
1. Xác định các hàm nghiệp vụ thực tế.
2. Xây dựng dữ liệu kiểm thử.
3. Viết Unit Test bằng Jest.
4. Thực thi BK01-BK08.
5. Chạy Code Coverage.
6. Cập nhật kết quả PASS/FAIL.
