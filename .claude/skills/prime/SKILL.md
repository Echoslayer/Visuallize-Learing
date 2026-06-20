---
name: prime
description: 開工前建立專案上下文與脈絡。
---

# Prime Skill - 建立開發上下文

當使用者執行 `/prime` 或是新的一輪開發工作開始時，請執行以下步驟以建立完整的專案上下文：

1. **閱讀核心文件**：
   - 閱讀 [docs/CONTEXT.md](file:///Users/wizard/Desktop/MacCode/Visual-Learning/docs/CONTEXT.md) 與 [docs/PLAN.md](file:///Users/wizard/Desktop/MacCode/Visual-Learning/docs/PLAN.md)，了解目前專案的進度與架構目標。
   
2. **檢查程式碼庫狀態**：
   - 執行 `git status --short`，確認目前是否有未提交的變更，避免覆蓋他人或前一輪的工作。
   
3. **查看最近的 commit 歷史**：
   - 執行 `git log -n 5`，了解最近的開發軌跡。

4. **確認目前任務**：
   - 閱讀 [.agent/backlog.md](file:///Users/wizard/Desktop/MacCode/Visual-Learning/.agent/backlog.md) 與 [.agent/log.md](file:///Users/wizard/Desktop/MacCode/Visual-Learning/.agent/log.md) 獲取具體的工作清單與之前的執行紀錄。
