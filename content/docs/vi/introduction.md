---
title: Giới thiệu
description: EasyTV là gì, bốn kho mã phân chia công việc ra sao và ai nên triển khai nó.
---

EasyTV là studio sáng tác phim ngắn bằng AI, mã nguồn mở và tự triển khai được. Ngay trong trình duyệt, bạn biến một ý tưởng dài một dòng thành bộ phim hoàn chỉnh: canvas dạng nút cho kịch bản, phân cảnh, hình ảnh, video và âm thanh; sân khấu đạo diễn 3D để xếp vị trí nhân vật và đặt máy quay; quy trình một câu thành phim tự lập kế hoạch, tạo nội dung và dựng phim. Điểm, định giá mô hình, thanh toán và trang quản trị đều được tích hợp sẵn.

Mô hình vẫn đi qua gateway tương thích OpenAI của chính bạn. EasyTV lo phần quy trình sáng tác và vận hành.

## Bốn kho mã

| Kho mã | Vai trò | Cổng mặc định |
| --- | --- | --- |
| [easytv-api](https://github.com/easytv-ai/easytv-api) | Backend Go: xác thực, canvas, agent, dựng phim, tính phí, lưu trữ | 8383 |
| [easytv-web](https://github.com/easytv-ai/easytv-web) | Studio: canvas, một câu thành phim, sân khấu đạo diễn, cộng đồng | 3005 |
| [easytv-manage](https://github.com/easytv-ai/easytv-manage) | Quản trị: người dùng, kiểm duyệt, định giá, gateway, tăng trưởng | 3006 |
| [easytv-partner](https://github.com/easytv-ai/easytv-partner) | Trang đối tác: hoa hồng, rút tiền, tài liệu quảng bá | 3010 |

Trang giới thiệu sản phẩm là [easytv-website](https://github.com/easytv-ai/easytv-website), không nằm trên luồng sáng tác. Ảnh chụp giao diện có ở trang [Bắt đầu sử dụng](/docs).

## Dành cho ai

- Bạn muốn một bàn làm việc phim ngắn / video ngắn bằng AI tự triển khai, tự nắm mô hình và dữ liệu
- Bạn đã vận hành (hoặc sẽ vận hành) một gateway mô hình tương thích OpenAI
- Bạn cần điểm, gói hội viên, thanh toán và kiểm duyệt, chứ không chỉ vài lệnh gọi tạo nội dung

## Phía người sáng tác

- [Canvas tự do](/docs/canvas): các nút văn bản / hình ảnh / video / âm thanh / phân cảnh / đạo diễn
- [Một câu thành phim](/docs/create): lập kế hoạch → tạo theo từng lớp → dựng phim
- [Sân khấu đạo diễn 3D](/docs/director): vị trí nhân vật và máy quay được ghi ngược về canvas
- [Công cụ media](/docs/media): cắt khung / trích dải khung hình bằng ffmpeg, cùng nâng độ phân giải / xóa phụ đề tùy theo năng lực mô hình
- [Cộng đồng và Skill](/docs/community): phim công khai, chia thưởng Skill
- [Đăng nhập và nhóm](/docs/team): email / SMS / WeChat, không gian cá nhân và không gian nhóm

## Phía người vận hành

- [Trang quản trị](/docs/admin): người dùng, kiểm duyệt, định giá, thanh toán, tăng trưởng
- [Gateway](/docs/gateway) và [tính phí](/docs/billing)
- [Trang đối tác](/docs/partner): hoa hồng, rút tiền, bộ tài liệu quảng bá
- [Lưu trữ](/docs/storage) và [triển khai chính thức](/docs/deploy)

## EasyTV không phải là gì

EasyTV **không phải** gateway mô hình. Các lệnh gọi văn bản, hình ảnh, video và âm thanh được chuyển tiếp đến gateway tương thích OpenAI mà bạn cấu hình. Không có gateway thì studio vẫn mở được, nhưng việc tạo nội dung sẽ không chạy.

## Bước tiếp theo

Làm theo [Bắt đầu nhanh](/docs/quickstart) để đi từ Docker đến bộ phim đầu tiên. Nếu muốn sửa mã: [Chạy từ mã nguồn](/docs/install-source).
