# Prime
> 開工前執行：建立對本專案的上下文，再用一段話總結你的理解。
> （借鏡 TAC `/prime`；本專案版本聚焦 engine/content 架構。）

## Read
- `docs/plan/CONTEXT.md` — 專案緣起、核心原則（「幾何是程式碼」、engine/content 分離、模型選型）。
- `docs/plan/PLAN.md` — 執行計劃、查核點、自我驗證迴圈、迭代方法論、停止條件。
- `docs/references/` — 若有參考截圖，看一眼視覺目標。

## Run
- `ls -R src/ 2>/dev/null` 了解現有 `engine/`、`ui/`、`content/`、`gallery/` 結構（若已存在）。
- `git log --oneline -10` 看最近進度（查核點 commit）。
- `cat .agent/backlog.md 2>/dev/null` 看待辦佇列。

## Report
- 用 3~5 句總結：目前進度（到哪個查核點）、架構現況、下一步該做什麼。
- 點出任何 §2 GUARDRAILS / §9 停止條件相關的風險。
