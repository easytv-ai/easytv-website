---
title: 營運後台
description: easytv-manage 管哪些東西，以及上線後要先改哪幾項設定。
---

營運後台串接 API 的 `/admin/*`，儲存庫 [easytv-manage](https://github.com/easytv-ai/easytv-manage)。用首次啟動建立的 `admin` 帳號登入。

![營運後台：看板、使用者、審核、定價和閘道](/images/docs/admin.svg)

## 能管什麼

| 領域 | 頁面 |
| --- | --- |
| 人 | 使用者、團隊額度、通路夥伴 |
| 內容 | 作品、精選、分類、輪播、技能、提示詞、風格、主體、專案、資產、畫布 |
| 社群 | 評論 / 檢舉 / 動態審核、公告、通知 |
| 錢 | 訂單、儲值、提領、流水、會員、積分包、模型定價、發票 |
| 成長 | 活動、邀請與簽到、看板 |
| 系統 | 站點、金流、閘道、成長與發票（僅超級管理員） |

這裡改的設定寫入 `setting` 表，無需重啟 API。

系統設定（僅超級管理員）分這些頁籤：站點、簡訊、發票、金流、閘道與儲存、AI 對話、媒體工具。成長規則（邀請、簽到、成片預設模型、分潤匯率）在成長頁。

## 首次上線清單

1. **系統 → 閘道**：填 OpenAI 相容閘道的位址與 Key，拉取模型並匯入定價
2. **系統 → 站點**：創作台公開位址（邀請連結和回呼用它）
3. **系統 → 金流**：要賣方案或積分時開啟微信 / 支付寶
4. **模型定價**：依模型調整積分單價

## 執行

```bash
pnpm dev          # :3006
```

```bash
docker run -d -p 3006:3006 \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -e NUXT_PUBLIC_STUDIO_URL=https://studio.example.com \
  -e NUXT_PUBLIC_PARTNER_URL=https://partner.example.com \
  ghcr.io/easytv-ai/easytv-manage:latest
```

`NUXT_PUBLIC_PARTNER_URL` 給夥伴頁「開啟通路後台」用。沒有後端時登入頁有示範帳號，只能看介面。角色 `role ≥ 10` 才能進後台，改閘道 / 金流 / 站點要超級管理員（`role ≥ 100`）。
