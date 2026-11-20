---
title: Đơn hàng và thanh toán
description: Báo giá, đặt hàng, thăm dò, đóng đơn. Số tiền tính bằng CNY; máy chủ tính giá lại, báo giá phía client chỉ để tham khảo.
---

Báo giá có thể ẩn danh; đặt hàng thì cần [xác thực](/docs/api-auth). Các kênh là WeChat Native và Alipay.

`kind`: `membership` / `points`. `status`: `pending` → `paid` / `closed` / `refunded`. Trên production phải đặt `ServerAddress`, nếu không kênh thanh toán không thể callback.
