# 0017 — 機台級 process(單機台物料進出)

Status: Accepted

## Context

[ADR-0016](0016-process-layer.md) 在 `SceneContent` 加了 topic-level `process`,表達**整線**產線語意(站/路線/物料)。但 gallery 單機台檢視(`?view=gallery&machine=<id>`)的 `focusMachine()` 直接 `process: undefined`,所以**單台機台沒有物料進出**——看不到「這台機器吃什麼、吐什麼」。

半導體與 AI 伺服器重做都需要在單機台頁呈現 in/out(晶圓進晶片出;資料/電源/熱進出)。問題:topic-level process 的座標是整場景世界座標,聚焦單機台時座標對不上;且整線的箭頭/環尺寸是為大場景調的,套到單機台會蓋過機台本身。

## Decision

在 schema 加兩個 optional 欄位,**重用既有 `ProcessLayer`/`process-motion`,不開新渲染路徑**:

- `Part.process?: ProcessSpec` —— 機台「自己的」流,座標為 **machine-local**(root 視為原點)。`focusMachine()` 把聚焦機台 root 的 `process` 提升為 `content.process` 渲染(取代原本的 `undefined`);整線視圖忽略 `Part.process`(只認 topic-level)。
- `ProcessSpec.scale?: number` —— route 管/箭頭/station 環的尺寸倍率(預設 1)。單機台用 ~0.4–0.6 縮小,免得 marker 蓋過機台;整線視圖不帶 scale → 維持原大小,無回歸。

`materials.ts` 同步加 `heat`(橘)等流動材質,讓 in/out(資料/電源/熱/AC/DC)可分色——材質登錄表本就是擴充點,非 schema 變更。

## Consequences

- 單機台頁可表達 in→站→out、到站 dwell、in/out 分色;machine-local 座標讓內容作者以機台自身為原點設計,直覺。
- 重用 `ProcessLayer`/`process-motion`,只加一個 `scale` 倍率參數;engine 幾乎沒增加複雜度。
- `engine/content` 分離維持:`Part.process` 是通用 schema,題目字眼只在 content。
- 已跨兩題目驗證(semiconductor 機台 scale 0.4;ai-server 盤 scale 0.6),屬可重用 pattern。
- 已知限制:`focusMachine` 的相機是固定值,對「特別大的節點」(如 ai-server 機櫃框 `rack-sys`,高 3.2)會過近、構圖偏滿;機台尺度接近 ~1 單位時最佳。若之後常見大節點,再考慮讓 focus 相機依 bounding box 自動退距(另開 ADR)。
