---
title: Skill
description: Danh mục chính thức, Skill riêng, mục yêu thích. Tác vụ văn bản có skill_id sẽ được chèn quy ước thực thi.
---

Danh sách chính thức là ẩn danh — xem `GET /skill` ở trang [Công khai](/docs/api-public). Nhóm này là các Skill của chính người dùng đã đăng nhập.

`guide` + `output_format` là quy ước thực thi, được đặt lên đầu khi `POST /user/task` có `skill_id` và `type=text`. Tác vụ hình ảnh / video không chèn nó.
