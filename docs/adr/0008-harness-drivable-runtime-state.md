# 0008 — 自查 harness 可驅動的執行期狀態(query 參數 + DEV store handle)

- 狀態:Accepted
- 日期:2026-06-18
- 相關:深化 [0003](0003-visual-self-verification-loop.md)、[0006](0006-minimal-query-routing.md)

## Context

自查迴圈靠截圖驗證。但 C3(選取)、C4(拆解)這類是**互動/動畫狀態**——靜態載入頁面截不到。
要驗證「展開長怎樣」「收合有沒有漂移」「選取會不會切換」,harness 必須能把 app 驅動到那些狀態。
純靠載入單一 URL 不夠;手動點也無法在無人值守時重現。

## Decision

讓執行期狀態可被 harness 以兩種方式驅動,**狀態驅動邏輯放在組合層(Gallery),engine 保持乾淨**:

1. **URL query 灌入初始狀態** — Gallery 讀 `?exploded=1&lang=en&part=<id>` 寫進 zustand store。
   一個 URL = 一個可重現狀態,適合靜態截圖(展開圖、英文標籤圖…)。
2. **DEV 暴露 store handle** — 僅 `import.meta.env.DEV` 時把 `useSelection` 掛上 `window.__selection`。
   Playwright 可 `page.evaluate(() => window.__selection.setState(...))` 在執行期 toggle,
   截動畫中段、或做「展開→收合」往返驗證漂移。

## Consequences

- ✅ 自查迴圈能涵蓋互動與動畫,不只靜態畫面(C3/C4 已靠此驗證)。
- ✅ 截圖狀態可重現、可參數化(URL),支撐 [[0003]]。
- ✅ 驅動邏輯在 Gallery,`engine/` 不知道 harness 存在,維持題目/工具無關。
- ⚠️ `window.__selection` 是**測試縫**,不是 debug 殘渣——**別當垃圾清掉**,清了 harness 就無法驅動動畫狀態。
  已用 `import.meta.env.DEV` 圍住,正式 build 不外洩。
- ⚠️ query 參數集中在 Gallery 的 `useQueryState`;保持薄,別長成自製狀態路由器。
