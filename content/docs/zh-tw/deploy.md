---
title: 正式環境部署
description: 網域怎麼拆、Nginx 反向代理、Cloudflare、多節點 worker，以及上線清單。
---

本機用 [Docker Compose](/docs/install-docker) 即可。對外提供服務時，建議把四個行程拆到不同子網域，共用一個 API。

## 建議網域

| 服務 | 例子 | 說明 |
| --- | --- | --- |
| easytv-api | `https://api.example.com` | 所有前端的 `NUXT_PUBLIC_API_BASE_URL` |
| easytv-web | `https://studio.example.com` | `NUXT_PUBLIC_SITE_URL` / 後台「站點」裡的創作台位址 |
| easytv-manage | `https://admin.example.com` | 不要直接暴露在公網，至少加 IP 允許清單或 VPN |
| easytv-partner | `https://partner.example.com` | 後台 `NUXT_PUBLIC_PARTNER_URL` |

CORS 回顯任意 `Origin` 並允許憑證，三端可以不同網域。驗證走 Header 不是 Cookie，反向代理不必為 CSRF 另做一層。

## Nginx

API 生成和上傳都可能很慢、很大：

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

前端三個 Nuxt 應用：

- **Cloudflare Workers**（儲存庫預設）：`cp .env.example .env.production && pnpm deploy`
- **Node 主機**：`NITRO_PRESET=node-server pnpm build`，再 `node .output/server/index.mjs`
- **Docker**：GHCR 映像檔，執行時覆寫全部 `NUXT_PUBLIC_*`

## 多節點 API

每個 API 行程只處理打了自己標籤的作業：環境變數 `WORKER_TAG`。生成任務、合成、媒體作業都可以依標籤分流。沒有標籤的行程處理未打標籤的作業。

MySQL 必須共用；Redis 強烈建議（限流、驗證碼，不填則走行程記憶體，多節點會各算各的）。物件儲存用 OSS / 七牛，不要用各節點本機磁碟。

## 上線清單

1. `ROOT_PASSWORD`、`CRYPTO_SECRET`（≥ 32 位）、MySQL 密碼全部改掉
2. `DEBUG=false`
3. [串接閘道](/docs/gateway) 並匯入定價
4. [物件儲存](/docs/storage) 換成 OSS / 七牛，或給本機磁碟設定公網 `UploadBaseUrl`
5. [金流](/docs/billing)：`ServerAddress` 填 `https://api.example.com`
6. SMTP 或簡訊，關掉「驗證碼印在日誌」
7. 創作台 `NUXT_PUBLIC_SITE_URL`、`NUXT_PUBLIC_MEDIA_HOSTS`
8. `/legal/*` 的協議文案依你的營運主體和法律審一遍
9. 營運後台不要對全世界開放
