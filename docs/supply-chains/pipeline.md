# 製程管線供應鏈研究

> Phase A 研究文件,供建/更新 `pipeline` 3D demo 用。公司與代號已先查公開資料,但供應角色與台廠對應仍需人類查證。
> 由 `/research-supply-chain pipeline` 產出。

## 0. TL;DR

- 製程管線不是「管子而已」,而是儲槽、泵、管線/法蘭、閥件、換熱/反應、過濾/分離、儀控與工程整合串起來的流體處理系統。
- demo 最適合做成 compact skid:左進右出,把主流體、旁通、儀控訊號分開,比畫整座工廠更清楚。
- 國際大廠主導核心流體設備與儀控:Flowserve、Emerson、Xylem、Alfa Laval、Parker、Danaher/Pall、Siemens、Yokogawa。
- 台灣較適合放在工程整合、不鏽鋼/管材、現場施工與特定設備供應;精確公司對應需再校。

## 1. 總覽

製程管線把液體、氣體或漿料從上游儲存端送到處理設備,再輸出成半成品或成品。它常出現在化工、食品飲料、製藥、水處理、半導體濕製程、能源與一般工業現場。可教學的重點是「流體沿管線經過不同設備,狀態被改變」:壓力由泵提升,溫度由換熱器改變,雜質由過濾器去除,流量與安全由閥件和儀控維持。

## 2. 產業地圖

- **上游材料/元件**:不鏽鋼/碳鋼管、管件、法蘭、墊片、密封件、儀表感測器、馬達、軸封、濾材。
- **核心設備**:儲槽、壓力容器、泵、閥件、換熱器、反應器、過濾器、分離器、控制盤。
- **系統整合**:PFD/P&ID 設計、skid 組裝、焊接/試壓、控制邏輯、現場安裝與試車。
- **下游應用**:化工、食品飲料、製藥、半導體化學品/純水、石化、能源、水處理。

## 3. 環節(依流程順序)

### ① 儲存 / 進料槽

- **定位**:穩定進料來源,隔離上游波動。
- **做什麼**:儲槽保存原料或中間液,搭配液位計、呼吸閥、排放口與人孔;高潔淨或腐蝕性流體會要求材質、內襯與清洗設計。
- **輸入 → 輸出**:原料/公用流體 → 穩定供料。
- **關鍵設備/元件/材料**:槽體、液位計、攪拌器、進出口 nozzle、排氣/泄壓、支架。
- **技術門檻 / 護城河**:材質相容、焊接品質、壓力/真空設計、法規與現場驗收。
- **台灣地位**:本土工程與壓力容器/槽體廠可供應,但 demo 公司對應需查證。
- **瓶頸 / 卡脖子**:大型槽體運輸、材質交期、現場焊接與檢驗。

### ② 泵 / 加壓 skid

- **定位**:提供壓頭,讓流體克服管線阻力並進入下游設備。
- **做什麼**:離心泵適合連續大流量,容積泵適合高黏度或精準計量;泵組通常包含馬達、聯軸器、底座、軸封、進出口閥與儀表。
- **輸入 → 輸出**:低壓流體 → 加壓流體。
- **關鍵設備/元件/材料**:泵體、葉輪/轉子、馬達、機械密封、底座、旁通/回流管。
- **技術門檻 / 護城河**:效率、汽蝕控制、密封可靠度、腐蝕/磨耗材質、現場維修網。
- **台灣地位**:本土可做一般泵與系統組裝;高階流程泵多見國際品牌。
- **瓶頸 / 卡脖子**:密封件、特殊合金、交期與售後服務。

### ③ 管線 / 法蘭 / 閥件

- **定位**:把設備接起來,同時控制隔離、旁通、止回與安全釋放。
- **做什麼**:管線負責承壓與導流;法蘭/接頭讓設備可維修;閥件負責開關、調節、止回、泄壓與安全保護。
- **輸入 → 輸出**:加壓流體 → 可被分流/隔離/調節的流體。
- **關鍵設備/元件/材料**:管材、彎頭、三通、法蘭、墊片、球閥、蝶閥、控制閥、安全閥。
- **技術門檻 / 護城河**:壓力等級、泄漏等級、材料相容、焊接與試壓、閥門可靠度。
- **台灣地位**:不鏽鋼管材、鋼材、現場配管有本土供應;高階控制閥/安全閥多由國際品牌主導。
- **瓶頸 / 卡脖子**:特殊材質、認證閥件、施工品質。

