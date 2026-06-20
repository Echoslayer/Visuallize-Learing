---
name: verify
description: 執行專案自我驗證迴圈（typecheck, lint, build, check, shoot），沒通過不可進行 commit。
---

# Verify Skill - 自我驗證迴圈

當使用者執行 `/verify` 或是準備提交變更前，必須執行以下自我驗證程序以確保代碼品質：

1. **執行 TypeScript 檢查**：
   - 執行命令：`pnpm typecheck` (或 `tsc -b`)
   
2. **執行 ESLint 檢查**：
   - 執行命令：`pnpm lint`

3. **執行專案建置**：
   - 執行命令：`pnpm build`

4. **執行數據與邏輯驗證**：
   - 執行命令：`pnpm check`
   - 此指令會執行 [tools/check-explode.ts](file:///Users/wizard/Desktop/MacCode/Visual-Learning/tools/check-explode.ts) 等多個數學與結構驗證腳本。

5. **執行截圖驗證 (視覺層測試)**：
   - 執行命令：`pnpm shoot "?topic=<topic>&view=gallery&machine=<partId>" <name>`，依照需求擷取畫面。必須確保帶上 topic 參數，否則截圖對象會錯誤。
   
> [!IMPORTANT]
> 任何一項驗證失敗都必須修復，直到所有驗證流程完全通過（DoD 達成）才可進行 Git 提交。
