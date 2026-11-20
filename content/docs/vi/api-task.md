---
title: Tác vụ tạo nội dung
description: Tạo, thăm dò, hủy, thử lại. Điểm được tạm trừ trước; mô hình phải nằm trong danh sách model_price đang hiệu lực.
---

Cần [xác thực](/docs/api-auth). Chức năng tạo trong Inspector của canvas và tác vụ văn bản của hội thoại dùng nhóm này. Danh sách mô hình là ẩn danh — xem [Mô hình](/docs/api-models).

Trạng thái: `pending` → `running` → `succeeded` / `failed` / `cancelled`.

- Điểm được **tạm trừ** khi tạo, `settle` khi thành công, `unfreeze` khi thất bại / hủy (lô 365 ngày).
- `params.count` phải bằng 1.
- `model` không xác định trả về `模型暂未接入` và không lưu gì.
- Thiếu số dư trả về `积分不足，还需 N 积分`.
- Việc tạo nội dung chỉ đi qua gateway tương thích OpenAI.
