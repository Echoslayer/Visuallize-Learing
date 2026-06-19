# 重電 / 電網供應鏈重做計畫(supply chain → demo → 逐設備,checklist 迴圈)

> 目標:把 `grid` 題目(目前只有一台簡化變壓器)重做成可教學的重電/電網供應鏈 demo。
> **先懂供應鏈、再定整體 demo 長相、最後才逐設備 research/design/實作**。
> 每個查核點跑完 checklist + 截圖,**停下給人類看再續**(ADR-0004 互動節奏)。
> 結構參考 [`ai-server-redo.md`](ai-server-redo.md),但重電不是機櫃,重點是**電力流:升壓 → 輸電 → 變電 → 配電 / 用電**。

正典在 [`CONTEXT.md`](CONTEXT.md) / [`PLAN.md`](PLAN.md);三段管線與慣例在 [`topic-playbook.md`](topic-playbook.md)、[`../machines/README.md`](../machines/README.md)。本檔只列「這次重做」的步驟與 checklist。

## 管線總覽(順序不可跳)

```
Phase A  研究供應鏈   /research-supply-chain grid      → docs/supply-chains/grid.md
Phase B  設計 demo    /design-demo grid                → specs/<NN>-topic-grid.md
Phase C  逐設備迴圈   每設備: /research-machine → /design-machine → /add-component → /verify → 停
Phase D  電力流接線   接 topic-level process + 全題驗收 + ADR/Pattern + /update-docs
```

> A、B 是**整體**(重電供應鏈全貌 + demo 取捨);C 才下到**單台設備**。
> 現有 `grid.json` 是早期 transformer close-up,可當起點,但不要被它限制。

## 與 AI Server 計畫不同處(先讀)

1. **這是電力設備鏈,不是機櫃。** AI server 是一櫃內的電源/資料 fabric;重電是電力從高壓側進入,經開關/保護/變壓/冷卻/配電後輸出。
2. **demo scope 需先拍板。** Phase B 必須決定:
   - A. **變壓器 close-up**:深做單台變壓器(油箱/鐵芯線圈/套管/散熱/分接開關/保護裝置)。最小、最穩。
   - B. **小型變電站**:變壓器 + GIS/斷路器 + 電纜/母線 + 控制保護 + 配電盤。較完整,但節點更多。**預設傾向 B**,因為「重電」不只油箱。
3. **流是電力流,不是物料流。** topic-level `process` 可表 AC power token 單向流,但 token 是抽象電能;不要畫成工件輸送帶。
4. **目前狀態很陽春。** `grid.json` 只有 base/tank/lid/core/bushing/fin,且仍有 legacy `explode.vector`;沒有供應鏈研究、沒有 topic process、沒有機台級 process。

---

## Phase A — 研究供應鏈(整體,先做)

先把重電/電網供應鏈搞懂,再決定 demo 要呈現哪些設備。

- [ ] `/research-supply-chain grid` → `docs/supply-chains/grid.md`。
- [ ] 涵蓋:變壓器、矽鋼片/鐵芯、銅線/繞組、絕緣油/絕緣材料、套管/礙子、散熱器、分接開關、GIS/斷路器、電纜/母線、保護電驛/控制盤、配電設備、系統整合。
- [ ] 每環節:代表公司 + 代號 + 具體供應角色 + 市占/地位(**準確性需人類查證,草稿標「需查證」**)。
- [ ] 標清楚**電力如何流**:高壓輸入 → 開關保護 → 變壓 → 配電輸出;控制/保護是訊號側,不要混成主電力流。
- [x] **停 → 人類看研究內容 + 校對公司**,再進 Phase B。

## Phase B — 設計 demo(整體取捨,先做)

依研究決定「重電 demo 長怎樣」——選 close-up 還是小型變電站,再定設備、布局、互動、電力流。

- [ ] `/design-demo grid` → `specs/<NN>-topic-grid.md`。
- [ ] **scope 拍板**:
  - [ ] A close-up:單台變壓器拆細。
  - [x] B substation:變壓器 + GIS/斷路器 + 母線/電纜 + 控制保護 + 配電輸出。
- [ ] **精選節點**:從研究挑 4-7 個可教學節點,避免一次塞完整電網。
- [ ] **形狀/大小**:套 `object-abstraction`;每個設備是 primitive 組合,不是單方塊。
- [ ] **布局**:
  - close-up:變壓器居中,高壓側/低壓側分左右或前後。
  - substation:高壓進線 → GIS/斷路器 → 變壓器 → 配電盤/用電端,單向排布。
