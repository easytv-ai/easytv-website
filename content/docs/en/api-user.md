---
title: User API index
description: Every /user/* the studio calls. Request bodies and examples live on the resource pages.
---

Prefix `/user/*`, needs [auth](/docs/api-auth). Caller is mostly [easytv-web](https://github.com/easytv-ai/easytv-web).

## Projects and canvas

| Method | Path | Notes |
| --- | --- | --- |
| GET/POST | `/user/project` | list / `{ name, description }` |
| GET/PUT/DELETE | `/user/project/:id` | detail with `canvases`; trash cascades |
| POST | `/user/project/:id/restore` | |
| GET | `/user/project/trash` | |
| GET/POST | `/user/canvas` | missing `project_id` auto-creates a project |
| GET/PUT/DELETE | `/user/canvas/:id` | PUT **requires `version`** |
| GET/POST | `/user/canvas/:id/versions…` | history and restore |
| GET/PUT | `/user/canvas/:id/share` | |
| GET/POST/PUT/DELETE | `/user/canvas/:id/chat` | |
| POST | `/user/share/canvas/:token/copy` | |

See [Projects](/docs/api-project), [Canvas](/docs/api-canvas).

## Assets and generation

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/user/asset` | `type?, project_id?, source?, keyword?` |
| POST | `/user/asset/upload` | multipart `file` |
| POST | `/user/asset/import` | |
| GET | `/generation/models` | anonymous |
| POST | `/user/task` | create |
| GET | `/user/task/:id` | poll |
| POST | `/user/task/:id/cancel` `/retry` | |
| GET | `/user/media/actions` `/user/media/jobs` | |

See [Assets](/docs/api-asset), [Tasks](/docs/api-task), [Models](/docs/api-models), [Media jobs](/docs/api-media).

## Works, skills, wallet, team

Works / likes / comments: [Works](/docs/api-work). Private skills and favorites: [Skills](/docs/api-skill). Wallet, lots, orders: [Wallet](/docs/api-wallet), [Orders](/docs/api-order). Team space: [Teams](/docs/api-team). Notifications: `GET /user/notification`, `POST /user/notification/read`. Self-deactivate: `POST /user/self/deactivate`.
