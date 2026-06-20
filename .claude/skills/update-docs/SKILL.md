---
name: update-docs
description: 同步活文件（README.md, CLAUDE.md, log.md）並按架構變更按需新增 ADR。
---

# Update Docs Skill - 同步活文件與決策紀錄

當使用者執行 `/update-docs` 或在完成重大工作階段時，請確保：

1. **更新執行日誌**：
   - 同步更新 [.agent/log.md](file:///Users/wizard/Desktop/MacCode/Visual-Learning/.agent/log.md) 以反映最新進度與已達成的 DoD（Definition of Done）。

2. **更新專案指引與 README**：
   - 若開發環境或依賴發生變動，同步更新 [CLAUDE.md](file:///Users/wizard/Desktop/MacCode/Visual-Learning/CLAUDE.md) 與 [README.md](file:///Users/wizard/Desktop/MacCode/Visual-Learning/README.md)。

3. **新增 ADR（Architecture Decision Records）**：
   - 若做出了任何推翻舊架構或新增關鍵機制的決策，必須在 `docs/adr/` 底下新增一筆 ADR 說明設計脈絡與原因，切勿默默修改。
