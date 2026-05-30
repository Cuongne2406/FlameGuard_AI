# Tài liệu Chi tiết: Module Bảo mật (Security) trong Admin Settings

Module Bảo mật được thiết kế theo kiến trúc **Full-stack Dynamic Configuration**, cho phép Admin thay đổi các chính sách bảo mật của hệ thống mà không cần khởi động lại máy chủ.

## 1. Kiến trúc phân lớp (Layered Architecture)

### 🧩 Giao diện người dùng (Frontend - React)
- **Component**: `TabSecurity.jsx`
- **Cơ chế**: Sử dụng React State để lưu trữ tạm thời các thay đổi. Khi bạn nhấn "Lưu Thay Đổi" ở header, toàn bộ các khóa (keys) và giá trị (values) được gửi đi trong một yêu cầu duy nhất (Batch Update).
- **Các thành phần chính**:
    - **Access Security**: Quản lý 2FA, Session Timeout (thời gian hết hạn token), và Password Policy.
    - **Data Protection**: Quản lý sao lưu tự động và danh sách IP được phép (IP Whitelisting).
    - **Integrations**: Quản lý API Keys và Webhooks.

### 🔌 Dịch vụ API (Service Layer - Node.js/JS)
- **Service**: `systemService.js`
- **Endpoint**: `PUT /settings/batch/update`
- **Nhiệm vụ**: Đóng gói các cặp Key-Value và gửi về Backend.

### ⚙️ Máy chủ xử lý (Backend - FastAPI)
- **Endpoint**: `app/api/v1/endpoints/settings.py`
- **Nghiệp vụ**: Nhận danh sách cài đặt, cập nhật vào bảng `system_settings` trong PostgreSQL. Nếu khóa chưa tồn tại, nó sẽ tạo mới.

### 🗃️ Cơ sở dữ liệu (Database - PostgreSQL)
- **Table**: `system_settings`
- **Schema**: `{ id: UUID, key: String, value: Text, description: Text }`

---

## 2. Cách thức hoạt động chi tiết

### 🔓 Access Security (Bảo mật truy cập)
1. **2FA Enforcement**: Khi được bật (`TWO_FACTOR_REQUIRED: "true"`), logic tại `auth.py` sẽ kiểm tra flag này sau khi người dùng nhập đúng mật khẩu. Nếu bật, hệ thống sẽ yêu cầu thêm mã OTP.
2. **Session Timeout**: Giá trị này (ví dụ: `30` phút) được dùng để tính toán trường `exp` (expiration) trong JWT Token khi `create_access_token` được gọi trong `security.py`.
3. **Password Policy**: Khi người dùng đổi mật khẩu hoặc tạo tài khoản mới, hệ thống sẽ đọc các cấu hình như `PW_MIN_LENGTH`, `PW_REQUIRE_SYMBOLS` từ database để validate mật khẩu trước khi lưu.

### 🛡️ Data Protection (Bảo vệ dữ liệu)
1. **IP Whitelisting**: Đây là một màng lọc (Middleware) ở cấp độ API. Trước khi xử lý yêu cầu từ Admin, hệ thống lấy IP của client và so sánh với chuỗi `IP_WHITELIST` trong DB. Nếu IP không nằm trong danh sách, yêu cầu sẽ bị từ chối (403 Forbidden).
2. **Auto Backup**: Một công việc định kỳ (Cron job/Worker) sẽ chạy hàng ngày. Nó kiểm tra giá trị `AUTO_BACKUP` trong DB, nếu là `true`, nó sẽ kích hoạt tiến trình sao lưu database vào S3 hoặc Storage cục bộ.

### 🔑 API & Webhooks
1. **API Keys**: Lưu trữ các Token truy cập cho ứng dụng bên thứ 3 (như Mobile App). Mỗi Key có phân quyền riêng.
2. **Webhooks**: Khi có sự kiện quan trọng (ví dụ: `USER_CREATED`), Backend sẽ đọc `WEBHOOK_CALLBACK_URL` và gửi một POST request chứa dữ liệu sự kiện kèm theo chữ ký HMAC (tạo từ `WEBHOOK_SECRET`) để đảm bảo tính xác thực.

---

## 3. Cách để cấu hình này thực sự "chạy"
Hiện tại, tôi đã kết nối Giao diện với Database. Để các cài đặt này thực sự tác động đến logic hệ thống (ví dụ: thực sự chặn IP), chúng ta thực hiện các bước sau:
1. **Tạo Middleware Check IP**: Thêm một Class middleware trong FastAPI để kiểm tra `IP_WHITELIST` từ DB cho mỗi request vào prefix `/api/v1/admin`.
2. **Cập nhật Logic Token**: Sửa hàm `create_access_token` để query DB lấy `SESSION_TIMEOUT` thay vì chỉ dùng file `.env`.
3. **Validation logic**: Thêm hàm validate mật khẩu dùng chung đọc từ bảng `system_settings`.

> [!TIP]
> Việc sử dụng cơ chế Batch Update mà chúng ta vừa triển khai giúp việc cập nhật hàng loạt các chính sách bảo mật này trở nên an toàn và nhất quán (tất cả thay đổi được lưu hoặc không có gì thay đổi).
