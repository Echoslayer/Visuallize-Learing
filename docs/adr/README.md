# 架構決策紀錄（ADR）

記錄本專案**重要且不易回頭**的決策:為什麼這樣選、放棄了什麼、後果是什麼。
格式採 [Michael Nygard 的 ADR](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)。

> 規則:既有 ADR 不改寫(歷史不可變)。要推翻某個決策 → 新增一筆 ADR,在新檔標 `Supersedes 00XX`、
> 在舊檔標 `Superseded by 00YY`。改動觸及某決策前,先讀對應 ADR。

| # | 決策 | 狀態 |
|---|---|---|
| [0001](0001-engine-content-separation.md) | engine / content 兩層分離(資料驅動引擎) | Accepted |
| [0002](0002-geometry-as-code.md) | 幾何是程式碼:機械件程式生成 primitive,有機件借模型不細分 | Accepted |
| [0003](0003-visual-self-verification-loop.md) | 視覺自我驗證迴圈(Playwright 截圖 + 讀回)作為迭代閘門 | Accepted |
| [0004](0004-lightweight-agentic-workflow.md) | 輕量 agentic 工作流(slash command + skill),不採完整 ADW | Accepted |
| [0005](0005-toolchain-versioning.md) | 鎖 react19+fiber9;vite/ts/eslint 跟隨官方範本 | Accepted |
| [0006](0006-minimal-query-routing.md) | 極簡 query 路由,不引 react-router | Accepted |
| [0007](0007-procedural-environment-deterministic.md) | 程序化棚拍環境 + 決定性截圖(不抓外部 HDR) | Accepted |
| [0008](0008-harness-drivable-runtime-state.md) | 自查 harness 可驅動的執行期狀態(query 參數 + DEV store handle) | Accepted |
| [0009](0009-tuning-config-leva.md) | 視覺參數集中到 config + leva DEV 調參面板(不做產品設置頁) | Accepted |
