---
title: Canvas
description: Opaque graph storage, optimistic version, history, read-only share and chat threads.
---

Needs [auth](/docs/api-auth). Path `/canvas?id=`. The API **does not parse** node semantics. Cap: **2 MB per canvas**. Do not write camera-capture base64 into director `data.scene`.

## POST `/user/canvas`

`{ name, project_id?, graph? }`. Missing `project_id` creates a same-name project.

## GET `/user/canvas/:id`

Full `graph` and current `version`. Save must send that `version` back.

## PUT `/user/canvas/:id`

**`version` is required.** Mismatch returns `画布已在其他地方修改，请刷新`.

| Field | Notes |
| --- | --- |
| `version` | optimistic lock |
| `name` | also updates the project name |
| `graph` | full replace |
| `snapshot` | `true` writes a manual version |
| `note` | version note, 100 chars |

Success is light: `{ id, version, updated_at }`. Autosave merges into one `auto` row about every 10 minutes. Ctrl+S sends `snapshot: true`.

## Versions

`GET /user/canvas/:id/versions` — max 50, no `graph` on the list.

`GET /user/canvas/:id/versions/:vid` — includes `graph`.

`POST /user/canvas/:id/versions/:vid/restore` — backs up current, then overwrites.

`source`: `auto` / `manual` / `restore`.

## Share

`GET/PUT /user/canvas/:id/share` with `{ enabled }`. Response `{ enabled, token, path }` (`/share/<token>`). Anonymous read: `GET /share/canvas/:token`. Copy as mine: `POST /user/share/canvas/:token/copy`.

## Chat

`GET/POST/PUT/DELETE /user/canvas/:id/chat`. In-flight bubbles and `undoToken` are not stored. Max 200 messages / 2 MB per thread. List max 30, no message bodies.
