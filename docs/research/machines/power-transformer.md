# 電力變壓器研究

> 由 `/research-machine power-transformer` 產出，供 `/design-machine` 使用。
> 對應 `grid` 題目的 Phase C-0 試金石設備。

## 1. 用途

電力變壓器在重電/電網供應鏈中負責升壓或降壓。對 `grid` demo 而言,它是高壓 GIS/斷路器之後、母線/配電之前的轉換站:輸入 `high-voltage-ac`,在內部經鐵芯與繞組完成電磁耦合,輸出 `stepped-ac` 或低壓側電力。

## 2. 真實外觀

大型油浸式電力變壓器通常是厚重矩形油箱,頂部有高壓/低壓套管,側面有散熱片或外掛 radiator bank,上方或側邊有油枕(conservator),局部有分接開關箱、壓力釋放/油位/溫度監測裝置。若切開或開透視,內部重點是鐵芯、一次/二次繞組、絕緣與油冷通道。

可視化重點:

- 外形要像重電變壓器,不是一般箱子。
- 高低壓套管要分組,顯示電力進出兩側。
- 油箱要可 `enclosure:true` 透視,看見鐵芯與繞組。
- 散熱片/油枕/分接開關是辨識重點,不可省。

## 3. 輸入 → 輸出

- **輸入**:`high-voltage-ac` 從 GIS/斷路器側進入高壓套管。
- **內部轉換**:一次繞組產生磁通,鐵芯耦合到二次繞組;油與散熱器帶走熱。
- **輸出**:`stepped-ac` 從低壓套管/母線側輸出到 busbar / distribution。
- **側向訊號**:控制保護/SCADA 讀取油溫、油位、壓力、保護繼電器狀態;分接開關可能接受調壓命令。

## 4. 關鍵子系統

| 部位 | 功能 | 是否有供應鏈意義 | primitive 提示 |
|---|---|---|---|
| 油箱 tank | 容納鐵芯/繞組/絕緣油,提供外殼與保護 | 是;對應變壓器本體/鋼構/油箱製造 | 大 `box`,標 `enclosure:true` |
| 頂蓋 / 底座 | 封閉油箱、承載套管與內部件 | 是;結構件與維修介面 | 薄 `box` |
| 鐵芯 core | 低損耗磁路,通常由矽鋼片/電磁鋼片疊成 | 是;對應矽鋼片/鐵芯材料 | 中央 `box` 或三柱 `box` |
| 一次/二次繞組 windings | 銅/鋁導體繞組,完成電磁感應與電壓轉換 | 是;對應銅材、繞線、絕緣 | `cylinder` 直立繞組 2-3 組 |
| 絕緣油 / 絕緣紙 | 絕緣與冷卻 | 是;材料供應鏈 | 不單獨建透明液體;用油箱/冷卻流表意 |
| 高壓套管 HV bushings | 高壓導體穿出油箱且不對外殼放電 | 是;高壓絕緣件 | 高的 `cone/cylinder` + `repeat` 3 相 |
| 低壓套管 LV bushings | 低壓側接 busbar / cable | 是;輸出介面 | 較短 `cone/cylinder` + `repeat` 3 相 |
| 散熱器 radiator | 油冷散熱,大型變壓器側邊明顯特徵 | 是;冷卻/散熱供應鏈 | 薄 `box` + `repeat` |
| 油枕 conservator | 補償油體積膨脹,常在頂部或側上方 | 是;大型油浸式辨識特徵 | 水平 `cylinder` |
| 分接開關 tap changer | 調整匝比/電壓,OLTC 可帶載調壓 | 是;調壓與維護關鍵 | 側邊 `box` + 小 `cylinder` |
| 保護/監測附件 | 壓力釋放、油位、溫度、Buchholz relay 等 | 是,但 demo 可簡化 | 小 `box/cylinder`;若太擠可併入 tap changer |
| 接地/底座 | 安裝與接地 | 有供應鏈意義較低,但視覺/安全需要 | 低矮 `box`,可不掛公司 |

## 5. 可套用 pattern

套用 `docs/machine-patterns.md` 的 **Transformer** pattern,但要比現有 `grid.json` 更完整:

- `oil tank`:主體 `box`,標 `enclosure:true`。
- `bushings`:分成 HV/LV 兩組,用 `cone/cylinder` + `repeat`。
- `cooling fins`:側面散熱片 `box repeat`。
- `core`:內部三柱或中央鐵芯 `box`。
- 新增 `windings`, `conservator`, `tap changer`, `protection`。

機台頁內部 process 建議:

- `hv-in`:從 HV bushing 側進入。
- `core-station`:穿過鐵芯/繞組中心,停 0.6s。
- `lv-out`:從 LV bushing/busbar 側輸出。
- `signal-in`:控制保護側向進入 tap changer / relay,可選。

## 6. 待查證

- 實作時要做「三相三柱」還是更抽象的單一核心 + 雙繞組;三相較真實,但畫面可能擁擠。
- 是否把保護附件(Buchholz relay、壓力釋放閥、油位計)獨立成可點部位;第一版可合併。
- HV/LV 套管應放同側還是分前後/左右;為了 demo 電力流,建議 HV 左、LV 右。
- 公司對應需人類查證:華城/士電/亞力/中興電對主體,中鋼/大亞/華新對材料是否掛在子部位。

## Sources

- [Transformer - construction, bushings, cores, windings, cooling](https://en.wikipedia.org/wiki/Transformer) — 鐵芯、繞組、套管、油冷與大型變壓器構造背景。
- [Transformer types - liquid-cooled transformer](https://en.wikipedia.org/wiki/Transformer_types) — 大型油浸式變壓器、散熱器/油泵/風扇/油水冷卻。
- [Tap changer](https://en.wikipedia.org/wiki/Tap_changer) — 分接開關用途、NLTC/OLTC、帶載調壓概念。
- [Bushing (electrical)](https://en.wikipedia.org/wiki/Bushing_%28electrical%29) — 套管讓導體安全穿過變壓器外殼並控制電場。
- [亞力 Transformer](https://www.allis.com.tw/en/product-c39455/Transformer.html) — 油浸式、乾式、鑄樹脂、非晶質鐵芯等產品類型。
- [華城電機 Fortune Electric](https://www.fortune.com.tw/en/index.html) — 變壓器與工程/維修服務定位。
