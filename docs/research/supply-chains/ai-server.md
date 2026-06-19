# AI 伺服器供應鏈研究

> 深度研究文件,供建/更新 3D 供應鏈模型用。代號以台股為主、已盡量查證(見 Sources);
> 事實/推測/待查證已分標。由 `/research-supply-chain ai-server` 產出(2026-06)。
> ⚠️ 公司↔環節對應與市占數字**準確性仍須人類最終查證**;代號已交叉比對。

## 0. TL;DR

- AI 伺服器是把**GPU/加速器 + HBM + CPU + NVLink 交換 + 網路 + 電源 + 液冷**整合進一個機櫃級系統(代表作 NVIDIA GB200 NVL72:72 顆 Blackwell GPU + 36 顆 Grace CPU,單櫃 ~120kW,像一台巨大加速器)。
- **真正的瓶頸在少數環節**:TSMC 的 **CoWoS 先進封裝**(被 NVIDIA 包走逾半產能,sold out 到 2026+)、**HBM**(SK Hynix 約 ~57–62% 市占、供 NVIDIA ~90% HBM)、**ABF 載板**。這三個是卡脖子點。
- **台灣是整機與「電力+散熱+載板+PCB+連接器」的結構性樞紐**:ODM 三雄(鴻海 2317 / 廣達 2382 / 緯創 3231)+ 緯穎 6669 幾乎包辦全球超大規模 AI 伺服器組裝;散熱(奇鋐 3017 / 雙鴻 3324)、電源(台達電 2308 / 光寶 2301)、載板(欣興 3037 / 南電 8046 / 景碩 3189)地位類比 TSMC 之於晶圓。
- 最該認識的幾家:**NVIDIA**(系統定義者)、**TSMC 2330**(製造+CoWoS)、**SK Hynix**(HBM)、**鴻海 2317 / 廣達 2382 / 緯穎 6669**(組裝)、**台達電 2308**(電源)、**奇鋐 3017**(液冷)。
- 趨勢:機櫃功率往 megawatt 走 → NVIDIA 推 **800V HVDC**,電源盤移出機櫃進電力櫃、液冷成標配;互連從光模組往 **CPO 共封裝光學** 演進。

## 1. 總覽

AI 伺服器供應鏈做的是:把最先進的運算晶片組裝成「能當一台超級加速器用」的機櫃系統,賣給雲端業者(CSP)蓋 AI 資料中心。最終產品不是單顆晶片,而是**整櫃**(rack-scale):運算盤(GPU/CPU)+ 交換盤(NVLink/網路)+ 電源盤 + 液冷,用高速銅纜/光纖把數十顆 GPU 連成一個記憶體共享的運算體。

台灣的定位極關鍵但**集中在「組裝 + 周邊基建」而非核心晶片**:GPU/HBM/交換 ASIC 由美韓主導,但沒有台灣的 ODM 組裝、ABF 載板、伺服器 PCB、高功率電源、液冷模組、高速連接器,這些系統根本出不了貨。2025 年 AI 伺服器讓鴻海/廣達/緯創營收同創新高(均破兆元台幣),緯穎更供應全球近半超大規模 AI 伺服器採購。

## 2. 產業地圖(上中下游)

價值與技術門檻集中在**上游核心晶片**(GPU/HBM/CoWoS,美韓台寡占)與**中游高階載板/PCB/連接**(台灣強);下游組裝量大但毛利相對薄(台灣 ODM 走量,近年因 AI 毛利改善)。

- **上游(核心晶片 + 製造)**:GPU/加速器設計(NVIDIA/AMD/自研 ASIC)、CPU(Grace/EPYC/Xeon)、HBM 記憶體(SK Hynix/Samsung/Micron)、晶圓代工 + CoWoS 先進封裝(TSMC,部分外溢 ASE/Amkor)。
- **中游(載板 / PCB / 互連 / 電源 / 散熱)**:ABF 載板(欣興/南電/景碩)、伺服器高速 PCB + CCL(金像電/健鼎/台光電)、高速連接器與銅纜(嘉澤/貿聯/Amphenol)、網路交換 ASIC + 光模組(Broadcom/Marvell + Innolight/Eoptolink)、電源(台達電/光寶)、液冷(奇鋐/雙鴻/Vertiv)。
- **下游(組裝 + 系統 + 雲端)**:ODM/系統整合(鴻海/廣達/緯創/緯穎/英業達/技嘉/Supermicro)、機構機櫃,最終交給 CSP(微軟/Google/AWS/Meta/xAI)與企業。

