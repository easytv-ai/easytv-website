---
title: 快速开始
description: 从空机器到第一次出片：Docker 拉起、登录后台、接通网关、跑一条一句话成片。
---

目标是 **15 分钟内**看到一条成片。下面默认本机已经有 Docker 24+，以及一个能调文本 / 图像 / 视频模型的 [New API](https://github.com/QuantumNous/new-api) 兼容令牌。

更细的安装选项见 [安装部署](/docs/install)；只想先看能力见 [创作台](/docs/studio)。

## 1. 拉起整套

```bash
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
```

编辑 `.env`：

- `ROOT_PASSWORD`：第一个管理员密码（用户名默认 `admin`）
- `CRYPTO_SECRET`：`openssl rand -hex 32`

```bash
docker compose --profile full up -d
curl http://localhost:8383/healthz
```

| 打开 | 地址 |
| --- | --- |
| API | http://localhost:8383 |
| 创作台 | http://localhost:3005 |
| 运营后台 | http://localhost:3006 |

渠道后台要单独起，见 [渠道后台](/docs/partner)。

## 2. 登录运营后台

打开 `http://localhost:3006`，用 `admin` + 你设的 `ROOT_PASSWORD` 登录。

按这个顺序改设置（都在 **系统** 里，改完立刻生效）：

1. **站点**：创作台公开地址填 `http://localhost:3005`（邀请链接、支付回调都用它）
2. **网关**：填 New API 兼容 Base URL 与 Key → 拉取模型 → **导入定价**
3. **模型定价**：核对接进来的文本 / 图像 / 视频单价（没有定价的模型，创作台不允许生成）

细节见 [对接网关](/docs/gateway)。

## 3. 给管理员加点积分

生成要扣积分。在后台 **用户** 里找到 `admin`，用「调整积分」发一笔测试额度（或先给自己开通一个会员计划）。

也可以在创作台 `/pricing` 走支付，但本地联调通常先手动加点。

## 4. 跑一条一句话成片

打开 `http://localhost:3005/create`（没登录会弹登录框，用同一个 `admin` 账号）。

1. 输入一句话，选时长 15 / 30 / 60 秒
2. 生成策划案（会扣一次文本模型积分）
3. 核对角色、场景、分镜，点「建画布」
4. 分层生成角色图、分镜图、镜头视频、配音
5. 合成：ffmpeg 拼接、烧字幕、混 BGM，免费账号会打水印

完整步骤见 [一句话成片](/docs/create)。

## 5. 接下来

- 在画布上改镜头、加节点：[自由画布](/docs/canvas)
- 摆机位：[3D 导演台](/docs/director)
- 卖套餐：[计费与支付](/docs/billing)
- 上线到自己的域名：[生产部署](/docs/deploy)
