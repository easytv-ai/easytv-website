---
title: Sân khấu đạo diễn 3D
description: Xếp vị trí nhân vật, đặt máy quay và chuyển động máy trong trình duyệt; mô tả cảnh quay được ghi ngược về canvas.
---

Đường dẫn `/canvas/director`. Sân khấu là bản chuyển sang Vue / TresJS của [open-director](https://github.com/x1n9/open-director) (MIT) và dùng chung `graph` với canvas tự do.

![Sân khấu đạo diễn 3D](/images/docs/director.png)

## Dùng để làm gì

Ngôn ngữ máy quay là chỗ mà việc tạo phim ngắn thường đổ vỡ. Sân khấu cho bạn nhìn thấy vị trí nhân vật và máy quay trong không gian 3D, rồi đưa mô tả đó cho mô hình video, thay vì trông chờ một đoạn prompt là đủ.

Cách dùng điển hình:

1. Thả một nút `director`, hoặc mở sân khấu từ thanh công cụ của canvas
2. Đưa vào nhân vật (có thể lấy bản vẽ ba góc nhìn từ thư viện nhân vật) và bối cảnh
3. Đặt máy quay, đẩy / trượt / lia máy, xem trước chuyển động
4. Xuất mô tả cảnh quay vào `data.scene` của nút đó, rồi nối với một nút video ở hạ nguồn

## Lưu trữ

`data.scene` là một cảnh dựng đầy đủ (nhân vật, máy quay, chuyển động máy, bối cảnh). API **không phân tích nó**.

Trước khi lưu, client loại bỏ:

- ảnh chụp từ máy quay (PNG base64, mỗi ảnh thường > 1 MB)
- tài sản dạng blob chỉ có trong trình duyệt

Cả canvas dùng chung **2 MB**. Chỉ một nút đạo diễn nhúng ảnh chụp là đủ khiến canvas không lưu được. Xem `easytv-web/app/utils/director/persist.ts`.

Các mô hình mannequin của UE trong `public/director-assets/` có giấy phép riêng; giấy phép thương mại không cấp lại quyền cho chúng.
