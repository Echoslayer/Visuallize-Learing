# AI 伺服器供應鏈重做計畫(supply chain → demo → 逐盤,checklist 迴圈)

> 目標:把 `ai-server` 題目(專案最早、最陽春的內容)整個重做。**先懂供應鏈、再定整體 demo 長相、最後才逐台機台 research/design/實作**,加機台級物料流(資料/電源進出),並把整機機櫃互連接起來。
> **不要一步做完**——每個查核點跑完 checklist + 截圖,**停下給人類看再續**(ADR-0004 互動節奏)。
> 結構比照 [`semiconductor-machine-redo.md`](semiconductor-machine-redo.md),但**補上半導體當初已有、AI server 還缺的前段**(supply-chain 研究 + design-demo)。

正典在 [`CONTEXT.md`](../CONTEXT.md) / [`PLAN.md`](../PLAN.md);兩條三段管線與慣例在 [`topic-playbook.md`](../topic-playbook.md)、[`../machines/README.md`](../research/machines/README.md)。本檔只列「這次重做」的步驟與 checklist。

## 管線總覽(順序不可跳)

```
Phase A  研究供應鏈   /research-supply-chain ai-server   → docs/research/supply-chains/ai-server.md
Phase B  設計 demo    /design-demo ai-server             → docs/specs/<NN>-topic-ai-server.md
Phase C  逐盤迴圈     每盤: /research-machine → /design-machine → /add-component → /verify → 停
Phase D  整機互連     接電源+資料 fabric + 全機驗收 + ADR + /update-docs
```

> A、B 是**整體**(supply chain 全貌 + demo 取捨);C 才下到**單盤**。先有 A/B 才知道要做哪些盤、長相、互連方向。

## 與半導體計畫不同處(先讀)

1. **這是機櫃,不是產線。** semiconductor 是輸送帶單向產線;AI server 是**一個機櫃裡疊著多個盤**。整機「流」不是一條帶子,而是**互連**:電源(電源盤 → 各盤)+ 資料 fabric(GPU ↔ NVSwitch ↔ 網路盤)。互連如何呈現在 Phase B 拍板、Phase D 實作。
2. **機台級流機制已存在,直接重用。** `Part.process` + `ProcessSpec.scale`(scale ~0.4)已在半導體做好,`focusMachine` 已會把 root 的 process 提升渲染。**本計畫不動 engine**;若真要動 → 回報(§9)。
3. **起點更陽春。** 現況 8 個 part、每盤是單一 `box`、無 partOf、無 process、**也無 topic-level process**。幾何升級幅度比 semiconductor 大。

---

## Phase A — 研究供應鏈(整體,先做)

先把 AI 伺服器供應鏈搞懂,才知道要呈現哪些環節。

- [ ] `/research-supply-chain ai-server` → `docs/research/supply-chains/ai-server.md`。
- [ ] 涵蓋:整體鏈分層(GPU/加速器、CPU、HBM 記憶體、NVSwitch/NVLink、網路交換+光收發、電源、散熱、PCB/載板、機構/機櫃、代工/封測、系統 ODM)。
- [ ] 每環節:代表公司 + 代號 + 具體供應角色 + 市占(**準確性需人類查證,草稿標「需查證」**)。
- [ ] 標清楚**環節之間怎麼連**(電源、NVLink、網路 fabric、PCIe),供 Phase B 決互連。
- [ ] **停 → 人類看研究內容 + 校對公司**,再進 Phase B。

## Phase B — 設計 demo(整體取捨,先做)

依研究決定「整台 demo 長怎樣」——選哪些盤、形狀/大小、互動、物流/互連。

- [ ] `/design-demo ai-server` → `docs/specs/<NN>-topic-ai-server.md`(沿用 design-demo 產出格式)。
- [ ] **精選節點**:從研究挑出要在機櫃呈現的盤(GPU/CPU/NVSwitch/網路/電源…),定每盤在機櫃的位置。
- [ ] **形狀/大小**:套 `object-abstraction`,每盤從單方塊升級成 primitive 組合的方向(細節跟供應鏈意義走)。
- [ ] **互動**:拆解/名稱/股票/透視;機台頁 ↔ 整機導航。
- [ ] **物流/互連(關鍵決策)**:整機要不要 topic-level 互連流?
  - A. **互連 fabric**:電源層(電源盤→各盤)+ 資料層(GPU↔NVSwitch↔網路);分層、非閉合跑馬燈。**(預設傾向,呼應「把互動接起來」)**
  - B. 純爆炸看公司,不加整機流。
