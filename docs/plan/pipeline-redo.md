# 製程管線供應鏈重做計畫(supply chain → demo → 逐設備,checklist 迴圈)

> 目標:把 `pipeline` 題目從早期 tube 範例重做成可教學的製程管線 / 流體處理 skid demo。
> **先懂供應鏈、再定整體 demo 長相、最後才逐設備 research/design/實作**。
> 每個查核點跑完 checklist + 截圖,**停下給人類看再續**(ADR-0004 互動節奏)。
> 結構參考 [`ai-server-redo.md`](ai-server-redo.md),但 pipeline 重點是**流體沿管線經設備處理**,不是機櫃或電網。

正典在 [`CONTEXT.md`](CONTEXT.md) / [`PLAN.md`](PLAN.md);三段管線與慣例在 [`topic-playbook.md`](topic-playbook.md)、[`../machines/README.md`](../machines/README.md)。本檔只列「這次重做」的步驟與 checklist。

## 管線總覽(順序不可跳)

```
Phase A  研究供應鏈   /research-supply-chain pipeline  → docs/supply-chains/pipeline.md
Phase B  設計 demo    /design-demo pipeline            → specs/<NN>-topic-pipeline.md
Phase C  逐設備迴圈   每設備: /research-machine → /design-machine → /add-component → /verify → 停
Phase D  製程流接線   接 topic-level process + 全題驗收 + Pattern + /update-docs
```

> A、B 是**整體**(製程管線供應鏈全貌 + demo 取捨);C 才下到**單台設備**。
> 現有 `pipeline.json` 只有兩個儲槽、兩條管、一個閥,可保留 tube/path 經驗,但不要被它限制。

## 與 AI Server 計畫不同處(先讀)

1. **這是流體製程,不是機櫃。** AI server 是盤件互連;pipeline 是原料/流體從進料、儲存、加壓、換熱/反應、分離到出料。
2. **管線本身是主角之一。** `tube + path` 應保留,但要補法蘭、閥、泵、儀表、支架等有供應鏈意義的部位。
3. **流是製程流,不是裝飾 flow。** topic-level `process` 表單向流體;`shape:"flow"` 只用於非語意循環裝飾。
4. **不要新增 engine 能力。** 現有 `tube`、`process`、`partOf`、`enclosure` 夠用;若真要動 `engine/` → 先停下回報。

---

## Phase A — 研究供應鏈(整體,先做)

先搞懂製程管線 / 流體處理 skid 的設備鏈,再決定 demo 節點。

- [ ] `/research-supply-chain pipeline` → `docs/supply-chains/pipeline.md`。
- [ ] 涵蓋:儲槽、泵、管材/法蘭、閥件、換熱器/反應器、過濾/分離、儀控、密封件、工程整合。
- [ ] 每環節:代表公司 + 代號 + 具體供應角色 + 市占/地位(**準確性需人類查證,草稿標「需查證」**)。
- [ ] 標清楚**流體怎麼走**:進料 → 儲存 → 加壓 → 處理 → 分離/過濾 → 出料;儀控是訊號側,不要混成主製程流。
- [x] **停 → 人類看研究內容 + 校對公司**,再進 Phase B。

## Phase B — 設計 demo(整體取捨,先做)

依研究決定「pipeline demo 長怎樣」——選設備、布局、互動、製程流。

- [ ] `/design-demo pipeline` → `specs/<NN>-topic-pipeline.md`。
- [ ] **scope 拍板**:
  - [ ] A compact skid:一座 skid 上排出完整小製程。最小、最穩。**預設傾向 A**。
  - [ ] B process area:多座槽/設備分散,管線跨區連接。較完整,但容易擠。
