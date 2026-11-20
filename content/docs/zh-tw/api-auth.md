---
title: 驗證與登入
description: Bearer + EasyTV-User、團隊空間標頭、信箱 / 簡訊登入，以及統一錯誤回傳。
---

創作台、營運後台、通路後台共用同一套登入。**不要用 Cookie 做驗證。** 下文 `$API` 預設 `http://127.0.0.1:8383`。

每條介面的 Header、請求主體、200 回應在左側子選單裡。

## 請求標頭

| Header | 何時需要 | 說明 |
| --- | --- | --- |
| `Authorization` | `/user/*`、`/admin/*` | `Bearer <access_token>` |
| `EasyTV-User` | 同上 | 目前使用者 id，必須和 token 裡的使用者一致 |
| `EasyTV-Team` | 可選 | 團隊空間 id。未帶 / `0` 為個人空間 |
| `Content-Type` | JSON 請求主體 | `application/json` |
| `Accept-Language` | 模型詳情等 | 原樣轉送給閘道，用於文案語言 |

`/admin/*` 還要求 `role ≥ 10`。改系統設定、退款、調積分等要 `role ≥ 100`（RootAuth）。切到團隊空間時再加 `EasyTV-Team`。團隊空間裡的生成花團隊積分池；個人空間一律花自己的錢包。

## 回應包

HTTP **恆為 200**。用 JSON 裡的 `success`。越權與資源不存在都回傳 `success: false, message: "资源不存在"`，避免列舉。部分介面另帶 `code`（例如通路控制台 `not_applied` / `not_approved`）。

## 常見錯誤

| message | 含義 |
| --- | --- |
| `无效的参数` | JSON 解不出來或必填欄位為空 |
| `用户名或密码错误` | 登入失敗，不區分帳號是否存在 |
| `资源不存在` | 越權或真的沒有 |
| `权限不足` | 一般管理員呼叫了 RootAuth 介面 |
| `积分不足，还需 N 积分` | 建立任務預扣失敗 |
| `模型未定价` / `模型暂未接入` | `model` 不在 `model_price` 生效清單 |
