---
title: Đăng nhập, vai trò và nhóm
description: Email / SMS / WeChat, vai trò quản trị, và ai trả tiền trong không gian cá nhân so với không gian nhóm.
---

## Đăng nhập

Studio và trang đối tác dùng chung một hệ thống tài khoản.

| Cách | API | Ghi chú |
| --- | --- | --- |
| Email + mật khẩu | `POST /user/login` | |
| Mã SMS | `GET /sms/verification` + `POST /user/sms_login` | Tự đăng ký nếu chưa có tài khoản |
| WeChat Open Platform | OAuth | Đặt host callback trong trang quản trị; khi phát triển có thể in OTP ra log của API |

Phản hồi có chứa `access_token`. Từ đó, mọi lệnh gọi cần xác thực đều gửi:

```
Authorization: Bearer <access_token>
EasyTV-User: <user_id>
```

Trang quản trị dùng `/admin/*` và cần `role ≥ 10`. Cài đặt hệ thống, hoàn tiền và điều chỉnh điểm cần quản trị viên cấp cao `role ≥ 100` (tài khoản `admin` tạo ở lần khởi động đầu tiên).

Quản trị viên có thể cấp một ticket dùng một lần để vào studio hoặc trang đối tác (đăng nhập thay người dùng để hỗ trợ).

## Không gian nhóm

Đầu trang studio: **cá nhân** / **nhóm**. Một người dùng thuộc tối đa một nhóm. Header `EasyTV-Team: <team_id>` (không gửi hoặc 0 = cá nhân).

Quy tắc:

1. Không gian cá nhân luôn tiêu ví của chính bạn, kể cả khi bạn thuộc một nhóm
2. Không gian nhóm tiêu **quỹ điểm của owner**; gói nhóm hết hạn sẽ bị từ chối (`team_expired`)
3. Dự án có sẵn vẫn là của cá nhân; tác giả có thể chuyển vào hoặc chuyển ra
4. Vai trò `admin` / `editor` / `viewer`. Viewer không thể tạo nội dung bằng điểm của nhóm
5. Nếu bạn bị xóa khỏi nhóm, API trả về `team_forbidden`; client nên bỏ header và chuyển về không gian cá nhân

Hội viên có bản dành cho người sáng tác với một chỗ và bản nhóm (2–10 chỗ, mức giảm giá nằm trong `BillingPromo`). Số tác vụ chạy đồng thời và dung lượng lưu trữ đi theo gói.
