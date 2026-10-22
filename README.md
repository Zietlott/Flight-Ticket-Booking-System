# Student Enrollment & Tuition Management

Hệ thống quản lý đăng ký môn học và thu học phí của sinh viên.

## 1. Giới thiệu

**Student Enrollment & Tuition Management** là dự án phần mềm hỗ trợ quản lý quá trình đăng ký môn học và thu học phí của sinh viên. Repository được sử dụng để lưu trữ mã nguồn, tài liệu thiết kế và phối hợp phát triển giữa các thành viên trong nhóm.

Dự án được thực hiện trong khuôn khổ Lab 07 – Software Implementation & Version Control (Git/GitHub). Nhóm sử dụng Git để quản lý lịch sử thay đổi và GitHub để chia sẻ mã nguồn, review và tích hợp các thay đổi.

> Lưu ý: Nội dung mô tả chức năng chi tiết cần được cập nhật theo phạm vi mà nhóm thực sự triển khai.

## 2. Mục tiêu dự án

- Tổ chức mã nguồn Frontend, Backend và tài liệu thiết kế theo cấu trúc thống nhất.
- Hỗ trợ quản lý thông tin đăng ký môn học của sinh viên theo phạm vi chức năng của dự án.
- Hỗ trợ quản lý thông tin học phí theo phạm vi chức năng của dự án.
- Áp dụng Git/GitHub để làm việc nhóm, quản lý phiên bản và review thay đổi thông qua Pull Request.

## 3. Phạm vi chức năng dự kiến

Tùy theo yêu cầu và tiến độ triển khai, hệ thống có thể bao gồm các nhóm chức năng sau:

- **Quản lý sinh viên:** lưu trữ và tra cứu thông tin sinh viên.
- **Quản lý môn học:** quản lý danh sách môn học và thông tin liên quan.
- **Đăng ký môn học:** ghi nhận và tra cứu các môn học sinh viên đăng ký.
- **Quản lý học phí:** ghi nhận thông tin học phí phải thu và tình trạng thanh toán.
- **Tra cứu và báo cáo:** hỗ trợ tra cứu dữ liệu phục vụ quản lý.

Các chức năng trên là phạm vi tham khảo; chỉ xem là đã hoàn thành khi có mã nguồn và kiểm thử tương ứng.

## 4. Thành viên và phân công

| Thành viên | Nhiệm vụ |
|---|---|
| TV1 | Tạo cấu trúc thư mục Frontend |
| TV2 | Tạo cấu trúc thư mục Backend |
| TV3 | Hoàn thiện README, đặc biệt là hướng dẫn cài đặt và chạy dự án |

Bổ sung họ tên và username GitHub của từng thành viên theo danh sách thực tế của nhóm.

## 5. Công nghệ sử dụng

Cập nhật mục này sau khi nhóm thống nhất công nghệ và cấu hình dự án.

| Thành phần | Công nghệ |
|---|---|
| Frontend | Chưa xác nhận |
| Backend | Chưa xác nhận |
| Database | Chưa xác nhận |
| Quản lý mã nguồn | Git, GitHub |
| IDE đề xuất | Visual Studio Code |

Không cài đặt thư viện hoặc chạy lệnh dành cho một công nghệ cụ thể cho đến khi xác nhận công nghệ đó đang được sử dụng trong repository.

## 6. Cấu trúc thư mục

Cấu trúc mục tiêu theo yêu cầu Lab 07:

```text
student-enrollment-tuition/
├── README.md
├── .gitignore
├── docs/
│   ├── architecture.md
│   ├── database-design.md
│   └── ui-design.md
├── frontend/
└── backend/
```

Ý nghĩa các thành phần:

