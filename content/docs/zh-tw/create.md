---
title: 一句話成片
description: 輸入一句話，自動產出企劃案、分層生成、合成帶字幕的成片。
---

路徑 `/create`。精靈是：輸入 → 企劃案 → 分層生成 → 合成 → 完成。契約在 `API.md` 第 8.2 節。

![一句話成片](/images/docs/create.png)

匿名可以看第一步；點「生成企劃案」才要求登入。狀態依企劃案 id 存在 sessionStorage，重新整理或 `?screenplay=` 能接上。

## 流程

### 1. 輸入

一句話（上限約 8000 字），時長 15 / 30 / 60 秒，可選風格。`POST /user/screenplay` 同步呼叫文字模型寫出企劃案，依文字單價扣一次積分。

預設文字模型優先順序：本次已選 → 上次記住的 → 後台 **成長** 裡的 `ComposePlanModel` → 定價表裡第一個文字模型。

### 2. 企劃案

結構大致是：

```json
{
  "title": "",
  "style": "电影感 · 冷色调",
  "aspect": "16:9",
  "characters": [{ "key": "c1", "name": "", "look": "外貌与服装" }],
  "scenes": [{ "key": "s1", "name": "", "look": "场景" }],
  "shots": [{ "no": 1, "scene": "s1", "characters": ["c1"], "prompt": "画面", "motion": "运镜", "line": "台词", "seconds": 5 }]
}
```

檢查：鏡頭 ≤ 12、角色 ≤ 4、場景 ≤ 4。儲存走 `PUT /user/screenplay/:id`。

`POST /user/screenplay/:id/estimate` 會依你選的圖像 / 影片 / 音訊模型預估建畫布後各層積分。

### 3. 建畫布並分層生成

`POST /user/screenplay/:id/build` 新建一張畫布（沒有專案就順手建）：

- 文字節點：企劃案摘要
- 每個角色一張圖（`sp.layer=character`）
- 每鏡：分鏡圖 → 影片 → 有台詞則配音

然後在畫布上逐層點執行，或讓精靈批次提交。圖像預設、影片預設、音訊預設分別讀 setting `ComposeImageModel` / `ComposeVideoModel` / `ComposeAudioModel`（營運後台 **系統 / 成長 → 成片與分潤**）。某個通路在閘道壞了，換這三個鍵即可，不必改程式碼。

### 4. 合成

`POST /user/canvas/:id/compose` 取已成功的影片節點（依 x 或 `clip_order`），ffmpeg 統一到 1280×720 / 30fps，燒錄 SRT、混 BGM（-14 dB），免費使用者右下角浮水印 `EasyTV.ai`（`ComposeWatermarkEnabled` 且非會員）。

合成 **不扣積分**。單一使用者同時排隊 / 合成中 ≥ 3 會先拒絕，全域佇列 ≥ 20 再拒絕。超過 10 分鐘標為失敗。輪詢 `GET /user/compose/:id`。

成片進資產庫 `source=compose`，可以發到社群 `/watch/:id`。

## 常見失敗

- 企劃案解析失敗：介面會自動重試一次文字模型
- 圖生影片 502：有的閘道通路文生影片正常、圖生必掛。把 `ComposeVideoModel` 換成實測可用的模型
- 閘道 429 / 503：後端最多再試 2 次（認 `Retry-After`）。用盡仍回「模型目前排隊較多」
