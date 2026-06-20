# 機台研究：Subsea Cables (海底電纜)

## 1. 現實中的實體結構
海底電纜（Subsea Cables）在離岸風場中扮演傳輸電力的微血管與大動脈。
1. **陣列電纜 (Array Cables / In-field Cables)**：
   - 負責將單台風機產生的電力（通常為 33kV 或 66kV 中低壓）匯集至海上升壓站。
   - 包含靜態電纜（埋入海床）與動態電纜（如浮動式風機使用的懸垂段）。
2. **輸出電纜 (Export Cables)**：
   - 將升壓站處理過的高壓電（通常為 220kV 交流或更高壓直流 HVDC）傳送至陸地併網點。

## 2. 供應鏈映射
根據 `docs/research/supply-chains/wind.md` 的盤點：
- **Prysmian Group** (PRY.MI)：全球最大的電纜製造商。
- **Nexans** (NEX.PA)：高壓海纜領域巨頭。
- **NKT** (NKT.CO)：丹麥專業海纜供應商。

## 3. 領域抽象化 (Object Abstraction)
- **`array-cable`** (陣列電纜)：
  - 使用 `tube` 或 `path` + `cylinder` 沿著海床（Y=0）鋪設。
  - 代表將 `wind-tower` 塔底的電力連接至後方的 `wind-substation`。
- **`export-cable`** (輸出電纜)：
  - 同樣使用 `tube`，但管徑略粗或顏色不同，從 `wind-substation` 延伸至遠方的 `wind-grid`。

## 4. 能量與物質流 (Process Layer)
- **輸入**：接收來自 `wind-tower` 塔底站點的 `electrical-lv` Token。
- **轉換**：純傳輸，無轉換。Token 在電纜中流動。
- **輸出**：將 `electrical-lv` Token 送至 `wind-substation` 升壓站。
