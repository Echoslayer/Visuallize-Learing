# 0006 — 極簡 query 路由,不引 react-router

- 狀態:Accepted
- 日期:2026-06-18

## Context

需要在「主場景」與「元件畫廊(供截圖自查)」之間切換。畫廊還要能用參數控制狀態
(`?view=gallery&part=...&exploded=1&lang=en`)以便分別截圖。直覺會想裝 react-router,
但它不在版本鎖定清單,且 GUARDRAIL 規定不擅自加依賴。本專案只有極少數「頁面」。

## Decision

不引 react-router。在 `src/main.tsx` 用 `new URLSearchParams(window.location.search)` 讀 `view`:
`?view=gallery` 渲染 `<Gallery/>`,否則渲染 `<App/>`。畫廊內再用同樣方式讀 `part`/`exploded`/`lang`
等參數挑選要渲染的零件與狀態。`shoot.mjs` 對 `http://localhost:5173/?view=gallery&...` 截圖。

## Consequences

- ✅ 零新依賴,符合 GUARDRAIL;邏輯幾行就好。
- ✅ query 驅動的狀態天生適合截圖 harness(一個 URL = 一個可重現狀態)。
- ⚠️ 沒有巢狀路由/history 管理;本專案用不到,真有需要再回頭評估(屆時新增 ADR)。
- ⚠️ 所有「路由」走同一個 SPA entry,query 解析集中在 main.tsx 與 Gallery;保持簡單,別長成自製 router。
