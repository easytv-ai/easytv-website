---
title: 專案介紹
description: 四個產品儲存庫各自做什麼、預設連接埠，以及官網不在創作流程上。
---

EasyTV 拆成四個可獨立部署的儲存庫，共用一份 [介面契約](/docs/api)。改介面先改 `easytv-api/API.md`，再改三個前端。

![創作台](/images/docs/studio.png)

## 儲存庫

| 儲存庫 | 做什麼 | 預設連接埠 | 文件 |
| --- | --- | --- | --- |
| [easytv-api](https://github.com/easytv-ai/easytv-api) | Go 後端：驗證、畫布、任務、計費、儲存、閘道適配 | 8383 | [API 參考](/docs/api) |
| [easytv-web](https://github.com/easytv-ai/easytv-web) | 創作台：畫布、一句話成片、導演台、社群 | 3005 | [創作台](/docs/studio) |
| [easytv-manage](https://github.com/easytv-ai/easytv-manage) | 營運後台：使用者、審核、定價、閘道、成長 | 3006 | [營運後台](/docs/admin) |
| [easytv-partner](https://github.com/easytv-ai/easytv-partner) | 通路夥伴自助後台：返佣、提領、素材 | 3010 | [通路後台](/docs/partner) |

官網 [easytv-website](https://github.com/easytv-ai/easytv-website) 只做介紹和這份文件，不參與生成。

## 誰呼叫誰

```
easytv-web      ──┐
easytv-manage   ──┼──▶  easytv-api  ── MySQL / Redis / 对象存储
easytv-partner  ──┘         │
                            ▼
                    OpenAI 兼容网关
```

三端都用 `Authorization: Bearer` + `EasyTV-User`。營運後台再加 `role ≥ 10`。模型請求不直連廠商，一律走你設定的閘道。

## 本機怎麼開

四個儲存庫都在本機時，依連接埠開啟即可。Docker Compose `--profile full` 會啟動 API、創作台和營運後台；通路後台要另外 `pnpm dev`。步驟見 [快速開始](/docs/quickstart) 和 [原始碼執行](/docs/install-source)。
