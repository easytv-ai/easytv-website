---
title: 对接网关
description: 把 New API / One API 兼容网关接到 EasyTV，拉取模型并导入积分定价。
---

EasyTV 通过 OpenAI 兼容接口调用模型：`/v1/chat`、`/v1/images`、`/v1/videos`（以及网关提供的音频能力）。**先有网关，再谈生成。**

## 第一次接通

1. 准备一个已在跑的 [New API](https://github.com/QuantumNous/new-api)（或其它兼容网关）令牌，该令牌能调你要用的文本 / 图像 / 视频模型。
2. 用 `admin` 登录运营后台 → **系统 → 网关**。
3. 填网关 Base URL 与 Key，保存。
4. 拉取模型清单，把要用的模型 **导入定价**。
5. 在 **模型定价** 里按秒 / 张 / 次核对积分单价。创作台的预估费用读这里。

对应 setting 键：`EasyAPIGatewayBaseUrl`、`EasyAPIGatewayKey`、`EasyAPIGatewayEnabled`。单价在 `model_price` 表。

调用入口和定价接口不在同一个域名时（例如调用 `api.xxx.com`、定价在 `token.xxx.com`），另填 `EasyAPIGatewayPricingBaseUrl`。查网关余额要用控制台的「系统访问令牌」`EasyAPIGatewayAccessToken`（sk 调用令牌看不到真实余额），低于 `GatewayBalanceAlertUSD`（默认 20 美元）会给管理员发站内通知。

建议积分：

```
网关美元成本 × 汇率(7.3) × 毛利系数(3) × 积分/元(20)
```

按量模型会按假设 token 用量折成次 / 张 / 秒。这些系数都可以在网关设置里改。导入后仍要到 **模型定价** 里核对，尤其是视频按秒、口播要打 `native_audio` 能力位。

## 网关实际打哪些路径

EasyTV 不直连厂商 SDK，全部进 `service/providers/easyapi.go`：

| 类型 | 网关路径 |
| --- | --- |
| 文本 | `POST /v1/chat/completions`（可带最多 4 张图走视觉） |
| 图像 | `POST /v1/images/generations` |
| 语音 | `POST /v1/audio/speech` |
| 视频 | `POST /v1/videos`，再 `GET /v1/videos/{job_id}` 轮询 |

素材用 `input_references[{type,url,role}]`。图生视频的 URL 必须是网关能 GET 到的公网地址，见 [对象存储](/docs/storage)。

429 / 503 最多重试 2 次（认 `Retry-After`）。502 / 504 可能上游已经建任务，不会重发。映射过的错误会变成一句中文给创作者，原文进 SysLog。

## 模型从哪来

EasyTV 不内置厂商 SDK。Kling、即梦、Seedance、Hailuo、Sora、GPT、Qwen、MiniMax 等都只要网关能转成上述 OpenAI 风格路由即可。换模型 = 换网关渠道，不用改 EasyTV 代码。

## 常见卡点

- 网关 200 但创作台一直排队：看 API 日志里上游报错，以及该模型是否已导入定价。
- 只配了聊天模型：图像 / 视频节点会失败，需要网关也暴露对应路由。
- Base URL 多写了 `/v1`：按后台提示填，不要和网关文档里的路径叠一层。
