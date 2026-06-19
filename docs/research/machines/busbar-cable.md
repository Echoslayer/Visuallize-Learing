# 母線 / 電纜研究

> 由 `/research-machine busbar-cable` 產出，供 `/design-machine` 使用。
> 對應 `grid` 題目的 Phase C-2 連接設備。

## 1. 用途

母線 / 電纜位在 transformer 低壓側與 distribution / load 之間，負責承載大電流並把電力分配到下游設備。對 `grid` demo 而言，它接收 `stepped-ac`，經三相母線、絕緣支柱與電纜終端送出 `load-power`。

## 2. 真實外觀

母線常見為銅或鋁的扁條、實心棒、圓管或中空管，靠絕緣支柱支撐，可裝在 switchgear、panel board、busway 或變電站中。高壓/中壓電纜則包含 conductor、insulation、shield、jacket，端部需要 termination / joint 控制電場。

可視化重點:

- 三相導體要並排，不能畫成單線。
- 要有絕緣支撐柱，讓 busbar 看起來是被支撐的導體。
- 要有 cable termination / 出線端，表達從硬母線過渡到電纜。
- 這台是連接件，不是大型機櫃；外形應低矮、長向延伸。

## 3. 輸入 → 輸出

- **輸入**:`stepped-ac` 從 transformer 低壓側進入。
- **內部傳輸**:三相 busbar 承載大電流，經絕緣支柱支撐與分相。
- **輸出**:`load-power` 從 cable termination / busway 送往 distribution / load。
- **側向訊號**:第一版不做控制訊號;狀態量留給後續 control panel。

## 4. 關鍵子系統

| 部位 | 功能 | 是否有供應鏈意義 | primitive 提示 |
|---|---|---|---|
| busbar frame | 固定母線與絕緣支柱 | 是;金屬結構 | low `box` |
| phase busbars | 三相銅/鋁母線 | 是;銅/鋁/導體供應鏈 | long thin `box` + `repeat` |
| insulator posts | 支撐並隔離導體 | 是;絕緣材料 | `cylinder` + `repeat` |
| cable terminations | 電纜終端、應力控制 | 是;電纜附件 | vertical `cylinder` + `repeat` |
| cable bundle | 往下游出線 | 是;電纜供應鏈 | `tube` |
| ground bar | 接地/安全 | 有供應鏈意義低,但視覺/安全需要 | thin `box` |

## 5. 可套用 pattern

套用 `docs/machine-patterns.md` 的 **Piping Skid**，但不用閥:

- `busbar`:低矮框架 / annotation anchor。
- `busbar-bars`:三相平行導體。
- `busbar-insulators-a/b`:兩排絕緣支柱。
- `busbar-terminations`:三相 cable termination。
- `busbar-cable-*`:三條出線電纜。

機台頁內部 process 建議:

- `busbar-in`:從 transformer 側進入。
- `busbar-out`:往 distribution 側輸出。

## 6. 待查證

- 公司對應需人類查證:大亞、華新可掛 wire/cable;中鋼若只代表結構鋼或材料,是否掛 busbar 需校對。
- 第一版不拆銅、鋁、絕緣、屏蔽層;若後續做材料教學再細分。

## Sources

- [Busbar](https://en.wikipedia.org/wiki/Busbar) — busbar 形狀、材料、絕緣支撐與變電站用途。
- [High-voltage cable](https://en.wikipedia.org/wiki/High-voltage_cable) — 高壓電纜 conductor、insulation、shield、jacket 與 termination / joint 電場控制。
- [Substation](https://en.wikipedia.org/wiki/Substation) — 變電站常用 busbars 連接設備。
- [Allis Switchgear](https://www.allis.com.tw/en/product-c39454/Switchgear.html) — switchgear / GIS / control panel 產品背景。
