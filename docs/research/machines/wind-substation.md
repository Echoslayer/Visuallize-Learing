# 機台研究：Offshore Substation (海上升壓站)

## 1. 現實中的實體結構
海上升壓站（Offshore Substation, OSS）是離岸風場的心臟。風機產生的電力（通常為 33kV 或 66kV 中低壓）在傳輸到陸地前，必須先在海上升壓站升壓（至 220kV 甚至更高的 HVDC），以減少長途海纜傳輸的能量損耗。

主要實體結構包含：
1. **頂部模組 (Topside)**：
   - 包含主變壓器（Main Transformers）、氣體絕緣開關設備（GIS）、控制室與直升機停機坪。
   - 通常為一個巨大的多層鋼結構箱體。
2. **水下基礎 (Foundation)**：
   - 用於支撐頂部模組，通常使用四腳或多腳的套筒式基礎（Jacket Foundation），或大型單樁（Monopile）。

## 2. 供應鏈映射
根據 `docs/research/supply-chains/wind.md`：
- **頂部模組結構與基礎**：Bladt Industries（已被 CS Wind 收購）、世紀鋼（9958.TW）。
- **高壓電力設備 (變壓器/GIS)**：ABB (ABBN.SW)、Siemens Energy (ENR.DE)、GE Vernova (GEV)。

## 3. 領域抽象化 (Object Abstraction)
- **`wind-substation` (升壓站外殼與平台)**：
  - 作為根節點，使用 `box` 幾何體，並開啟 `enclosure: true`，代表頂部模組外殼。
- **`substation-foundation` (支撐基礎)**：
  - 使用 `cylinder` 代表支撐柱，連接海平面與頂部模組。
- **`offshore-transformer` (主變壓器)**：
  - 置於模組內部的核心設備，使用 `box` 幾何。
- **`offshore-gis` (開關設備)**：
  - 放置於變壓器旁的控制開關，使用較小的 `box` 或 `cylinder`。

## 4. 能量與物質流 (Process Layer)
- **輸入**：接收來自陣列海纜 (`wind-cables`) 的 `electrical-lv` (低壓電能) Token。
- **轉換**：在變壓器站點（`transformer-station`）將 `electrical-lv` 轉換為 `electrical-hv` (高壓電能，為區隔可調整參數如大小或維持顏色但改變變數，這裡統一轉為黃色的 hv token，速度可能更快或半徑更大)。
- **輸出**：將 `electrical-hv` 輸出，準備接駁往陸地的輸出海纜或電網。