| Đường dẫn | Mục đích |
|---|---|
| `README.md` | Giới thiệu dự án và hướng dẫn sử dụng |
| `.gitignore` | Khai báo các tệp/thư mục không đưa vào Git |
| `docs/` | Lưu tài liệu thiết kế và mô tả hệ thống |
| `docs/architecture.md` | Mô tả kiến trúc tổng thể |
| `docs/database-design.md` | Mô tả thiết kế cơ sở dữ liệu |
| `docs/ui-design.md` | Mô tả thiết kế giao diện |
| `frontend/` | Mã nguồn giao diện người dùng |
| `backend/` | Mã nguồn xử lý nghiệp vụ và API |

Các thư mục và tệp trong sơ đồ cần được đối chiếu với repository thực tế. Nếu một thành phần chưa được tạo, hãy ghi nhận là chưa có thay vì coi như đã hoàn thành.

## 7. Yêu cầu môi trường

Trước khi cài đặt và chạy dự án, cần chuẩn bị:

- Máy tính chạy Windows, macOS hoặc Linux phù hợp với công nghệ dự án.
- Git đã được cài đặt.
- Visual Studio Code hoặc một trình soạn thảo tương đương.
- Runtime/SDK và các công cụ quản lý gói đúng với công nghệ Frontend, Backend thực tế.
- Hệ quản trị cơ sở dữ liệu nếu ứng dụng có sử dụng Database.
- Quyền truy cập repository GitHub của nhóm.

### 7.1. Kiểm tra Git

Mở Terminal hoặc PowerShell và chạy:

```bash
git --version
```

Nếu terminal hiển thị phiên bản Git, có thể tiếp tục. Nếu không, cài Git từ trang chính thức: https://git-scm.com/install/windows, sau đó mở lại terminal.

### 7.2. Cấu hình thông tin Git

Thay thông tin mẫu bằng tên và email của bạn:

```bash
git config --global user.name "Ho Ten Cua Ban"
git config --global user.email "email-cua-ban@example.com"
```

Kiểm tra cấu hình:

```bash
git config --global --list
```

Nên sử dụng email đã xác minh trên GitHub hoặc email noreply của GitHub nếu muốn bảo vệ địa chỉ email cá nhân. Không chia sẻ mật khẩu hoặc token GitHub cho thành viên khác.

## 8. Hướng dẫn lấy mã nguồn

### 8.1. Clone repository

Trên GitHub, mở repository của nhóm, nhấn **Code**, chọn **HTTPS** và sao chép URL. Trong terminal, di chuyển đến thư mục muốn lưu dự án rồi chạy:

```bash
git clone <REPOSITORY_URL>
cd student-enrollment-tuition
```

Thay `<REPOSITORY_URL>` bằng URL thật của repository. Nếu tên thư mục sau khi clone khác với ví dụ, hãy `cd` vào đúng thư mục đã được tạo.

### 8.2. Kiểm tra repository

```bash
git status
git remote -v
git branch -a
```

- `git status`: kiểm tra trạng thái tệp và nhánh hiện tại.
- `git remote -v`: kiểm tra địa chỉ repository từ xa.
- `git branch -a`: xem các nhánh local và remote.

### 8.3. Mở dự án trong Visual Studio Code

```bash
code .
```

Nếu lệnh `code .` chưa hoạt động, mở Visual Studio Code, chọn **File → Open Folder** và chọn thư mục repository đã clone.

## 9. Hướng dẫn cài đặt dự án

Do công nghệ và tệp cấu hình hiện tại chưa được xác nhận, thực hiện theo quy trình chung sau và bổ sung lệnh cụ thể sau khi nhóm hoàn thiện mã nguồn.

1. Đọc các tệp cấu hình và tài liệu trong repository để xác định runtime, phiên bản và trình quản lý gói cần dùng.
2. Cài đặt runtime/SDK đúng phiên bản được yêu cầu.
3. Cài đặt các thư viện phụ thuộc theo tệp cấu hình của Frontend và Backend (nếu có).
4. Nếu có Database, tạo cơ sở dữ liệu theo tài liệu thiết kế hoặc tệp SQL do nhóm cung cấp.
5. Thiết lập các biến môi trường và thông tin kết nối cần thiết.
6. Không commit mật khẩu, token, khóa bí mật hoặc tệp cấu hình chứa thông tin nhạy cảm lên GitHub.

