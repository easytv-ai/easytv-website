---
title: Mô hình
description: Danh sách khả dụng và chi tiết. Danh sách chính là model_price.status=1 — danh sách trắng duy nhất khi tạo tác vụ.
---

Cả hai route đều **ẩn danh**. Lấy danh sách, rồi truyền `model` vào `POST /user/task`. Gateway chưa cấu hình hoặc bảng trống sẽ trả về `[]`.

Mỗi dòng kèm giá theo điểm: `unit` (`second` / `image` / `call`), `points_per_unit`, `member_points_per_unit`, `priced`. Bộ phận vận hành nhập từ gateway tại trang [Định giá](/docs/api-admin-price).
