# 0010 — 不引入測試框架 / TDD;截圖 harness 為測試層

- 狀態:Accepted
- 日期:2026-06-18
- 相關:深化 [0003](0003-visual-self-verification-loop.md)(視覺自查迴圈)

## Context

常見問題:這種專案要不要 TDD / 單元測試框架(vitest)?評估本專案特性:

- 絕大多數是**視覺 / 宣告式 R3F 程式**(元件回傳 mesh、材質、`<Html>`),correctness = 「畫面對不對」。
- 已有 §7 **截圖 harness**(typecheck→lint→build→Playwright shoot→讀回截圖)= 整合測試,
  且能抓 unit test 抓不到的東西(遮擋、NaN 位置、打光、標籤錯位、拆解漂移)。
- 單人學習專案,**無後端 / 無資料管線 / 無商業邏輯層**。

對視覺程式寫「斷言 `GeometryFactory` 回傳 `<mesh>`」的單元測試,是在測 React/three,不是測你的邏輯。

## Decision

- **不做 TDD、不引測試框架。截圖 harness(§7)就是測試層。**
- 唯一例外:**純函式 + 有靜默壞掉邊界**的邏輯,留一個 `node:assert` 自查(無框架)。
  範例 `tools/check-explode.ts`(`pnpm check`)——explodeOffset 除零會吐 NaN 讓場景消失。
- **升級階梯**(真需要更多時,先低後高,不要一步到框架):
  純函式 `assert` → Node 內建 `node:test`(stdlib,零依賴)→ 最後才考慮 vitest(僅當需要 jsdom / 元件測試)。

## Consequences

- ✅ 不養框架、不寫對視覺無意義的測試;用對工具(截圖)驗視覺。
- ✅ 純數學邊界仍有快速 assert 守著,毫秒級、免起瀏覽器。
- ⚠️ 非視覺回歸會較晚發現——靠下列「重新評估觸發條件」把關。
- ⚠️ 截圖 harness 需 dev server + 瀏覽器,比 unit test 慢;單人/互動式可接受。

## 重新評估觸發條件(命中任一 → 回來評估加測試,從升級階梯最低階開始)

1. **engine 累積非視覺演算法**:schema 驗證、`repeat`/layout 展開器、圖計算、資料轉換等真邏輯。
2. **出現後端 / API / 資料管線**(目前沒有)——那是邏輯,要測。
3. **從單人變多人協作**——回歸安全網價值上升。
4. **純函式 self-check 超過 ~5–6 個** → 用 `node:test` 一次跑(仍 stdlib,不算框架)。
5. **反覆出現截圖抓不到的非視覺 bug**。
6. **變成正式產品(非學習)**,且顯示的數據 correctness 關鍵(投資內容錯了傷信任)→ 資料層要測。
