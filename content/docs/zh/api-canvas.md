---
title: 画布
description: graph 原样存取、乐观锁 version、版本历史、只读分享和对话记录。
---

需要 [鉴权](/docs/api-auth)。创作台路径 `/canvas?id=`。后端 **不解析** `graph` 里的节点语义，上限 **2 MB / 张**。导演台节点不要把机位截图 base64 写进 `data.scene`。

## GET `/user/canvas`

| Query | 说明 |
| --- | --- |
| `project_id` | 可选，按项目过滤 |
| `page` / `page_size` | 分页 |

列表一般不含完整 `graph`。

## POST `/user/canvas`

新建。不传 `project_id` 时后端自动新建同名项目并关联。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | string | 草稿名 |
| `project_id` | int | 可选 |
| `graph` | object | 可选，默认空图 |

```bash
curl -X POST "$API/user/canvas" \
  -H "Authorization: Bearer $TOKEN" \
  -H "EasyTV-User: $UID" \
  -H "Content-Type: application/json" \
  -d '{"name":"未命名草稿","graph":{"nodes":[],"edges":[],"viewport":{"x":0,"y":0,"zoom":1}}}'
```

## GET `/user/canvas/:id`

含完整 `graph` 和当前 `version`。打开画布必须先拉这一份，保存时把 `version` 原样带回去。

```json
{
  "success": true,
  "data": {
    "id": 88,
    "project_id": 12,
    "name": "未命名草稿",
    "version": 7,
    "graph": {
      "nodes": [{ "id": "image-1", "type": "easytv", "position": { "x": 0, "y": 0 }, "data": { "kind": "image", "label": "图片1" } }],
      "edges": [],
      "viewport": { "x": 0, "y": 0, "zoom": 1 }
    },
    "thumbnail_url": "",
    "updated_at": 1730000100
  }
}
```

## PUT `/user/canvas/:id`

保存。**必须带当前 `version`**，否则返回 `画布已在其他地方修改，请刷新`。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `version` | int | 必填，乐观锁 |
| `name` | string | 改名同时更新所属项目名 |
| `graph` | object | 整张替换 |
| `thumbnail_url` | string | 可选 |
| `snapshot` | bool | `true` 时单独记一条手动版本 |
| `note` | string(100) | 版本备注 |

```bash
curl -X PUT "$API/user/canvas/88" \
  -H "Authorization: Bearer $TOKEN" \
  -H "EasyTV-User: $UID" \
  -H "Content-Type: application/json" \
  -d '{"version":7,"graph":{"nodes":[],"edges":[],"viewport":{"x":0,"y":0,"zoom":1}},"snapshot":false}'
```

成功只回轻量字段：

```json
{ "success": true, "data": { "id": 88, "version": 8, "updated_at": 1730000200 } }
```

自动保存大约 10 分钟合并一条版本（`source=auto`）。Ctrl+S / 保存按钮带 `snapshot: true` 记 `manual`。

## DELETE `/user/canvas/:id`

进回收站。所属项目在回收站时，恢复画布会一并恢复项目：`POST /user/canvas/:id/restore`。

## GET `/user/canvas/:id/versions`

版本历史，最多 50 条。列表 **不含** `graph`。

`source`：`auto` / `manual` / `restore`（回滚前自动备份）。

取单条含 graph：`GET /user/canvas/:id/versions/:vid`。

## POST `/user/canvas/:id/versions/:vid/restore`

回滚：先备份当前状态，再覆盖 `graph`，返回新的画布详情（含 graph 与 version）。

## GET `/user/canvas/:id/share`

只读分享状态。

## PUT `/user/canvas/:id/share`

```json
{ "enabled": true }
```

返回 `{ enabled, token, path }`。`path` 形如 `/share/<token>`。关闭后 token 保留但链接失效。

匿名读分享：`GET /share/canvas/:token`，见 [公开信息流](/docs/api-public)。登录用户可 `POST /user/share/canvas/:token/copy` 复制为自己的项目 + 画布。

## 对话

画布右侧对话按当前用户和画布存。进行中的气泡和 `undoToken` 不入库。单段最多 200 条、2 MB。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/user/canvas/:id/chat` | 会话列表，不含消息正文，最多 30 条 |
| POST | `/user/canvas/:id/chat` | `{ title?, messages }` 新建 |
| GET | `/user/canvas/:id/chat/:sid` | 含 `messages` |
| PUT | `/user/canvas/:id/chat/:sid` | 覆盖标题和消息 |
| DELETE | `/user/canvas/:id/chat/:sid` | 删一段 |
| DELETE | `/user/canvas/:id/chat` | 清空，返回 `{ deleted }` |
