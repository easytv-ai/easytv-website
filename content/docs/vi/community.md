---
title: Cộng đồng và Skill
description: Bảng tin công khai, theo dõi / xếp hạng, kiểm duyệt bình luận, và cách mẫu Skill được đăng lên và chia thưởng.
---

Studio cũng là một cộng đồng phim công khai. Người vận hành kiểm duyệt tác phẩm, bình luận và Skill trong trang quản trị.

![Bảng tin khám phá](/images/docs/explore.png)

## Tác phẩm

Người sáng tác xuất bản từ một tài sản: `POST /user/work`. Bảng tin công khai `GET /work`, trình phát `/watch/:id` (lượt xem +1). Tác giả có thể công khai quá trình thực hiện tại `/process/:id`.

Route của studio:

| Đường dẫn | Ý nghĩa |
| --- | --- |
| `/explore` | Bảng tin, tuyển chọn lên trước |
| `/studio` | Đề xuất |
| `/following` | Đang theo dõi |
| `/rank` | Bảng xếp hạng |
| `/author/:id` | Tác giả |
| `/watch/:id` | Trình phát |

Thích, bình luận và báo cáo cần đăng nhập. Các trang **Tác phẩm / kiểm duyệt cộng đồng / báo cáo** trong trang quản trị dùng để gỡ nội dung. Phim tuyển chọn và banner trang chủ được sắp lịch riêng.

## Skill

Skill là một quy trình dùng lại được (prompt + graph của canvas, tùy chọn).

- Quảng trường `/skills`: Skill chính thức cùng Skill của người dùng đã được duyệt
- Người sáng tác gửi duyệt bằng `POST /user/skill/:id/submit`; trang **Skill** trong trang quản trị kiểm duyệt
- Người khác chạy Skill của bạn thì bạn được tích lũy phần chia; chi trả bằng điểm hoặc CNY (tỷ lệ `GrowthPointsPerYuan`, mặc định 20 điểm/nhân dân tệ)

Trang quản trị còn duy trì thư viện prompt, thư viện phong cách và thư viện nhân vật (bản vẽ ba góc nhìn của nhân vật) để làm tham chiếu cho canvas.

## Tăng trưởng

Lời mời `/invite/:code`, đối tác `/partner/:code` hoặc `/p/:code`, mã thưởng — việc ghi nhận nguồn được thực hiện lúc đăng ký. Quy tắc nằm trong **Cài đặt hệ thống → Tăng trưởng**: tặng điểm khi đăng ký, điểm danh, thưởng mời, thời hạn ghi nhận. Xem [Trang đối tác](/docs/partner).

Chiến dịch: `/campaign`, cấu hình tại trang **Chiến dịch** trong trang quản trị.
