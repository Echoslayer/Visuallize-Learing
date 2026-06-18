# 0005 — 鎖 react19+fiber9;vite/ts/eslint 跟隨官方範本

- 狀態:Accepted
- 日期:2026-06-18

## Context

PLAN.md §3 原先(依較舊知識)把版本鎖定寫成 vite^6 / typescript^5。但 C0 實際跑
`pnpm create vite@latest --template react-ts` 時,官方範本已給 **vite 8 / TypeScript 6 / ESLint 10**。
出現「計劃版本」與「範本實裝版本」不一致。逆向降版到 vite6/ts5 會與新版 eslint flat config、
範本預設互相打架,徒增摩擦。

## Decision

- **真正需要鎖定的只有 `react@19` + `@react-three/fiber@9`** ——這對相容性錯配會直接壞(fiber9 必須配 React19)。
- **vite / typescript / eslint 跟隨官方 react-ts 範本當下版本**,不逆向降版。C0 實裝:vite 8 / ts 6 / eslint 10。
- 其餘 3D 依賴(three / drei / zustand@5 / @react-spring/three / three-bvh-csg)取與 fiber9 相容的最新版。
- **不擅自引入鎖定清單外的新依賴**;要加先回報人類(GUARDRAIL)。
- PLAN.md §3 表格已更新對齊實裝版本,並註明此決策。

## Consequences

- ✅ 與官方範本同步,享有最新 flat ESLint、Vite 8 建置,少踩相容雷。
- ✅ 守住唯一會壞的鎖(react19+fiber9),其餘給彈性。
- ⚠️ 「版本鎖定」語意從「凍結特定版」放寬為「凍結關鍵相容對 + 跟隨範本」;需在文件講清楚避免誤解。
- ⚠️ 範本未來再升版時,仍以 react+fiber 相容為準繩做判斷。
- 註:build 出現 three.js 體積使單一 chunk > 500kB 的警告,屬後續 code-splitting 議題,不影響此決策。
