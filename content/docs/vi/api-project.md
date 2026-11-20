---
title: Dự án
description: Nơi chứa bộ phim. Canvas nằm dưới dự án; tạo canvas không có project_id cũng tạo một dự án cùng tên.
---

Cần [xác thực](/docs/api-auth). Trang `/projects` của studio gọi các API này.

Các trường: `id`, `user_id`, `name`, `description`, `cover_url`, `status`, `canvas_id` (chỉ đọc, canvas mới nhất), các mốc thời gian. Trong danh sách, `cover_url` trống được điền bằng một khung hình gần đây, chỉ trong phản hồi. Mở canvas bằng `canvas_id` được trả về.
