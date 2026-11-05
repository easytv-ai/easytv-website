---
title: 源码运行
description: 分别启动 API、创作台、运营后台和渠道后台，方便改代码。
---

## 后端

需要 Go 1.27+、MySQL 8.x、可选 Redis，以及 `PATH` 里的 `ffmpeg` / `ffprobe`。

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS easytv DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
go run . --port 8383
```

`.env` 里填 `SQL_DSN`、`ROOT_PASSWORD`、`CRYPTO_SECRET`。可选灌演示数据：

```bash
go run ./cmd/seed --env-file .env
```

## 创作台

需要 Node.js 22.21+（文档按 Nuxt 4.6 的要求；仓库 `engines` 写的是 22.5+）和 pnpm 10+。

```bash
git clone https://github.com/easytv-ai/easytv-web.git
cd easytv-web
pnpm install
cp .env.example .env.development
```

把 `NUXT_PUBLIC_API_BASE_URL` 改成 `http://127.0.0.1:8383`，然后：

```bash
pnpm dev          # http://localhost:3005
```

没有后端时首页、探索、技能广场可以打开，创作功能会弹出登录框。请用 **pnpm**，不要用 npm / cnpm。

## 运营后台

```bash
git clone https://github.com/easytv-ai/easytv-manage.git
cd easytv-manage
pnpm install
cp .env.example .env.development
pnpm dev          # http://localhost:3006
```

用 API 首次启动创建的 `admin` 账号登录。

## 渠道后台

```bash
git clone https://github.com/easytv-ai/easytv-partner.git
cd easytv-partner
pnpm install
cp .env.example .env.development
pnpm dev          # http://localhost:3010
```

用任意 EasyTV 账号登录。还不是伙伴的账号会进入驻申请页。

## 二进制 + systemd

不想装 Docker 时，从 [Releases](https://github.com/easytv-ai/easytv-api/releases) 下 Linux 包，或自己编译：

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

没有 systemd 的主机可用仓库里的 `deploy.sh start|stop|restart|status`。反向代理示例见 [接口概览](/docs/api)。
