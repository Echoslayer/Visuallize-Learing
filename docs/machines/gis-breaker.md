# GIS / 斷路器研究

> 由 `/research-machine gis-breaker` 產出，供 `/design-machine` 使用。
> 對應 `grid` 題目的 Phase C-1 高壓開關保護設備。

## 1. 用途

GIS / GCB 位在高壓進線與變壓器之間，負責保護、切換、隔離與故障電流切斷。對 `grid` demo 而言，它接收 `high-voltage-ac`，在斷路器/隔離開關腔內完成保護與切換，再把仍屬高壓側的電力送往 transformer。

## 2. 真實外觀

高壓 GIS 常見特徵是密封金屬氣體槽、三相母線筒、斷路器腔、隔離/接地開關、操作機構箱、套管或 GIL/電纜終端。外形比變壓器更像橫向金屬管線與控制箱的組合，不應畫成普通機櫃。

可視化重點:

- 主體是密封 GIS tank / bus duct，可 `enclosure:true`。
- 三相母線或相筒要用 repeat 表示。
- 斷路器腔、隔離/接地開關、操作機構箱要可辨認。
- 高壓進出方向要明確:左進、右往 transformer。

## 3. 輸入 → 輸出

- **輸入**:`high-voltage-ac` 從高壓進線/套管側進入。
- **內部動作**:斷路器根據保護命令切斷故障電流;隔離/接地開關提供維修安全隔離。
- **輸出**:`protected-high-voltage-ac` 送往 transformer 高壓側。
- **側向訊號**:control/protection panel 讀取 breaker 狀態並送出 trip/close command。

## 4. 關鍵子系統

| 部位 | 功能 | 是否有供應鏈意義 | primitive 提示 |
|---|---|---|---|
| GIS tank | 密封 SF6/絕緣氣體外殼與接地金屬槽 | 是;主體製造 | `box` 或大 `cylinder`, `enclosure:true` |
| phase bus ducts | 三相母線/導體腔 | 是;GIS/GIL 結構 | horizontal `cylinder` + `repeat` |
| circuit breaker chamber | 斷路器滅弧/開斷模組 | 是;GCB 核心 | `cylinder` 或 box chamber |
| disconnector / earthing switch | 隔離與接地維修安全 | 是;開關機構 | small `box` / `cylinder` |
| operating mechanism | 彈簧/馬達操作機構箱 | 是;控制執行 | side `box`, material `chip` |
| bushings / terminals | 對外高壓進出線 | 是;高壓絕緣介面 | `cone`/`cylinder` repeat |
| sensors / gas monitor | 氣壓、狀態、局放監測 | 是但第一版可簡化 | small `box` |
| base frame | 安裝底座 | 視覺需要 | low `box` |

## 5. 可套用 pattern

套用 `docs/plan/machine-patterns.md` 的 **Piping Skid** 與 **Process Tool** 混合:

- `gis`:密封金屬 tank / anchor。
- `gis-phase-tubes`:三相水平圓筒,表示 GIS/GIL 導體腔。
- `gis-breaker-chamber`:斷路器腔,作為 station。
- `gis-disconnector`、`gis-earthing-switch`:小型開關機構。
- `gis-drive`:操作機構箱。
- `gis-bushings-in/out`:進出線套管。

機台頁內部 process 建議:

- `gis-hv-in`:高壓從左側進入 breaker station。
- `gis-hv-out`:受保護高壓往右輸出。
- `gis-signal-in`:控制保護訊號從後側進入 drive / breaker。

## 6. 待查證

- 第一版只做 GIS/GCB，不區分完整 bay 內所有 CT/PT、避雷器與保護盤。
- 公司對應需人類查證:中興電可掛 GIS/GCB;亞力、士電是否掛 switchgear / 高低壓開關需人類校對。

## Sources

- [中興電工供配電產品](https://www.chem.com.tw/tc/products_info.aspx?Class1=1&Class2=1157) — GIS/GCB/GIL/GCS 產品與台電相關資歷。
- [Allis Switchgear](https://www.allis.com.tw/en/product-c39454/Switchgear.html) — high/low-voltage switchgear、GIS、control panels。
- [Switchgear](https://en.wikipedia.org/wiki/Switchgear) — switchgear 用於控制、保護、隔離電力設備。
- [High-voltage switchgear](https://en.wikipedia.org/wiki/High-voltage_switchgear) — disconnectors、earthing switches、circuit breakers 等功能。
