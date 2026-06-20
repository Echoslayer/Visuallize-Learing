# 風力發電供應鏈重做計畫(supply chain → demo → 逐設備,checklist 迴圈)

> 目標:把 `wind` 題目(目前只有一台簡化風機)重做成可教學的風力發電供應鏈 demo。
> **先懂供應鏈、再定整體 demo 長相、最後才逐設備 research/design/實作**。
> 每個查核點跑完 checklist + 截圖,**停下給人類看再續**(ADR-0004 互動節奏)。
> 結構參考 [`ai-server-redo.md`](ai-server-redo.md),但風電不是機櫃/產線,重點是**風能 → 機械旋轉 → 電力 → 併網**。

正典在 [`CONTEXT.md`](../CONTEXT.md) / [`PLAN.md`](../PLAN.md);三段管線與慣例在 [`topic-playbook.md`](../topic-playbook.md)、[`../machines/README.md`](../research/machines/README.md)。本檔只列「這次重做」的步驟與 checklist。

## 管線總覽(順序不可跳)

```
Phase A  研究供應鏈   /research-supply-chain wind      → docs/research/supply-chains/wind.md
Phase B  設計 demo    /design-demo wind                → docs/specs/<NN>-topic-wind.md
Phase C  逐設備迴圈   每設備: /research-machine → /design-machine → /add-component → /verify → 停
Phase D  能量流接線   接 topic-level process + 全題驗收 + Pattern + /update-docs
```

> A、B 是**整體**(風電供應鏈全貌 + demo 取捨);C 才下到**單台設備/子系統**。
> 現有 `wind.json` 是早期 turbine close-up,可當起點,但不要被它限制。

## 與 AI Server 計畫不同處(先讀)

1. **這是能量轉換鏈,不是機櫃。** AI server 是盤與盤互連;風電是風經葉片/輪轂進入,在機艙內由主軸/齒輪箱/發電機/變流器轉成電,再經塔內電纜/升壓/海纜或陸纜併網。
2. **demo scope 需先拍板。** Phase B 必須決定:
   - A. **單台風機 close-up**:深做一台風機(葉片/輪轂/變槳/主軸/齒輪箱/發電機/變流器/塔架/基礎)。最小、最穩。
   - B. **風場到併網**:風機 + 海上/陸上基礎 + 陣列電纜 + 升壓站 + 電網接入。較完整。**預設傾向 B**,因為「風力發電供應鏈」不只葉片。
3. **流是抽象能量流。** topic-level `process` 可表 wind/mechanical/electrical/control,但 token 是抽象能量/訊號;不要畫成工件輸送帶。
4. **目前狀態很陽春。** `wind.json` 只有 tower/nacelle/hub/blades,仍有 legacy `explode.vector`;沒有供應鏈研究、沒有 topic process、沒有機台級 process。

---

## Phase A — 研究供應鏈(整體,先做)

先把風力發電供應鏈搞懂,再決定 demo 要呈現哪些設備。

- [ ] `/research-supply-chain wind` → `docs/research/supply-chains/wind.md`。
- [ ] 涵蓋:葉片材料/成型、輪轂/變槳、主軸/軸承、齒輪箱或直驅、發電機、功率變流器、控制/感測、塔架、基礎、電纜、升壓站、施工船/吊裝/O&M。
- [ ] 每環節:代表公司 + 代號 + 具體供應角色 + 市占/地位(**準確性需人類查證,草稿標「需查證」**)。
- [ ] 標清楚**能量如何流**:風 → 葉片捕能 → 主軸旋轉 → 發電 → 變流/升壓 → 電纜 → 併網;控制/變槳/偏航是訊號側,不要混成主電力流。
- [ ] **停 → 人類看研究內容 + 校對公司**,再進 Phase B。

## Phase B — 設計 demo(整體取捨,先做)

依研究決定「風電 demo 長怎樣」——選 close-up 還是風場到併網,再定設備、布局、互動、能量流。

- [ ] `/design-demo wind` → `docs/specs/<NN>-topic-wind.md`。
- [ ] **scope 拍板**:
  - [ ] A close-up:單台風機拆細。
  - [ ] B wind-farm:風機 + 基礎/塔架 + 電纜 + 升壓站 + 併網端。
- [ ] **精選節點**:從研究挑 5-7 個可教學節點,避免一次塞完整風場。
- [ ] **形狀/大小**:套 `object-abstraction`;每個設備是 primitive 組合,不是單方塊。葉片/塔架/機艙/基礎/電纜必須一眼可辨。
- [ ] **布局**:
  - close-up:單台 turbine 居中,機艙剖開/X-Ray 看 drivetrain,塔內電纜往下。
  - wind-farm:左側風機 → 右側升壓站/併網,電纜沿地面或海面連接。
