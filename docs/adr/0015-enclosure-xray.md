# 0015 — 透視(X-Ray):看穿封閉外殼/黑箱的內部互動

- 狀態:Accepted
- 日期:2026-06-19
- 相關:[0014](0014-radial-explode-labels-partof.md)(互動三件套);schema 加一欄

## Context

把模型做細之後,**封閉外殼**(變壓器油箱、無塵室機殼、機櫃外箱…)會把內部元件、子部位與 flow 全擋住——
收合狀態下「看不到模型內部的互動」。拆解雖能把外殼移開,但外殼若 `magnitude 0`(框體不動)就一直擋著;
而且使用者常想在**不拆解**的情況下直接看穿內部。

## Decision

新增一個與「名稱/股票」對稱的**全域透視開關**,讓被標記為外殼的 part 變半透明且不擋點擊。

- **schema**:`Part.enclosure?: boolean`。內容把外殼/黑箱那一塊標 `true`(箱體/機殼)。純視覺旗標,與題目無關。
- **狀態**:`selection.xray` + `toggleXray`(比照 `showAllNames`/`showAllCards`)。
- **render(GeometryFactory)**:`ghost = enclosure && xray` 時——
  - 材質 `transparent + opacity 0.12 + depthWrite false`(殼變玻璃);
  - `raycast` 關閉 → 點擊穿透到內部元件;`castShadow` 關 → 透明殼不再投影遮內部。
- **三 .js 坑**:執行期把材質從不透明切成透明,程式狀態會殘留 → 用 `key={ghost?'ghost':'solid'}` 讓材質**重建**,不靠 `needsUpdate`。

## Consequences

- 「黑箱」可一鍵看穿,內部元件/flow/子部位都看得見,且能直接點選內部(殼不擋)。預設仍實心,要看才開。
- 內容只需多標一個 `enclosure: true`;不標 = 行為不變(向後相容,既有題目零回歸)。
- 透明度 `0.12` 暫寫死(`ponytail` 註);要可調再 bake 進 `config.ts`。
- 與「拆解」正交:可拆解 + 透視併用。外殼一樣會放射移開,只是同時透明。

## Alternatives 未採用

- **外殼恆半透明(無開關)**:少一顆按鈕,但黑箱永遠看起來不實心,失去「實心 → 想看才透視」的對比。
- **剖面/clipping plane**:切一刀看內部。更炫但要管裁切面方向 + UI,對「看穿」這需求過重。
- **全域 X 光(所有 part 半透明)**:不必標 enclosure,但內部想看的東西也跟著糊掉,清晰度更差。
