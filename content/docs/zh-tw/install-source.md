---
title: 原始碼執行
description: 分別啟動 API、創作台、營運後台和通路後台，方便改程式碼。
---

## 後端

需要 Go 1.27+、MySQL 8.x、可選 Redis，以及 `PATH` 裡的 `ffmpeg` / `ffprobe`。

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS easytv DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
go run . --port 8383
```

`.env` 裡填 `SQL_DSN`、`ROOT_PASSWORD`、`CRYPTO_SECRET`。可選擇匯入示範資料：

```bash
go run ./cmd/seed --env-file .env
```

## 創作台

需要 Node.js 22.21+（文件依 Nuxt 4.6 的要求；儲存庫 `engines` 寫的是 22.5+）和 pnpm 10+。

```bash
git clone https://github.com/easytv-ai/easytv-web.git
cd easytv-web
pnpm install
cp .env.example .env.development
```

把 `NUXT_PUBLIC_API_BASE_URL` 改成 `http://127.0.0.1:8383`，然後：

```bash
pnpm dev          # http://localhost:3005
```

沒有後端時首頁、探索、技能廣場可以開啟，創作功能會彈出登入框。請用 **pnpm**，不要用 npm / cnpm。

## 營運後台

```bash
git clone https://github.com/easytv-ai/easytv-manage.git
cd easytv-manage
pnpm install
cp .env.example .env.development
pnpm dev          # http://localhost:3006
```

用 API 首次啟動建立的 `admin` 帳號登入。

## 通路後台

```bash
git clone https://github.com/easytv-ai/easytv-partner.git
cd easytv-partner
pnpm install
cp .env.example .env.development
pnpm dev          # http://localhost:3010
```

用任意 EasyTV 帳號登入。還不是夥伴的帳號會進入入駐申請頁。

## 二進位檔 + systemd

不想裝 Docker 時，從 [Releases](https://github.com/easytv-ai/easytv-api/releases) 下載 Linux 套件，或自行編譯：

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

沒有 systemd 的主機可用儲存庫裡的 `deploy.sh start|stop|restart|status`。反向代理範例見 [介面概覽](/docs/api)。
