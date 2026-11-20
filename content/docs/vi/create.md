---
title: Một câu thành phim
description: Đưa vào một câu; nhận về bộ phim đã lên kế hoạch, tạo theo từng lớp và có phụ đề.
---

Đường dẫn `/create`. Trình hướng dẫn gồm: nhập → kế hoạch → tạo theo từng lớp → dựng phim → hoàn tất. Quy ước: API.md §8.2.

![Một câu thành phim](/images/docs/create.png)

Khách ẩn danh xem được bước 1; tạo kế hoạch thì cần đăng nhập. Trạng thái của trình hướng dẫn nằm trong sessionStorage, khóa theo id kịch bản; làm mới trang hoặc `?screenplay=` sẽ tiếp tục phiên.

## Quy trình

### 1. Nhập

Một prompt (khoảng 8000 ký tự), thời lượng 15 / 30 / 60 giây, phong cách tùy chọn. `POST /user/screenplay` gọi đồng bộ một mô hình văn bản và tính phí một lần theo đơn giá văn bản.

Mô hình văn bản mặc định: lựa chọn của phiên này → lựa chọn được ghi nhớ gần nhất → `ComposePlanModel` ở trang **Tăng trưởng** của trang quản trị → mô hình văn bản đầu tiên đã định giá.

### 2. Kế hoạch

Cấu trúc đại khái:

```json
{
  "title": "",
  "style": "cinematic, cool grade",
  "aspect": "16:9",
  "characters": [{ "key": "c1", "name": "", "look": "wardrobe" }],
  "scenes": [{ "key": "s1", "name": "", "look": "set" }],
  "shots": [{ "no": 1, "scene": "s1", "characters": ["c1"], "prompt": "frame", "motion": "camera", "line": "dialogue", "seconds": 5 }]
}
```

Giới hạn: ≤ 12 cảnh quay, ≤ 4 nhân vật, ≤ 4 bối cảnh. Lưu bằng `PUT /user/screenplay/:id`.

`POST /user/screenplay/:id/estimate` báo số điểm theo từng lớp cho các mô hình hình ảnh / video / âm thanh bạn đã chọn.

### 3. Dựng canvas và tạo nội dung

`POST /user/screenplay/:id/build` tạo một canvas (và một dự án nếu cần):

- nút văn bản: tóm tắt kế hoạch
- mỗi nhân vật một ảnh (`sp.layer=character`)
- mỗi cảnh quay: ảnh → video → lồng tiếng nếu có lời thoại

Sau đó chạy từng lớp một, hoặc để trình hướng dẫn chạy hàng loạt. Giá trị mặc định lấy từ các cài đặt `ComposeImageModel` / `ComposeVideoModel` / `ComposeAudioModel` (trang quản trị **Tăng trưởng → dựng phim**). Nếu một đường của gateway bị hỏng, hãy đổi ba khóa đó — không cần sửa mã.

### 4. Dựng phim

`POST /user/canvas/:id/compose` lấy các nút video đã thành công (theo x hoặc `clip_order`), dùng ffmpeg đưa về 1280×720 / 30 fps, gắn cứng SRT, trộn nhạc nền ở −14 dB. Người dùng miễn phí sẽ có watermark `EasyTV.ai` (khi `ComposeWatermarkEnabled` bật và không phải hội viên).

Dựng phim **không tiêu điểm**. Mỗi người dùng có tối đa 3 tác vụ dựng phim đang xếp hàng / đang chạy; hàng đợi toàn cục giới hạn ở 20. Tác vụ quá 10 phút sẽ thất bại. Thăm dò `GET /user/compose/:id`.

Bộ phim được lưu thành tài sản (`source=compose`) và có thể xuất bản lên `/watch/:id`.

## Lỗi thường gặp

- Lỗi phân tích kế hoạch: API thử lại mô hình văn bản một lần
- Ảnh thành video trả về 502: một số kênh của gateway chạy được T2V nhưng không chạy được I2V. Hãy trỏ `ComposeVideoModel` tới một mô hình bạn đã kiểm chứng
- Gateway trả về 429 / 503: backend thử lại hai lần (tuân theo `Retry-After`). Hết lượt thử lại sẽ trả về “模型当前排队较多”