- [ ] **電力流方案**:
  - topic-level `process` 表主電力流;route 有箭頭,token 沿高壓→低壓方向走。
  - 控制/保護用 `signal-token` side route;不冒充主電力。
- [ ] **機台級流配方**:確認是否重用 `Part.process`+`scale`;訂每設備 in/out token 語意(高壓 AC、低壓 AC、冷卻/控制訊號)。
- [x] **停 → 人類看 demo 設計 + 拍板 scope/電力流**,再進 Phase C。

---

## Phase C — 逐設備迴圈(每設備 research→design→實作,跑完即停)

依 Phase B 選定設備,**一次只做一台**:

### 每設備 checklist

- [ ] **Research machine** — `/research-machine <設備>` → `docs/machines/<slug>.md`。
- [ ] **Design machine** — `/design-machine <slug>` → `specs/<NN>-machine-<slug>.md`:
  - [ ] primitive 組合(別單一方塊);有供應鏈意義的部位都建出。
  - [ ] 機台/設備內部 process:in/out token(高壓/低壓/熱/控制),站點,local 座標,scale ~0.4。
  - [ ] **介面契約**:這台設備對外 in/out 與 Phase B topic-level 電力流對得起來。
  - [ ] 擋內部的殼標 `enclosure: true`(如油箱/GIS 外殼)。
- [ ] **實作** — `/add-component`:幾何 + partOf 命名 + 機台級 process,寫進 `content/grid.json`。companies 走 `companies.csv`。
- [ ] **驗證** — `/verify`:機台頁拆解/名稱/股票/透視可用;電力 token 單向進出、過站心、到站停留、in/out 分色。
- [ ] **截圖 gate** → 讀回 PNG 對 spec 驗收 → **停,人類看過再做下一台**。
- [ ] 更新 `.agent/log.md` 一段 ✅。

> 建議設備順序(Phase B 可調):
> 1. Power Transformer(試金石,整合 tank/core/winding/bushing/radiator)
> 2. GIS / Breaker(高壓開關保護)
> 3. Busbar / Cable(母線/電纜連接)
> 4. Control & Protection Panel(保護電驛/控制盤)
> 5. Distribution / Load(低壓配電或用電端)
>
> 若 Phase B 選 close-up,則順序改為 transformer 子系統:鐵芯線圈 → 套管 → 分接開關 → 散熱冷卻 → 保護裝置。
> 同一設備連續驗證失敗 ≥3 次 → 停下回報(§9)。

---

## Phase D — 電力流接線 + 全題驗收

所有設備重做完後,回整體 topic 視圖接上 Phase B 拍板的電力流,確認爆炸看公司仍正常。

- [x] **topic-level process**:高壓進線 → GIS/斷路器 → 變壓器 → 配電/用電端;token 分高壓/低壓/控制訊號材質;route 單向、不閉合。
- [x] **介面契約對齊**:上游 output = 下游 input;高壓/低壓轉換發生在 transformer。
- [x] **爆炸/公司/導航**:點各設備→拆解→公司卡;名稱/股票/透視/重置;整體↔gallery 連結。
- [x] **全綠**:`pnpm check` / typecheck / lint / build;多角度截圖無 pageerror。
- [ ] **Pattern harvest**:若「substation power flow」可跨題目重用 → 寫進 `topic-playbook.md`。
- [ ] **ADR**:若拍板 topic-level 電力流 / 機台級 process 契約 → 補一則 ADR。
- [x] `/update-docs`:同步 README / CLAUDE / log;此計畫檔逐項勾完標 ✅。

---

## 進度追蹤

- [x] Phase A 研究供應鏈(`docs/supply-chains/grid.md`)
- [x] Phase B 設計 demo(`specs/18-topic-grid.md` + scope/電力流拍板)
- [x] Phase C-0 Power Transformer 試金石(`grid-transformer-machine*.png`)
- [x] Phase C-1 GIS / Breaker(`grid-gis-machine*.png`)
- [x] Phase C-2 Busbar / Cable(`grid-busbar-machine*.png`)
- [x] Phase C-3 Control & Protection Panel(`grid-control-machine*.png`)
- [x] Phase C-4 Distribution / Load(`grid-distribution-machine*.png`)
- [x] Phase D 電力流接線 + 全題驗收(`grid-phase-d*.png`)
