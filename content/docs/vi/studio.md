---
title: Studio
description: easytv-web làm gì, các route chính và cách trỏ nó tới API của bạn.
---

Studio là frontend dành cho người sáng tác, kho mã [easytv-web](https://github.com/easytv-ai/easytv-web). Hướng dẫn theo tính năng: [canvas](/docs/canvas), [một câu thành phim](/docs/create), [sân khấu đạo diễn](/docs/director), [cộng đồng](/docs/community), [đăng nhập và nhóm](/docs/team).

![Trang chủ studio và phim tuyển chọn](/images/docs/studio.png)

## Studio làm gì

- **Canvas tự do**: các nút văn bản, hình ảnh, video, âm thanh và nhóm phân cảnh, có lịch sử phiên bản và chia sẻ chỉ đọc
- **Một câu thành phim**: kế hoạch, nhân vật, bối cảnh, cảnh quay và lồng tiếng, rồi tinh chỉnh từng cảnh
- **Sân khấu đạo diễn 3D**: xếp vị trí nhân vật và đặt máy quay trong trình duyệt; mô tả cảnh quay được ghi ngược về canvas
- **Dựng ngay trong trình duyệt**: cắt, tách, ghép nối bằng FFmpeg.wasm
- **Cộng đồng**: khám phá, theo dõi, bảng xếp hạng, bình luận, trình phát công khai
- **Skill và prompt**: mẫu quy trình dùng lại được
- **Bảy ngôn ngữ**: tiếng Trung giản thể / phồn thể, Anh, Pháp, Nhật, Nga, Việt

## Route

| Đường dẫn | Ý nghĩa |
| --- | --- |
| `/agent` | Trang chủ (`/` chuyển hướng 301 về đây) |
| `/explore` `/studio` `/following` `/rank` | Bảng tin, tuyển chọn, đang theo dõi, bảng xếp hạng |
| `/create` | Một câu thành phim: prompt → kế hoạch → tạo theo từng lớp → dựng phim |
| `/canvas` | Canvas tự do. `?id=` mở một canvas, `?project_id=` tạo mới từ một dự án |
| `/canvas/director` | Sân khấu đạo diễn 3D; cảnh dựng được ghi ngược về cùng canvas |
| `/share/:token` | Chia sẻ canvas chỉ đọc |
| `/projects` `/assets` `/subjects` `/prompts` | Dự án và các thư viện |
| `/skills` | Quảng trường Skill |
| `/watch/:id` | Trình phát công khai |
| `/pricing` | Bảng giá |
| `/settings` | Tài khoản, nhóm, đơn hàng, hóa đơn, lời mời |
| `/legal/*` | Điều khoản, quyền riêng tư, nguyên tắc AI (nội dung mẫu — hãy rà soát trước khi lên sóng) |

## Triển khai

Preset Cloudflare Workers:

```bash
cp .env.example .env.production
pnpm deploy
```

Máy chủ Node: `NITRO_PRESET=node-server pnpm build`, sau đó `node .output/server/index.mjs`.

Docker:

```bash
docker run -d -p 3005:3005 \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -e NUXT_PUBLIC_SITE_URL=https://studio.example.com \
  ghcr.io/easytv-ai/easytv-web:latest
```
