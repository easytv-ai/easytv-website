---
title: Canvas
description: graph không trong suốt, khóa lạc quan version, lịch sử, chia sẻ chỉ đọc và hội thoại.
---

Cần [xác thực](/docs/api-auth). Đường dẫn trong studio là `/canvas?id=`. Backend **không** phân tích ngữ nghĩa của nút. Tối đa **2 MB mỗi canvas**. Đừng lưu base64 của ảnh chụp từ máy quay vào `data.scene` của nút đạo diễn.

Khi lưu phải gửi `version` hiện tại, nếu không bạn sẽ nhận “画布已在其他地方修改，请刷新”. Tối đa 50 phiên bản. Đường dẫn chia sẻ là `/share/<token>`.
