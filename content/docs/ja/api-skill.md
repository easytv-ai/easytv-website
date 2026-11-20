---
title: スキル
description: 公式スキルライブラリ、非公開の Skill、お気に入り。テキストタスクに skill_id を付けると実行ルールが注入されます。
---

公式の一覧は匿名で取得できます。[公開 API](/docs/api-public) の `GET /skill` を参照してください。以下はログインユーザー自身のスキルです。

`guide` + `output_format` を合わせて実行契約と呼びます。`POST /user/task` に `skill_id` があり、かつ `type=text` のとき、プロンプトの先頭に連結されます。画像 / 動画タスクには注入されません。
