---
title: 常见问题
description: 部署、网关、登录和开源许可上最常碰到的坑。
---

## 创作台能打开，但不能生成

后端没连上，或网关 / 模型定价没配。确认 `NUXT_PUBLIC_API_BASE_URL` 指向活着的 API，然后按 [对接网关](/docs/gateway) 导入模型。

## Docker 里前端调不通 API

浏览器访问的是你的机器，不是容器网络里的 `api:8383`。把 `PUBLIC_API_URL` 设成浏览器能打开的地址，例如 `http://192.168.x.x:8383`。

## 启动报没有管理员

`ROOT_PASSWORD` 没设。系统里没有管理员时，API 会拒绝启动。

## 验证码出不来

开发可以把 `EMAIL_VERIFICATION_ENABLED=false`，验证码打在 API 日志里。生产再配 SMTP 或短信。

## 媒体裁剪失败 / 跨域

对象存储没配 CORS 时，让创作台走服务端媒体代理，并把桶域名加到 `NUXT_PUBLIC_MEDIA_HOSTS`。

## 3000 端口被占

官网 `easytv-website` 默认也是 3000。关掉那个 `nuxt dev`，或给官网换端口。创作台默认 3005，一般不冲突。

## 必须用 pnpm 吗

三个前端仓库都锁了 pnpm。npm / yarn / cnpm 会把 lockfile 和 `packageManager` 搞乱，安装结果也不一样。

## 画布保存失败 / 提示超过 2 MB

整张 `graph` 上限 2 MB。导演台节点不要把机位截图（base64 PNG）写进去，前端持久化时已经会摘掉。

## 任务一直 pending

API 进程要有人处理作业。多节点时看 `WORKER_TAG` 是否对得上。日志里搜网关 429 / 内容审核 / `unsupported duration`。

## 图生视频失败、文生视频成功

网关拿不到素材 URL。本地存储要配公网 `UploadBaseUrl`；OSS / 七牛要用公网域名。见 [对象存储](/docs/storage)。

## 会员价没生效

个人空间看自己有没有有效会员。团队空间看 **owner** 的团队版是否在期内，查看者不能生成。

## 支付回调 404 / 签名失败

`ServerAddress` 必须是 API 的 https 根地址。微信和支付宝控制台里的通知 URL 要指到 `/wechat/webhook`、`/alipay/webhook`。

## 我能闭源商用吗

遵守 AGPL-3.0（对外提供修改版网络服务时公开对应源码）就可以商用，不必买授权。想闭源或白标且不开源改动，需要 [商业许可](/docs/license)。`easytv-api` 里参考 New API 的模块仍受 AGPL 约束。
