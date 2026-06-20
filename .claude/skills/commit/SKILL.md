---
name: commit
description: 格式化 Git commit 訊息。階段一採用 C{n}: ... 格式，階段二採用包含 spec 檔名的格式。
---

# Commit Skill - 格式化提交

當使用者執行 `/commit` 或代理人準備進行工作階段性提交時，請遵循以下規範：

1. **前提條件**：
   - 必須先成功執行完 [/verify](file:///Users/wizard/Desktop/MacCode/Visual-Learning/.agents/skills/verify/SKILL.md) 且沒有任何報錯。

2. **Commit 訊息格式規範**：
   - **階段一 (Phase 1)**：格式為 `C{n}: <簡短說明>` (例如 `C3: implement GeometryFactory cylinder`)。
   - **階段二 (Phase 2)**：格式需包含對應的 spec 檔案名稱 (例如 `[spec 09] redo semiconductor topic`)。

3. **提交操作**：
   - 整理已變更的檔案，使用 `git add` 暫存，並依上述格式進行 `git commit -m "<message>"`。