### ④ 換熱 / 反應 / 處理設備

- **定位**:真正改變流體狀態,例如升溫、降溫、反應或混合。
- **做什麼**:換熱器用熱媒/冷媒交換熱量;反應器或混合器讓物料停留並反應;工藝條件通常由溫度、壓力與停留時間決定。
- **輸入 → 輸出**:加壓原料 → 已加熱/冷卻/反應中的流體。
- **關鍵設備/元件/材料**:板式/殼管式換熱器、反應筒、夾套、攪拌器、溫壓感測器。
- **技術門檻 / 護城河**:傳熱效率、結垢控制、耐腐蝕、清洗性、壓力容器規範。
- **台灣地位**:工程整合與部分設備製造可在地化;高效率換熱器與特殊材料設備仍常見國際供應商。
- **瓶頸 / 卡脖子**:特殊合金板片、密封墊、熱設計經驗。

### ⑤ 過濾 / 分離

- **定位**:去除顆粒、液滴或不需要的相,讓下游品質穩定。
- **做什麼**:濾芯/濾袋去除顆粒;分離器靠重力、旋流、膜或離心分離不同相;高潔淨製程重視壓降、截留率與相容性。
- **輸入 → 輸出**:處理中流體 → 過濾/分離後產品流。
- **關鍵設備/元件/材料**:濾殼、濾芯、濾袋、旋流器、膜、差壓計。
- **技術門檻 / 護城河**:濾材配方、可靠供應、驗證文件、污染控制。
- **台灣地位**:可做一般水處理/濾材/系統組裝;生命科學與高階製程濾材多由國際品牌主導。
- **瓶頸 / 卡脖子**:耗材供應、驗證周期、進口品牌依賴。

### ⑥ 儀控 / 自動化 / 安全

- **定位**:讓製程可監測、可控制、可安全停機。
- **做什麼**:流量、壓力、溫度、液位、分析儀表回傳數據;DCS/PLC 控制閥與馬達;SIS/聯鎖在異常時停機或泄壓。
- **輸入 → 輸出**:現場訊號 → 控制命令/告警/資料紀錄。
- **關鍵設備/元件/材料**:感測器、變送器、控制閥定位器、PLC/DCS、控制盤、HMI。
- **技術門檻 / 護城河**:長期可靠度、防爆/安全認證、控制邏輯、資安、維護生態。
- **台灣地位**:系統整合與控制盤可在地做;高階 DCS/儀表品牌以國際大廠為主。
- **瓶頸 / 卡脖子**:認證、軟體授權、資安與老舊系統整合。

### ⑦ EPC / skid 整合

- **定位**:把單機設備變成可交付、可維修、可試車的工程系統。
- **做什麼**:依 PFD/P&ID 設計設備、管線與儀表;在工廠預組 skid,完成焊接、壓測、配線、FAT,再到現場安裝試車。
- **輸入 → 輸出**:設備/材料/圖面 → 可運轉製程模組。
- **關鍵設備/元件/材料**:鋼構底座、管線、閥件、儀表、控制盤、文件包。
- **技術門檻 / 護城河**:跨專業整合、施工品質、專案管理、安規文件與客戶驗收。
- **台灣地位**:CTCI 等工程公司有 EPC 經驗;本土現場施工與模組化能力需依案場查證。
- **瓶頸 / 卡脖子**:人力、焊工/檢驗排程、跨國供應交期。

## 4. 流動與互動

主流是**流體製程流**:

`進料槽` → `泵 skid` → `閥組 / 管線` → `換熱器或反應器` → `過濾 / 分離` → `產品槽`

側向流:

