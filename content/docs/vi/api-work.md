---
title: Tác phẩm
description: Xuất bản từ một tài sản, thích, bình luận. Bảng tin công khai là một nhóm ẩn danh riêng.
---

CRUD khi đã đăng nhập cần [xác thực](/docs/api-auth). Bảng tin công khai nằm ở trang [Công khai](/docs/api-public).

`status`: 0 bản nháp / 1 đã xuất bản / 2 đã gỡ / -1 bị từ chối. `review_status`: 0 chờ duyệt / 1 đã duyệt / 2 bị từ chối. Việc xuất bản không bị chặn; kiểm duyệt diễn ra sau. Cần `canvas_id` để công khai quá trình thực hiện.