- [ ] **能量流方案**:
  - topic-level `process` 表 wind → mechanical → electrical → grid;route 有箭頭,token 單向。
  - 控制/變槳/偏航若要表現,用 side route 或靜態 signal line;不冒充主電力。
- [ ] **機台級流配方**:確認是否重用 `Part.process`+`scale`;訂每設備 in/out token 語意(wind/mechanical/electrical/control/heat)。
- [ ] **停 → 人類看 demo 設計 + 拍板 scope/能量流**,再進 Phase C。

---

## Phase C — 逐設備迴圈(每設備 research→design→實作,跑完即停)

依 Phase B 選定設備,**一次只做一台/一個子系統**:

### 每設備 checklist

- [ ] **Research machine** — `/research-machine <設備>` → `docs/research/machines/<slug>.md`。
- [ ] **Design machine** — `/design-machine <slug>` → `docs/specs/<NN>-machine-<slug>.md`:
  - [ ] primitive 組合(別單一方塊);有供應鏈意義的部位都建出。
  - [ ] 機台/設備內部 process:in/out token(風/旋轉/電/控制),站點,local 座標,scale ~0.4。
  - [ ] **介面契約**:這台設備對外 in/out 與 Phase B topic-level 能量流對得起來。
  - [ ] 擋內部的殼標 `enclosure: true`(如機艙外殼、升壓站外殼)。
- [ ] **實作** — `/add-component`:幾何 + partOf 命名 + 機台級 process,寫進 `content/wind.json`。companies 走 `companies.csv`。
- [ ] **驗證** — `/verify`:機台頁拆解/名稱/股票/透視可用;能量 token 單向進出、過站心、到站停留、in/out 分色。
- [ ] **截圖 gate** → 讀回 PNG 對 spec 驗收 → **停,人類看過再做下一台**。
- [ ] 更新 `.agent/log.md` 一段 ✅。

> 建議設備順序(Phase B 可調):
> 1. Rotor / Blade System(試金石:葉片、輪轂、變槳機構)
> 2. Nacelle Drivetrain(主軸、齒輪箱/直驅、發電機、冷卻)
> 3. Tower / Foundation(塔架、法蘭、梯架/電纜、陸上或海上基礎)
> 4. Converter / Control(變流器、控制櫃、感測/偏航/變槳訊號)
> 5. Collection Cable / Substation(陣列電纜、升壓變壓器、開關設備)
> 6. Grid Connection / O&M(併網端或維運節點;若畫面太滿可併入 substation)
>
> 若 Phase B 選 close-up,則順序改為 turbine 子系統:葉片/輪轂 → drivetrain → generator/converter → tower/foundation → control/yaw/pitch。
> 同一設備連續驗證失敗 ≥3 次 → 停下回報(PLAN §9)。

---

## Phase D — 能量流接線 + 全題驗收

所有設備重做完後,回整體 topic 視圖接上 Phase B 拍板的能量流,確認爆炸看公司仍正常。

- [x] **topic-level process**:wind → rotor → nacelle/generator → converter/transformer → cable/substation → grid;token 分 wind/mechanical/electrical/control/heat;route 單向、不閉合。
- [x] **介面契約對齊**:上一設備 output = 下設備 input;mechanical→electrical 轉換發生在 generator/converter 節點。
- [x] **爆炸/公司/導航**:點各設備→拆解→公司卡;名稱/股票/透視/重置;整體↔gallery 連結。
- [x] **全綠**:`pnpm check` / typecheck / lint / build;多角度截圖無 pageerror。
- [x] **Pattern harvest**:若「energy conversion flow」可跨題目重用 → 寫進 `topic-playbook.md`。
- [x] `/update-docs`:同步 README / CLAUDE / log;此計畫檔逐項勾完標 ✅。

---

## 進度追蹤

- [x] Phase A 研究供應鏈(`docs/research/supply-chains/wind.md`) — 待人類校對公司/代號
- [x] Phase B 設計 demo(`docs/specs/27-topic-wind.md` + scope/能量流拍板)
- [x] Phase C-0 Rotor / Blade System 試金石 — 待人類確認
- [x] Phase C-1 Nacelle Drivetrain — 待人類確認
- [x] Phase C-2 Tower / Foundation — 待人類確認
- [x] Phase C-3 Converter / Control (已整合至 Phase C-1/C-0)
- [x] Phase C-4 Collection Cable / Substation — 待人類確認
- [x] Phase C-5 Grid Connection / O&M — 待人類確認
- [x] Phase D 能量流接線 + 全題驗收

