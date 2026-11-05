---
title: 生成任务
description: 创建、轮询、取消、重试。积分先预扣后结算；模型必须在 model_price 生效清单里。
---

需要 [鉴权](/docs/api-auth)。画布 Inspector「生成」和对话栏文本任务都走这组接口。模型清单是匿名的，见 [模型](/docs/api-models)。

状态机：`pending` → `running` → `succeeded` / `failed` / `cancelled`。

规则：

- 积分按 `model_price` **先预扣**（`freeze`），成功 `settle`，失败 / 取消退回（`unfreeze`，365 天有效）。
- `params.count` 只能是 1。要多条请客户端拆多次提交。
- `model` 不在生效清单：`模型暂未接入` 或 `模型 X 未定价`，不落库。
- 余额不够：`积分不足，还需 N 积分`。
- 非文本任务会校验云存储；已满直接拒绝。

## POST `/user/task`

创建任务。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | string | `text` / `image` / `video` / `audio` |
| `model` | string | 与 `GET /generation/models` 的 `model` 一致 |
| `prompt` | string | |
| `params` | object | 透传：`ratio` / `aspect_ratio`、`resolution`、`duration`、`size`、`generate_audio`、`seed`、`voice`、`negative_prompt` |
| `inputs` | array | `[{ "asset_id": 1, "role": "first_frame" }]` |
| `canvas_id` / `node_id` / `project_id` | | 回填画布节点用 |
| `skill_id` | int | 可选。文本任务会把技能的执行规则拼到提示词前面 |

`inputs[].role`：

| role | 用途 |
| --- | --- |
| `first_frame` | 图生视频首帧 |
| `last_frame` | 尾帧 |
| `reference` | 外观参考图，不作首帧 |
| `reference_video` | 参考视频 |
| `reference_audio` | 参考音频 |
| `image` | 文本任务视觉输入（最多 4 张） |

```bash
curl -X POST "$API/user/task" \
  -H "Authorization: Bearer $TOKEN" \
  -H "EasyTV-User: $UID" \
  -H "Content-Type: application/json" \
  -d '{
    "type":"video",
    "model":"Kling-2.5",
    "prompt":"主角走过天台边缘，城市灯光在身后。",
    "params":{"duration":5,"resolution":"1080P","ratio":"16:9"},
    "inputs":[{"asset_id":42,"role":"first_frame"}],
    "canvas_id":88,
    "node_id":"video-1"
  }'
```

成功 `data` 为任务对象，额外带 `points_frozen`。前端拿到 `id` 后轮询详情。

生成 **只走 EasyAPI / New API 兼容网关**，不直连厂商。视频是网关 `POST /v1/videos` + `GET /v1/videos/{job_id}`；网关任务 ID 记在 `provider_task_id`，进程重启后自动恢复轮询。

## GET `/user/task/:id`

详情。前端 1–2 秒轮询，直到终态。

```json
{
  "success": true,
  "data": {
    "id": 1001,
    "task_no": "GT20261105001",
    "type": "video",
    "model": "Kling-2.5",
    "status": "running",
    "progress": 40,
    "points_frozen": 150,
    "cost_points": 0,
    "result_url": "",
    "result_asset_id": 0,
    "error_msg": ""
  }
}
```

成功后 `result_asset_id` / `result_url` 有值，文本任务用 `result_text`（没有 asset）。

## GET `/user/task`

任务列表。

| Query | 说明 |
| --- | --- |
| `canvas_id` | 这张画布 |
| `status` | `pending` / `running` / `succeeded` / `failed` / `cancelled` |
| `keyword` | 提示词 / 模型 / 单号 |
| `active=1` | 只看进行中 |
| `page` / `page_size` | 分页 |

## GET `/user/task/summary`

任务中心概览：`{ total, active, succeeded, failed, cancelled, points_today, points_30d, points_frozen }`。

## POST `/user/task/:id/cancel`

仅 `pending` / `running`。取消后预扣退回。

## POST `/user/task/:id/retry`

按原参数新建任务并重新预扣，返回 **新** 任务。旧参数里 `count > 1` 会改成 1 再计费。

## 超时

后台把超时任务标失败并退分。默认 pending 15 分钟、running 30 分钟（`TASK_PENDING_TIMEOUT_MINUTES` / `TASK_RUNNING_TIMEOUT_MINUTES`）。
