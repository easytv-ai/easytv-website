---
title: 3D 導演台
description: 在瀏覽器裡擺角色、定機位、推運鏡，鏡頭描述寫回畫布。
---

路徑 `/canvas/director`。導演台是 [open-director](https://github.com/x1n9/open-director)（MIT）的 Vue / TresJS 移植，和自由畫布共用同一張 `graph`。

![3D 導演台](/images/docs/director.png)

## 用來做什麼

短劇生成最容易崩在「鏡頭語言對不上」。導演台讓你先在三維裡看好站位和機位，再把描述餵給影片模型，而不是只靠一段提示詞碰運氣。

典型用法：

1. 在畫布上放一個 `director` 節點，或從畫布頂欄進導演台
2. 匯入角色（可掛主體庫的三視圖）和場景
3. 擺機位、做推 / 拉 / 搖，預覽運動
4. 匯出鏡頭描述寫回該節點的 `data.scene`，再連到下游影片節點去生成

## 儲存注意

`data.scene` 裡是完整場景（角色、機位、運鏡、場景設定）。後端 **同樣不解析**。

前端儲存前會移除：

- 機位截圖（base64 PNG，單張經常超過 1 MB）
- 瀏覽器本機 blob 素材

整張畫布共用 **2 MB**。一個導演台節點如果把截圖寫進去，整張畫布都存不了。相關邏輯在 `easytv-web/app/utils/director/persist.ts`。

`public/director-assets/` 下的 UE 素體模型有單獨授權，見該目錄的 license，商業授權不能涵蓋這部分。
