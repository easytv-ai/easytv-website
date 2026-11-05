---
title: 媒体工具
description: 裁切、抽帧、去停顿等本地 ffmpeg 动作，以及超分、去字幕等走生成任务的模型动作。
---

需要 [鉴权](/docs/api-auth) 和可选 `EasyTV-Team`。创建限流 30 次/分钟。

`engine=local` 免费，服务器没装 ffmpeg 时不可用。`engine=model` 同步提交生成任务，积分不足 / 未定价时创建接口直接报错且不落作业。

## GET `/user/media/actions`

动作清单与可用性。前端工具条整条据此驱动。

## POST `/user/media/jobs`

```json
{
  "action": "crop",
  "asset_id": 123,
  "params": { "rect": { "x": 0, "y": 0.8, "w": 1, "h": 0.2 } },
  "node_id": "video-3",
  "canvas_id": 12,
  "project_id": 5
}
```

`asset_id` 与 `task_id` 二选一（后者取该任务产物）。团队空间里队友的素材也能处理。

```json
{
  "success": true,
  "data": {
    "job": {
      "id": 8,
      "engine": "local",
      "action": "crop",
      "status": 0,
      "progress": 0,
      "source_asset_id": 123,
      "outputs": []
    }
  }
}
```

`status`：`0` 排队 / `1` 处理中 / `2` 成功 / `-1` 失败。

## GET `/user/media/jobs`

`canvas_id` / `project_id` / `asset_id` / `action` / `active=1` + 分页。

## GET `/user/media/jobs/:id`

详情。模型动作的状态由生成任务实时映射。取消模型动作走 `POST /user/task/:id/cancel`。本地动作秒级完成，不设取消。

## 常用 action

本地（免费）：`crop`、抽帧、拆分、拼接、`remove_silence`（去停顿）、音画分离。

模型（计费，要对应 `abilities`）：`upscale`、`remove_subtitle`、抠像、`transcribe`（语音转字幕）等。完整参数表见契约 23.3 / 35。
