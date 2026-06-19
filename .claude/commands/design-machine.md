# Design Machine

> 接 `/research-machine`，把單台機台研究轉成可實作的 machine spec。
> 這支只做設計取捨；不改 content、不碰 engine。

## Variables
slug: $1 — 對應 `docs/research/machines/<slug>.md`。

## Instructions
1. 先讀 `docs/research/machines/<slug>.md` 與 `docs/machine-patterns.md`。
2. 套用 `object-abstraction`：每個有供應鏈意義的部位都要列出 primitive；不要用單一方塊代表整台機台。
3. 優先用既有 schema：`box / cylinder / cone / tube / repeat / rotation / partOf / enclosure / explode.magnitude`。
4. 先設計成 content primitive 群組。只有同一拼法已在 2+ 題目重複且 JSON 難維護時，才建議抽 `src/engine/kit/`。
5. 輸出到 `docs/specs/<NN>-machine-<slug>.md`。

## Format
```md
# <機台名稱> machine spec (`<slug>`)

> 由 `/design-machine <slug>` 依 `docs/research/machines/<slug>.md` 產出。確認後由 `/add-component` 實作。
- type: machine
- 研究來源: docs/research/machines/<slug>.md

## 1. 目標
<這台機台在畫面中要讓人看懂什麼。>

## 2. Pattern 選擇
<沿用哪個 machine pattern；增減哪些部位與理由。>

## 3. Primitive 組合
| part id | 部位 | geometry | transform 概念 | material | label/partOf | enclosure | explode.magnitude |
|---|---|---|---|---|---|---|---|

## 4. 互動與 gallery 驗收
- 單機 URL：`?view=gallery&topic=<topic>&machine=<partId>`
- 驗收：剪影可辨認；子部位可點；需要時 `xray=1` 看得到內部；名稱不重疊。

## 5. 實作注意
<要改哪個 content/topic；是否需要 companies.csv；哪些項目待人類確認。>
```

## Report
- 回傳 spec 路徑。
- 摘要：primitive 數量、是否需 enclosure/process、是否建議抽 kit。
