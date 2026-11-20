---
title: 計費與金流
description: 積分批次、會員價、預扣結算，以及微信 / 支付寶怎麼接到創作台。
---

創作只認 **積分**。歷史遺留的 `quota` 只給提領等舊功能，不參與生成。契約在 `API.md` 第 6 章。

![營運後台看板裡的積分與成交](/images/docs/admin.svg)

## 積分怎麼算

- 入帳是「批次」：來源 + 數量 + 過期時間。消耗依 **最早過期優先**
- 餘額 = 未過期批次剩餘之和
- 建立任務時依模型參數 **預扣**（`freeze` 流水）；成功 `settle`（金額 0，估算即結算）；失敗 / 取消退回一筆 365 天有效的 `refund` 批次
- **沒有定價的模型不能建立任務**
- 伺服器端重新計價，前端顯示的報價只是參考。下單回應裡的 `price` 才是應付金額

模型單價在 `model_price`：

| 欄位 | 含義 |
| --- | --- |
| `type` | `text` / `image` / `video` / `audio` |
| `unit` | `second`（影片按秒）/ `image`（按張）/ `call`（文字、語音按次） |
| `points_per_unit` | 標準價 |
| `member_points_per_unit` | 會員價，0 表示同標準價 |

估算：影片 `duration × count × 单价`；圖片 / 文字 / 語音 `count × 单价`。建立任務時 `count` 只能是 1，批次由前端拆成多筆。

匯入定價時的建議積分：閘道美元成本 × 匯率（預設 7.3）× 毛利係數（預設 3）× 積分/元（預設 20）。按量模型會依假設的 token 用量折算成次 / 張 / 秒。營運可在閘道設定裡改這些係數。

## 會員與積分包

會員方案（`starter` / `creator` / `pro` / `flagship`）每月發積分，有效期內生成走會員價。開通即發首月（31 天有效），之後由後台任務依發放日補發。

積分包按天有效（30 / 90 / 365 / 730）。會員買積分包走 `member_price`。

年 / 季折扣、團隊席位折扣寫在 setting `BillingPromo` JSON 裡，過期後倍率全部回到 1。

免費帳號還有並行路數和雲端儲存上限（`FREE_CONCURRENT` / `FREE_STORAGE_GB`，會員方案會覆蓋）。

## 下單

創作台 `/pricing`：`POST /user/order`，`payment_method` 為

- `wechat_native`：回傳 `code_url`，前端畫 QR Code
- `alipay_f2f`：當面付 QR Code
- `alipay_pc`：跳轉收銀台 `payment_url`

通路沒開時訂單仍是 `pending`，`pay` 為 null。`order_no` 同時當作付款單號。微信 `/wechat/webhook`、支付寶 `/alipay/webhook` 回呼後履約（發會員或發積分），冪等。

## 後台要設定的

1. **系統 → 站點**：`ServerAddress` 填 API 對外根位址（不要結尾斜線），用來拼回呼
2. **系統 → 金流**：微信 APIv3 Native、支付寶憑證模式（當面付 / 電腦網站支付可分開）
3. **會員方案 / 積分包 / 模型定價** 三頁維護商品
4. 本機不想接金流：在使用者頁給測試帳號手動加積分

發票、退款、手動標記已付款只有超級管理員（`role ≥ 100`）能做。
