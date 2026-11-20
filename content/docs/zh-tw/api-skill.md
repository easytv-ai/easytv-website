---
title: 技能
description: 官方技能廣場、私有 Skill、收藏。文字任務帶 skill_id 時會注入執行規則。
---

官方列表可匿名，見 [公開介面](/docs/api-public) 的 `GET /skill`。下面是登入使用者自己的。

`guide` + `output_format` 合稱執行契約：`POST /user/task` 帶 `skill_id` 且 `type=text` 時拼到提示詞最前面。圖片 / 影片任務不注入。
