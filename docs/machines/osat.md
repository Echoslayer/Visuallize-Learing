# 封裝測試(OSAT)研究

> 由 `/research-machine osat` 產出，供 `/design-machine` 使用。
> 對應半導體供應鏈 `osat`(封裝測試)節點:把已加工晶圓切割、封裝、測試成可出貨的晶片。
> **公司/代號準確性需人類查證**(下方標「需查證」)。

## 1. 用途

OSAT(委外封裝測試)接晶圓代工的已加工晶圓,做晶圓測試 → 切割成晶粒 → 黏晶 → 打線/覆晶 → 封膠 → 植球 → 雷射標記 → 成品測試 → 出貨。先進封裝(CoWoS / InFO / 2.5D/3D / chiplet)把多顆晶粒/中介層整合,是近年瓶頸與亮點。輸出**封裝好且測試合格的晶片**給下游應用。

## 2. 真實外觀

兩段視覺語彙:**封裝段**(切割機、黏晶/打線機、封裝載板、封膠機)+ **測試段**(測試機 handler + 測試座 socket + 成品盤)。

可視化要讀得出「晶圓 → 切成晶粒 → 封進載板 → 測試 → 成品晶片」,不要只放一台黑箱。

## 3. 輸入 → 輸出

- **輸入**:已加工晶圓(來自晶圓代工)、封裝載板(ABF/leadframe)、打線金/銅線、封膠材料、錫球、測試設備。
- **中間物**:晶圓測試(CP)→ 切割晶粒 → 黏晶 → 打線/覆晶 bump → 封膠 → 植球(BGA)→ 標記 → 成品測試(FT)。
- **輸出**:封裝測試完成的晶片,送下游應用(模組/品牌/系統)。
- **供應鏈流向**:`processed-wafer`(已加工晶圓,藍/accent)流入 → 本節點 → `chip`(成品晶片,綠/chip)流向 `downstream`。**介面契約:input = foundry output 對應;output = downstream input。整線藍→綠變色點在此。**

## 4. 關鍵子系統

| 部位 | 功能 | 供應鏈意義 | primitive 提示 |
|---|---|---|---|
| 封裝 mainframe | 封裝產線本體 | 是;封裝廠 | `box` 機體 |
| 切割機 Dicing | 晶圓切成晶粒 | 是;singulation | `box` 鋸台 |
| 封裝載板 Substrate | 晶粒承載基板 | 是;ABF 載板(欣興/南電) | 扁 `box` |
| 打線臂 / 覆晶 Bonder | 晶粒對外連線 | 是;打線/覆晶 | 細 `cylinder` 臂 |
| 封膠 Molding | 包封保護 | 是 | `box` 壓模 |
| 測試機 Tester / handler | 成品電性測試 | 是;測試廠(京元電) | `box` 機體 |
| 測試座 Socket | DUT 對接 | 是 | 小 `box` repeat |
| 成品盤 Chip Tray | 成品晶片承載 | 是;最終可辨識產物 | 扁 `box` + chip 材質 |

## 5. 代表公司(需人類查證)

| 公司 | 代號 | 角色 | 備註 |
|---|---|---|---|
| 日月光投控 ASE | 3711 TW | 封裝測試(全球龍頭) | 需查證 |
| 力成 PTI | 6239 TW | 封裝測試/記憶體封測 | 需查證 |
| 京元電 KYEC | 2449 TW | 半導體測試 | 需查證 |
| 南茂 ChipMOS | 8150 TW | 封裝測試 | 需查證 |
| 頎邦 Chipbond | 6147 TW | 驅動 IC 封測(COF) | 需查證 |
| 精材 XinTec | 3374 TW | 晶圓級封裝 WLCSP | 需查證 |
| Amkor | AMKR US | 封裝測試 | 需查證 |
| 通富微電 / JCET | — CN | 封裝測試 | 需查證 |

> root id 仍為 `osat`,companies.csv 既有對應由人類查證版維持。

## 6. 機台級物料流(供 gallery 單機台)

- 入:`processed-wafer`(已加工晶圓,藍/accent)從左進。
- 站:`osat-pkg` 封裝測試(dwell 0.9s),錨在 mainframe。
- 出:`chip`(成品晶片,綠/chip)往 downstream 出。
- in 藍 / out 綠分色(整線變色點);單向。