## 3. 環節(依流程順序)

### ① GPU / AI 加速器(運算核心)
- **定位**:整個系統的算力來源,也是成本與供給的主導者。
- **做什麼**:大規模平行運算(訓練/推論);Blackwell B200 由兩顆 die 以 10TB/s 連成一顆邏輯 GPU,封進 CoWoS-L 內含 192GB HBM3e。
- **輸入 → 輸出**:GPU die(TSMC 製)+ HBM stack + 矽中介層 → CoWoS 封裝 → GPU 模組/OAM。
- **關鍵設備/元件/材料**:先進製程晶圓、HBM、CoWoS、ABF 載板、供電 VRM。
- **技術門檻/護城河**:NVIDIA CUDA 軟體生態 + NVLink + 系統整合;競爭者只有 AMD(MI300/MI350)與自研 ASIC(Broadcom 助 Google TPU/Meta MTIA)。
- **台灣地位**:不設計 GPU,但**製造(TSMC)+ 封裝 + 載板 + 模組組裝全在台供應鏈**。
- **規模/關鍵數字**:NVIDIA 訂走 TSMC 2026 CoWoS 逾 50%(約 80–85 萬片晶圓)(待查證,數字隨報導浮動)。
- **瓶頸/卡脖子**:CoWoS 與 HBM 供給;先進製程產能。

### ② HBM 高頻寬記憶體
- **定位**:餵飽 GPU 的記憶體牆解方,AI 算力的硬限制之一。
- **做什麼**:DRAM die 以 TSV 垂直堆疊(HBM3e 8/12 層),貼在 GPU 旁的中介層上,提供 TB/s 級頻寬。
- **輸入 → 輸出**:DRAM die → TSV 堆疊 + base die → HBM stack → 交給 CoWoS。
- **關鍵設備/元件/材料**:TSV、thermal compression bonding、先進 DRAM 製程。
- **技術門檻/護城河**:良率與堆疊層數;只有三家做得出。
- **台灣地位**:HBM 本體缺席(美韓主導);但封裝/測試與載板沾邊。
- **規模/關鍵數字**:2025 市占約 SK Hynix ~57–62% / Micron ~21% / Samsung ~17–22%(Q2 vs Q3 有變動);SK Hynix 供 NVIDIA 約 90% HBM;HBM TAM 2025 ~$35B → 2028 估 ~$100B。
- **瓶頸/卡脖子**:產能與良率;NVIDIA 高度集中於 SK Hynix。

