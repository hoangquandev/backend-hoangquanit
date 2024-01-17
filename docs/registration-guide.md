# Hướng dẫn Sử Dụng Chức Năng Đăng Ký

## Đăng Ký Người Dùng

### Mô tả

Chức năng đăng ký giúp bạn tạo ra một tài khoản để có thể sử dụng các tính năng khác của ứng dụng. Dưới đây là cách bạn có thể sử dụng API để đăng ký người dùng.

### Các Bước

1. **Gửi Yêu Cầu Đăng Ký:**
   - Sử dụng phương thức HTTP POST để gửi yêu cầu đăng ký tới endpoint `/api/users/register`.
   - Gửi một đối tượng JSON chứa thông tin người dùng như `username`, `email`, `password`, `phone`, `image`, và `role`.

   ```json
   {
     "username": "your_username",
     "email": "your_email@example.com",
     "password": "your_password",
     "phone": "your_phone_number",
     "image": "your_avatar_url",
     "role": "customer"
   }
   ```

2. **Gửi Yêu Cầu Đăng Ký:**
- Nếu đăng ký thành công, bạn sẽ nhận được một phản hồi với mã trạng thái HTTP 201 và một thông báo thành công.
```json
{
  "statusCode": 201,
  "message": "User registered successfully"
}
```
- Nếu có lỗi, bạn sẽ nhận được một phản hồi với mã trạng thái HTTP tương ứng và một thông báo lỗi.
```json
{
  "statusCode": 400,
  "message": "Email already exists"
}
```