- [ ] **精選節點**:挑 5-7 個可教學節點,避免做整座工廠。
- [ ] **形狀/大小**:套 `object-abstraction`;每台設備是 primitive 組合,不是單方塊。
- [ ] **布局**:左到右或前到後單向:feed tank → pump skid → heater/reactor → filter/separator → product tank;儀控面板放側邊。
- [ ] **製程流方案**:topic-level `process` 表主流體;route 有箭頭,token 沿設備中心走;儀表/控制用 side route。
- [ ] **機台級流配方**:確認重用 `Part.process`+`scale`;訂每設備 in/out token 語意(原料、加壓流、加熱流、產品、控制訊號)。
- [ ] **停 → 人類看 demo 設計 + 拍板 scope/製程流**,再進 Phase C。

---

## Phase C — 逐設備迴圈(每設備 research→design→實作,跑完即停)

依 Phase B 選定設備,**一次只做一台**。

### 每設備 checklist

- [ ] **Research machine** — `/research-machine <設備>` → `docs/machines/<slug>.md`。
- [ ] **Design machine** — `/design-machine <slug>` → `specs/<NN>-machine-<slug>.md`:
  - [ ] primitive 組合(別單一方塊);有供應鏈意義的部位都建出。
  - [ ] 機台/設備內部 process:in/out token(原料/產品/控制),站點,local 座標,scale ~0.4。
  - [ ] **介面契約**:這台設備對外 in/out 與 Phase B topic-level 製程流對得起來。
  - [ ] 擋內部的殼標 `enclosure: true`(如泵殼、過濾器筒體、控制櫃)。
- [ ] **實作** — `/add-component`:幾何 + partOf 命名 + 機台級 process,寫進 `content/pipeline.json`。companies 走 `companies.csv`。
- [ ] **驗證** — `/verify`:機台頁拆解/名稱/股票/透視可用;流體 token 單向進出、過站心、到站停留、in/out 分色。
- [ ] **截圖 gate** → 讀回 PNG 對 spec 驗收 → **停,人類看過再做下一台**。
- [ ] 更新 `.agent/log.md` 一段 ✅。

> 建議設備順序(Phase B 可調):
> 1. Storage / Feed Tank(試金石,槽體/液位/管口/支架)
> 2. Pump Skid(泵、馬達、底座、聯軸器)
> 3. Valve Manifold / Piping(管線、法蘭、閥、旁通)
> 4. Heat Exchanger / Reactor(處理設備,可用 enclosure)
> 5. Filter / Separator(下游品質或分離)
> 6. Instrument & Control Panel(訊號側)
>
> 同一設備連續驗證失敗 ≥3 次 → 停下回報。

---

## Phase D — 製程流接線 + 全題驗收

所有設備重做完後,回整體 topic 視圖接上 Phase B 拍板的製程流,確認爆炸看公司仍正常。

- [ ] **topic-level process**:feed tank → pump → treatment → filter/separator → product tank;token 分原料/處理中/成品材質;route 單向、不閉合。
- [ ] **介面契約對齊**:上游 output = 下游 input;壓力/溫度/品質變化發生在對應設備。
- [ ] **爆炸/公司/導航**:點各設備→拆解→公司卡;名稱/股票/透視/重置;整體↔gallery 連結。
- [ ] **全綠**:`pnpm check` / typecheck / lint / build;多角度截圖無 pageerror。
- [ ] **Pattern harvest**:若「process skid + tube routes」可跨題目重用 → 寫進 `topic-playbook.md`。
- [ ] `/update-docs`:同步 README / CLAUDE / log;此計畫檔逐項勾完標 ✅。

---

## 進度追蹤

- [x] Phase A 研究供應鏈(`docs/supply-chains/pipeline.md`)— 待人類校對公司/代號
- [ ] Phase B 設計 demo(`specs/<NN>-topic-pipeline.md`)
- [ ] Phase C-0 Storage / Feed Tank
- [ ] Phase C-1 Pump Skid
- [ ] Phase C-2 Valve Manifold / Piping
- [ ] Phase C-3 Heat Exchanger / Reactor
- [ ] Phase C-4 Filter / Separator
- [ ] Phase C-5 Instrument & Control Panel
- [ ] Phase D 製程流接線 + 全題驗收
