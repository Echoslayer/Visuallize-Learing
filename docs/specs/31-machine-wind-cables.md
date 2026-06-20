# 機台設計 Spec: wind-cables

## 1. 幾何與層級結構
`wind-cables` 代表連接風機、升壓站與併網點的海底電纜。
為表現供應鏈，我們將其分為負責風場內傳輸的「陣列電纜 (Array Cable)」與負責向陸地傳輸的「輸出電纜 (Export Cable)」。

由於目前實作的重點是連接 `wind-tower` (位於 `X=-56`) 到未來的 `wind-substation` (位於 `X=20`)，我們主要設計陣列電纜段。

- **`wind-cables`** (根節點 - 陣列電纜)
  - 幾何：`tube`，`args: []`（依賴 path，`radius: 0.3`）
  - 路徑：`[[-50.0, -14.5, 0], [-15.0, -14.5, 0], [20.0, -14.5, 0]]` (貼著海床 Y=-14.5 延伸。註：塔架底部輸出約為 X=-50, Y=-25.5 局部，對應世界坐標為 Y=-14.5? 不，前一個 spec `wind-tower` 放在 Y=25.5，塔底是 local -25.5，也就是 global 0！ Wait, monopile goes to Y=-7.5, which is global -15.0? Wait! Tower base station was at local [0, -25.5, 0] which is global [-56, 0, 0]. Let's route the cable on the sea floor at `Y=0`).
  - 位置：`[0, 0, 0]` (全域座標)
  - 幾何詳細路徑：`[[-50.0, 0, 0], [-15.0, 0, 0], [20.0, 0, 0]]`
  - 材質：`metal-dark`
  - 標籤：陣列電纜 (Array Cable)，對應公司 Prysmian Group。

## 2. 能量流與 Process Layer
電纜負責單純的傳輸，不進行能量轉換。
`wind-tower` 結束於全球座標 `[-50.0, 0, 0]`。
`wind-cables` 起點也是 `[-50.0, 0, 0]`。

- **Stations**:
  - `cable-entry`: 位於 `[-50.0, 0, 0]`
  - `cable-exit`: 位於 `[20.0, 0, 0]`
- **Routes**:
  - `array-transmission`:
    - `material`: `primary` (黃色電能)
    - 路徑：`[[-50.0, 0, 0], [-15.0, 0, 0], [20.0, 0, 0]]`
    - 停靠：起點 `0` 於 `cable-entry`，終點 `2` 於 `cable-exit`。
    - 處理：接收 `electrical-lv`，輸出 `electrical-lv`。

## 3. 公司映射 (companies.csv)
- `wind-cables` -> PRY.MI (Prysmian Group)

## 4. 驗證重點
- 執行 `?topic=wind&view=gallery&machine=wind-cables` 時，應能看到一條橫跨畫面的長管狀電纜。
- 點擊拆解時，若有子電纜則分離，否則無特別動作。
- `electrical-lv` token (黃色) 能從電纜的一端順暢流向另一端。
