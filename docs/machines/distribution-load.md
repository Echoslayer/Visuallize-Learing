# 配電 / 用電端研究

> 由 `/research-machine distribution-load` 產出，供 `/design-machine` 使用。
> 對應 `grid` 題目的 Phase C-4 下游配電與負載設備。

## 1. 用途

配電 / 用電端位在 busbar / cable 之後，負責把 `load-power` 分配到多個下游回路。對 `grid` demo 而言，它是電力鏈的終端:接收 transformer 降壓後的電力，經主開關、分路斷路器、端子與出線送到 load rack。

## 2. 真實外觀

distribution board / panelboard 通常是金屬箱體，內有 busbar、主開關或 main breaker、多個分路 breakers、端子排、接地/中性排與出線。工業配電盤可能是直立 switchboard / motor control center，有抽屜式開關、表計與負載出線。

可視化重點:

- 直立配電櫃或 switchboard。
- Breaker modules 要成排，不能只是一塊箱子。
- 要有 meter / status screen 表示配電監測。
- 要有 outgoing terminals / cables 連到簡化 load rack。

## 3. 輸入 → 輸出

- **輸入**:`load-power` 從 busbar / cable 進入配電盤。
- **內部分配**:主斷路器與分路 breakers 將電力分配到多個 feeder。
- **輸出**:`served-load` 往 load rack / 用電端。
- **側向訊號**:狀態可回 control panel,但第一版只做主電力 in/out。

## 4. 關鍵子系統

| 部位 | 功能 | 是否有供應鏈意義 | primitive 提示 |
|---|---|---|---|
| distribution cabinet | 配電盤箱體與面板 | 是;配電盤/系統整合 | tall `box` |
| main breaker | 主開關 / 主斷路器 | 是;保護與隔離 | large `box` |
| branch breakers | 多個分路 breakers | 是;下游回路分配 | small `box` + `repeat` |
| meter / HMI | 電表、狀態、監控 | 是;配電監測 | thin `box` |
| outgoing terminals | 出線端子 | 是;接線介面 | small `cylinder` / `box` + `repeat` |
| load rack | 用電負載代表 | 是;終端負載 | rack-like stacked `box` |
| feeder cables | 到負載的出線 | 是;電纜 | `tube` |

## 5. 可套用 pattern

套用 `docs/plan/machine-patterns.md` 的 **Rack** pattern:

- `distribution`:主配電櫃 / annotation anchor。
- `distribution-main-breaker`:主斷路器。
- `distribution-breakers-left/right`:分路 breaker columns。
- `distribution-meter`:電表 / HMI。
- `distribution-terminals`:出線端子。
- `distribution-load`:簡化負載 rack。
- `distribution-feeder-*`:出線電纜。

機台頁 process:

- `distribution-in`:load-power 進入 distribution。
- `distribution-out`:served-load 輸出到 load rack。

## 6. 待查證

- 公司對應需人類查證:士電、亞力、中興電可掛配電盤/開關設備;台達電是否掛負載端電源/監控需校對。
- 第一版不拆 MCC、UPS、PDU、低壓開關盤等細項;若後續做資料中心或工廠配電再拆。

## Sources

- [Distribution board](https://en.wikipedia.org/wiki/Distribution_board) — 配電盤將電力分成多個回路,常含 main switch、breakers、busbars、neutral/ground terminal blocks。
- [Circuit breaker](https://en.wikipedia.org/wiki/Circuit_breaker) — breaker 用於過電流保護,也常安裝於 distribution boards。
- [Substation](https://en.wikipedia.org/wiki/Substation) — 變電站包含 switching、protection、control、transformers,並使用 busbars 連接設備。
- [Allis Switchgear](https://www.allis.com.tw/en/product-c39454/Switchgear.html) — switchgear、control panels 與相關配電設備產品背景。
