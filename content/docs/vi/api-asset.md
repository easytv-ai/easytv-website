---
title: Tài sản
description: Tải lên, liệt kê, thùng rác. generated = kết quả của tác vụ, upload = tệp của người dùng, media = kết quả của công cụ media.
---

Cần [xác thực](/docs/api-auth). Loại được suy từ MIME: `image` / `video` / `audio` / `text` / `other`. Kích thước tệp tối đa mặc định là 200 MB (`UPLOAD_MAX_MB`). Với Qiniu, trình duyệt tải lên trực tiếp rồi đăng ký qua `POST /user/asset/import`.
