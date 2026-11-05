---
title: 接口概览
description: Base URL、响应包，以及按资源拆开的接口目录。完整契约仍以 API.md 为准。
---

完整实体、路由和状态机写在 [`easytv-api/API.md`](https://github.com/easytv-ai/easytv-api/blob/main/API.md)。**改接口先改那份文件，再改代码。** 文档站把常用接口按资源拆开，每条带方法、参数、curl 和响应示例。

## 约定

- Base URL：`NUXT_PUBLIC_API_BASE_URL`，本地默认 `http://127.0.0.1:8383`。下文 curl 里写成 `$API`。
- HTTP **恒 200**。成败看 JSON 里的 `success`，不要看状态码。
- 时间：Unix 秒。`deleted_at` 为空表示未删除。
- 分页：`?page=1&page_size=20`（上限 100），`data = { "items": [], "total": 123 }`。
- 软删：`DELETE` 进回收站，30 天后物理清理；对应 `POST …/restore`。

```json
{ "success": true, "message": "", "data": {} }
{ "success": false, "message": "错误原因" }
```

鉴权头、登录、越权返回见 [鉴权与登录](/docs/api-auth)。

## 健康检查

### GET `/healthz`

匿名。Docker 与 Compose 都用它做探针。HTTP 200，body 不是通用响应包：

```json
{ "status": "ok" }
```

```bash
curl "$API/healthz"
```

## 目录

按调用方和资源拆开。创作台从登录走到出片，一般按这个顺序对接。

| 分组 | 页面 |
| --- | --- |
| 约定 | [鉴权与登录](/docs/api-auth) · [用户侧总表](/docs/api-user) |
| 创作 | [项目](/docs/api-project) · [画布](/docs/api-canvas) · [资产](/docs/api-asset) · [生成任务](/docs/api-task) |
| 社区 | [作品](/docs/api-work) · [技能](/docs/api-skill) · [公开信息流](/docs/api-public) |
| 计费 | [模型](/docs/api-models) · [钱包](/docs/api-wallet) · [订单](/docs/api-order) |
| 协作 | [团队](/docs/api-team) · [媒体工具](/docs/api-media) |
| 运营 | [管理侧总表](/docs/api-admin) · [用户](/docs/api-admin-user) · [审核](/docs/api-admin-review) · [定价与网关](/docs/api-admin-price) |
| 渠道 | [渠道控制台](/docs/api-partner) |

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
| web `/projects` | `GET/POST /user/project`，回收站与 restore |
| web `/canvas?id=` | `GET/PUT /user/canvas/:id`（带 `version`），版本历史 |
| web 画布「生成」 | `GET /generation/models` → `POST /user/task` → 轮询 `GET /user/task/:id` |
| web `/studio` `/watch/:id` | `GET /work`、`GET /work/:id`、评论与点赞 |
| web `/settings` 钱包 | `GET /user/wallet`、`POST /user/order` |
| manage `/user` | `GET /admin/user`、启用禁用、代登 ticket |
| manage `/community-audit` | 作品审核、举报、评论 |
| manage `/model-price` | `GET/POST/PUT /admin/model-price`，网关拉取与导入 |
| partner `/` 看板 | `GET /user/partner/console/overview`、`/stats`、`/customers` |
