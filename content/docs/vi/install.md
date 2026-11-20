---
title: Cài đặt
description: Cần những gì để triển khai EasyTV, và khi nào chọn Docker, khi nào chọn mã nguồn.
---

Bộ tối thiểu là **API + MySQL + một gateway tương thích OpenAI**. Studio và trang quản trị có thể thêm sau; `/healthz` là đủ để chứng minh backend đã chạy.

## Bạn cần

| Thành phần | Ghi chú |
| --- | --- |
| MySQL 8.x | Bắt buộc. Lần khởi động đầu tiên sẽ AutoMigrate cấu trúc bảng |
| Redis | Khuyến nghị. Không có thì giới hạn tần suất và OTP sẽ dùng bộ nhớ |
| ffmpeg / ffprobe | Dựng phim, trích khung hình, tách âm thanh |
| Gateway tương thích OpenAI | Đầu vào cho các mô hình văn bản / hình ảnh / video / âm thanh |
| Node.js 22.21+ và pnpm 10+ | Chỉ cần khi chạy các frontend từ mã nguồn |

## Chọn cách nào

| Cách | Khi nào |
| --- | --- |
| [Docker Compose](/docs/install-docker) | Mặc định. Một lệnh là có API; `full` khởi động thêm studio và trang quản trị |
| [Chạy từ mã nguồn](/docs/install-source) | Khi bạn đang sửa mã backend hoặc frontend |
| Binary + systemd | Máy chủ production không nên chạy Docker; lấy bản dựng Linux từ GitHub Releases |

## Cổng

| Dịch vụ | Cổng |
| --- | --- |
| easytv-api | 8383 |
| easytv-web | 3005 |
| easytv-manage | 3006 |
| easytv-partner | 3010 |

Nếu trình duyệt không chạy trên localhost, hãy đặt `PUBLIC_API_URL` và `PUBLIC_STUDIO_URL` trong `.env` thành các URL mà trình duyệt thực sự mở.
