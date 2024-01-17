# Hướng Dẫn Sử Dụng Chức Năng Đăng Nhập

## Đăng Nhập

### Mô tả

Chức năng đăng nhập giúp bạn xác thực người dùng và cung cấp AccessToken và RefreshToken cho việc xác thực trong các yêu cầu sau này.

### Các Bước

1. **Gửi Yêu Cầu Đăng Nhập:**
   - Sử dụng phương thức HTTP POST để gửi yêu cầu đăng nhập tới endpoint `/api/auth/login`.
   - Gửi một đối tượng JSON chứa thông tin đăng nhập như `identifier` (username hoặc email) và `password`.

   ```json
   {
     "identifier": "your_username_or_email",
     "password": "your_password"
   }
   ```
2. **Xử Lý Phản Hồi:**

    - Nếu đăng nhập thành công, bạn sẽ nhận được một phản hồi với mã trạng thái HTTP 200 và một thông báo thành công cùng với AccessToken và RefreshToken.
    ```json
    {
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "your_access_token_here",
    "refreshToken": "your_refresh_token_here"
  }
}

    ```
    - Nếu có lỗi, bạn sẽ nhận được một phản hồi với mã trạng thái HTTP tương ứng và một thông báo lỗi.
    ```
    {
  "statusCode": 401,
  "message": "Invalid username or email or password"
}
    ```