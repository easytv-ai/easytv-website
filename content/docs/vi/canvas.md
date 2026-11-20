---
title: Canvas tự do
description: Các loại nút, tạo nội dung theo đường nối, lịch sử phiên bản, chia sẻ chỉ đọc và giới hạn 2 MB.
---

Canvas là phần cốt lõi của studio, tại `/canvas`. `?id=` mở một canvas; `?project_id=` tạo mới từ một dự án. API lưu `graph` dưới dạng JSON không trong suốt và **không phân tích ngữ nghĩa của nút**. Giới hạn: **2 MB mỗi canvas**.

![Các nút và đường nối trên canvas](/images/docs/canvas.png)

## Các loại nút

| kind | Vai trò |
| --- | --- |
| `text` | Kịch bản, prompt, suy ngược mô tả từ ảnh. Tối đa 4 ảnh tham chiếu cho mô hình thị giác |
| `image` | Văn bản thành ảnh / ảnh thành ảnh, có thể khóa nhân vật và phong cách |
| `video` | Văn bản thành video, khung đầu / khung cuối, video tham chiếu, video nhân vật nói (`videoMode=talking`) |
| `audio` | TTS, nhạc nền, lời thoại |
| `storyboard` | Nhóm phân cảnh: nhiều ảnh xếp thành lưới |
| `director` | Cảnh dựng của [đạo diễn 3D](/docs/director), được ghi ngược về cùng canvas |
| `panorama` | Ảnh toàn cảnh |

Canvas trống có sẵn các thẻ khởi đầu: kịch bản câu chuyện, bản vẽ ba góc nhìn của nhân vật, video tham chiếu đa năng, video nhân vật nói, nhạc nền — hoặc thả vào một mẫu [Skill](/docs/community).

## Một lần chạy diễn ra thế nào

1. Thêm một nút, điền prompt, chọn mô hình
2. Nối thượng nguồn → hạ nguồn: ảnh làm khung đầu / ảnh tham chiếu, văn bản làm prompt cho ảnh
3. Bấm chạy. Client gọi `POST /user/task` rồi thăm dò `GET /user/task/:id`
4. Khi thành công, tài sản được lưu và `content` của nút trở thành một URL phát được

Mô hình chưa định giá sẽ thất bại với “模型未定价” và không bao giờ tạo tác vụ. Điểm tuân theo [tính phí](/docs/billing): tạm trừ trước, hoàn lại khi thất bại hoặc bị hủy.

Tham số video được truyền thẳng: `ratio` / `resolution` / `duration` / `generate_audio` / `seed` / `negative_prompt`. Vai trò của đầu vào: `first_frame`, `last_frame`, `reference`, `reference_video`, `reference_audio`.

## Phiên bản và chia sẻ

- Lưu tự động được gộp thành một bản ghi khoảng mỗi 10 phút; Ctrl+S / Lưu sẽ gửi `snapshot: true`
- Tối đa 50 phiên bản mỗi canvas. Khôi phục sẽ sao lưu graph hiện tại trước
- `PUT` phải gửi `version` hiện tại, nếu không bạn sẽ nhận “画布已在其他地方修改，请刷新”
- Chia sẻ: `GET/PUT /user/canvas/:id/share`, trang công khai `/share/<token>` (`/s/<token>` cũ chuyển hướng 301). Người xem ẩn danh thấy graph đã lược bớt; người dùng đã đăng nhập có thể sao chép thành dự án của mình

## Công cụ media

Cắt khung, dải khung hình, bỏ khoảng lặng, tách hình / tiếng và các thao tác tương tự đi qua [Công cụ media](/docs/media). Các thao tác ffmpeg cục bộ miễn phí; nâng độ phân giải, xóa phụ đề gắn cứng, tách nền và tương tự được tính phí qua năng lực của mô hình.

Trình duyệt cũng có thể cắt / tách / ghép nối bằng FFmpeg.wasm. Nếu bucket chưa cấu hình CORS, hãy dùng proxy media của studio và thêm host vào `NUXT_PUBLIC_MEDIA_HOSTS`.
