---
title: Tính phí
description: Lô điểm, giá hội viên, tạm trừ rồi quyết toán, và cách WeChat / Alipay kết nối với studio.
---

Sáng tác chỉ tiêu **điểm**. Trường `quota` cũ chỉ dành cho rút tiền và các chức năng tương tự; nó không dùng cho việc tạo nội dung. Quy ước: API.md chương 6.

![Điểm trên bảng điều khiển của trang quản trị](/images/docs/admin.svg)

## Điểm hoạt động thế nào

- Mỗi lần cấp là một **lô**: nguồn + số lượng + hạn dùng. Lô hết hạn sớm nhất được tiêu trước
- Số dư = phần còn lại của các lô chưa hết hạn
- Tạo tác vụ sẽ **tạm trừ** (`freeze`); thành công thì `settle` (số tiền 0 — ước tính là con số cuối cùng); thất bại / hủy thì hoàn lại bằng một lô `refund` có hạn 365 ngày
- **Mô hình chưa định giá không tạo được tác vụ**
- Máy chủ tính giá lại. Con số trên client chỉ để tham khảo; `price` trong phản hồi đơn hàng mới là số bạn phải trả

Đơn giá nằm trong `model_price`:

| Trường | Ý nghĩa |
| --- | --- |
| `type` | `text` / `image` / `video` / `audio` |
| `unit` | `second` (video) / `image` / `call` (văn bản, giọng nói) |
| `points_per_unit` | giá niêm yết |
| `member_points_per_unit` | giá hội viên; 0 nghĩa là bằng giá niêm yết |

Ước tính: video `duration × count × unit`; hình ảnh / văn bản / giọng nói `count × unit`. `count` phải bằng 1 khi tạo; client tự tách các lô nhiều mục.

Số điểm đề xuất khi nhập: chi phí USD của gateway × tỷ giá (mặc định 7.3) × hệ số lợi nhuận (mặc định 3) × số điểm mỗi nhân dân tệ (mặc định 20). Các mô hình tính theo lượng dùng được quy đổi về lượt / ảnh / giây dựa trên lượng token giả định. Người vận hành có thể đổi các hệ số đó trong cài đặt gateway.

## Hội viên và gói điểm

Các gói (`starter` / `creator` / `pro` / `flagship`) cấp điểm hằng tháng và giá hội viên trong thời gian còn hiệu lực. Mở gói sẽ cấp ngay tháng đầu tiên (lô 31 ngày); một cron sẽ cấp bổ sung vào ngày cấp điểm.

Gói điểm hết hạn sau 30 / 90 / 365 / 730 ngày. Hội viên mua gói điểm với `member_price`.

Giảm giá theo năm / quý và giảm giá theo số chỗ của nhóm nằm trong cài đặt `BillingPromo`. Sau `ends_at`, mọi hệ số đều bằng 1.

Tài khoản miễn phí cũng có giới hạn về số tác vụ chạy đồng thời và dung lượng lưu trữ (`FREE_CONCURRENT` / `FREE_STORAGE_GB`; gói hội viên sẽ ghi đè).

## Thanh toán

Trang `/pricing` của studio gọi `POST /user/order` với:

- `wechat_native` — `code_url` để tạo mã QR
- `alipay_f2f` — mã QR thanh toán trực tiếp
- `alipay_pc` — `payment_url` dẫn tới quầy thu ngân Alipay

Nếu một kênh đang tắt, đơn hàng giữ ở `pending` và `pay` là null. `order_no` cũng là mã giao dịch thanh toán. `/wechat/webhook` của WeChat và `/alipay/webhook` của Alipay thực hiện việc giao hàng (cấp gói hoặc điểm) theo cách idempotent.

## Danh sách việc cần làm trong trang quản trị

1. **Cài đặt hệ thống → Trang web**: `ServerAddress` là địa chỉ gốc công khai của API (không có dấu gạch chéo ở cuối), dùng cho callback
2. **Cài đặt hệ thống → Thanh toán**: WeChat APIv3 Native, Alipay chế độ chứng chỉ (F2F / PC có thể tách riêng)
3. Duy trì **gói hội viên / gói điểm / giá mô hình**
4. Khi thử nghiệm cục bộ, hãy cấp điểm ở trang Người dùng thay vì nối thanh toán

Hóa đơn, hoàn tiền và “đánh dấu đã thanh toán” cần quản trị viên cấp cao (`role ≥ 100`).
