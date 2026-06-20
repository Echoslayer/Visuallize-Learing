# 機台設計 Spec: wind-grid

## 1. 幾何與層級結構
`wind-grid` 代表風力發電的最終歸宿——陸上變電站與國家電網併網點。

- **`wind-grid`** (根節點 - 陸上變電站建築)
  - 幾何：`box`，`args: [10.0, 5.0, 8.0]`
  - 位置：`[60.0, 2.5, 0.0]` (建立於陸地基準面上)
  - 材質：`metal-light`
  - 屬性：`enclosure: true` (建築外殼)
  - 標籤：陸上變電站 (Onshore Substation)，公司對應中興電 (1513)。
- **`onshore-transformer`** (陸上主變壓器)
  - 幾何：`box`，`args: [3.0, 3.0, 3.0]`
  - 位置：`[58.0, 1.5, 0.0]` (局部座標 `[-2.0, -1.0, 0]`)
  - 材質：`metal-dark`
  - 屬性：`partOf: "wind-grid"`，標籤「陸上變壓器 (Onshore Transformer)」，公司對應華城電機 (1519)。
- **`onshore-gis`** (陸上高壓開關)
  - 幾何：`box`，`args: [2.0, 2.0, 4.0]`
  - 位置：`[62.0, 1.0, 0.0]` (局部座標 `[2.0, -1.5, 0]`)
  - 材質：`metal-light`
  - 屬性：`partOf: "wind-grid"`，標籤「高壓開關 (GIS)」，公司對應中興電 (1513)。
- **`transmission-tower`** (輸電鐵塔)
  - 幾何：`cone`，`args: [0.5, 12.0, 4]` (四面體錐柱，象徵鐵塔形狀)
  - 位置：`[68.0, 6.0, -5.0]` (局部座標 `[8.0, 3.5, -5.0]`)
  - 材質：`metal-dark`
  - 屬性：`partOf: "wind-grid"`，標籤「輸電網絡 (Transmission Grid)」，公司對應大亞 (1609)。

## 2. 能量流與 Process Layer
接收從海上升壓站與輸出海纜送來的 `electrical-hv`，並將其送往輸電鐵塔，象徵匯入千家萬戶。

- **Stations**:
  - `grid-station`: 位於變壓器局部座標 `[-2.0, -1.0, 0]`。
    處理：`input: "electrical-hv"` -> `output: "electrical-hv"`，`processTime: 0.5`
- **Routes**:
  - `export-in`:
    - `material`: `primary`
    - 路徑：`[[-10.0, -2.5, 0], [-5.0, -2.5, 0], [-2.0, -1.0, 0]]` (從海床/地下爬升進入變壓器)
    - 停靠：終點 `2` 於 `grid-station`。
  - `grid-out`:
    - `material`: `primary`
    - 路徑：`[[-2.0, -1.0, 0], [2.0, -1.5, 0], [8.0, 3.5, -5.0]]` (經過 GIS 後，爬升向遠方的輸電鐵塔)
    - 停靠：起點 `0` 於 `grid-station`。
- **Tokens**:
  - `export-in-tok`: `count: 2`, `radius: 0.15`, `duration: 2.0`
  - `grid-out-tok`: `count: 2`, `radius: 0.15`, `duration: 2.0`

## 3. 公司映射 (companies.csv)
- `wind-grid` -> 1513 (中興電)
- `onshore-transformer` -> 1519 (華城)
- `onshore-gis` -> 1513 (中興電)
- `transmission-tower` -> 1609 (大亞)

## 4. 驗證重點
- 執行 `?topic=wind&view=gallery&machine=wind-grid` 時，應能看到陸上的變電建築與遠處尖尖的鐵塔。
- 點擊透視變電站可看見裡面的變壓器與開關。
- 高壓電 Token 應從左下進入，最終流向右後方的輸電鐵塔。
