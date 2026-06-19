# 0016 — process layer 表達產線語意

Status: Accepted

## Context

半導體題目原本用 `shape:"flow"` 表達晶圓流動。實機截圖顯示它讀起來像「小球閉合跑馬燈」:
物料不清楚是否單向、是否進站加工、是否由晶圓變晶片,側向設備/材料也容易被誤讀成主線站點。

`flow` 適合裝飾性或非語意循環流動,但不足以描述產線。產線至少需要:
物料 token、單向 route、station 停留加工、input/output 變化、側向注入。

完整離散事件模擬或外部 simulation library 對目前教學 demo 過重;本專案只需要可視化流程語意,不需要 throughput、queue、capacity、隨機事件。

## Decision

在 `SceneContent` 加 optional `process` layer:

- `stations`:加工/停留點,以 `partId` 錨到既有 3D 零件。
- `routes`:單向 path,渲染 tube + arrow。
- `tokens`:物料,沿 route 移動,到 route stop 依 station `processTime` 停留。

新增 `engine/ProcessLayer.tsx` 負責渲染 route、arrow、station marker、token。
新增 `engine/process-motion.ts` 做純函式時間/停站計算,並以 `tools/check-process.ts` 納入 `pnpm check`。

保留既有 `flow`;但 `flow` 只作非產線/裝飾性循環流動。製程/物流題目優先用 `process`。

## Consequences

- 半導體題目可表達「晶圓 → 代工 → 封測 → 晶片 → 下游」與「設備/材料側向注入」。
- `engine/content` 分離仍成立:process 是通用 schema,不是半導體硬寫。
- schema 變大一點,但比導入 simulation framework 小很多。
- 目前不做 queue/capacity/resource utilization;若未來要做產能/瓶頸分析,再另開 schema-change ADR。
