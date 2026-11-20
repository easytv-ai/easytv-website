---
title: Xác thực và đăng nhập
description: Bearer + EasyTV-User, header nhóm, đăng nhập bằng email / SMS và gói lỗi dùng chung.
---

Studio, trang quản trị và trang đối tác dùng chung một hệ thống đăng nhập. **Không xác thực bằng cookie.** `$API` mặc định là `http://127.0.0.1:8383`.

Header, body và dữ liệu trả về 200 của từng route nằm trong menu con bên trái.

## Header

| Header | Khi nào | Ghi chú |
| --- | --- | --- |
| `Authorization` | `/user/*`, `/admin/*` | `Bearer <access_token>` |
| `EasyTV-User` | như trên | Id của người dùng hiện tại; phải khớp với token |
| `EasyTV-Team` | tùy chọn | Id của không gian nhóm. Không gửi / `0` là không gian cá nhân |
| `Content-Type` | body JSON | `application/json` |
| `Accept-Language` | chi tiết mô hình | Được chuyển tiếp tới gateway |

`/admin/*` còn cần `role ≥ 10`. Cài đặt, hoàn tiền và điều chỉnh điểm cần `role ≥ 100` (RootAuth). Thêm `EasyTV-Team` khi dùng không gian nhóm. Tạo nội dung trong không gian nhóm tiêu quỹ điểm của owner; không gian cá nhân luôn tiêu ví của bên gọi.

## Gói phản hồi

HTTP **luôn là 200**. Hãy đọc `success` trong JSON. Không có quyền truy cập và tài nguyên không tồn tại đều trả về `资源不存在`, nên bạn không thể dò xem tài nguyên có tồn tại hay không. Một số route thêm `code` (`not_applied` / `not_approved` ở trang đối tác).

## Lỗi thường gặp

| message | Ý nghĩa |
| --- | --- |
| `无效的参数` | JSON sai hoặc trường bắt buộc để trống |
| `用户名或密码错误` | Đăng nhập thất bại |
| `资源不存在` | Không tồn tại hoặc không có quyền truy cập |
| `权限不足` | Quản trị viên gọi vào một route RootAuth |
| `积分不足，还需 N 积分` | Không đủ điểm để tạo tác vụ |
| `模型未定价` / `模型暂未接入` | `model` không nằm trong danh sách `model_price` đang hiệu lực |
