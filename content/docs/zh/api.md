---
title: 接口概览
description: Base URL、响应包、鉴权头。左侧按资源展开到每一条接口，含参数类型和 200 响应。
---

完整实体、路由和状态机写在 [`easytv-api/API.md`](https://github.com/easytv-ai/easytv-api/blob/main/API.md)。**改接口先改那份文件，再改代码。** 文档站把常用接口拆到左侧菜单，点进去看 Header / Query / Body 和返回 JSON。

## 约定

- Base URL：`NUXT_PUBLIC_API_BASE_URL`，本地默认 `http://127.0.0.1:8383`。curl 里写成 `$API`。
- HTTP **恒 200**。成败看 JSON 里的 `success`，不要看状态码。
- 时间：Unix 秒。`deleted_at` 为空表示未删除。
- 分页：`?page=1&page_size=20`（上限 100），`data = { "items": [], "total": 123 }`。
- 软删：`DELETE` 进回收站，30 天后物理清理；对应 `POST …/restore`。

```json
{ "success": true, "message": "", "data": {} }
{ "success": false, "message": "错误原因" }
```

鉴权头、登录见左侧 [鉴权与登录](/docs/api-auth)。健康检查见 [GET /healthz](/docs/api-healthz)。

## 反向代理

鉴权走 Header 而不是 Cookie。生成和上传会跑几十秒到几分钟，超时和体积要放开。

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8383/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 300s;
    client_max_body_size 512m;
}
```

## 页面对照

| 页面 | 接口 |
| --- | --- |
| web `/projects` | [项目列表](/docs/api-project-list)、[新建](/docs/api-project-create) |
| web `/canvas?id=` | [画布详情](/docs/api-canvas-get)、[保存](/docs/api-canvas-update) |
| web 画布「生成」 | [模型清单](/docs/api-models-list) → [创建任务](/docs/api-task-create) → [轮询](/docs/api-task-get) |
| web `/studio` `/watch/:id` | [信息流](/docs/api-public-feed)、[作品详情](/docs/api-public-work) |
| web `/settings` 钱包 | [钱包](/docs/api-wallet-get)、[下单](/docs/api-order-create) |
| manage `/user` | [用户列表](/docs/api-admin-user-list)、[代登](/docs/api-admin-console-access) |
| manage `/community-audit` | [作品审核](/docs/api-admin-review-work)、[举报](/docs/api-admin-report) |
| manage `/model-price` | [模型定价](/docs/api-admin-model-price)、[拉模型](/docs/api-admin-fetch-models) |
| partner `/` 看板 | [渠道看板](/docs/api-partner-overview)、[趋势](/docs/api-partner-stats) |
