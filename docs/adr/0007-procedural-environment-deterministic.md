# 0007 — 程序化棚拍環境 + 決定性截圖(不抓外部 HDR)

- 狀態:Accepted
- 日期:2026-06-18
- 相關:深化 [0003](0003-visual-self-verification-loop.md)(自查迴圈靠決定性)

## Context

C2 要做出統一的柔影金屬質感。金屬材質(PBR metalness)需要環境貼圖才有正確反射,
否則金屬看起來死黑。最省事的做法是 drei `<Environment preset="city" />`,但它會在
**runtime 從 CDN(pmndrs 資產)非同步抓一張 HDR**。這帶來三個問題:

1. **截圖不決定性** — HDR 非同步載入,自查截圖可能在載入前/後拍到不同畫面,破壞自查迴圈的穩定比對。
2. **離線/網路依賴** — 沒網路或 CDN 變動就壞;CI/agent 環境不一定有外網。
3. **與守則精神相左** — §9「不自行下載外部素材」雖主要指 GLB,但 runtime 抓 HDR 同屬外部素材依賴。

## Decision

用 `<Environment>` + 程序化 `<Lightformer>` 子元件,在記憶體即時建出棚拍環境貼圖,**不抓任何外部 HDR**;
搭配一盞 directional 軟陰影 + 透明地面接影。金屬材質 metalness 取中等值,靠 Lightformer 的反射加直接光成形。

## Consequences

- ✅ 截圖具決定性,支撐 [[0003]] 的視覺自查迴圈(已驗證:多次載入畫面一致、無 pageerror)。
- ✅ 離線可跑、零外部素材依賴、無 CDN 風險。
- ✅ 統一柔影質感仍達成,對齊參考產品的 airy 觀感。
- ⚠️ 環境反射細緻度不如真實 HDR——對低多邊形、學習用途可接受。
- ⚠️ 若日後要更擬真質感,選項是**打包一張本地 HDR**(仍離線、仍決定性),屆時新增 ADR 取代本則,
  不要回頭改用會抓 CDN 的 preset(那會默默破壞自查迴圈)。
