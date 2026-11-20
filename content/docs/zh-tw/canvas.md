---
title: 自由畫布
description: 節點種類、連線生成、版本歷史、唯讀分享，以及畫布上限。
---

畫布是創作台的核心，路徑 `/canvas`。`?id=` 開啟既有畫布，`?project_id=` 從專案新建。後端把 `graph` 當 JSON 原樣儲存，**不解析節點語意**；上限 **2 MB / 張**。

![自由畫布節點連線](/images/docs/canvas.png)

## 節點種類

| kind | 做什麼 |
| --- | --- |
| `text` | 劇本、提示詞、反推描述。可帶最多 4 張參考圖發給能看圖的文字模型 |
| `image` | 文生圖 / 圖生圖，可鎖定主體、風格 |
| `video` | 文生影片、首尾幀、參考影片、口播（`videoMode=talking`） |
| `audio` | TTS、BGM、對白 |
| `storyboard` | 分鏡組：多張圖排成宮格 |
| `director` | [3D 導演台](/docs/director) 場景，寫回同一張畫布 |
| `panorama` | 全景圖 |

空畫布上有起步卡：故事腳本、角色三視圖、全能參考影片、口播、配樂；也可以從 [技能](/docs/community) 套用一組範本。

## 怎麼跑

1. 從左側或空白處新增節點，填提示詞、選模型
2. 把上游節點拖到下游：圖片給影片當首幀 / 參考，文字給圖像當提示詞
3. 點節點上的執行。前端 `POST /user/task`，然後輪詢 `GET /user/task/:id`
4. 成功後產物寫進 `asset`，節點 `content` 換成可播放位址

沒有定價的模型會直接回報「模型未定價」，不會建立任務。積分依 [計費](/docs/billing) 先預扣，失敗或取消後退回。

影片參數原樣轉送給閘道：`ratio` / `resolution` / `duration` / `generate_audio` / `seed` / `negative_prompt`。素材角色：`first_frame`、`last_frame`、`reference`、`reference_video`、`reference_audio`。

## 版本與分享

- 自動儲存大約 10 分鐘合併一筆；Ctrl+S / 儲存按鈕帶 `snapshot: true` 單獨記一筆
- 每張畫布最多 50 個版本。歷史裡可還原（還原前會再備份目前這一稿）
- `PUT` 必須帶目前的 `version`，否則回傳「畫布已在其他地方修改，請重新整理」
- 分享：`GET/PUT /user/canvas/:id/share`，公開頁 `/share/<token>`（舊 `/s/<token>` 會 301）。匿名可看去識別化後的 graph，登入使用者可「複製為我的專案」

## 媒體工具

畫布工具列上的裁切、抽幀、去停頓、音畫分離等走 [媒體工具](/docs/media)。本機 ffmpeg 動作免費；超解析度、去字幕、去背等依模型能力位計費。

瀏覽器裡也可以用 FFmpeg.wasm 做裁剪 / 拆分 / 拼接，不經伺服器端。物件儲存沒設定 CORS 時改走創作台的媒體代理，並把儲存桶網域加到 `NUXT_PUBLIC_MEDIA_HOSTS`。
