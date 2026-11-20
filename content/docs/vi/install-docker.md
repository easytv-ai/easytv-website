---
title: Docker Compose
description: Khởi động API bằng tệp compose trong easytv-api; tùy chọn khởi động cả bộ frontend.
---

Cần Docker 24+ và Compose v2.

```bash
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
```

Sửa `.env` và ít nhất đặt:

- `ROOT_PASSWORD` — mật khẩu của quản trị viên đầu tiên (tên đăng nhập mặc định là `admin`)
- `CRYPTO_SECRET` — khóa bí mật HMAC; trên production hãy dùng `openssl rand -hex 32`

Sau đó:

```bash
docker compose up -d
curl http://localhost:8383/healthz
```

Compose kéo `ghcr.io/easytv-ai/easytv-api:latest`, khởi động MySQL 8.4, Redis 7 và API trên cổng 8383. Tệp tải lên và log nằm trong các named volume. Lần khởi động đầu tiên sẽ tạo cấu trúc bảng và tạo tài khoản quản trị.

## Khởi động cả studio và trang quản trị

```bash
docker compose --profile full up -d
```

- Studio http://localhost:3005
- Quản trị http://localhost:3006

Image lấy từ GHCR (`easytv-web`, `easytv-manage`). Trang đối tác được triển khai riêng; xem [Trang đối tác](/docs/partner).

Nếu các máy khác trong mạng LAN cần truy cập, hãy đặt các URL mà trình duyệt sẽ thực sự mở:

```bash
PUBLIC_API_URL=http://192.168.1.10:8383
PUBLIC_STUDIO_URL=http://192.168.1.10:3005
```

`NUXT_PUBLIC_API_BASE_URL` được đóng cứng vào bundle frontend. Tên host của compose như `http://api:8383` không truy cập được từ trình duyệt.

Trên production, hãy đổi `MYSQL_PASSWORD` / `MYSQL_ROOT_PASSWORD` mặc định.

## Build image API tại máy

Mặc định là kéo image về. Để build tại máy, hãy bỏ comment dòng `build: .` ở service API trong `docker-compose.yml`.

Image có cho `linux/amd64` và `linux/arm64`, gắn tag theo phiên bản, cùng với `latest` và `main`.
