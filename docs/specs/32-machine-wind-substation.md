# 機台設計 Spec: wind-substation

## 1. 幾何與層級結構
`wind-substation` 代表離岸風場的海上升壓站 (Offshore Substation)。負責匯集風機發出的中低壓電，並將其升壓以利長途傳輸。

- **`wind-substation`** (根節點 - 頂部模組)
  - 幾何：`box`，`args: [12.0, 8.0, 10.0]`
  - 位置：`[20.0, 15.0, 0.0]` (漂浮於海面之上)
  - 材質：`primary` (離岸防護黃漆)
  - 屬性：`enclosure: true` (使用者點擊可透視看見內部設備)
  - 標籤：海上升壓站 (Offshore Substation)，公司對應 Bladt Industries。
- **`substation-foundation`** (支撐基礎)
  - 幾何：`cylinder`，`args: [2.5, 3.5, 15.0, 16]`
  - 位置：`[20.0, 7.5, 0.0]` (局部座標 `[0, -7.5, 0]`)
  - 材質：`primary`
  - 屬性：`partOf: "wind-substation"`，標籤「升壓站基礎」，公司對應世紀鋼 (Century Iron & Steel)。
- **`offshore-transformer`** (主變壓器)
  - 幾何：`box`，`args: [4.0, 5.0, 4.0]`
  - 位置：`[20.0, 15.0, -2.0]` (局部座標 `[0, 0, -2.0]`)
  - 材質：`metal-dark`
  - 屬性：`partOf: "wind-substation"`，標籤「主變壓器 (Main Transformer)」，公司對應 Siemens Energy。
- **`offshore-gis`** (氣體絕緣開關設備)
  - 幾何：`box`，`args: [3.0, 3.0, 2.0]`
  - 位置：`[20.0, 15.0, 2.5]` (局部座標 `[0, 0, 2.5]`)
  - 材質：`metal-light`
  - 屬性：`partOf: "wind-substation"`，標籤「高壓開關 (HV GIS)」，公司對應 ABB。

## 2. 能量流與 Process Layer
將海底陣列電纜傳來的 `electrical-lv` 轉換為傳輸效率更高的 `electrical-hv`。

- **Stations**:
  - `hv-transformer`: 位於局部座標 `[0, 0, -2.0]`。
    處理：`input: "electrical-lv"` -> `output: "electrical-hv"`，`processTime: 0.8`
- **Routes**:
  - `lv-in`:
    - `material`: `primary`
    - 路徑：`[[0, -15.0, 0], [0, 0, 0], [0, 0, -2.0]]` (從海床底部 Y=-15 上升至頂部模組，進入變壓器)
    - 停靠：終點 `2` 於 `hv-transformer`。
  - `hv-out`:
    - `material`: `primary`
    - 路徑：`[[0, 0, -2.0], [0, 0, 2.5], [4.0, 0, 2.5], [4.0, -15.0, 0]]` (從變壓器出發，經過 GIS 開關，由模組右側垂降至海床，準備輸出)
    - 停靠：起點 `0` 於 `hv-transformer`。
- **Tokens**:
  - `lv-in-tok`: `count: 3`, `radius: 0.1`, `duration: 2.0`
  - `hv-out-tok`: `count: 2`, `radius: 0.15`, `duration: 1.5` (高壓電 Token 較大且速度較快，表示高壓高能狀態)

## 3. 公司映射 (companies.csv)
- `wind-substation` -> BLADT (Bladt Industries - 現 CS Wind Offshore)
- `substation-foundation` -> 9958 (世紀鋼)
- `offshore-transformer` -> ENR.DE (Siemens Energy)
- `offshore-gis` -> ABBN.SW (ABB)

## 4. 驗證重點
- 執行 `?topic=wind&view=gallery&machine=wind-substation` 時，應看到一個黃色的海上平台結構。
- 點擊拆開（透視）後，能看見裡面的變壓器與開關設備。
- 黃色 Token 應從下方進入，在變壓器處轉換後，變成較大的 Token 往下導出。