### Cấu hình môi trường

Nếu dự án cần thông tin kết nối hoặc biến môi trường, nhóm nên cung cấp một tệp mẫu như `.env.example` chỉ chứa tên biến và giá trị minh họa không nhạy cảm. Mỗi thành viên tạo tệp cấu hình cục bộ theo hướng dẫn của nhóm. Tệp `.env` chứa bí mật cần được đưa vào `.gitignore`.

## 10. Hướng dẫn chạy dự án

Trước khi chạy, xác nhận lệnh khởi động dựa trên công nghệ thực tế và tài liệu cấu hình của repository.

### 10.1. Chạy Frontend

1. Mở một terminal.
2. Di chuyển vào thư mục `frontend/`.
3. Cài đặt phụ thuộc theo tệp cấu hình của Frontend.
4. Chạy lệnh phát triển hoặc khởi động được định nghĩa trong cấu hình dự án.
5. Mở URL mà terminal thông báo.

**Lệnh cụ thể:** cần bổ sung sau khi xác nhận công nghệ Frontend và tệp cấu hình hiện có.

### 10.2. Chạy Backend

1. Mở terminal riêng.
2. Di chuyển vào thư mục `backend/`.
3. Cài đặt phụ thuộc theo công nghệ Backend.
4. Cấu hình biến môi trường và thông tin kết nối Database nếu có.
5. Khởi động Backend bằng lệnh được quy định trong dự án.
6. Kiểm tra thông báo khởi động và địa chỉ API nếu có.

**Lệnh cụ thể:** cần bổ sung sau khi xác nhận công nghệ Backend và tệp cấu hình hiện có.

### 10.3. Khởi động Database

Nếu dự án sử dụng Database:

1. Cài đặt và khởi động hệ quản trị cơ sở dữ liệu được nhóm lựa chọn.
2. Tạo database theo tên và cấu trúc trong tài liệu thiết kế.
3. Chạy các tệp migration hoặc SQL do dự án cung cấp.
4. Cập nhật cấu hình kết nối trong môi trường cục bộ.
5. Kiểm tra Backend có kết nối thành công hay không.

Nếu dự án chưa có Database hoặc chưa tích hợp chức năng này, ghi rõ trạng thái thực tế thay vì thực hiện bước này.

### 10.4. Thứ tự chạy đề xuất

1. Khởi động Database nếu cần.
2. Khởi động Backend.
3. Khởi động Frontend.
4. Mở địa chỉ Frontend được cung cấp và kiểm tra ứng dụng.
5. Theo dõi log của các thành phần nếu xảy ra lỗi.

Thứ tự trên có thể điều chỉnh tùy theo kiến trúc và công nghệ thực tế của dự án.

## 11. Kiểm thử và xác nhận

Sau khi khởi động dự án, thực hiện các kiểm tra phù hợp với chức năng đã triển khai:

- Ứng dụng khởi động mà không có lỗi nghiêm trọng.
- Frontend hiển thị được giao diện.
- Frontend gọi Backend thành công nếu đã tích hợp API.
- Backend kết nối Database thành công nếu dự án sử dụng Database.
- Các chức năng đã triển khai hoạt động theo yêu cầu.
- Các lỗi được ghi nhận để nhóm sửa và kiểm tra lại.

### Kiểm thử tự động

Nếu repository đã có cấu hình kiểm thử, sử dụng lệnh được định nghĩa trong cấu hình dự án và bổ sung lệnh chính xác vào mục này. Nếu chưa có, không ghi rằng kiểm thử tự động hoặc báo cáo coverage đã được thực hiện.

## 12. Quy trình làm việc với Git/GitHub

Nhóm sử dụng Pull Request để review thay đổi trước khi tích hợp vào nhánh `dev`.

