---
title: Trang đối tác
description: Hoa hồng tự phục vụ và công cụ quảng bá trong easytv-partner cho MCN, trường học và KOL.
---

Trang đối tác gọi `/user/partner/*`, kho mã [easytv-partner](https://github.com/easytv-ai/easytv-partner). Đối tác đăng nhập bằng tài khoản EasyTV thông thường, đăng ký tham gia, và sau khi được duyệt sẽ nhận liên kết cùng mã giới thiệu.

## Đối tác làm được gì

| Mảng | Ghi chú |
| --- | --- |
| Bảng điều khiển | Khách hàng, khách hàng trả tiền, doanh số và hoa hồng; xu hướng 7 / 30 / 90 ngày |
| Khách hàng | Biệt danh đã che, nguồn, lần thanh toán đầu tiên, tổng chi tiêu |
| Hoa hồng & rút tiền | Lịch sử giao dịch, lịch sử rút, gửi yêu cầu (Alipay / WeChat / ngân hàng) |
| Mã thưởng | Lượt nhận, lượt đăng ký, lượt chuyển đổi trả tiền |
| Tài liệu quảng bá | Liên kết, mã QR, nội dung mẫu, quy tắc |
| Đăng ký tham gia | Đăng ký, gửi lại sau khi bị từ chối, sửa thông tin liên hệ |

Tỷ lệ hoa hồng, thời hạn ghi nhận và việc kiểm duyệt nằm trong trang quản trị, tại **Cài đặt hệ thống → Tăng trưởng** và trang Đối tác. Quản trị viên cũng có thể cấp một ticket dùng một lần để vào trang của một đối tác.

## Chạy

```bash
pnpm dev          # :3010
```

`NUXT_PUBLIC_API_BASE_URL` trỏ tới API; `NUXT_PUBLIC_STUDIO_URL` trỏ tới studio (phương án dự phòng cho liên kết quảng bá).

Docker:

```bash
docker run -d -p 3010:3010 \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -e NUXT_PUBLIC_STUDIO_URL=https://studio.example.com \
  ghcr.io/easytv-ai/easytv-partner:latest
```

Quản trị viên có thể cấp một ticket dùng một lần ở trang Đối tác trong trang quản trị và mở `/console?ticket=` để vào thẳng trang của đối tác đó.
