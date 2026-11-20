---
title: Công cụ media
description: Thao tác ffmpeg cục bộ (cắt khung, bỏ khoảng lặng) và thao tác mô hình (nâng độ phân giải, xóa phụ đề).
---

Cần [xác thực](/docs/api-auth). Việc tạo bị giới hạn tần suất ở 30 lần/phút.

`engine=local` miễn phí và cần ffmpeg trên máy chủ. `engine=model` gửi một tác vụ tạo nội dung; thiếu điểm hoặc mô hình chưa định giá sẽ làm lệnh tạo thất bại và không lưu gì.
