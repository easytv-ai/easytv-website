---
title: Kết nối gateway
description: Trỏ EasyTV tới một gateway tương thích OpenAI, lấy danh sách mô hình và nhập giá theo điểm.
---

EasyTV gọi mô hình qua các route tương thích OpenAI: `/v1/chat`, `/v1/images`, `/v1/videos` (và âm thanh nếu gateway có cung cấp). **Bạn cần có gateway thì việc tạo nội dung mới chạy.**

Đặt URL và khóa của gateway tại trang quản trị **Cài đặt hệ thống → Gateway**. Thay đổi có hiệu lực mà không cần khởi động lại.

![Gateway trong trang quản trị](/images/docs/admin.svg)

## Thiết lập lần đầu

1. Chuẩn bị token của một gateway tương thích OpenAI đang chạy, gọi được các mô hình văn bản / hình ảnh / video mà bạn cần.
2. Đăng nhập trang quản trị bằng `admin` → **Cài đặt hệ thống → Gateway**.
3. Lưu base URL và khóa của gateway.
4. Lấy danh sách mô hình và **nhập bảng giá** cho các mô hình bạn sẽ dùng.
5. Kiểm tra giá điểm theo giây / theo ảnh / theo lượt tại **Định giá mô hình**. Ước tính chi phí của studio đọc từ đây.

Các khóa cài đặt: `EasyAPIGatewayBaseUrl`, `EasyAPIGatewayKey`, `EasyAPIGatewayEnabled`. Đơn giá nằm trong `model_price`.

Nếu host để gọi và host bảng giá khác nhau (ví dụ `api.xxx.com` và `token.xxx.com`), hãy đặt thêm `EasyAPIGatewayPricingBaseUrl`. Muốn xem số dư thực của gateway cần “system access token” của trang điều khiển gateway, tức `EasyAPIGatewayAccessToken` (token sk không cho biết số dư thực). Khi thấp hơn `GatewayBalanceAlertUSD` (mặc định 20 USD), quản trị viên sẽ nhận thông báo trong ứng dụng.

Số điểm đề xuất:

```
gateway USD cost × FX (7.3) × markup (3) × credits-per-yuan (20)
```

Các mô hình tính theo lượng dùng được quy đổi về lượt / ảnh / giây dựa trên lượng token giả định. Bạn có thể đổi các hệ số đó. Sau khi nhập, vẫn nên xem lại **Định giá mô hình** — đặc biệt là giá video theo giây và năng lực `native_audio` cho video nhân vật nói.

## Gateway thực sự nhận được gì

EasyTV không gọi SDK của nhà cung cấp. Mọi thứ đi qua `service/providers/easyapi.go`:

| Loại | Đường dẫn trên gateway |
| --- | --- |
| Văn bản | `POST /v1/chat/completions` (tối đa 4 ảnh cho mô hình thị giác) |
| Hình ảnh | `POST /v1/images/generations` |
| Giọng nói | `POST /v1/audio/speech` |
| Video | `POST /v1/videos`, sau đó thăm dò `GET /v1/videos/{job_id}` |

Tài sản đầu vào dùng `input_references[{type,url,role}]`. URL của ảnh thành video phải để gateway GET được; xem [Lưu trữ](/docs/storage).

429 / 503 được thử lại hai lần (tuân theo `Retry-After`). 502 / 504 có thể đã tạo tác vụ ở thượng nguồn nên không thử lại. Lỗi đã được ánh xạ sẽ thành một câu tiếng Trung cho người sáng tác; nội dung gốc được ghi vào SysLog.

## Mô hình đến từ đâu

EasyTV không kèm SDK của nhà cung cấp. Kling, Jimeng, Seedance, Hailuo, Sora, GPT, Qwen, MiniMax và các mô hình khác chỉ cần được gateway ánh xạ vào các route kiểu OpenAI nói trên. Đổi mô hình nghĩa là đổi kênh trên gateway, không phải sửa mã EasyTV.

## Lỗi thường gặp

- Gateway trả về 200 nhưng studio cứ xếp hàng mãi: kiểm tra log của API xem có lỗi thượng nguồn không, và mô hình đó đã được nhập vào bảng giá chưa.
- Chỉ cấu hình một mô hình chat: các nút hình ảnh / video sẽ thất bại cho đến khi gateway cung cấp những route đó.
- Base URL đã chứa sẵn `/v1`: đừng chồng thêm một `/v1` nữa lên giá trị mà biểu mẫu quản trị yêu cầu.
