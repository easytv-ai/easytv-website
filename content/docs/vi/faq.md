---
title: Câu hỏi thường gặp
description: Những cái bẫy quen thuộc quanh việc triển khai, gateway, đăng nhập và giấy phép.
---

## Studio mở được nhưng không tạo ra gì

Chưa có API, hoặc chưa đặt gateway / giá mô hình. Hãy trỏ `NUXT_PUBLIC_API_BASE_URL` tới một API đang chạy, rồi [kết nối gateway](/docs/gateway).

## Frontend trong Docker không gọi được API

Trình duyệt trao đổi với máy của bạn, chứ không phải `api:8383` trong mạng compose. Đặt `PUBLIC_API_URL` thành một URL mà trình duyệt mở được, ví dụ `http://192.168.x.x:8383`.

## Khởi động thất bại vì không có quản trị viên

`ROOT_PASSWORD` đang trống. Nếu cơ sở dữ liệu chưa có quản trị viên, API từ chối khởi động.

## Không nhận được mã xác minh

Khi phát triển, hãy đặt `EMAIL_VERIFICATION_ENABLED=false`; mã sẽ được in trong log của API. Trên production hãy nối SMTP hoặc SMS.

## Cắt media thất bại / CORS

Nếu bucket chưa cấu hình CORS, hãy để studio dùng proxy media phía máy chủ và thêm host của bucket vào `NUXT_PUBLIC_MEDIA_HOSTS`.

## Cổng 3000 đang bận

Trang giới thiệu `easytv-website` cũng mặc định dùng 3000. Hãy dừng `nuxt dev` đó, hoặc cho trang này một cổng khác. Studio mặc định dùng 3005.

## Có bắt buộc dùng pnpm không?

Ba kho mã frontend cố định dùng pnpm. npm / yarn / cnpm sẽ xung đột với lockfile và trường `packageManager`, và kết quả cài đặt sẽ không khớp với CI.

## Lưu canvas thất bại / “quá 2 MB”

Toàn bộ `graph` bị giới hạn ở 2 MB. Đừng lưu ảnh chụp từ máy quay của sân khấu đạo diễn (PNG base64); frontend đã tự loại bỏ chúng khi lưu.

## Tác vụ cứ ở trạng thái pending

Phải có tiến trình xử lý tác vụ. Khi chạy nhiều nút, hãy kiểm tra `WORKER_TAG`. Tìm trong log các lỗi gateway 429 / kiểm duyệt nội dung / `unsupported duration`.

## Ảnh thành video thất bại, văn bản thành video thì chạy

Gateway không GET được URL nguồn. Ổ đĩa cục bộ cần một `UploadBaseUrl` công khai; OSS / Qiniu cần host công khai. Xem [Lưu trữ](/docs/storage).

## Giá hội viên không được áp dụng

Không gian cá nhân xét gói hội viên đang hiệu lực *của bạn*. Không gian nhóm xét gói nhóm **của owner**. Viewer không thể tạo nội dung.

## Callback thanh toán trả về 404 / sai chữ ký

`ServerAddress` phải là địa chỉ gốc https công khai của API. URL thông báo của WeChat và Alipay cần trỏ tới `/wechat/webhook` và `/alipay/webhook`.

## Tôi có thể dùng mã đóng cho mục đích thương mại không?

Được dùng thương mại theo AGPL-3.0, miễn là bạn công bố mã nguồn tương ứng khi cung cấp bản đã sửa đổi dưới dạng dịch vụ mạng. Trường hợp đó bạn không cần mua giấy phép. Mã đóng hoặc white-label mà không kèm các nghĩa vụ trên thì cần [giấy phép thương mại](/docs/license). Các mô-đun trong `easytv-api` phát sinh từ dự án AGPL thượng nguồn vẫn giữ AGPL.
