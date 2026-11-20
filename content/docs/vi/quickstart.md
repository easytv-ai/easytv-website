---
title: Bắt đầu nhanh
description: Từ máy trống đến bộ phim đầu tiên – Docker, đăng nhập trang quản trị, gateway, một câu thành phim.
---

Mục tiêu là có một đoạn phim hoàn chỉnh trong **khoảng 15 phút**. Bạn cần Docker 24+ và một token của gateway tương thích OpenAI gọi được mô hình văn bản, hình ảnh và video.

Các cách cài đặt khác: [Cài đặt](/docs/install). Tổng quan tính năng: [Studio](/docs/studio).

## 1. Khởi động hệ thống

```bash
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
```

Sửa `.env`:

- `ROOT_PASSWORD` — mật khẩu của quản trị viên đầu tiên (tên đăng nhập mặc định là `admin`)
- `CRYPTO_SECRET` — `openssl rand -hex 32`

```bash
docker compose --profile full up -d
curl http://localhost:8383/healthz
```

| Mở | URL |
| --- | --- |
| API | http://localhost:8383 |
| Studio | http://localhost:3005 |
| Quản trị | http://localhost:3006 |

Trang đối tác được triển khai riêng; xem [Trang đối tác](/docs/partner).

## 2. Đăng nhập trang quản trị

Mở http://localhost:3006 bằng `admin` và `ROOT_PASSWORD` của bạn.

Sửa cài đặt theo thứ tự sau (tất cả nằm trong **Cài đặt hệ thống**, có hiệu lực ngay):

1. **Trang web**: URL công khai của studio `http://localhost:3005` (dùng cho lời mời và callback thanh toán)
2. **Gateway**: Base URL và Key của gateway tương thích OpenAI → lấy danh sách mô hình → **nhập bảng giá**
3. **Định giá mô hình**: kiểm tra đơn giá văn bản / hình ảnh / video (mô hình chưa định giá thì không tạo nội dung được)

Chi tiết: [Kết nối gateway](/docs/gateway).

## 3. Cấp điểm cho quản trị viên

Tạo nội dung sẽ tiêu điểm. Tại trang **Người dùng**, tìm `admin` và cấp một lô điểm để thử (hoặc mở một gói hội viên).

Bạn cũng có thể thanh toán tại `/pricing`, nhưng khi thử nghiệm cục bộ thường chỉ cần nạp tay.

## 4. Chạy một câu thành phim

Mở http://localhost:3005/create (đăng nhập bằng chính tài khoản `admin`).

1. Nhập một câu, chọn 15 / 30 / 60 giây
2. Tạo kế hoạch (tính phí một lần gọi mô hình văn bản)
3. Xem lại nhân vật, bối cảnh, cảnh quay, rồi **dựng canvas**
4. Tạo theo từng lớp: ảnh nhân vật, ảnh cảnh quay, video cảnh quay, lồng tiếng
5. Dựng phim: ffmpeg ghép nối, gắn cứng phụ đề, trộn nhạc nền; tài khoản miễn phí sẽ có watermark

Hướng dẫn đầy đủ: [Một câu thành phim](/docs/create).

## 5. Bước tiếp theo

- Sửa cảnh quay trên canvas: [Canvas tự do](/docs/canvas)
- Xếp máy quay: [Sân khấu đạo diễn 3D](/docs/director)
- Bán gói hội viên: [Tính phí](/docs/billing)
- Đưa lên tên miền của bạn: [Triển khai chính thức](/docs/deploy)
