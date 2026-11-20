---
title: Tham chiếu API
description: Toàn bộ API của EasyTV. Chia theo tài nguyên, mỗi trang có tham số kèm kiểu và một body 200.
---

Backend là một REST API gồm hai nhóm: **studio & người dùng** và **quản trị & đối tác**. Studio, trang quản trị và trang đối tác dùng chung một hệ thống đăng nhập. **Không dùng cookie để xác thực.**

- Base URL: `NUXT_PUBLIC_API_BASE_URL`, cục bộ là `http://127.0.0.1:8383`. Các ví dụ curl dùng `$API`.
- HTTP **luôn là 200**. Hãy đọc `success` trong JSON.
- Mốc thời gian là giây Unix. `deleted_at` trống nghĩa là chưa bị xóa.
- Phân trang: `?page=1&page_size=20` (tối đa 100).
- Xóa mềm: `DELETE` đưa vào thùng rác; dọn dẹp vật lý sau 30 ngày.

```json
{ "success": true, "message": "", "data": {} }
{ "success": false, "message": "reason" }
```

Header xác thực là `Authorization: Bearer <token>` và `EasyTV-User`. Thực thể và máy trạng thái nằm trong [`easytv-api/API.md`](https://github.com/easytv-ai/easytv-api/blob/main/API.md). **Hãy sửa tệp đó trước khi sửa mã.**