- [ ] **機台級流配方**:確認重用 `Part.process`+`scale`;訂每盤 in/out token 語意(資料/電源/熱)。
- [ ] **停 → 人類看 demo 設計 + 拍板互連方案**,再進 Phase C。

---

## Phase C — 逐盤迴圈(每盤 research→design→實作,跑完即停)

依 Phase B 選定的盤,**一次只做一盤**:

### 每盤的 checklist
- [ ] **Research machine** — `/research-machine <盤>` → `docs/research/machines/<slug>.md`(公司/代號標需查證)。
- [ ] **Design machine** — `/design-machine <slug>` → `docs/specs/<NN>-machine-<slug>.md`:
  - [ ] primitive 組合(別單一方塊);有供應鏈意義的部位都建出。
  - [ ] 機台內部 process:in/out token(資料/電源/熱)、站、machine-local 座標、scale ~0.4。
  - [ ] **互連契約**:這盤對外 in/out 與 Phase B 整機 fabric 對得起來。
  - [ ] 擋內部的殼標 `enclosure: true`。
- [ ] **實作** — `/add-component`:幾何 + partOf 命名 + 機台級 process,寫進 `content/ai-server.json`。companies 走 `companies.csv`。
- [ ] **驗證** — `/verify`:機台頁拆解/名稱/股票/透視可用;物料單向進出、過站心、到站停留、in/out 分色。
- [ ] **截圖 gate** → 讀回 PNG 對 spec 驗收 → **停,人類看過再做下一盤**。
- [ ] 更新 `.agent/log.md` 一段 ✅。

> 盤順序(Phase B 可調):GPU 運算盤(試金石)→ GPU#2(沿用)→ CPU 運算盤 → NVSwitch 交換盤 → 網路交換盤 → 電源盤。
> tray-gpu-01 / tray-gpu-02 同型 → 設計一次,#2 套同配方。
> 同一盤連續驗證失敗 ≥3 次 → 停下回報(§9)。

---

## Phase D — 整機互連 + 全機驗收

所有盤重做完後,回整機實作 Phase B 拍板的互連,確認爆炸看公司仍正常。

- [ ] **整機互連**(若選 A):新增 topic-level `process` —— 電源層(電源盤→各盤垂直 route)+ 資料層(GPU↔NVSwitch↔網路 route);token 分電源/封包材質;分層、非閉合跑馬燈。
- [ ] **互連契約對齊**:電源盤 output(DC)= 各盤電源 input;NVSwitch/網路 in/out 與 GPU/CPU 對得上。
- [ ] **爆炸/公司/導航**:點各盤→拆解→公司卡;名稱/股票/透視/重置;整機↔gallery 連結。
- [ ] **全綠**:`pnpm check` / typecheck / lint / build;多角度截圖無 pageerror。
- [ ] **Pattern harvest**:機櫃互連 fabric 若可跨題目重用 → 寫進 `topic-playbook.md`。
- [ ] **ADR**:整機互連方案若拍板 → 補一則 ADR。
- [ ] `/update-docs`:同步 README / CLAUDE / log;此計畫檔逐項勾完標 ✅。

---

## 進度追蹤

- [x] Phase A 研究供應鏈(docs/research/supply-chains/ai-server.md)— 待人類校對公司/代號
- [x] Phase B 設計 demo(docs/specs/17-topic-ai-server.md)— 待人類拍板 §7
- [x] Phase C-0 GPU 運算盤 `tray-gpu-01`(試金石)— 待人類確認
- [x] Phase C-1 GPU 運算盤 #2 `tray-gpu-02`(套 C-0 同配方)— 待人類確認
- [x] Phase C-2 CPU 運算盤 `tray-cpu`(spec 21)— 待人類確認
- [x] Phase C-3 NVSwitch 交換盤 `tray-nvswitch`(spec 22)— 待人類確認
- [x] Phase C-4 網路交換盤 `tray-network`(spec 23)— 待人類確認
- [x] Phase C-5 電源盤 `tray-power`(spec 24)— 待人類確認
- [x] Phase D 整機互連 + 全機驗收(rack-sys 節點 + 兩層 process + companies.csv + ADR-0017)— 待人類校對公司
