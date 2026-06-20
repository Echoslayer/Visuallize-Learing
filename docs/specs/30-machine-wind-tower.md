# 機台設計 Spec: wind-tower

## 1. 幾何與層級結構
`wind-tower` 代表風機的塔架與水下基礎，負責支撐上方的機艙，並提供內部通道讓電纜將電力送往海底。

我們將上段塔架設為根節點，下段塔架、轉接段與單樁基礎為其子節點。

- **`wind-tower`** (根節點 - 上段塔架)
  - 幾何：`cylinder`，`args: [1.2, 1.8, 25.0, 16]` (上窄下寬)
  - 位置：`[-56.0, 25.5, 0.0]` (涵蓋高度 Y=13 到 Y=38)
  - 材質：`metal-light`
  - 標籤：塔架與基座 (Tower & Foundation)，對應公司 CS Wind。
- **`tower-lower`** (下段塔架)
  - 幾何：`cylinder`，`args: [1.8, 2.2, 10.0, 16]`
  - 位置：`[-56.0, 8.0, 0.0]` (局部座標 `[0, -17.5, 0]`)
  - 材質：`metal-light`
  - 屬性：`partOf: "wind-tower"`
- **`transition-piece`** (TP 轉接段平台)
  - 幾何：`cylinder`，`args: [2.5, 2.5, 3.0, 16]`
  - 位置：`[-56.0, 1.5, 0.0]` (局部座標 `[0, -24.0, 0]`)
  - 材質：`primary` (象徵離岸風電常見的黃色防撞段)
  - 屬性：`partOf: "wind-tower"`，獨立標籤「轉接段 (Transition Piece)」，公司世紀鋼 (Century Iron & Steel)。
- **`monopile`** (單樁水下基礎)
  - 幾何：`cylinder`，`args: [2.2, 2.2, 15.0, 16]`
  - 位置：`[-56.0, -7.5, 0.0]` (局部座標 `[0, -33.0, 0]`)
  - 材質：`metal-dark` (象徵海面下的深色鋼管)
  - 屬性：`partOf: "wind-tower"`，獨立標籤「水下單樁 (Monopile)」，公司 Sif Group。

## 2. 能量流與 Process Layer
塔架主要作為 `electrical-lv` 的傳輸通道。
上方 Nacelle 的 `elec-out` 結束於全球座標 `[-52.0, 37.5, 0.0]`。
`wind-tower` 根節點的局部原點為 `[-56.0, 25.5, 0.0]`。

- **Stations**:
  - `tower-base`: 位於塔底 TP 附近，局部座標 `[0, -25.5, 0]` (全球 `Y=0`)。
    處理：`input: "electrical-lv"` -> `output: "electrical-lv"`，`processTime: 0.5`
- **Routes**:
  - `cable-down`:
    - `material`: `primary` (黃色電能)
    - 路徑：`[[4.0, 12.0, 0], [0.0, 12.0, 0], [0.0, -25.5, 0]]` (從偏離中心的 Nacelle 尾部接回塔架中心，垂直往下至海平面)
    - 停靠：終點 `2` 於 `tower-base`。
  - `cable-out`:
    - `material`: `primary`
    - 路徑：`[[0.0, -25.5, 0], [4.0, -25.5, 0], [6.0, -25.5, 0]]` (由塔底出發，往海底電纜方向前進)
    - 停靠：起點 `0` 於 `tower-base`。

## 3. 公司映射 (companies.csv)
- `wind-tower` -> 112610.KS (CS Wind)
- `transition-piece` -> 9958 (世紀鋼)
- `monopile` -> SIFG.AS (Sif Group)

## 4. 驗證重點
- 執行 `?topic=wind&view=gallery&machine=wind-tower` 時，應能看到一根完整的塔架，帶有黃色的轉接段與深色的水下單樁。
- `electrical-lv` (黃色 token) 應由頂部進入，沿著塔架中心落下，抵達底部黃色平台處後折向輸出。
- 點擊拆解時，各段塔架與基座會分離。
