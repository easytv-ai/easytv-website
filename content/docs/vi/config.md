---
title: Cấu hình
description: Biến môi trường bắt buộc của API, các giá trị NUXT_PUBLIC_* của frontend và những gì nằm trong bảng setting.
---

Cấu hình có hai lớp: biến môi trường được đọc khi tiến trình khởi động, và bảng `setting` mà trang quản trị cập nhật nóng. Danh sách có chú thích nằm trong `.env.example` của từng kho mã.

## API: bắt buộc

| Biến | Ý nghĩa |
| --- | --- |
| `SQL_DSN` | DSN của MySQL, ví dụ `user:pass@tcp(127.0.0.1:3306)/easytv?charset=utf8mb4&parseTime=true&loc=Local` |
| `ROOT_PASSWORD` | Mật khẩu của quản trị viên đầu tiên. Tiến trình từ chối khởi động nếu chưa có quản trị viên mà biến này để trống |
| `CRYPTO_SECRET` | Khóa bí mật HMAC cho OTP và token; trên production cần ≥ 32 ký tự ngẫu nhiên |

## API: thường dùng

| Biến | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `PORT` | `8383` | Cổng HTTP (`--port` được ưu tiên) |
| `DEBUG` | `false` | Log chi tiết và in câu lệnh SQL |
| `REDIS_CONN_STRING` | — | Không có thì giới hạn tần suất / OTP dùng bộ nhớ |
| `UPLOAD_DIR` | `./upload` | Thư mục lưu trữ cục bộ |
| `FFMPEG_PATH` / `FFPROBE_PATH` | lấy từ `PATH` | Cũng có thể ghi đè trong cài đặt |
| `WORKER_TAG` | — | Nhiều nút: chỉ nhận tác vụ có tag này |

Gateway, thanh toán, OSS / Qiniu, SMTP và SMS cũng có thể đặt bằng biến môi trường; trên production chúng thường nằm trong **Cài đặt hệ thống** để bạn không phải khởi động lại API.

## Tích hợp tùy chọn

| Mảng | Biến / cài đặt |
| --- | --- |
| OTP qua email | `EMAIL_VERIFICATION_ENABLED`, `SMTP_*`, `VERIFICATION_VALID_MINUTES`. Khi phát triển có thể tắt gửi mail; mã sẽ được in trong log của API |
| SMS (SubMail) | `SMS_ENABLED`, `SUBMAIL_*`, `SMS_SIGNATURE` |
| Gateway mô hình | các cài đặt `EasyAPIGatewayBaseUrl` / `EasyAPIGatewayKey` / `EasyAPIGatewayEnabled`. Giá nằm trong `model_price` |
| Aliyun OSS | `OSS_BUCKET`, `OSS_ENDPOINT`, `OSS_ACCESS_KEY_ID`, `OSS_ACCESS_KEY_SECRET`, `OSS_BASE_URL`, `OSS_PREFIX`. Đặt `OSS_BUCKET` thì không còn ghi vào `upload/` cục bộ |
| Qiniu | các cài đặt `QiniuAccessKey` / `QiniuSecretKey` / `QiniuBucketName` / `QiniuDomain`. Có URL công khai nên ảnh thành video không cần `UPLOAD_BASE_URL` |
| Thanh toán | `WECHATPAY_*`, `ALIPAY_APPID` hoặc các cài đặt tương ứng; host nhận callback là cài đặt `ServerAddress` |
| Hạn mức miễn phí | `FREE_CONCURRENT`, `FREE_STORAGE_GB` |

## Biến bổ sung cho Docker Compose

Các biến này nằm trong `.env` của `easytv-api` và chỉ dùng cho compose:

| Biến | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `MYSQL_PASSWORD` | `change-me-easytv` | Mật khẩu của người dùng ứng dụng trong MySQL đi kèm |
| `MYSQL_ROOT_PASSWORD` | `change-me-root` | Mật khẩu root của MySQL đi kèm |
| `PUBLIC_API_URL` | `http://localhost:8383` | URL mà **trình duyệt** dùng để gọi API, không phải tên host của compose |
| `PUBLIC_STUDIO_URL` | `http://localhost:3005` | URL công khai của studio |
| `API_PORT` / `WEB_PORT` / `MANAGE_PORT` | 8383 / 3005 / 3006 | Ánh xạ cổng trên máy chủ |

## Studio `easytv-web`

Tất cả đều là cấu hình runtime công khai (được đóng vào client — **không đặt bí mật**).

| Biến | Bắt buộc | Ý nghĩa |
| --- | --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | có | URL của API |
| `NUXT_PUBLIC_SITE_URL` | có, trên production | canonical, sitemap, OG |
| `NUXT_PUBLIC_SITE_NAME` | không | mặc định `EasyTV` |
| `NUXT_PUBLIC_MEDIA_HOSTS` | không | các host OSS / CDN bổ sung mà proxy media được phép tải |
| `NUXT_PUBLIC_CONTACT_EMAIL` | không | thông tin liên hệ trên các trang pháp lý |

Môi trường phát triển đọc `.env.development`; bản build production đọc `.env.production`.

## Quản trị `easytv-manage`

| Biến | Ý nghĩa |
| --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | URL của API |
| `NUXT_PUBLIC_STUDIO_URL` | URL của studio: mục “trang web” ở đầu trang, kiểm duyệt → trình phát, tài nguyên tĩnh |
| `NUXT_PUBLIC_PARTNER_URL` | URL của trang đối tác: nút “mở trang đối tác” ở trang Đối tác |
| `NUXT_PUBLIC_SITE_NAME` | Tên trên thanh tiêu đề |

## Đối tác `easytv-partner`

| Biến | Ý nghĩa |
| --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | URL của API |
| `NUXT_PUBLIC_STUDIO_URL` | URL của studio: mục “trang web” ở đầu trang và phương án dự phòng cho liên kết quảng bá |
| `NUXT_PUBLIC_SITE_NAME` | Tên trên thanh tiêu đề |
