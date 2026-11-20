---
title: Tổng quan dự án
description: Bốn kho mã sản phẩm làm gì, cổng mặc định, và vì sao trang giới thiệu nằm ngoài luồng sáng tác.
---

EasyTV gồm bốn kho mã triển khai được, dùng chung một [quy ước API](/docs/api). Hãy sửa `easytv-api/API.md` trước khi sửa bất kỳ client nào.

![Studio](/images/docs/studio.png)

## Các kho mã

| Kho mã | Vai trò | Cổng | Tài liệu |
| --- | --- | --- | --- |
| [easytv-api](https://github.com/easytv-ai/easytv-api) | API Go: xác thực, canvas, tác vụ, tính phí, lưu trữ, gateway | 8383 | [Tham chiếu API](/docs/api) |
| [easytv-web](https://github.com/easytv-ai/easytv-web) | Studio: canvas, một câu thành phim, sân khấu đạo diễn, cộng đồng | 3005 | [Studio](/docs/studio) |
| [easytv-manage](https://github.com/easytv-ai/easytv-manage) | Quản trị: người dùng, kiểm duyệt, giá, gateway, tăng trưởng | 3006 | [Trang quản trị](/docs/admin) |
| [easytv-partner](https://github.com/easytv-ai/easytv-partner) | Trang đối tác: hoa hồng, rút tiền, bộ tài liệu quảng bá | 3010 | [Trang đối tác](/docs/partner) |

Trang giới thiệu [easytv-website](https://github.com/easytv-ai/easytv-website) chỉ gồm tài liệu và trang đích.

## Ai gọi ai

```
easytv-web      ──┐
easytv-manage   ──┼──▶  easytv-api  ── MySQL / Redis / object storage
easytv-partner  ──┘         │
                            ▼
                    OpenAI-compatible gateway
```

Cả ba client đều gửi `Authorization: Bearer` + `EasyTV-User`. Trang quản trị còn cần `role ≥ 10`. Lệnh gọi mô hình không bao giờ đi thẳng tới nhà cung cấp.

## Chạy cục bộ

Khi cả bốn kho mã nằm trên máy này, hãy mở các cổng ở trên. Docker Compose `--profile full` khởi động API, studio và trang quản trị; trang đối tác chạy riêng bằng `pnpm dev`. Xem [bắt đầu nhanh](/docs/quickstart) và [chạy từ mã nguồn](/docs/install-source).