### ③ CPU(主機處理器)
- **定位**:系統協調與資料前處理;在 GPU 主導的系統裡是配角但必要。
- **做什麼**:跑 OS、排程、I/O、餵資料給 GPU;GB200 用 Grace(72 ARM 核、480GB LPDDR5X)以 NVLink-C2C 與 GPU 連接。
- **輸入 → 輸出**:CPU die(TSMC/Intel 製)→ 封裝 → CPU 模組/Superchip。
- **關鍵設備/元件/材料**:ABF 載板、DIMM/LPDDR、供電。
- **技術門檻/護城河**:指令集生態(x86 vs ARM);ARM 在 AI 主機 CPU 快速上升。
- **台灣地位**:CPU 設計缺席;製造(TSMC for Grace/部分 AMD)+ 載板 + 組裝在台。
- **規模/關鍵數字**:AMD 伺服器 x86 市占升破 30%+;ARM 預估 2029 佔自研 ASIC 伺服器主機 CPU 九成(推測,Tom's Hardware 引述報告)。
- **瓶頸/卡脖子**:相對不缺;先進製程排擠。

### ④ NVLink / NVSwitch 交換(GPU 間互連)
- **定位**:把數十顆 GPU 連成「一顆大 GPU」的東西向 fabric,是 rack-scale 的關鍵。
- **做什麼**:NVLink 5 提供每 GPU 1.8TB/s 雙向頻寬;NVL72 用 9 個 NVSwitch tray + 機櫃背板 5000+ 條銅纜(總長逾 2 哩)全互連 72 GPU。
- **輸入 → 輸出**:NVSwitch ASIC + 高速連接器 + 銅纜 → 交換盤 + 銅背板。
- **關鍵設備/元件/材料**:NVSwitch 晶片、224G PAM4 銅纜、高密度浮動連接器(Amphenol Paladin HD 224G)、銅背板。
- **技術門檻/護城河**:224Gbps 訊號完整性、連接器精度、背板佈線;NVIDIA 專有。
- **台灣地位**:連接器/銅纜/線束(嘉澤 3533、貿聯 3665)+ 背板 PCB + 交換盤組裝。
- **規模/關鍵數字**:NVL72 用 5184 條銅纜直連 72 GPU,單向 900GB/s/GPU。
- **瓶頸/卡脖子**:高速連接器與訊號完整性;NVIDIA 通常雙源(Amphenol + 備援)。

### ⑤ 網路交換 + 光收發(機櫃對外/南北向)
- **定位**:把機櫃連成叢集、連向資料中心網路(scale-out)。
- **做什麼**:交換 ASIC 路由封包;光模組做光電轉換(800G/1.6T);InfiniBand 或乙太網。
- **輸入 → 輸出**:交換 ASIC + 光收發模組 + DSP → 網路交換盤/交換器。
- **關鍵設備/元件/材料**:Broadcom Tomahawk / NVIDIA Spectrum-X/Quantum、800G 光模組、Broadcom/Marvell DSP、雷射。
- **技術門檻/護城河**:交換 ASIC(美商寡占)、光模組量產與雷射、CPO 共封裝光學。
- **台灣地位**:交換器系統(智邦 2345)、光模組部分台廠/中國廠(Innolight/Eoptolink 主導)、PCB。
- **規模/關鍵數字**:Innolight + Eoptolink 約佔全球 800G 模組 60%;Broadcom 2025 出貨逾 5 萬台 Tomahawk 5 CPO 交換器。
- **瓶頸/卡脖子**:DSP 晶片(Broadcom/Marvell)、雷射;光模組產能。

### ⑥ 電源(供電 / 配電)
- **定位**:把市電轉成 GPU 能用的低壓大電流;機櫃功率爆增使其成關鍵。
- **做什麼**:AC→DC 電源盤、DC-DC、銅排(busbar)配電、電池備援(BBU);NVIDIA 推 800V HVDC,電源移出機櫃進電力櫃。
- **輸入 → 輸出**:市電 AC → 電源盤(整流)→ DC busbar → 各運算盤。
- **關鍵設備/元件/材料**:AC-DC/DC-DC power shelf、busbar、BBU、固態變壓器。
- **技術門檻/護城河**:高效率(98%+)、高功率密度、HVDC 架構;台達數十年電源 R&D。
- **台灣地位**:**全球領先**——台達電 2308(電網到晶片全方案)、光寶 2301(BBU/高瓦數電源)。
- **規模/關鍵數字**:Delta 72kW AC-DC shelf(400–480Vac→800Vdc, 98%)、90kW DC-DC(800V→50V, 98.5%);機櫃往 megawatt 走。
- **瓶頸/卡脖子**:800V 轉換、散熱整合;銅排載流。

### ⑦ 散熱 / 液冷
- **定位**:120kW+ 機櫃無法氣冷,液冷成標配;台灣樞紐地位類比 TSMC。
- **做什麼**:冷板(cold plate)直接貼 GPU 帶走熱、機櫃 manifold 分配冷卻液、CDU 做液對液/液對氣熱交換、UQD/MQD 快接。
- **輸入 → 輸出**:GPU 廢熱 → 冷板 → manifold → CDU → 設施冷卻水。
- **關鍵設備/元件/材料**:冷板、manifold、CDU、UQD/MQD 快接、泵。
- **技術門檻/護城河**:熱阻、洩漏防護、可維護性;與 GPU/機構深度整合。
- **台灣地位**:**全球領先**——奇鋐 3017(冷板,GB300 近 50% 市占)、雙鴻 3324(冷板/CDU,切入美系 CSP 自研晶片鏈)、台達/Vertiv(CDU)。
- **規模/關鍵數字**:液冷滲透率 2025 估 ~24%(TrendForce);Delta 1.5MW 液對液 CDU(>100kW 機櫃)。
- **瓶頸/卡脖子**:快接洩漏、CDU 產能、整機熱設計。

### ⑧ ABF 載板 / 伺服器 PCB / 連接(中游基板)
- **定位**:承載晶片與高速訊號的「地基」,AI 推升至供不應求。
- **做什麼**:ABF 載板承載 GPU/CPU/ASIC、做晶片對外連線;伺服器主板/背板用高層數高速 PCB(低損耗 CCL);連接器/銅纜接訊號與電力。
- **輸入 → 輸出**:ABF 膜/CCL/玻纖布 → 載板 + PCB → 給模組/交換盤/背板。
- **關鍵設備/元件/材料**:Ajinomoto ABF 膜、低 CTE 玻纖布、低損耗 CCL(M8/M9)、高速連接器。
- **技術門檻/護城河**:層數/線寬、翹曲控制、低損耗材料;ABF 三雄寡占。
- **台灣地位**:**全球領先**——欣興 3037(全球最大 IC 載板,美系 GPU 載板估 30–40% 市占)、南電 8046、景碩 3189;PCB 金像電 2368/健鼎 3044;CCL 台光電 2383;連接器嘉澤 3533、線束貿聯 3665。
- **規模/關鍵數字**:ABF 三雄雙位數年增、產能滿載;低 CTE 玻纖布上游緊缺。
- **瓶頸/卡脖子**:ABF 膜(Ajinomoto 單一來源)、低 CTE 玻纖布、載板產能。

### ⑨ 系統組裝 / ODM(下游整機)
- **定位**:把所有盤整合成機櫃、測試、出貨給 CSP;台灣絕對主場。
- **做什麼**:L6/L10/L11 系統組裝、機櫃整合、整櫃測試與 burn-in、全球佈點交付。
- **輸入 → 輸出**:各運算/交換/電源盤 + 機構 + 液冷 → 整櫃 AI 伺服器 → CSP。
- **關鍵設備/元件/材料**:機構機櫃、背板、整櫃測試設備。
- **技術門檻/護城河**:整櫃整合複雜度(電/熱/訊號)、產能與良率、客戶綁定。
- **台灣地位**:**全球主導**——鴻海 2317、廣達 2382、緯創 3231、緯穎 6669、英業達 2356、技嘉 2376;美系 Supermicro。
- **規模/關鍵數字**:三大 ODM 2025 營收均破兆台幣;緯穎供全球近半超大規模 AI 伺服器採購;GB200/300 2025 出貨估 27–28k 櫃(待查證,隨報導調整)。
- **瓶頸/卡脖子**:上游晶片/CoWoS/HBM 供給;液冷與電源整合良率。

## 4. 流動與互動

AI 伺服器**不是單向產線,是機櫃內的互連 fabric**——這是和半導體輸送帶最大的差異:

- **製造/組裝流(上游→下游,單向)**:晶圓 →(CoWoS + HBM)→ GPU 模組 →(+CPU、載板、PCB)→ 各運算盤 →(+ 交換盤、電源盤、液冷)→ 整櫃組裝 → CSP。這是「供應鏈」敘事的主流動。
- **運轉互連(機櫃內,雙向/多向,不是跑馬燈)**:
  - **電源層(配電,單向發散)**:市電 → 電源盤 → DC busbar → 各運算/交換盤(電源盤是源頭,發散到全櫃)。
  - **資料層(東西向 fabric,雙向)**:GPU 運算盤 ↔ NVSwitch 交換盤 ↔ 其他 GPU 盤(NVLink 全互連);GPU/CPU ↔ 網路交換盤(南北向對外)。
  - **散熱層(熱回收循環)**:各盤廢熱 → 冷板 → manifold → CDU → 設施水(循環)。
- **側向注入**:設備/材料、ABF 載板、HBM、連接器/銅纜在「組裝流」中側向匯入各盤。
- 模型化重點:整機可分**兩層 process** —— 電源層(電源盤發散)+ 資料層(GPU↔NVSwitch↔網路);機台頁則各盤自己的 in/out(資料/電源/熱)。

## 5. 關鍵公司(台股為主)

| 環節 | 公司 | 代號 | 具體供應 | 地位 | 備註(市占/客戶/暴露) |
|---|---|---|---|---|---|
| GPU/加速器 | NVIDIA | NVDA US | Blackwell GPU、系統定義 | 絕對龍頭 | 訂走 TSMC CoWoS 逾半(待查證) |
| GPU/加速器 | AMD | AMD US | Instinct MI300/MI350 | 第二 | x86 伺服器市占升 |
| 自研 ASIC | Broadcom | AVGO US | 助 Google TPU/Meta ASIC、交換 ASIC | 最大 ASIC 夥伴 | 6 大 XPU 客戶 |
| CPU | Intel / AMD | INTC / AMD US | Xeon / EPYC 主機 CPU | x86 雙雄 | AMD 快速搶市 |
| HBM | SK Hynix | 000660 KS | HBM3e | 龍頭 ~57–62% | 供 NVIDIA ~90% HBM |
| HBM | Micron | MU US | HBM3e | ~21% | 美系 |
| HBM | Samsung | 005930 KS | HBM3e/HBM4 | ~17–22% | 回溫中 |
| 晶圓代工+CoWoS | 台積電 TSMC | 2330 TW | 製造 + CoWoS 先進封裝 | 絕對龍頭 | CoWoS sold out 到 2026+ |
| 晶圓代工 | 聯電 UMC | 2303 TW | 成熟/特殊製程 | 二線 | (待查證 AI 暴露) |
| 封測 | 日月光投控 ASE | 3711 TW | 封裝測試、CoWoS 外溢 | 龍頭 | 承接 TSMC 外包 |
| ABF 載板 | 欣興 Unimicron | 3037 TW | GPU/ASIC ABF 載板 | 全球最大 IC 載板 | 美系 GPU 載板 30–40% |
| ABF 載板 | 南電 Nan Ya PCB | 8046 TW | 高階 ABF 載板 | 三雄 | 最純 ABF |
| ABF 載板 | 景碩 Kinsus | 3189 TW | IC 載板 | 三雄 | 產能保留 AI |
| 伺服器 PCB | 金像電 GCE | 2368 TW | 伺服器主板/高速板 | 伺服器板龍頭 | |
| 伺服器 PCB | 健鼎 Tripod | 3044 TW | 高階 PCB | | |
| CCL 材料 | 台光電 EMC | 2383 TW | 低損耗 CCL(M8/M9) | CCL 龍頭 | AI 高速板材料 |
| 連接器 | 嘉澤 Lotes | 3533 TW | CPU/GPU socket、高速連接器 | 利基龍頭 | |
| 連接線束/銅纜 | 貿聯 BizLink | 3665 TW | 線束/銅纜 | | AI+機器人雙引擎 |
| 高速連接器/銅纜 | Amphenol | APH US | Paladin HD 224G、背板銅纜 | 龍頭 | NVL72 銅背板 |
| NVSwitch | NVIDIA | NVDA US | NVSwitch ASIC、NVLink | 專有 | 9 tray/NVL72 |
| 網路交換 ASIC | Broadcom / Marvell | AVGO / MRVL US | Tomahawk 交換 ASIC、DSP | 寡占 | |
| 網路交換系統 | 智邦 Accton | 2345 TW | 交換器系統 | 白牌交換龍頭 | |
| 光模組 | Innolight | 300308 SZ | 800G/1.6T 光模組 | 龍頭 | NVIDIA 800G 逾 50% |
| 光模組 | Eoptolink | 300502 SZ | 800G 光模組 | 第二 | 高淨利 |
| 電源 | 台達電 Delta | 2308 TW | AC-DC/DC-DC power shelf、busbar、HVDC、CDU | 全球領先 | 電網到晶片全方案 |
| 電源/BBU | 光寶 Lite-On | 2301 TW | 高瓦數電源、BBU | | 800V 架構受惠 |
| 液冷 | 奇鋐 AVC | 3017 TW | 冷板、CDU、散熱模組 | 冷板龍頭 | GB300 近 50% |
| 液冷 | 雙鴻 Auras | 3324 TW | 冷板、CDU、manifold、UQD | | 切美系 CSP 自研鏈 |
| 液冷/CDU | Vertiv | VRT US | CDU、機櫃熱管理 | 國際龍頭 | |
| 系統 ODM | 鴻海 Hon Hai | 2317 TW | 整櫃組裝 | 全球最大 | GB200 核心承接 |
| 系統 ODM | 廣達 Quanta | 2382 TW | 整櫃組裝 | 三雄 | 毛利率最優 |
| 系統 ODM | 緯創 Wistron | 3231 TW | 整櫃組裝 | 三雄 | |
| 系統 ODM | 緯穎 Wiwynn | 6669 TW | 雲端/超大規模 AI 伺服器 | 純度最高 | 供全球近半 hyperscale |
| 系統 ODM | 英業達 Inventec | 2356 TW | AI 伺服器組裝 | 電子五哥 | |
| 系統/板卡 | 技嘉 Gigabyte | 2376 TW | AI 伺服器/GPU 板卡 | | |

## 6. 競爭格局(國際 vs 本土)

- **核心晶片(GPU/HBM/交換 ASIC/CPU):國際主導**——NVIDIA/AMD(GPU)、SK Hynix/Samsung/Micron(HBM)、Broadcom/Marvell(交換+DSP)、Intel/AMD/ARM(CPU)。台灣在此**設計缺席**。
- **製造 + 先進封裝:台灣絕對主導**——TSMC 製造 + CoWoS,是整條鏈最深的護城河與最大瓶頸。
- **中游基建(載板/PCB/連接/電源/散熱):台灣全球領先**——ABF 三雄、電源(台達/光寶)、液冷(奇鋐/雙鴻)地位結構性不可替代。
- **下游組裝:台灣主導**——ODM 四雄 + 緯穎,美系僅 Supermicro 較突出;中國廠受地緣限制較難進北美 CSP。
- **被卡 vs 卡人**:台灣被上游 CoWoS/HBM/GPU 供給節奏牽制;但反過來,**沒有台灣的載板/電源/液冷/組裝,NVIDIA 也出不了整櫃**——互相卡。

## 7. 趨勢與風險

- **機櫃功率爆增 → 800V HVDC + 液冷標配**:電源盤移出機櫃進電力櫃、BBU 重要性升;氣冷退場。
- **互連往 CPO 共封裝光學**:降低光互連功耗;Broadcom Tomahawk CPO 量產。
- **HBM/CoWoS 為長期瓶頸**:HBM4、CoWoS 產能擴(TSMC 估 2026 底 ~12.7 萬片/月)仍可能供不應求到 2027。
- **自研 ASIC 崛起**:Google TPU、Meta MTIA、Amazon Trainium 分食 NVIDIA;Broadcom/Marvell 受惠;ARM 主機 CPU 上升。
- **地緣政治**:晶片出口管制、台海風險、ODM 往墨西哥/美國/東南亞分散產能(Foxconn 瓜達拉哈拉、Wiwynn/Inventec 墨西哥)。
- **資本支出循環**:CSP capex 是需求引擎,景氣反轉是最大下行風險。

## 8. 模型化建議(對應引擎 schema)

> ai-server 現況是「機櫃裡疊著數個單方塊盤」、無 partOf、無 process。本題目應呈現**機櫃**(不是輸送帶)。

- **整體布局**:直立**機櫃**(rack):背板 + 底座 + 由上而下疊運算盤/交換盤/電源盤;比照真實 1U 盤堆疊。
- **parts(每環節 = 一個盤,primitive 組合,別單方塊)**:
  - GPU 運算盤:PCB `box` + GPU 模組 `box`(repeat 2–8)+ HBM 小 `box`(貼 GPU 旁)+ 冷板 `box`(蓋在上)+ NVLink 連接器 `box`。
  - CPU 運算盤:PCB `box` + CPU socket `box` + DIMM 直立薄 `box`(repeat)+ 供電 VRM。
  - NVSwitch 交換盤:交換 ASIC `box` + 高密度連接器 `box`(repeat)+ 銅纜 `tube`/背板。
  - 網路交換盤:交換 ASIC `box` + 光模組 `box`(repeat,前面板)+ 埠口。
  - 電源盤:PSU brick `box`(repeat)+ busbar `box`/`cylinder` + BBU。
  - 機構:rack 背板 + 底座(`box`,enclosure 可透視)。
- **拆解節點**:每盤 = 一個 annotation 節點,掛 §5 對應公司(GPU 盤→NVIDIA/TSMC/SK Hynix/欣興/奇鋐…;電源盤→台達/光寶…)。
- **flow / process(機台級 + 整機兩層)**:
  - 機台級(gallery 單盤):各盤 in/out token —— GPU 盤(資料/NVLink in↔out、電源 in、熱 out)、電源盤(AC in→DC out)、網路盤(封包 in/out)。
  - 整機(topic-level):**兩層** —— 電源層(電源盤 → 各盤,單向發散)+ 資料層(GPU↔NVSwitch↔網路,雙向 fabric);**非閉合跑馬燈**。
- **形狀/視覺參考**:像一座**伺服器機櫃**——水平盤層層堆疊、前面板有埠口/把手、背後銅纜背板、頂/底電源與散熱;液冷管路。

## 9. 名詞表

- **HBM(High Bandwidth Memory)**:DRAM 垂直堆疊的高頻寬記憶體,貼 GPU 旁。
- **CoWoS(Chip-on-Wafer-on-Substrate)**:TSMC 把 GPU die + HBM 整合到矽中介層上的 2.5D 先進封裝;CoWoS-L 用局部矽互連。
- **NVLink / NVSwitch**:NVIDIA 的 GPU 間高速互連與交換晶片,把多 GPU 連成一顆。
- **ABF 載板**:用 Ajinomoto Build-up Film 做的高階 IC 載板,承載高階晶片。
- **CCL(Copper Clad Laminate)**:銅箔基板,PCB 的基材;AI 高速板需低損耗等級(M8/M9)。
- **CDU(Coolant Distribution Unit)**:冷卻液分配/熱交換單元,液冷核心。
- **UQD/MQD**:Universal/Multiple Quick Disconnect,液冷快接頭。
- **HVDC(High Voltage DC)**:高壓直流配電(NVIDIA 推 800V),提升供電效率。
- **BBU(Battery Backup Unit)**:電池備援單元。
- **CPO(Co-Packaged Optics)**:把光引擎與交換 ASIC 共封裝,降功耗。
- **OAM / UBB**:OCP 加速器模組 / 通用基板,業界 GPU 模組標準。
- **ODM**:委託設計製造(整機組裝廠)。
- **CSP(Cloud Service Provider)**:雲端服務商(微軟/Google/AWS/Meta…),最終買家。
- **NVL72**:NVIDIA GB200 NVL72,72 GPU 機櫃級系統。

## 10. 待查證 / 限制

- **市占/出貨數字會隨季度與報導變動**:HBM 市占(Q2 vs Q3 已不同)、CoWoS NVIDIA 佔比、GB200/300 出貨櫃數,均標「待查證」,人類引用前請以最新法說/TrendForce 為準。
- **公司↔盤對應是「代表性」歸類**:多數公司橫跨多環節(台達電兼電源+CDU;欣興兼 GPU/CPU/ASIC 載板);填 companies.csv 時須人工確認每個 part 掛哪幾家。
- **國際代號**:SK Hynix(000660 KS)、Samsung(005930 KS)、Innolight(300308 SZ)、Eoptolink(300502 SZ)等非台股,3D demo 是否納入由 design-demo 決定。
- **聯電 2303 的 AI 伺服器暴露**較間接(成熟製程),列入與否待設計取捨。
- 本研究為 2026-06 時點;AI 硬體迭代極快(GB300/Rubin),架構細節可能再變。

## Sources

綜述 / 整機架構:
- [NVIDIA GB200 NVL72 官方](https://www.nvidia.com/en-us/data-center/gb200-nvl72/) — 系統規格(72 GPU/36 CPU/NVLink5)。
- [NVIDIA GB200 Supply Chain (IntuitionLabs)](https://intuitionlabs.ai/articles/nvidia-gb200-supply-chain) — 全球供應鏈生態。
- [GB200 NVL72 PCB & System Architecture (NextPCB)](https://www.nextpcb.com/blog/nvidia-gb200-nvl72-architecture) — 系統/PCB 架構。
- [Taiwan ODMs record quarter (DigiTimes)](https://www.digitimes.com/news/a20260210PD205/taiwan-ai-server-odm-demand-supply-chain-2026.html) — 台廠 ODM 動能。
- [Foxconn/Wistron/Quanta trillion revenue (DigiTimes)](https://www.digitimes.com/news/a20260109PD249/revenue-ai-server-foxconn-wistron-quanta.html) — ODM 營收。

各環節:
- [SK hynix 62% HBM / Micron overtakes Samsung (Astute)](https://www.astutegroup.com/news/general/sk-hynix-holds-62-of-hbm-micron-overtakes-samsung-2026-battle-pivots-to-hbm4/) — HBM 市占。
- [Counterpoint Global DRAM/HBM share](https://counterpointresearch.com/en/insights/global-dram-and-hbm-market-share) — HBM 市占交叉比對。
- [TSMC CoWoS capacity / Nvidia booking (DigiTimes)](https://www.digitimes.com/news/a20251210PD218/tsmc-cowos-capacity-nvidia-equipment.html) — CoWoS 產能與 NVIDIA 佔比。
- [Innolight/Eoptolink 60% 800G (ip-fiber)](https://ip-fiber.com/blogs/news/nvidia-orders-surge-innolight-and-eoptolink-dominate-60-of-800g-sfp-optical-modules-supply) — 光模組市占。
- [Delta HVDC/power shelf (PRNewswire GTC)](https://www.prnewswire.com/news-releases/delta-unveils-next-generation-power-and-cooling-solutions-for-ai-data-centers-at-nvidia-gtc-2025-302406157.html) — 電源規格。
- [NVIDIA 800V HVDC architecture (NVIDIA blog)](https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/) — HVDC 架構。
- [Liquid cooling favors Taiwan (TrendForce)](https://www.trendforce.com/news/2024/10/17/news-liquid-cooling-set-for-a-new-era-in-2025-with-penetration-projected-to-reach-24-favoring-taiwanese-supply-chain/) — 液冷滲透率/台廠。
- [Taiwan power & cooling boom (Substack)](https://richard367.substack.com/p/taiwans-ai-power-and-cooling-infrastructure) — 奇鋐/雙鴻/台達定位。
- [Taiwan ABF substrate leaders (DigiTimes)](https://www.digitimes.com/news/a20250422PD220/demand-taiwan-2025-substrate-revenue.html) — 欣興/南電/景碩。
- [GB200 copper cable interconnect (FiberMall)](https://www.fibermall.com/blog/nvidia-gb200-interconnect-architecture.htm) — NVLink 銅纜/連接器。
- [Custom AI ASIC state of play (Tom's Hardware)](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia) — 自研 ASIC/Broadcom。
- [CPUs for AI infrastructure (Introl)](https://introl.com/blog/cpus-for-ai-infrastructure-epyc-xeon-grace-server-processors-2025) — CPU(Grace/EPYC/Xeon)。

公司 / 代號(台股交叉比對):
- [AI 伺服器概念股(MY-Learning 理財通)](https://my-finance.com.tw/tw/News_detail/2291/) — ODM/散熱/電源代號。
- [散熱概念股(MY-Learning)](https://www.my-finance.com.tw/tw/News_detail/2234/) — 奇鋐/雙鴻。
- [ABF 載板四雄(今周刊)](https://www.businesstoday.com.tw/article/category/183008/post/202604210006/) — 欣興/南電/景碩/臻鼎代號。
- [貿聯-KY 3665 (口袋學堂)](https://www.pocket.tw/school/report/SCHOOL/7219/) — 貿聯定位/代號。
