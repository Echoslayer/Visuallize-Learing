# 0012 — flow 持續運動 + 動畫場景截圖非決定性(0007 的受控例外)

- 狀態:Accepted
- 日期:2026-06-18
- 相關:scoped amendment to [0007](0007-procedural-environment-deterministic.md);spec 06

## Context

參考產品的場景會「活」——材料/晶圓沿產線流動、循環。為此加了 `shape: "flow"`:
小球沿 path 用 `useFrame` 持續移動、循環。但 ADR-0007 立的原則是「截圖要決定性」(便於穩定比對)。
持續動畫**本質上**讓含 flow 的場景每幀不同 → 截圖無法 byte-identical,與 0007 衝突。

## Decision

對**含持續動畫(flow 等)的場景**,放寬 0007 的決定性要求:

- 這類場景的截圖**不要求 byte-identical**;自查改為「**視覺判斷**:小球有在 path 上流動、形態正確」。
- 「收合零漂移」那種 **byte 比對測試只在無動畫的場景**(如 ai-server)跑——它們仍受 0007 保護。
- 驗證一個 flow 有沒有在動:**同場景隔幾秒截兩張,hash 應不同**(已用此法驗 semiconductor)。
- 0007 對「程序化環境、不抓外部 HDR」的部分**完全不變**;本則只縮小「決定性」的適用範圍。

## Consequences

- ✅ 場景能有持續運動,貼近參考產品;同時保留多數靜態場景的決定性截圖。
- ✅ 「動兩張 hash 不同」反而成為驗 flow 有在動的正向測試。
- ⚠️ 含 flow 的場景不能用 byte 比對驗回歸;靠視覺判斷 + 其他靜態場景的回歸。
- ⚠️ flow 是 three/useFrame 視覺膠水,無純邏輯邊界 → 不加 `pnpm check`(ADR-0010)。
- 適用範圍:目前 `semiconductor`(晶圓產線);未來其他動畫場景同此原則。