- `儀控 / 控制盤` 讀取流量、壓力、溫度、液位,再控制泵與控制閥。
- `旁通 / 回流` 可從泵後回到進料槽或繞過處理設備,但 demo 先保留為短 side route。
- `公用系統` 如冷卻水、蒸汽、氮氣、CIP 清洗可作背景管線,不當主線。

demo 應用 topic-level `process` 表主流體單向穿過設備,token 到泵站後改成 `pressurized-fluid`,到換熱/反應後改成 `treated-fluid`,過濾後改成 `product-fluid`。儀控訊號用細線 side route,不要和主流體混在一起。

## 5. 關鍵公司(台股為主,需人類查證)

| 環節 | 公司 | 代號 | 具體供應 | 地位 | 備註 |
|---|---|---|---|---|---|
| 泵 / 閥 / 密封 | Flowserve | FLS | 工業泵、閥、機械密封、服務 | 國際流體控制大廠 | 對應泵 skid / valve 節點 |
| 泵 / 水處理系統 | Xylem | XYL | 泵、packaged pump systems、過濾/水處理產品 | 水與流體系統大廠 | 適合水處理/一般工業版本 |
| 閥件 / 儀表 / DCS | Emerson | EMR | Fisher 控制閥、Rosemount 儀表、DeltaV DCS | 國際自動化大廠 | 可掛 valve / instrumentation |
| 換熱 / 分離 | Alfa Laval | ALFA.ST | 換熱器、分離器、泵閥與衛生級流體處理 | 熱交換與分離強項 | 適合 heat-exchanger / separator |
| 過濾 / 流體控制 | Parker Hannifin | PH | 過濾、流體與氣體處理、密封/接頭 | motion & control 大廠 | 可掛 filtration / fittings |
| 高階過濾 | Danaher / Pall | DHR | Pall 濾材、生命科學與工業過濾 | 高階過濾品牌 | Pall 屬 Danaher |
| DCS / 控制 | Siemens | SIE.DE | SIMATIC PCS 7 / PCS neo、DCS 硬體 | 國際自動化大廠 | 可掛 control-panel |
| 儀控 / 分析 | Yokogawa | 6841.T | DCS、現場儀表、油氣/化工/水處理解決方案 | 日本儀控大廠 | pipeline / chemical / water 應用 |
| EPC / 工程整合 | 中鼎 | 9933.TW | 工程、採購、施工、試車整合 | 台灣 EPC 代表 | 對應 skid integration,需校對 |
| 不鏽鋼/管材 | 華新 | 1605.TW | 不鏽鋼、線纜/材料 | 上游材料 | 是否掛 pipeline 材料需校對 |
| 不鏽鋼管 | 彰源 | 2030.TW | 不鏽鋼管材 | 管材供應 | 代號/供應範圍需校對 |

## 6. 競爭格局

- **國際主導**:流程泵、控制閥、高階濾材、DCS/儀表、板式換熱器多由歐美日品牌主導,靠產品可靠度、認證、售後與 installed base。
- **本土角色**:台灣較適合放在工程整合、現場施工、控制盤、不鏽鋼/管材與客製設備。若題目要偏半導體化學品/純水,本土供應鏈還需要另查。
- **中國/亞洲供應**:一般閥件、管件、槽體與低階設備競爭激烈;高階案場仍會要求品牌、認證與實績。
- **護城河**:不是單一零件,而是「可靠 + 可維修 + 有文件 + 符合法規 + 交期可控」。

## 7. 趨勢與風險

- **模組化 skid**:工廠預組與 FAT 減少現場工期,適合 demo 呈現。
- **數位化 / asset performance**:感測器、DCS、SCADA 與 predictive maintenance 讓儀控節點更重要。
- **潔淨與驗證**:食品、製藥、半導體要求材質、清洗、文件與污染控制,濾材和儀表價值提高。
- **能源與水處理需求**:水資源、廢水、氫能、碳捕捉等應用增加流體處理設備需求。
- **風險**:特殊合金、認證閥件、濾材、DCS 軟體與現場人力都可能拉長交期。

## 8. 模型化建議(對應引擎 schema)

