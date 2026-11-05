---
title: Generation tasks
description: Create, poll, cancel, retry. Credits freeze first; the model must be on the live model_price list.
---

Needs [auth](/docs/api-auth). Inspector run and chat text jobs both use this. Model list is anonymous: [Models](/docs/api-models).

State: `pending` → `running` → `succeeded` / `failed` / `cancelled`.

- Credits **freeze** on create, `settle` on success, `unfreeze` on fail / cancel (365-day refund lot).
- `params.count` must be 1. Split batches on the client.
- Unknown model: `模型暂未接入` / `模型 X 未定价`, nothing persisted.
- Low balance: `积分不足，还需 N 积分`.
- Non-text jobs check cloud storage.

## POST `/user/task`

| Field | Notes |
| --- | --- |
| `type` | `text` / `image` / `video` / `audio` |
| `model` | same string as `/generation/models` |
| `prompt` | |
| `params` | `ratio` / `aspect_ratio`, `resolution`, `duration`, `size`, `generate_audio`, `seed`, `voice`, `negative_prompt` |
| `inputs` | `[{ "asset_id": 1, "role": "first_frame" }]` |
| `canvas_id` / `node_id` / `project_id` | write-back |
| `skill_id` | optional; text jobs prepend the skill contract |

`inputs[].role`: `first_frame`, `last_frame`, `reference`, `reference_video`, `reference_audio`, `image` (vision, max 4).

```bash
curl -X POST "$API/user/task" \
  -H "Authorization: Bearer $TOKEN" \
  -H "EasyTV-User: $UID" \
  -H "Content-Type: application/json" \
  -d '{"type":"video","model":"Kling-2.5","prompt":"…","params":{"duration":5,"resolution":"1080P","ratio":"16:9"},"inputs":[{"asset_id":42,"role":"first_frame"}],"canvas_id":88,"node_id":"video-1"}'
```

Response includes `points_frozen`. Poll `GET /user/task/:id` until a terminal status. Generation goes only through the New API–compatible gateway (`/v1/videos` + job poll). `provider_task_id` survives process restart.

## GET `/user/task/:id`

Poll every 1–2s. Success fills `result_asset_id` / `result_url`; text jobs use `result_text`.

## GET `/user/task`

`canvas_id`, `status`, `keyword` (prompt / model / task_no), `active=1`, pagination.

## GET `/user/task/summary`

`{ total, active, succeeded, failed, cancelled, points_today, points_30d, points_frozen }`.

## POST `/user/task/:id/cancel`

Only `pending` / `running`. Unfreezes credits.

## POST `/user/task/:id/retry`

Creates a **new** task with the old params (count forced to 1) and freezes again.

Default timeouts: pending 15 min, running 30 min.
