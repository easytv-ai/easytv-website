---
title: 技能
description: 官方技能广场、私有 Skill、收藏。文本任务带 skill_id 时会注入执行规则。
---

官方列表可匿名，见 [公开接口](/docs/api-public) 的 `GET /skill`。下面是登录用户自己的。

`guide` + `output_format` 合称执行契约：`POST /user/task` 带 `skill_id` 且 `type=text` 时拼到提示词最前。图片 / 视频任务不注入。
