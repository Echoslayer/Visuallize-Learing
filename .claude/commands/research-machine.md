# Research Machine

> 研究單一機台/設備的真實外觀與功能，產出 `docs/machines/<slug>.md`。
> 這支只做事實整理；不寫 spec、不改 content、不碰 engine。

## Variables
machine: $1 — 機台名稱（如 `lithography-tool`、`transformer`、`conveyor`）。

## Instructions
1. 先查真實外觀與構造。可用 WebSearch/WebFetch；有不確定就標 `(待查證)`，不要猜。
2. 聚焦「建模需要知道的事」：剪影、主要量體、輸入/輸出、關鍵子系統、哪些部位有供應鏈意義。
3. 先看 `docs/plan/machine-patterns.md`，標記最接近的 pattern；沒有就寫「無現成 pattern」。
4. 不列純造型細節。螺絲、支架、管線只有在代表材料/零件/製程/供應商時才保留。
5. 寫到 `docs/machines/<slug>.md`；已存在則補強，不要改短。

## Format
```md
# <機台名稱> 研究

> 由 `/research-machine <machine>` 產出，供 `/design-machine` 使用。

## 1. 用途
<這台機台在供應鏈/產線中做什麼。>

## 2. 真實外觀
<剪影、比例、最容易辨認的部位。>

## 3. 輸入 → 輸出
<進料、加工/轉換、出料。沒有實物流也要說明。>

## 4. 關鍵子系統
| 部位 | 功能 | 是否有供應鏈意義 | primitive 提示 |
|---|---|---|---|

## 5. 可套用 pattern
<參照 `docs/plan/machine-patterns.md`，說明要沿用/增減什麼。>

## 6. 待查證
<不確定的外觀、部位、功能。>

## Sources
<來源連結 + 用途。>
```

## Report
- 回傳文件路徑。
- 摘要：最接近的 pattern、保留的關鍵子系統、待查證項。
- 下一步：`/design-machine <slug>`。
