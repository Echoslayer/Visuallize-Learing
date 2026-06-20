# 機台研究：Grid Connection (陸上電網接入)

## 1. 現實中的實體結構
離岸風場的電力經過海上升壓站升壓並透過輸出海纜（Export Cable）傳輸到陸地後，必須在「陸上變電站（Onshore Substation）」進行最終的降壓與穩壓處理，才能正式併入國家主電網（National Grid）。

主要實體結構包含：
1. **陸上變電站 (Onshore Substation)**：
   - 接收來自海上的高壓交流電（HVAC）或高壓直流電（HVDC）。
   - 包含主變壓器（Transformers）、高壓開關設備（Switchgear, GIS/AIS）、電抗器與靜態無功補償器（STATCOM）以穩定電壓。
2. **輸電鐵塔/線路 (Transmission Towers / Lines)**：
   - 離開陸上變電站後，電力透過架空電纜或地下電纜接入既有電網。

## 2. 供應鏈映射
根據 `docs/research/supply-chains/wind.md` 與台灣供應鏈現況：
- **高壓電力設備 (外商)**：ABB (ABBN.SW)、Siemens Energy (ENR.DE)、GE Vernova (GEV)。
- **重電設備 (本土)**：華城電機 (1519.TW)、中興電工 (1513.TW)、士林電機 (1503.TW)、亞力電機 (1514.TW)。

## 3. 領域抽象化 (Object Abstraction)
- **`wind-grid` (變電站主建築 / 區域)**：
  - 作為根節點，使用扁平寬大的 `box` 代表陸上變電所的廠區或室內 GIS 變電所建築。
- **`onshore-transformer` (陸上變壓器)**：
  - 使用 `box` 幾何體置於建築旁或內部，代表本土重電廠負責的設備。
- **`transmission-tower` (輸電鐵塔)**：
  - 使用細長的 `cone` 或 `cylinder` 代表遠方的輸電鐵塔，象徵電網的終點。

## 4. 能量與物質流 (Process Layer)
- **輸入**：接收來自海面的 `electrical-hv` (高壓電能) Token。
- **轉換**：在變壓器站點將電力穩定化，或轉換為終端電網格式（可維持 `electrical-hv`，或轉為另一個象徵最終消費的 token）。
- **輸出**：沿著輸電鐵塔方向流出畫面，象徵供電給千家萬戶。
