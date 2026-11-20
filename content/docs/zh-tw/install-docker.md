---
title: Docker Compose
description: 用 easytv-api 儲存庫裡的 compose 檔案一鍵啟動 API，可選整套前端。
---

需要 Docker 24+ 與 Compose v2。

```bash
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
```

編輯 `.env`，至少改這兩項：

- `ROOT_PASSWORD`：第一個管理員密碼（使用者名稱預設 `admin`）
- `CRYPTO_SECRET`：HMAC 金鑰，正式環境用 `openssl rand -hex 32` 產生

然後：

```bash
docker compose up -d
curl http://localhost:8383/healthz
```

Compose 會拉取 `ghcr.io/easytv-ai/easytv-api:latest`，啟動 MySQL 8.4、Redis 7 和監聽 8383 的 API。上傳檔案與日誌放在具名卷裡。首次啟動自動建表並建立管理員。

## 連創作台和營運後台

```bash
docker compose --profile full up -d
```

- 創作台 http://localhost:3005
- 營運後台 http://localhost:3006

映像檔來自 GHCR（`easytv-web`、`easytv-manage`）。通路後台 `easytv-partner` 目前需要另外部署，見 [通路後台](/docs/partner)。

區域網路或其他機器存取時，在 `.env` 裡改成瀏覽器真正能開啟的位址：

```bash
PUBLIC_API_URL=http://192.168.1.10:8383
PUBLIC_STUDIO_URL=http://192.168.1.10:3005
```

`NUXT_PUBLIC_API_BASE_URL` 會打包進前端套件，填容器內部主機名稱 `http://api:8383` 瀏覽器打不開。

正式環境請改掉預設的 `MYSQL_PASSWORD` / `MYSQL_ROOT_PASSWORD`。

## 本機建置 API 映像檔

預設拉取預先建置的映像檔。要在本機 build，取消 `docker-compose.yml` 裡 API 服務的 `build: .` 註解即可。

映像檔提供 `linux/amd64` 與 `linux/arm64`，標籤跟隨版本，另有 `latest` 與 `main`。
