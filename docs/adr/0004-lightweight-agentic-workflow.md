# 0004 — 輕量 agentic 工作流,不採完整 ADW

- 狀態:Accepted
- 日期:2026-06-18

## Context

參考了 TAC（Total Agentic Coding）的 ADW（AI Developer Workflow）最佳實踐:Plan→Build→Test→
Review→Document 階段化、規格驅動、命令化、閉環驗證。但 ADW 完整版還包含 worktree 隔離、
埠號分配、GitHub issue 驅動、多 agent 並行、API key 自動化——那是團隊/大專案的重機制。
本專案是單人、學習用、互動式開發。

## Decision

**只取 ADW 的方法論,不搬機制。** 採用:

- **規格驅動**:階段二每個工作單元先寫 `docs/specs/` 規格(含 Validation Commands),再實作。
- **命令化**:重複流程固化成 `.claude/commands/`:`/prime`、`/verify`、`/commit`、`/add-component`、`/add-topic`。
- **領域 skill**:`r3f-industrial-component` 在建元件時自動載入配方。
- **閉環**:見 [[0003]]。
- **權限安全網**:`.claude/settings.json` 純設定擋 `rm -rf`、force push、讀 `.env`,零依賴。

**明確不採用**:`adws/` 那套 worktree+埠號+GitHub issue+觸發器、7 支 Python hook、app 專屬 e2e/mkdocs 命令。
ADW 自動化(無人值守跑 backlog)列為**選用**,人類決定;預設不開,採互動式(每查核點停下給人看)。

## Consequences

- ✅ 保留 agentic 開發的紀律(規格、命令、閉環),成本卻很低、零額外基礎設施。
- ✅ 命令與 skill 可隨專案演進,不被重框架綁住。
- ✅ 互動節奏讓人類把關美術品味(agent 弱項)。
- ⚠️ 放棄多 agent 並行與 issue 驅動自動化;單人專案用不到,真要時可接內建 `/loop`(見 SETUP §C1)。
- 來源:`/Users/wizard/Desktop/MacCode/TAC Repos/tw-tac`(課程 repo,僅參考方法論)。
