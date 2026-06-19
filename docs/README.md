# docs/ 地圖

找文件先看這張表。結構對應三段管線:**研究 → 設計 → 實作**,外加正典、決策、進度、審查。

| 你要找… | 去哪 |
|---|---|
| 專案緣起、核心原則、為什麼這樣選 | [`CONTEXT.md`](CONTEXT.md) |
| 執行計畫、查核點、停止條件 | [`PLAN.md`](PLAN.md) |
| 環境安裝 / 工具鏈 | [`SETUP.md`](SETUP.md) |
| 加一條供應鏈題目的完整步驟 + 驗收清單 | [`topic-playbook.md`](topic-playbook.md) |
| 機台 primitive 配方(Conveyor/Rack/Tank…) | [`machine-patterns.md`](machine-patterns.md) |
| **① 研究**:供應鏈事實查證 | [`research/supply-chains/`](research/supply-chains/) |
| **① 研究**:單台機台外觀/功能 | [`research/machines/`](research/machines/)([流程](research/machines/README.md)) |
| **② 設計**:每個工作單元的設計規格 | [`specs/`](specs/)(範本 [`_TEMPLATE.md`](specs/_TEMPLATE.md)) |
| **③ 實作進度**:各題目重做日誌 | [`progress/`](progress/) |
| 架構決策(改動前先讀) | [`adr/`](adr/)([索引](adr/README.md)) |
| 一次性審查報告 | [`review/`](review/) |
| 借用模型出處 / 截圖參考 | [`assets/`](assets/) / [`references/`](references/) |

管線指令:`/research-supply-chain` → `/design-demo` → `/add-topic`(題目);`/research-machine` → `/design-machine` → `/add-component`(單台機台)。規範以根目錄 [`CLAUDE.md`](../CLAUDE.md) 為準。
