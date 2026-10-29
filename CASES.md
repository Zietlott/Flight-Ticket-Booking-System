# Các trường hợp đăng ký/đăng nhập đã xử lý (services/authService.js)

Mọi hàm trả về `{ success, code, message, user? }`; `user` = `{ id, username, createdAt }` (không có password/passwordHash).

## register(username, password)
| Trường hợp | Kết quả | code |
|---|---|---|
| Hợp lệ (username được trim + lowercase, mật khẩu băm bcrypt) | success | REGISTERED |
| username/password không phải chuỗi | lỗi | INVALID_TYPE |
| username rỗng/chỉ khoảng trắng, password rỗng | lỗi | EMPTY_FIELD |
| Mật khẩu < 8 ký tự | lỗi | PASSWORD_TOO_SHORT |
| Username trùng (không phân biệt hoa/thường, khoảng trắng) | lỗi | USERNAME_TAKEN |
| Mật khẩu đúng 8 ký tự | success | REGISTERED |

## login(username, password)
| Trường hợp | Kết quả | code |
|---|---|---|
| Đúng tài khoản/mật khẩu (username không phân biệt hoa/thường) | success | LOGGED_IN |
| Sai kiểu dữ liệu | lỗi | INVALID_TYPE |
| Bỏ trống | lỗi | EMPTY_FIELD |
| Sai mật khẩu | lỗi | INVALID_CREDENTIALS |
| Tài khoản không tồn tại (cùng thông báo với sai mật khẩu) | lỗi | INVALID_CREDENTIALS |

Chạy kiểm tra: `node tests/authService.test.js` (11/11 pass).
