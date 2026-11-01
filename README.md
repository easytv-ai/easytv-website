# EasyTV Website

EasyTV 开源介绍站（[easytv.ai](https://easytv.ai)）。Nuxt 4 + Tailwind CSS 4 静态站，中英双语。

## 开发

```bash
npm install
npm run dev        # http://localhost:3000
```

## 构建与部署

```bash
npm run generate   # 静态产物在 .output/public
npm run deploy     # nuxt generate + wrangler deploy（Cloudflare）
```

环境变量见 `.env.example`（站点地址、演示站地址）。

## 目录

```
app/pages/index.vue       首页（按区块拼装）
app/components/Site*.vue  各区块
i18n/locales/{zh,en}.json 文案（改文案只改这里）
public/images/showcase    画廊图（来自 easytv-web）
```
