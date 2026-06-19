# 資料中心 / 機房基礎設施供應鏈

> 教學用草稿。公司與代號標為需查證,不作投資建議。

## 一句話

資料中心不是只有伺服器。AI 機房把高密度運算機櫃、供電鏈、冷卻鏈、網路 fabric、監控軟體整合成一個可連續運轉的基礎設施系統。

## Demo 節點

| 環節 | 做什麼 | demo 形狀 | 代表公司(需查證) |
|---|---|---|---|
| Compute rack row | 承載 GPU/CPU 伺服器與儲存 | 一排機櫃、層板、前面板 | Dell、Supermicro、緯穎、廣達 |
| Power room | 市電/備援進入,UPS/PDU/母線分配到機櫃 | UPS 櫃、電池、母線槽 | Vertiv、Eaton、Schneider、台達電 |
| Cooling loop | CDU/chiller/pump/manifold 把熱帶走 | CDU 櫃、泵、供回水管 | Vertiv、Johnson Controls、奇鋐、雙鴻、台達電 |
| Network fabric | Spine/leaf switch 與光纖連接機櫃 | 交換機櫃、光纖管線 | Cisco、Arista、Broadcom、智邦 |
| Monitoring / DCIM | 監控電力、溫度、資產、告警 | 控制台、螢幕 | Schneider、Vertiv、Eaton |

## 流動語意

- **Power**: utility / backup → UPS/PDU → rack row。
- **Cooling**: CDU/chiller → rack manifold → return loop。
- **Data**: rack row ↔ network fabric,雙向用兩條單向 route 表達。
- **Monitoring**: DCIM 監控訊號連到電力、冷卻、機櫃,不是主物料流。

## 來源

- Vertiv 產品目錄列出 UPS、power distribution、busway、thermal management、racks、monitoring 等資料中心基礎設施類別: https://www.vertiv.com/en-us/products-catalog/critical-power/uninterruptible-power-supplies-ups/
- Schneider Electric data center page 把 power、cooling、management、security 列為資料中心解決方案核心,並列 UPS、Integrated Cooling、DCIM、Rack Systems: https://www.se.com/us/en/work/solutions/data-centers-and-networks/
- NVIDIA / 產業資料指出高密度 AI 機櫃推動 800V DC 與液冷架構,本 demo 只抽象表達 power/cooling 方向,不實作特定電壓標準。

