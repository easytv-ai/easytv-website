---
title: 资产
description: 上传、列表、回收站。生成产物 source=generated，上传 source=upload，媒体工具 source=media。
---

需要 [鉴权](/docs/api-auth)。创作台 `/assets` 和画布素材库都走这组。

类型 `type`：`image` / `video` / `audio` / `text` / `other`，上传时按 MIME 自动判断。单文件上限默认 200 MB（`UPLOAD_MAX_MB`）。

## GET `/user/asset`

| Query | 说明 |
| --- | --- |
| `type` | `image` / `video` / `audio` / … |
| `project_id` | 可选 |
| `source` | `upload` / `generated` / `media` |
| `keyword` | 文件名 |
| `page` / `page_size` | 分页 |

```bash
curl "$API/user/asset?type=image&page=1&page_size=20" \
  -H "Authorization: Bearer $TOKEN" \
  -H "EasyTV-User: $UID"
```

```json
{
  "success": true,
  "data": {
    "items": [{
      "id": 42,
      "type": "image",
      "name": "frame.png",
      "url": "https://cdn.example/easytv/….png",
      "cover_url": "",
      "mime": "image/png",
      "size": 204800,
      "width": 1920,
      "height": 1080,
      "duration": 0,
      "source": "upload",
      "created_at": 1730000000
    }],
    "total": 1
  }
}
```

视频会异步抽帧写 `cover_url`，刚上传时可能为空。

## GET `/user/asset/:id`

单个资产。画布从技能页带素材进来时用。

## POST `/user/asset/upload`

`multipart/form-data`，字段 `file`，可选 `project_id`。返回刚写入的 asset。

```bash
curl -X POST "$API/user/asset/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -H "EasyTV-User: $UID" \
  -F "file=@./frame.png" \
  -F "project_id=12"
```

配了七牛时前端走直传：`GET /user/qiniu/upload-token`、`GET /user/qiniu/key`，再 `POST /user/asset/import` 登记。

## POST `/user/asset/import`

跨画布复制或外部 URL 引入。见契约 36.1。请求体带源资产或 URL，返回新 asset。

## DELETE `/user/asset/:id`

进回收站，文件保留 30 天。被画布节点引用时删除策略见契约 14.1。

## GET `/user/asset/trash`

回收站，分页。

## POST `/user/asset/:id/restore`

恢复。
