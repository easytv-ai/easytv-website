---
title: Projects
description: Work containers. Canvases hang off a project; creating a canvas without project_id auto-creates one.
---

Needs [auth](/docs/api-auth). Studio page `/projects`.

Fields (contract 1.1): `id`, `user_id`, `name`, `description`, `cover_url`, `status`, read-only `canvas_id` (latest canvas), timestamps. Empty `cover_url` on list may be filled with a recent frame; it is not written back.

## GET `/user/project`

Query `keyword`, `page`, `page_size`.

```bash
curl "$API/user/project?page=1&page_size=20" \
  -H "Authorization: Bearer $TOKEN" \
  -H "EasyTV-User: $UID"
```

Open the card with returned `canvas_id`: `/canvas?id=`.

## POST `/user/project`

`{ name, description? }`.

## GET `/user/project/:id`

`{ project, canvases }` (canvases without `graph`). Missing / no access: `资源不存在`.

## PUT `/user/project/:id`

Optional `name`, `description`, `cover_url`. Renaming a canvas also renames the project.

## DELETE `/user/project/:id`

Trash, cascading canvases. Restore: `POST /user/project/:id/restore`. Trash list: `GET /user/project/trash`.
