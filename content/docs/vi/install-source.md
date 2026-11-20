---
title: Chạy từ mã nguồn
description: Khởi động riêng API, studio, trang quản trị và trang đối tác trong lúc bạn sửa mã.
---

## Backend

Cần Go 1.27+, MySQL 8.x, Redis (tùy chọn), cùng `ffmpeg` / `ffprobe` trong `PATH`.

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS easytv DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
go run . --port 8383
```

Đặt `SQL_DSN`, `ROOT_PASSWORD` và `CRYPTO_SECRET` trong `.env`. Dữ liệu mẫu (tùy chọn):

```bash
go run ./cmd/seed --env-file .env
```

## Studio

Cần Node.js 22.21+ (mức tối thiểu của Nuxt 4.6; trường `engines` trong kho mã vẫn ghi 22.5+) và pnpm 10+.

```bash
git clone https://github.com/easytv-ai/easytv-web.git
cd easytv-web
pnpm install
cp .env.example .env.development
```

Trỏ `NUXT_PUBLIC_API_BASE_URL` tới `http://127.0.0.1:8383`, sau đó:

```bash
pnpm dev          # http://localhost:3005
```

Không có backend thì trang chủ, trang khám phá và quảng trường Skill vẫn hiển thị; phần sáng tác sẽ mở hộp thoại đăng nhập. Hãy dùng **pnpm**, không dùng npm hay cnpm.

## Trang quản trị

```bash
git clone https://github.com/easytv-ai/easytv-manage.git
cd easytv-manage
pnpm install
cp .env.example .env.development
pnpm dev          # http://localhost:3006
```

Đăng nhập bằng tài khoản `admin` được tạo ở lần khởi động đầu tiên của API.

## Trang đối tác

```bash
git clone https://github.com/easytv-ai/easytv-partner.git
cd easytv-partner
pnpm install
cp .env.example .env.development
pnpm dev          # http://localhost:3010
```

Mọi tài khoản EasyTV đều đăng nhập được. Tài khoản chưa là đối tác sẽ được đưa tới trang đăng ký tham gia.

## Binary + systemd

Nếu không dùng Docker, hãy lấy bản dựng Linux từ [Releases](https://github.com/easytv-ai/easytv-api/releases), hoặc tự biên dịch:

```bash
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -ldflags="-s -w" -o easytv-api .
```

```ini
# /etc/systemd/system/easytv-api.service
[Unit]
Description=EasyTV API
After=network.target mysql.service

[Service]
User=easytv
WorkingDirectory=/opt/easytv-api
ExecStart=/opt/easytv-api/easytv-api --port 8383 --env-file /opt/easytv-api/.env
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Máy chủ không có systemd có thể dùng `deploy.sh start|stop|restart|status` trong kho mã. Ví dụ reverse proxy: [Tổng quan API](/docs/api).
