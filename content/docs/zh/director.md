---
title: 3D 导演台
description: 在浏览器里摆角色、定机位、推运镜，镜头描述写回画布。
---

路径 `/canvas/director`。导演台是 [open-director](https://github.com/x1n9/open-director)（MIT）的 Vue / TresJS 移植，和自由画布共用同一张 `graph`。

![3D 导演台](/images/docs/director.png)

## 用来干什么

短剧生成最容易崩在「镜头语言对不上」。导演台让你先在三维里看好站位和机位，再把描述喂给视频模型，而不是只靠一段提示词碰运气。

典型用法：

1. 在画布上放一个 `director` 节点，或从画布顶栏进导演台
2. 导入角色（可挂主体库的三视图）和场景
3. 摆机位、做推 / 拉 / 摇，预览运动
4. 导出镜头描述写回该节点的 `data.scene`，再连到下游视频节点去生成

## 存储注意

`data.scene` 里是完整场景（角色、机位、运镜、场景设置）。后端 **同样不解析**。

前端保存前会摘掉：

- 机位截图（base64 PNG，单张经常超过 1 MB）
- 浏览器本地 blob 素材

整张画布共用 **2 MB**。一个导演台节点如果把截图写进去，整张画布都存不了。相关逻辑在 `easytv-web/app/utils/director/persist.ts`。

`public/director-assets/` 下的 UE 素体模型有单独授权，见该目录的 license，商业许可不能覆盖这部分。
