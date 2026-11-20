---
title: 畫布
description: graph 原樣存取、樂觀鎖 version、版本歷史、唯讀分享和對話紀錄。
---

需要 [驗證](/docs/api-auth)。創作台路徑 `/canvas?id=`。後端 **不解析** `graph` 裡的節點語意，上限 **2 MB / 張**。導演台節點不要把機位截圖 base64 寫進 `data.scene`。

儲存必須帶目前的 `version`，否則回傳「畫布已在其他地方修改，請重新整理」。每張畫布最多 50 個版本。分享頁路徑 `/share/<token>`。
