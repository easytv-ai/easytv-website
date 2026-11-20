---
title: 介紹
description: EasyTV 是什麼、四個儲存庫怎麼分工、適合誰來部署。
---

EasyTV 是開源、可自架的 AI 短劇創作平台。創作者在瀏覽器裡把一句話變成成片：節點畫布承載劇本、分鏡、圖像、影片與音訊；3D 導演台負責走位與機位；一句話成片產線自動企劃、生成、合成。計費、模型定價、金流和營運後台都內建。

模型仍然走你自己的 OpenAI 相容閘道，EasyTV 負責創作工作流和營運。

## 四個儲存庫

| 儲存庫 | 做什麼 | 預設連接埠 |
| --- | --- | --- |
| [easytv-api](https://github.com/easytv-ai/easytv-api) | Go 後端：驗證、畫布、智慧代理、合成、計費、儲存 | 8383 |
| [easytv-web](https://github.com/easytv-ai/easytv-web) | 創作台：畫布、一句話成片、導演台、社群 | 3005 |
| [easytv-manage](https://github.com/easytv-ai/easytv-manage) | 營運後台：使用者、審核、定價、閘道、成長 | 3006 |
| [easytv-partner](https://github.com/easytv-ai/easytv-partner) | 通路夥伴自助後台：返佣、提領、推廣素材 | 3010 |

官網（本站）在 [easytv-website](https://github.com/easytv-ai/easytv-website)，不參與創作流程。介面見 [開始使用](/docs)。

## 適合誰

- 要自建短劇 / 短影片 AI 工作台，並且自己掌握模型和資料
- 已經有（或準備架設）OpenAI 相容的模型閘道
- 需要積分計費、會員、金流、審核後台，而不是只呼叫幾個生成介面

## 創作者側能力

- [自由畫布](/docs/canvas)：文字 / 圖像 / 影片 / 音訊 / 分鏡 / 導演台節點
- [一句話成片](/docs/create)：企劃案 → 分層生成 → 合成
- [3D 導演台](/docs/director)：站位與機位寫回畫布
- [媒體工具](/docs/media)：ffmpeg 裁切抽幀，以及依能力位的超解析度 / 去字幕
- [社群與技能](/docs/community)：公開成片、技能分潤
- [登入與團隊](/docs/team)：信箱 / 簡訊 / 微信，個人與團隊空間

## 營運側能力

- [營運後台](/docs/admin)：使用者、審核、定價、金流、成長
- [串接閘道](/docs/gateway) 與 [計費](/docs/billing)
- [通路後台](/docs/partner)：返佣、提領、推廣素材
- [物件儲存](/docs/storage) 與 [正式環境部署](/docs/deploy)

## 不做什麼

EasyTV **不是**模型閘道。文字、圖像、影片、音訊請求都轉送到你設定的 OpenAI 相容閘道。沒有閘道時，創作台可以開啟，但生成跑不起來。

## 下一步

跟著 [快速開始](/docs/quickstart) 從 Docker 跑到第一條成片。想改程式碼請走 [原始碼執行](/docs/install-source)。
