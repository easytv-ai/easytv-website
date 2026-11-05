---
title: Assets
description: Upload, list, trash. source=upload / generated / media.
---

Needs [auth](/docs/api-auth). `type` is inferred from MIME: `image` / `video` / `audio` / `text` / `other`. Default max 200 MB.

## GET `/user/asset`

Query `type`, `project_id`, `source`, `keyword`, pagination.

## GET `/user/asset/:id`

Single asset.

## POST `/user/asset/upload`

`multipart/form-data` field `file`, optional `project_id`. Returns the asset.

```bash
curl -X POST "$API/user/asset/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -H "EasyTV-User: $UID" \
  -F "file=@./frame.png"
```

Qiniu direct upload: `GET /user/qiniu/upload-token`, then `POST /user/asset/import`.

## DELETE `/user/asset/:id`

Trash; file kept 30 days. Restore: `POST /user/asset/:id/restore`. List: `GET /user/asset/trash`.