- **整體布局**:採 compact process skid。左側進料槽,中央泵/閥組/處理設備,右側產品槽,後側控制盤;主流體左→右。
- **parts**:
  - FEED_TANK:直立 cylinder + 液位窗 + nozzle + 支架。
  - PUMP_SKID:底座 box + 泵體 cylinder/cone + 馬達 box/cylinder + 聯軸器 + 旁通管。
  - VALVE_MANIFOLD:tube path + 法蘭薄 cylinder + 球閥/控制閥小 cylinder + 手輪。
  - HEAT_EXCHANGER_REACTOR:殼管或板式換熱器,用 enclosure 看內部管束/板片。
  - FILTER_SEPARATOR:直立濾筒 enclosure + 濾芯 + 差壓計。
  - CONTROL_PANEL:box 控制櫃 + 小燈/螢幕 + signal route。
- **拆解節點**:每台設備是 annotation 節點;管件/法蘭/儀表小件用 `partOf`。
- **process**:topic-level route 表主流體;每設備 machine-local process 表 in/out 與狀態變化。
- **視覺參考**:P&ID 的設備序列轉成 3D skid,保留管線穿過設備中心、旁通與控制訊號。

## 9. 名詞表

- **PFD**:Process Flow Diagram,製程流程圖,描述主要設備與物流。
- **P&ID**:Piping and Instrumentation Diagram,管線與儀表圖,描述設備、管線、閥件、儀表與控制連接。
- **Skid**:把設備、管線、儀表裝在同一鋼構底座上的預組模組。
- **Nozzle**:槽體或設備上的管口。
- **Flange / 法蘭**:可拆式管線接頭,用螺栓和墊片密封。
- **Mechanical seal / 機械密封**:泵軸與泵殼間的防漏密封。
- **DCS**:Distributed Control System,分散式控制系統。
- **SIS**:Safety Instrumented System,安全儀控系統。
- **FAT**:Factory Acceptance Test,出廠前驗收測試。
- **CIP**:Clean-in-place,就地清洗。

## 10. 待查證 / 限制

- 台股公司對應只到「可能角色」層級;進 `companies.csv` 前需人工校對。
- 製程管線可代表化工、食品、製藥、水處理或半導體濕製程;Phase B 必須選一種語境,否則公司與外觀會發散。
- 市占與營收暴露未硬填,避免把未確認數字寫死。
- Flowserve/Alfa Laval/Parker/Danaher 等來源有部分取自公開百科或公司產品頁,重要投資級資訊需再查年報。

## Sources

- [Piping and instrumentation diagram](https://en.wikipedia.org/wiki/Piping_and_instrumentation_diagram) — P&ID 會列設備、管線、閥件、儀表與控制,作為 demo 節點拆分依據。
- [Process flow diagram](https://en.wikipedia.org/wiki/Process_flow_diagram) — PFD 描述主要設備與物流,作為 topic-level process 依據。
- [Emerson control valves / automation products](https://www.emerson.com/en-us/automation/valves/controlvalves) — 控制閥、DCS、SCADA、儀表產品分類。
- [Siemens Process Control](https://www.siemens.com/en-us/products/process-control/) — SIMATIC PCS 7 / PCS neo 與 DCS 定位。
- [Yokogawa Products & Services](https://www.yokogawa.com/solutions/products-and-services/) — 油氣、化工、水處理、pipeline 等 process industries 與儀控解決方案。
- [Xylem pumps & packaged pump systems](https://www.xylem.com/en-us/products--services/pumps-packaged-pump-systems/) — 泵、packaged pump systems、filtration、heat exchangers、pipe fittings 等產品分類。
- [Flowserve overview](https://en.wikipedia.org/wiki/Flowserve) — 泵、閥、密封與 flow control 產品背景。
- [Alfa Laval overview](https://en.wikipedia.org/wiki/Alfa_Laval) — 換熱、分離、輸送與衛生級流體設備背景。
- [Parker Hannifin overview](https://en.wikipedia.org/wiki/Parker_Hannifin) — motion/control、filtration、fluid/gas handling、process control 背景。
- [Danaher overview](https://en.wikipedia.org/wiki/Danaher_Corporation) — Pall 併入 Danaher 與生命科學/過濾相關背景。
