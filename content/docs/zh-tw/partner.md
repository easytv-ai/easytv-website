---
title: 通路後台
description: easytv-partner 給 MCN、院校、KOL 用的自助返佣與推廣後台。
---

通路後台串接 `/user/partner/*`，儲存庫 [easytv-partner](https://github.com/easytv-ai/easytv-partner)。夥伴用一般 EasyTV 帳號登入，申請入駐，通過後拿到專屬連結和專屬碼。

## 夥伴能做什麼

| 領域 | 說明 |
| --- | --- |
| 看板 | 客戶數、付費、成交與返佣；7 / 30 / 90 天趨勢 |
| 歸屬客戶 | 去識別化暱稱、來源、首次付費、累計實付 |
| 返佣與提領 | 流水、提領紀錄、申請提領（支付寶 / 微信 / 銀行卡） |
| 口令紅包 | 領取、註冊與付費轉換 |
| 推廣素材 | 連結、QR Code、文案、規則 |
| 入駐 | 申請、駁回後重新提交、改聯絡方式 |

返佣比例、歸因窗口和審核在營運後台 **系統 → 成長** 以及「通路夥伴」頁設定。管理員也可以發一次性憑證直接進入某個夥伴的控制台。

## 執行

```bash
pnpm dev          # :3010
```

`NUXT_PUBLIC_API_BASE_URL` 指向 API，`NUXT_PUBLIC_STUDIO_URL` 指向創作台（推廣連結的備援）。

Docker：

```bash
docker run -d -p 3010:3010 \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -e NUXT_PUBLIC_STUDIO_URL=https://studio.example.com \
  ghcr.io/easytv-ai/easytv-partner:latest
```

管理員在營運後台「通路夥伴」頁可以發一次性憑證，開啟 `/console?ticket=` 直接進入某個夥伴的控制台。
