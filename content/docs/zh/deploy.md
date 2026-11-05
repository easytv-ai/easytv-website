---
title: 生产部署
description: 域名怎么拆、Nginx 反代、Cloudflare、多节点 worker，以及上线清单。
---

本地用 [Docker Compose](/docs/install-docker) 即可。对外提供服务时，建议把四个进程拆到不同子域，共用一个 API。

## 推荐域名

| 服务 | 例子 | 说明 |
| --- | --- | --- |
| easytv-api | `https://api.example.com` | 所有前端的 `NUXT_PUBLIC_API_BASE_URL` |
| easytv-web | `https://studio.example.com` | `NUXT_PUBLIC_SITE_URL` / 后台「站点」里的创作台地址 |
| easytv-manage | `https://admin.example.com` | 不要对公网裸奔，至少加 IP 允许或 VPN |
| easytv-partner | `https://partner.example.com` | 后台 `NUXT_PUBLIC_PARTNER_URL` |

CORS 回显任意 `Origin` 并允许凭据，三端可以不同域。鉴权走 Header 不是 Cookie，反代不必为 CSRF 另做一层。

## Nginx

API 生成和上传都可能很慢、很大：

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

前端三个 Nuxt 应用：

- **Cloudflare Workers**（仓库默认）：`cp .env.example .env.production && pnpm deploy`
- **Node 主机**：`NITRO_PRESET=node-server pnpm build`，再 `node .output/server/index.mjs`
- **Docker**：GHCR 镜像，运行时覆盖全部 `NUXT_PUBLIC_*`

## 多节点 API

每个 API 进程只处理打了自己标签的作业：环境变量 `WORKER_TAG`。生成任务、合成、媒体作业都可以按标签分流。没有标签的进程处理未打标作业。

MySQL 必须共享；Redis 强烈建议（限流、验证码，不填则走进程内存，多节点会各算各的）。对象存储用 OSS / 七牛，不要用各节点本地盘。

## 上线清单

1. `ROOT_PASSWORD`、`CRYPTO_SECRET`（≥ 32 位）、MySQL 密码全部改掉
2. `DEBUG=false`
3. [对接网关](/docs/gateway) 并导入定价
4. [对象存储](/docs/storage) 换成 OSS / 七牛，或给本地盘配公网 `UploadBaseUrl`
5. [支付](/docs/billing)：`ServerAddress` 填 `https://api.example.com`
6. SMTP 或短信，关掉「验证码打日志」
7. 创作台 `NUXT_PUBLIC_SITE_URL`、`NUXT_PUBLIC_MEDIA_HOSTS`
8. `/legal/*` 的协议文案按你的主体和法律审一遍
9. 运营后台不要对全世界开放
