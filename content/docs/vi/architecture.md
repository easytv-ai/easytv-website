---
title: Kiến trúc
description: Studio, trang quản trị và trang đối tác trao đổi với easytv-api ra sao, cùng gateway và lưu trữ.
---

Sơ đồ động ở trang [Bắt đầu sử dụng](/docs) đổi theo giao diện của trang. Cả ba client đều gọi cùng một API; mô hình đi ra ngoài qua gateway.

```
easytv-web      ──┐
easytv-manage   ──┼──▶  easytv-api (Gin)  ── MySQL / Redis
easytv-partner  ──┘           │            ── object storage (local / OSS / Qiniu)
                              │            ── ffmpeg
                              ▼
                    OpenAI-compatible gateway
                              ▼
                    Kling · Jimeng · Seedance · Sora · GPT · …
```

## Xác thực

- Studio và trang đối tác: `Authorization: Bearer <token>` kèm `EasyTV-User: <user id>`
- Trang quản trị gọi `/admin/*` và cần `role ≥ 10`
- Không gian nhóm dùng `EasyTV-Team: <team_id>`; mặc định là không gian cá nhân
- CORS trả lại đúng origin của yêu cầu, nên ba frontend có thể nằm trên các host khác nhau

## Cấu hình lúc chạy

Biến môi trường được đọc một lần khi tiến trình khởi động. Tên trang, thanh toán, URL gateway, quy tắc mời và các mục tương tự nằm trong bảng `setting` của backend. Thay đổi trong trang quản trị có hiệu lực ngay; bạn không cần khởi động lại API.

Lưu trữ là một trong ba lựa chọn: thư mục `upload/` cục bộ, Aliyun OSS hoặc Qiniu. Ảnh thành video cần gateway tải được ảnh nguồn: OSS / Qiniu vốn đã cung cấp URL công khai; lưu trữ cục bộ cần `UPLOAD_BASE_URL` (hoặc cài đặt `UploadBaseUrl`) để gateway truy cập được tệp.

API nhiều nút dùng `WORKER_TAG`: mỗi tiến trình chỉ xử lý các tác vụ được gắn cùng tag.

## Quy ước

Hãy sửa [`API.md` trong easytv-api](https://github.com/easytv-ai/easytv-api/blob/main/API.md) trước khi sửa mã. Bản rút gọn xem tại [Tổng quan API](/docs/api).