### 12.1. Các nhánh

- `main`: nhánh chính, lưu phiên bản ổn định theo quy ước của nhóm.
- `dev`: nhánh tích hợp các thay đổi đang phát triển.
- `feature/*`: nhánh riêng cho từng nhiệm vụ.

### 12.2. Tạo nhánh làm việc

Đồng bộ thông tin nhánh từ GitHub:

```bash
git fetch origin
git switch dev
git pull origin dev
git switch -c feature/ten-nhiem-vu
```

Thay `ten-nhiem-vu` bằng tên nhiệm vụ phù hợp. Nếu nhánh `dev` chưa có ở local, cần tạo nhánh theo dõi `origin/dev` trước.

### 12.3. Commit và push

Sau khi chỉnh sửa, kiểm tra thay đổi:

```bash
git status
git diff
```

Đưa các tệp thuộc nhiệm vụ vào staging và commit:

```bash
git add README.md
git commit -m "docs: update project README"
git push -u origin feature/ten-nhiem-vu
```

Chỉ dùng `git add README.md` cho nhiệm vụ chỉ sửa README. Nếu thay đổi các tệp khác theo phân công, hãy kiểm tra kỹ trước khi thêm.

### 12.4. Tạo Pull Request

1. Mở repository trên GitHub.
2. Chọn **Pull requests → New pull request**.
3. Chọn **base: `dev`** và **compare: nhánh feature của bạn**.
4. Kiểm tra danh sách tệp thay đổi và nội dung diff.
5. Ghi tiêu đề, mô tả ngắn gọn rồi chọn **Create pull request**.
6. Chờ thành viên phụ trách review; chỉ merge theo quy trình của nhóm.

## 13. Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân có thể | Cách xử lý |
|---|---|---|
| `git` không được nhận diện | Git chưa cài hoặc terminal chưa cập nhật PATH | Cài Git và mở terminal mới |
| `Repository not found` | URL sai hoặc tài khoản chưa có quyền | Kiểm tra URL, đăng nhập và quyền truy cập |
| `Authentication failed` | Chưa xác thực GitHub đúng cách | Dùng phương thức xác thực GitHub được hỗ trợ |
| `Permission denied` khi push | Tài khoản không có quyền ghi | Kiểm tra lời mời collaborator và quyền repository |
| `nothing to commit` | Không có thay đổi được Git nhận diện | Kiểm tra đã lưu tệp và chạy `git status` |
| Push bị từ chối | Nhánh remote có commit mới hoặc lịch sử khác | `git fetch`, kiểm tra trạng thái và đồng bộ an toàn trước khi push |
| Frontend/Backend không chạy | Thiếu runtime, phụ thuộc hoặc cấu hình | Đọc thông báo lỗi, kiểm tra phiên bản và hướng dẫn của công nghệ |
| Không kết nối được Database | Dịch vụ chưa chạy hoặc cấu hình kết nối sai | Kiểm tra dịch vụ, tên database, host, port và thông tin kết nối |

Không đưa mật khẩu, access token hoặc thông tin bí mật vào README, commit hay nội dung Pull Request.

## 14. Trạng thái triển khai

Mục này cần được nhóm cập nhật theo tiến độ thực tế:

- [ ] Hoàn thiện cấu trúc Frontend.
- [ ] Hoàn thiện cấu trúc Backend.
- [ ] Hoàn thiện tài liệu thiết kế trong `docs/`.
- [ ] Xác nhận công nghệ và phiên bản sử dụng.
- [ ] Bổ sung lệnh cài đặt và chạy Frontend.
- [ ] Bổ sung lệnh cài đặt và chạy Backend.
- [ ] Bổ sung hướng dẫn cấu hình Database nếu có.
- [ ] Kiểm tra hướng dẫn cài đặt trên môi trường mới.
- [ ] Hoàn thiện kiểm thử theo chức năng đã triển khai.

