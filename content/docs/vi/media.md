---
title: Công cụ media
description: Các thao tác ffmpeg trên thanh công cụ của canvas, cùng các thao tác mô hình tùy theo năng lực.
---

Hơn hai mươi mục trên thanh công cụ dùng chung `media_job`. Các thao tác ffmpeg cục bộ miễn phí và ghi ra tài sản thật; các thao tác mô hình được tính phí qua những năng lực đã định giá. Quy ước: API.md chương 23.

Máy chủ API cần có `ffmpeg` / `ffprobe` (trong `PATH` hoặc các cài đặt `FFmpegPath` / `FFprobePath`). Trang quản trị **Cài đặt hệ thống → Media** có thể ẩn nút và đổi giới hạn hàng đợi.

## Thao tác cục bộ (miễn phí)

Không có ffmpeg thì cả nhóm này không dùng được.

| action | Tên | Nguồn → kết quả |
| --- | --- | --- |
| `crop` | Cắt khung | video / ảnh |
| `grid_split` | Tách lưới | ảnh → N ảnh (1–25) |
| `montage` | Ghép nhóm phân cảnh | N ảnh → một lưới |
| `trim` | Cắt đoạn | video / âm thanh |
| `split` | Tách đôi | một thành hai |
| `remove_silence` | Bỏ khoảng lặng | video / âm thanh |
| `extract_audio` / `mute_video` / `split_av` | Trích âm thanh / tắt tiếng / tách hình và tiếng | video |
| `mix_bgm` | Trộn nhạc nền | video + tài sản âm thanh |
| `extract_frame` / `extract_frames` | Lấy khung hình / dải khung hình | video → ảnh |
| `storyboard` | Phân tích từng cảnh quay | dải khung hình + mô hình văn bản đọc hiểu |
| `compress` | Nén | video / ảnh |

Giới hạn mặc định: mỗi người dùng 3 tác vụ đang xếp hàng / đang chạy, toàn cục 20 (quản trị viên chỉnh được). Giới hạn tần suất tạo: 30 lần/phút.

Tách lưới **không cắt trong trình duyệt** — OSS không có CORS thì không đọc được điểm ảnh — nên một tác vụ cho ra N kết quả.

## Thao tác mô hình (trả phí)

Thẻ năng lực nằm ở `model_price.abilities` (phân tách bằng dấu phẩy). Không có thẻ thì suy theo tên mô hình (`*upscale*`, `*subtitle*`, `*demucs*` …). Thiếu năng lực thì nút hiển thị ở trạng thái vô hiệu, thay vì bấm vào mới báo lỗi.

Các thẻ thường gặp: `upscale`, `remove_subtitle`, `vocal_separation`, `bgm_separation`, `matting`, `subject_remove` / `modify` / `replace`, `motion_capture`, `native_audio` (video nhân vật nói chỉ liệt kê các mô hình video đọc được lời thoại), `video_reference` (tham chiếu đa năng / remix).

Tạo một thao tác mô hình cũng tạo một tác vụ tạo nội dung: thiếu điểm, mô hình chưa định giá hoặc chạm giới hạn chạy đồng thời sẽ làm yêu cầu thất bại và không tạo tác vụ media.

## Dựng ngay trong trình duyệt

Studio còn kèm FFmpeg.wasm để cắt / tách / ghép nối hoàn toàn phía client. Tệp lớn và dựng phim trên timeline vẫn đi qua API.
