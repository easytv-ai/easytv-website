---
title: 画布
description: graph 原样存取、乐观锁 version、版本历史、只读分享和对话记录。
---

需要 [鉴权](/docs/api-auth)。创作台路径 `/canvas?id=`。后端 **不解析** `graph` 里的节点语义，上限 **2 MB / 张**。导演台节点不要把机位截图 base64 写进 `data.scene`。

保存必须带当前 `version`，否则返回「画布已在其他地方修改，请刷新」。每张画布最多 50 个版本。分享页路径 `/share/<token>`。
