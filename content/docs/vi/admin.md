---
title: Trang quản trị
description: easytv-manage quản lý những gì, và các cài đặt cần sửa trước tiên sau khi lên sóng.
---

Trang quản trị gọi `/admin/*` trên API, kho mã [easytv-manage](https://github.com/easytv-ai/easytv-manage). Đăng nhập bằng tài khoản `admin` được tạo ở lần khởi động đầu tiên.

![Quản trị: bảng điều khiển, người dùng, kiểm duyệt, giá và gateway](/images/docs/admin.svg)

## Bạn quản lý được gì

| Mảng | Các trang |
| --- | --- |
| Con người | Người dùng, hạn mức nhóm, đối tác kênh |
| Nội dung | Tác phẩm, phim tuyển chọn, danh mục, banner, Skill, prompt, phong cách, nhân vật, dự án, tài sản, canvas |
| Cộng đồng | Kiểm duyệt bình luận / báo cáo / bảng tin, thông báo chung, thông báo trong ứng dụng |
| Tiền | Đơn hàng, nạp tiền, rút tiền, lịch sử giao dịch, gói hội viên, gói điểm, giá mô hình, hóa đơn |
| Tăng trưởng | Chiến dịch, mời và điểm danh, bảng số liệu |
| Hệ thống | Trang web, thanh toán, gateway, tăng trưởng và hóa đơn (chỉ quản trị viên cấp cao) |

Các thay đổi này được ghi vào bảng `setting`; không cần khởi động lại API.

Cài đặt hệ thống (chỉ quản trị viên cấp cao) chia theo tab: trang web, SMS, hóa đơn, thanh toán, gateway & lưu trữ, AI chat, công cụ media. Quy tắc tăng trưởng (mời, điểm danh, mô hình mặc định khi dựng phim, tỷ lệ chi trả) nằm ở trang Tăng trưởng.

## Danh sách việc cần làm khi chạy lần đầu

1. **Cài đặt hệ thống → Gateway**: URL và khóa của gateway tương thích OpenAI, lấy danh sách mô hình, nhập bảng giá
2. **Cài đặt hệ thống → Trang web**: URL công khai của studio (lời mời và callback)
3. **Cài đặt hệ thống → Thanh toán**: WeChat Pay / Alipay nếu bạn bán gói hội viên hoặc điểm
4. **Định giá mô hình**: giá điểm cho từng mô hình

## Chạy

```bash
pnpm dev          # :3006
```

```bash
docker run -d -p 3006:3006 \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -e NUXT_PUBLIC_STUDIO_URL=https://studio.example.com \
  -e NUXT_PUBLIC_PARTNER_URL=https://partner.example.com \
  ghcr.io/easytv-ai/easytv-manage:latest
```

`NUXT_PUBLIC_PARTNER_URL` là liên kết “mở trang đối tác”. Không có backend thì trang đăng nhập có một tài khoản demo chỉ để xem giao diện. Cần `role ≥ 10`; cài đặt gateway / thanh toán / trang web cần quản trị viên cấp cao (`role ≥ 100`).
