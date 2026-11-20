---
title: アセット
description: アップロード、一覧、ごみ箱。生成物は source=generated、アップロードは source=upload、メディアツールの出力は source=media です。
---

[認証](/docs/api-auth) が必要です。種類は MIME で判定します：`image` / `video` / `audio` / `text` / `other`。1 ファイルあたりの上限は既定で 200 MB（`UPLOAD_MAX_MB`）です。Qiniu を設定している場合、フロントエンドは直接アップロードしたあと `POST /user/asset/import` で登録します。
