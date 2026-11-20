---
title: Nhật ký thay đổi
description: Trang tài liệu và bốn kho mã sản phẩm gần đây đã thêm gì. Ghi chú đầy đủ nằm trong CHANGELOG.md của từng kho.
---

Trang này là phần liên quan đến tài liệu. Mỗi kho mã sản phẩm giữ `CHANGELOG.md` riêng.

## Trang tài liệu easytv-website

- Tài liệu song ngữ tại `/docs` và `/en/docs`: Bắt đầu, Cài đặt, Hướng dẫn, Tham chiếu API, Trợ giúp
- Giao diện đi theo trang chủ; tài liệu không còn ép dùng nền tối
- Nhãn trong sơ đồ kiến trúc không còn đè lên các ô API / gateway
- pnpm, AGPL-3.0, ghi chú về đóng góp và bảo mật

## Studio easytv-web

- Image Docker và `NUXT_PUBLIC_*` lúc chạy
- Giấy phép kép: AGPL-3.0 kèm một mẫu giấy phép thương mại
- Danh sách cho phép của proxy media giờ lấy từ cấu hình runtime

## API easytv-api

- Quy ước vẫn là `API.md` trong kho mã đó (đến chương 38)
- Việc tạo nội dung chỉ trao đổi với gateway tương thích OpenAI
- Điểm được tạm trừ theo `model_price`, hoàn lại khi thất bại hoặc bị hủy

Phần chưa phát hành là mục `[Unreleased]` trong changelog của từng kho mã.
