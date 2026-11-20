---
title: API quản trị
description: /admin/* cho trang quản trị. role ≥ 10; cài đặt, hoàn tiền và điều chỉnh điểm cần role ≥ 100.
---

Bên gọi là [easytv-manage](https://github.com/easytv-ai/easytv-manage). Xác thực giống [người dùng](/docs/api-auth-login), cộng thêm vai trò quản trị.

RootAuth (`role ≥ 100`) là bắt buộc đối với cài đặt, vô hiệu hóa người dùng, đổi liên kết, quota, chi trả, hoàn tiền / đánh dấu đã thanh toán, điều chỉnh điểm, và sửa gói hội viên / gói điểm / khuyến mãi / giá mô hình. Quản trị viên thường sẽ nhận `权限不足`.

Các nhóm chi tiết ở bên trái: người dùng, kiểm duyệt, định giá.
