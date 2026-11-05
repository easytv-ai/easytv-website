---
title: 架构
description: 创作台、运营后台、渠道后台如何连到 easytv-api，以及网关与存储。
---

```
easytv-web      ──┐
easytv-manage   ──┼──▶  easytv-api (Gin)  ── MySQL / Redis
easytv-partner  ──┘           │            ── 对象存储（本地 / OSS / 七牛）
                              │            ── ffmpeg
                              ▼
                    New API 兼容网关
                              ▼
                    Kling · 即梦 · Seedance · Sora · GPT · …
```

## 鉴权

- 创作台与渠道后台：`Authorization: Bearer <token>` + `EasyTV-User: <用户 id>`
- 运营后台走 `/admin/*`，还要求角色 `role ≥ 10`
- 团队空间用 `EasyTV-Team: <team_id>`，缺省为个人空间
- CORS 回显请求来源，三端可以部署在不同域名

## 运行期配置

环境变量只在进程启动时读一次。站点名、支付、网关地址、邀请规则等放在后端 `setting` 表，运营后台改完立即生效，不必重启 API。

存储三选一：本地 `upload/`、阿里云 OSS、七牛。图生视频时网关要能拉到素材：OSS / 七牛给公网 URL；本地存储就要配 `UPLOAD_BASE_URL`（或 setting `UploadBaseUrl`）让网关访问得到。

多节点 API 用 `WORKER_TAG`：每个进程只处理打了相同标签的作业。

## 契约

改接口先改 [`easytv-api` 的 API.md](https://github.com/easytv-ai/easytv-api/blob/main/API.md)，再改三个前端。摘要见 [接口概览](/docs/api)。
