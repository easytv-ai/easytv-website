---
title: 串接閘道
description: 把 OpenAI 相容閘道接到 EasyTV，拉取模型並匯入積分定價。
---

EasyTV 透過 OpenAI 相容介面呼叫模型：`/v1/chat`、`/v1/images`、`/v1/videos`（以及閘道提供的音訊能力）。**先有閘道，再談生成。**

閘道位址和 Key 在營運後台 **系統 → 閘道** 填寫，改完立刻生效。

![營運後台系統與閘道](/images/docs/admin.svg)

## 第一次接通

1. 準備一個已在運作的 OpenAI 相容閘道的權杖，該權杖能呼叫你要用的文字 / 圖像 / 影片模型。
2. 用 `admin` 登入營運後台 → **系統 → 閘道**。
3. 填閘道 Base URL 與 Key，儲存。
4. 拉取模型清單，把要用的模型 **匯入定價**。
5. 在 **模型定價** 裡按秒 / 張 / 次核對積分單價。創作台的預估費用讀這裡。

對應 setting 鍵：`EasyAPIGatewayBaseUrl`、`EasyAPIGatewayKey`、`EasyAPIGatewayEnabled`。單價在 `model_price` 表。

呼叫入口和定價介面不在同一個網域時（例如呼叫 `api.xxx.com`、定價在 `token.xxx.com`），另填 `EasyAPIGatewayPricingBaseUrl`。查閘道餘額要用控制台的「系統存取權杖」`EasyAPIGatewayAccessToken`（sk 呼叫權杖看不到真實餘額），低於 `GatewayBalanceAlertUSD`（預設 20 美元）會給管理員發站內通知。

建議積分：

```
网关美元成本 × 汇率(7.3) × 毛利系数(3) × 积分/元(20)
```

按量模型會依假設的 token 用量折算成次 / 張 / 秒。這些係數都可以在閘道設定裡改。匯入後仍要到 **模型定價** 裡核對，尤其是影片按秒、口播要打上 `native_audio` 能力位。

## 閘道實際打哪些路徑

EasyTV 不直連廠商 SDK，全部進 `service/providers/easyapi.go`：

| 類型 | 閘道路徑 |
| --- | --- |
| 文字 | `POST /v1/chat/completions`（可帶最多 4 張圖走視覺） |
| 圖像 | `POST /v1/images/generations` |
| 語音 | `POST /v1/audio/speech` |
| 影片 | `POST /v1/videos`，再 `GET /v1/videos/{job_id}` 輪詢 |

素材用 `input_references[{type,url,role}]`。圖生影片的 URL 必須是閘道能 GET 到的公網位址，見 [物件儲存](/docs/storage)。

429 / 503 最多重試 2 次（認 `Retry-After`）。502 / 504 可能上游已經建立任務，不會重送。對應過的錯誤會變成一句中文給創作者，原文進 SysLog。

## 模型從哪來

EasyTV 不內建廠商 SDK。Kling、即夢、Seedance、Hailuo、Sora、GPT、Qwen、MiniMax 等都只要閘道能轉成上述 OpenAI 風格路由即可。換模型 = 換閘道通路，不用改 EasyTV 程式碼。

## 常見卡點

- 閘道 200 但創作台一直排隊：看 API 日誌裡的上游報錯，以及該模型是否已匯入定價。
- 只設定了聊天模型：圖像 / 影片節點會失敗，需要閘道也公開對應路由。
- Base URL 多寫了 `/v1`：依後台提示填，不要和閘道文件裡的路徑疊一層。
