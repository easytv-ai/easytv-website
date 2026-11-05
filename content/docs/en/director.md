---
title: 3D director stage
description: Block characters, set cameras and moves in the browser; shot descriptions write back to the canvas.
---

Path `/canvas/director`. The stage is a Vue / TresJS port of [open-director](https://github.com/x1n9/open-director) (MIT) and shares the same `graph` as the free canvas.

![3D director stage](/images/docs/director.png)

## What it is for

Shot language is where short-drama generation usually falls apart. The stage lets you see blocking and cameras in 3D, then feed that description to a video model instead of hoping a paragraph of prompt is enough.

Typical path:

1. Drop a `director` node, or open the stage from the canvas chrome
2. Bring in characters (optionally from the subject library turnarounds) and a set
3. Place cameras, dolly / truck / pan, preview the move
4. Export the shot description into `data.scene` on that node, then wire a downstream video node

## Storage

`data.scene` is a full scene (characters, cameras, moves, set). The API **does not parse it**.

Before save the client strips:

- camera stills (base64 PNG, often > 1 MB each)
- browser-local blob assets

The whole canvas shares **2 MB**. One director node that embeds stills will make the canvas unsavable. See `easytv-web/app/utils/director/persist.ts`.

UE mannequin models under `public/director-assets/` have their own license; the commercial grant does not relicense them.
