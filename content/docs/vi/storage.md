---
title: Lưu trữ đối tượng
description: Thư mục upload cục bộ, Aliyun OSS hoặc Qiniu, và vì sao ảnh thành video cần URL công khai.
---

Tệp tải lên, kết quả tạo nội dung và phim đã dựng đều phải nằm ở đâu đó. Chọn một phương án; có thể đổi trong lúc chạy.

## Ổ đĩa cục bộ

Mặc định. Thư mục `UPLOAD_DIR` (mặc định `./upload`), phục vụ tại `GET /upload/*`.

Compose giữ nó trên volume `upload`. Ảnh thành video cần gateway **HTTP GET** được ảnh nguồn:

- Cục bộ: đặt `UploadBaseUrl` thành địa chỉ mà gateway truy cập được, ví dụ `http://YOUR_PUBLIC_IP:8383/upload` hoặc một tunnel
- Mọi thứ trên cùng một máy: `http://host.docker.internal:8383/upload` đôi khi dùng được

Không có URL công khai thì tác vụ I2V / ảnh tham chiếu sẽ thất bại; T2V thường không bị ảnh hưởng.

## Aliyun OSS

Biến môi trường (đọc một lần khi khởi động):

| Biến | Ý nghĩa |
| --- | --- |
| `OSS_BUCKET` | Đặt biến này sẽ bật OSS và ngừng ghi cục bộ |
| `OSS_ENDPOINT` | ví dụ `oss-cn-hangzhou.aliyuncs.com` |
| `OSS_ACCESS_KEY_ID` / `OSS_ACCESS_KEY_SECRET` | Trên production hãy dùng người dùng RAM có quyền tối thiểu |
| `OSS_BASE_URL` | Host CDN hoặc host công khai của bucket |
| `OSS_PREFIX` | Tiền tố object, mặc định `easytv` |
| `OSS_PUBLIC_READ` | Có cho đọc công khai hay không |

`/upload/*` không còn là đường dẫn chính. Nếu bucket chưa cấu hình CORS, tính năng cắt khung / dải khung hình của studio không đọc được điểm ảnh — hãy thêm host vào `NUXT_PUBLIC_MEDIA_HOSTS` và dùng proxy phía máy chủ.

## Qiniu

Cài đặt (trang quản trị **Cài đặt hệ thống → Gateway & lưu trữ**), cập nhật nóng:

`QiniuAccessKey` / `QiniuSecretKey` / `QiniuBucketName` / `QiniuDomain`

Khi đó tệp tải lên và kết quả dùng URL CDN công khai, nên I2V thường không cần `UploadBaseUrl`. Tải trực tiếp từ client: `GET /user/qiniu/upload-token`, `GET /user/qiniu/key`.

## Chọn phương án nào

| Tình huống | Chọn |
| --- | --- |
| Phát triển trên laptop | Cục bộ; thêm `UploadBaseUrl` khi cần I2V |
| Tự triển khai trên một máy | Ổ đĩa cục bộ, Nginx phục vụ `/upload/` |
| Production + CDN | OSS hoặc Qiniu, đọc công khai hoặc URL có chữ ký |
