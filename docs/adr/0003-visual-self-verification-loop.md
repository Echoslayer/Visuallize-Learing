# 0003 — 視覺自我驗證迴圈作為迭代閘門

- 狀態:Accepted
- 日期:2026-06-18

## Context

要讓 agent 在終端**自主迭代**,它必須能「看到自己畫出什麼」。3D 視覺正確性無法只靠
typecheck/build 保證——程式碼通過編譯,畫面仍可能空白、零件錯位、標籤脫離。沒有視覺回饋,
agent 會盲改、越跑越歪。

## Decision

每個查核點/工作單元都跑固定的自查迴圈,**全綠才准 commit**:

1. `pnpm typecheck`(0 error)→ 2. `pnpm lint`(0)→ 3. `pnpm build`(exit 0)→
4. `pnpm shoot <route>` 用 Playwright headless 截圖到 `.agent/shots/`,
   **再用 Read 工具讀回那張 PNG**,逐條對照查核點的驗收;比例/質感類另對照 `docs/references/` 參考圖。

- 依序執行,**遇第一個失敗即停**並把原因寫進 `.agent/log.md`。
- 同一點連續失敗 **3 次** → 停下回報人類,不繞過驗收。
- 這套 harness(gallery 路由 + `shoot.mjs`)是 **C0 的硬性產出**,必須先建好才往下。

## Consequences

- ✅ agent 有了視覺閉環,可無人盯著也不盲改;「完成」有客觀定義。
- ✅ 截圖具決定性(場景靜止、固定延遲),比對穩定。
- ✅ gallery 讓每個零件單獨截圖,迭代不必跑整個 app。
- ⚠️ 截圖比對是「方向校準」非像素級;**美術品味仍需人類定期把關**(agent 弱項)。
- ⚠️ 多一層 Playwright + Chromium 依賴與每輪截圖開銷;換取的是自主性,值得。
- 借鏡 TAC 的 close-the-loop / 截圖驗收概念,但用本專案自寫的輕量 harness(見 [[0004]])。
