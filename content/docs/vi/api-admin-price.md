---
title: Định giá và gateway
description: Gói hội viên, gói điểm, giá mô hình, lấy / nhập từ gateway, hoàn tiền và điều chỉnh điểm.
---

Sửa gói hội viên / gói điểm / giá, hoàn tiền và điều chỉnh điểm đều là **RootAuth** (`role ≥ 100`). Quản trị viên thường chỉ được đọc. `model` phải khớp với id trên gateway — đây là nguồn dữ liệu duy nhất của `GET /generation/models`.
