---
title: 模型
description: 可用模型清单和详情。清单 = model_price 表 status=1，是创建任务的唯一白名单。
---

这两条都 **可匿名**。创建任务前先拉清单，再用返回的 `model` 去 `POST /user/task`。没在清单里的模型不会落任务。

每条附带积分定价：`unit`（`second` / `image` / `call`）、`points_per_unit`、`member_points_per_unit`、`priced`。

## GET `/generation/models`

```bash
curl "$API/generation/models"
```

```json
{
  "success": true,
  "data": [
    {
      "provider": "easyapi",
      "model": "Kling-2.5",
      "type": "video",
      "label": "Kling 2.5",
      "unit": "second",
      "points_per_unit": 30,
      "member_points_per_unit": 24,
      "priced": true,
      "abilities": ["native_audio"]
    }
  ]
}
```

网关没配或 `model_price` 为空时返回空数组，所有生成都会「暂未接入」。运营从网关拉取并导入：见 [定价与网关](/docs/api-admin-price)。

估算：视频 `duration × 单价`；图片按张；文本 / 语音按次。会员有效期内用 `member_points_per_unit`。

## GET `/generation/models/detail`

匿名。`model`（兼容 `model_name`）必填。本地积分定价 + 网关 `/pricing/detail` 的展示元数据。

```bash
curl "$API/generation/models/detail?model=Kling-2.5" \
  -H "Accept-Language: zh-CN"
```

成功时除定价字段外还有 `description`、`vendor`、`params`（参数表单属性表）、`durations`、`resolutions`、`abilities`。网关挂了也不报错：定价照常返回，展示字段为空，`gateway_available: false`。

失败：`缺少模型标识 model`、`模型不存在或未上架`。

不下发网关成本口径（`model_ratio`、美元价等）。切语言请带 `Accept-Language` 重新请求。
