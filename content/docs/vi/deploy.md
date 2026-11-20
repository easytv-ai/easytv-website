---
title: Triển khai chính thức
description: Cách chia tên miền, reverse proxy bằng Nginx, Cloudflare, worker nhiều nút và danh sách kiểm tra trước khi lên sóng.
---

[Docker Compose](/docs/install-docker) là đủ khi chạy trên laptop. Trên production, hãy đặt bốn tiến trình trên các host (hoặc tên miền con) khác nhau, dùng chung một API.

## Tên miền

| Dịch vụ | Ví dụ | Dùng làm |
| --- | --- | --- |
| easytv-api | `https://api.example.com` | `NUXT_PUBLIC_API_BASE_URL` của mọi frontend |
| easytv-web | `https://studio.example.com` | `NUXT_PUBLIC_SITE_URL` / “URL studio” trong trang quản trị |
| easytv-manage | `https://admin.example.com` | đừng để lộ ra internet công cộng |
| easytv-partner | `https://partner.example.com` | `NUXT_PUBLIC_PARTNER_URL` của trang quản trị |

CORS trả lại mọi `Origin` và cho phép credentials, nên ba frontend có thể khác host. Xác thực dùng header, không dùng cookie.

## Nginx

Tạo nội dung và tải lên vừa chậm vừa nặng:

```nginx
server {
    listen 443 ssl;
    server_name api.example.com;

    client_max_body_size 512m;
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;

    location / {
        proxy_pass http://127.0.0.1:8383;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ba ứng dụng Nuxt:

- **Cloudflare Workers** (mặc định của kho mã): `cp .env.example .env.production && pnpm deploy`
- **Máy chủ Node**: `NITRO_PRESET=node-server pnpm build`, sau đó `node .output/server/index.mjs`
- **Docker**: image trên GHCR, ghi đè mọi `NUXT_PUBLIC_*` lúc chạy

## API nhiều nút

Mỗi tiến trình API chỉ xử lý các tác vụ được gắn tag của nó: biến môi trường `WORKER_TAG`. Tác vụ tạo nội dung, dựng phim và media đều có thể chia tải theo cách đó. Tiến trình không có tag sẽ nhận các tác vụ không có tag.

MySQL phải dùng chung. Rất nên có Redis (giới hạn tần suất và OTP; không có thì mỗi tiến trình dùng map trong bộ nhớ). Hãy dùng OSS / Qiniu, đừng dùng ổ đĩa riêng của từng nút.

## Danh sách kiểm tra trước khi lên sóng

1. Đổi `ROOT_PASSWORD`, `CRYPTO_SECRET` (≥ 32 ký tự) và các mật khẩu MySQL
2. `DEBUG=false`
3. [Kết nối gateway](/docs/gateway) và nhập bảng giá
4. Chuyển [lưu trữ](/docs/storage) sang OSS / Qiniu, hoặc cấp cho ổ đĩa cục bộ một `UploadBaseUrl` công khai
5. [Thanh toán](/docs/billing): `ServerAddress` = `https://api.example.com`
6. SMTP hoặc SMS; ngừng in OTP ra log
7. Studio: `NUXT_PUBLIC_SITE_URL`, `NUXT_PUBLIC_MEDIA_HOSTS`
8. Rà soát nội dung `/legal/*` cho phù hợp với pháp nhân và khu vực pháp lý của bạn
9. Đừng để lộ trang quản trị ra bên ngoài
