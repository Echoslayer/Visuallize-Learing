# 半導體機台重做計畫(research → design → 實作,逐台迴圈)

> 目標:把半導體供應鏈的**每一台機台**用三段管線重做一遍,並讓**機台頁(gallery 單機台)也有物料進出**(process token in/out),
> 最後回到供應鏈頁把全線互動重新接起來。
> **不要一步做完**——一台機台一個迴圈,每台跑完 checklist + 截圖,**停下給人類看再續**(ADR-0004 互動節奏)。

正典在 [`CONTEXT.md`](CONTEXT.md) / [`PLAN.md`](PLAN.md);三段管線與慣例在 [`topic-playbook.md`](topic-playbook.md)、
[`../machines/README.md`](../machines/README.md)。本檔只列「這次重做」的步驟與 checklist,不複製上述內容。

## 機台清單與順序(照產線流)

| # | 機台 | root partId | 站點 input → output | 狀態 |
|---|------|-------------|----------------------|------|
| 0 | IC 設計 | `design` | (起點) → `silicon`? | 已重建(spec 12),**缺機台頁進出流** → 當 Phase 0 試金石 |
| 1 | 矽晶圓 | `wafer` | `silicon` → `wafer` | 待重做 |
| 2 | 晶圓代工 | `foundry` | `wafer` (+`supply`) → `processed-wafer` | 待重做 |
| 3 | 設備 / 材料 | `equip` | (側向源) → `supply` | 待重做 |
| 4 | 封裝測試 | `osat` | `processed-wafer` → `chip` | 待重做 |
| 5 | 下游應用 | `downstream` | `chip` → `system` | 待重做 |

> 站點 input/output 名稱要與 topic-level `process.stations`(見 `semiconductor.json`)一致,
> 這就是「機台內部流」與「供應鏈整線流」的**介面契約**:上一台的 output = 下一台的 input,材質/顏色在交接點變(如 wafer 藍 → chip 綠 發生在 osat)。

---

## Phase 0 — 機制決策 + engine 縫(只做一次,過了才開始逐台)

機台頁目前 **沒有** 物料進出:`Gallery.tsx` 的 `focusMachine()` 直接 `process: undefined`。
要讓單機台顯示「物料進 → 過內部站 → 出」,得先定一個可重用機制,**先在 `design` 一台上驗證**再推廣。

- [x] **選方案 → 採 A**:`Part.process?`(machine-local 座標);`focusMachine` 把 root part 的 process 提升為 `content.process`,不再 strip。
- [x] 擴 schema:`Part.process?` + `ProcessSpec.scale?`(管/箭頭/環尺寸倍率,單機台用 ~0.4);engine 無題目字眼。
- [x] `ProcessLayer` / `process-motion.ts` 原樣重用,只加 `scale` 倍率(箭頭/環/管半徑);`focusMachine` 接上 root.process。
- [x] `design` 機台寫最小進出流:`design-in`(metal-light/spec 進)→ 站 `design-wks`(floorplan,dwell 0.6s)→ `design-out`(chip/GDS 出)。
- [x] `pnpm check`(process.check 過,純函式未改不需新 check)→ typecheck → lint → build,全綠。
- [x] `pnpm shoot …machine=design` 讀回(`.agent/shots/phase0-design2.png`):箭頭、單向、token 過站、in 白 / out 綠分色。✅ 機制成立。
- [ ] **停 → 人類看截圖確認機制 OK**,再進 Phase 1。**ADR 待人類拍板後補**(機台級 process + gallery 渲染 + scale)。

> 機制過關前不要逐台展開,免得六台都要返工。

---

## 逐台迴圈(Phase 1–5,每台一個迴圈,跑完即停)

對清單第 1–5 台,**一次只做一台**,依序:

### 每台的 checklist
- [ ] **Research** — `/research-machine <機台>` → `docs/machines/<slug>.md`。事實查證,代號/供應商標「需查證」交人類核。
- [ ] **Design** — `/design-machine <slug>` → `specs/<NN>-machine-<slug>.md`。
  - [ ] 套 `object-abstraction`:鏈上有意義的部位都用 primitive 建出(別單一方塊)。
  - [ ] 定義**機台內部 process**:input token 從哪進、過哪些內部站、output 從哪出(座標 machine-local)。
  - [ ] 寫清楚**介面契約**:input 材質/名稱 = 上游 output;output = 下游 input(對齊上表)。
  - [ ] 擋內部的殼標 `enclosure: true`(可透視)。
- [ ] **實作** — `/add-component`:幾何 + partOf 命名 + 機台級 process,寫進 `content/semiconductor.json`。companies 仍走 `companies.csv`,別寫回 JSON。
- [ ] **驗證** — `/verify` 跑兩條 route:
  - [ ] 機台頁 `?view=gallery&topic=semiconductor&machine=<id>`:拆解/名稱/股票/透視都能用;**物料單向進出**、token 穿站心、到站停留、in/out 有分色。
  - [ ] 機台頁 EDA/螢幕等貼面細節貼齊正面(別重蹈 design 的 accent 浮空坑)。
- [ ] **截圖 gate** → 讀回 PNG 對 spec 驗收 → **停,人類看過再做下一台**。
- [ ] 更新 `.agent/log.md` 一段 ✅;`.agent/backlog.md` 勾掉該台。

> 同一台連續驗證失敗 ≥3 次 → 停下回報,不要硬幹(§9)。

---

## Phase 6 — 回供應鏈,把互動接起來 + 全線驗收

六台都重做完後,回 topic 視圖確認整線仍連續、機台↔供應鏈導航順。

- [ ] **介面契約對齊**:每台 output 材質/位置 = 下台 input;topic-level `process` 的 station input/output 與各機台一致(必要時調 `semiconductor.json` 的 route 交接點/材質)。
- [ ] **整線流**:`?topic=semiconductor` 單向、不是閉合跑馬燈;wafer 藍 → chip 綠在 osat 交接;設備/材料側向注入不排主線。
- [ ] **導航**:供應鏈頁「機台」連結 → gallery;gallery「← 供應鏈」連結 → topic;機台清單切換正常。
- [ ] **全綠**:`pnpm check` / typecheck / lint / build;多角度截圖(用 `__view` / hotkey)無 pageerror。
- [ ] **Pattern harvest**:機台級進出流若可跨題目重用 → 寫進 `topic-playbook.md`「可重用 pattern」。
- [ ] **ADR**:Phase 0 的 schema 機制若拍板 → 補一則 ADR(機台級 process / gallery 渲染流)。
- [ ] `/update-docs`:同步 README / CLAUDE / log;此計畫檔逐項勾完後標 ✅。

---

## 進度追蹤

- [x] Phase 0 機制(design 試金石)— 待人類確認 + ADR
- [x] Phase 1 矽晶圓 `wafer` — 待人類確認
- [x] Phase 2 晶圓代工 `foundry` — 待人類確認
- [x] Phase 3 設備 / 材料 `equip` — 待人類確認
- [x] Phase 4 封裝測試 `osat` — 待人類確認
- [ ] Phase 5 下游應用 `downstream`
- [ ] Phase 6 回供應鏈接線 + 全線驗收
