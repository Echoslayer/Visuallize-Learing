# 機台設計 Spec: wind-nacelle

## 1. 幾何與層級結構
`wind-nacelle` 代表風機的機艙，包含傳動系統與發電單元。為了呈現供應鏈多樣性，我們將機艙外殼設為根節點（透視件），內部擺放代表不同廠商的關鍵零組件。

- **`wind-nacelle`** (根節點)
  - 幾何：`box`，`args: [10, 3.5, 3.5]` (機艙外殼)
  - 位置：`[-56.0, 40.0, 0.0]` (緊接在 `wind-rotor` 後方)
  - 屬性：`enclosure: true` (X-ray 模式下半透明)、`material: "metal-light"`
  - 標籤：機艙系統 (Nacelle System)，公司對應 Vestas。
- **`main-shaft`** (主軸)
  - 幾何：`cylinder`，`args: [0.3, 0.3, 3.0, 16]`
  - 位置：`[-60.0, 40.0, 0.0]`，旋轉：`[0, 0, 1.5708]`
  - 屬性：`partOf: "wind-nacelle"`，材質 `"metal-dark"`
- **`main-bearing`** (主軸承)
  - 幾何：`cylinder`，`args: [0.6, 0.6, 0.8, 16]`
  - 位置：`[-59.5, 40.0, 0.0]`，旋轉：`[0, 0, 1.5708]`
  - 屬性：`partOf: "wind-nacelle"`，獨立標籤「主軸承 (Main Bearing)」，公司對應 SKF。
- **`gearbox`** (齒輪箱)
  - 幾何：`box`，`args: [1.5, 2.0, 2.0]`
  - 位置：`[-57.5, 40.0, 0.0]`
  - 屬性：`partOf: "wind-nacelle"`，獨立標籤「齒輪箱 (Gearbox)」，公司對應 ZF。
- **`generator`** (發電機)
  - 幾何：`cylinder`，`args: [1.2, 1.2, 2.5, 16]`
  - 位置：`[-54.5, 40.0, 0.0]`，旋轉：`[0, 0, 1.5708]`
  - 屬性：`partOf: "wind-nacelle"`，獨立標籤「發電機 (Generator)」，公司對應 ABB。
- **`converter`** (變流與控制櫃)
  - 幾何：`box`，`args: [1.5, 2.5, 1.5]`
  - 位置：`[-52.0, 40.0, 0.0]`
  - 屬性：`partOf: "wind-nacelle"`，獨立標籤「變流器 (Converter)」，公司對應 Delta Electronics (台達電)。

## 2. 能量流與 Process Layer
機艙負責將 `mechanical` 能量轉換為 `electrical-lv` 並往下送至塔架。
因為 `wind-nacelle` 位於 `[-56.0, 40.0, 0.0]`，所有 `process.routes` 為相對座標。

- **Stations**:
  - `generator-station`: 位於發電機中心附近，負責 `mechanical` → `electrical-lv`。
- **Routes**:
  - `mech-in`:
    - `material`: `metal-dark`
    - 路徑：`[[-5.4, 0, 0], [-2.0, 0, 0], [1.5, 0, 0]]` (從 Rotor 尾端傳入，穿過軸承與齒輪箱到達發電機)
    - 停靠：終點 `2` 於 `generator-station`
  - `elec-out`:
    - `material`: `primary` (黃色電能)
    - 路徑：`[[1.5, 0, 0], [4.0, 0, 0], [4.0, -2.5, 0]]` (從發電機出來，進入變流器，然後折向下朝向塔架)
    - 停靠：起點 `0` 於 `generator-station`

## 3. 公司映射 (companies.csv)
- `wind-nacelle` -> VWS.CO (Vestas)
- `main-bearing` -> SKF-B.ST (SKF)
- `gearbox` -> 私有不標或找代號？ZF 無代號，可以用 0658.HK (NGC 南高齒)。這裡選用 0658.HK (NGC)。
- `generator` -> ABBN.SW (ABB)
- `converter` -> 2308 (台達電)

## 4. 驗證重點
- 執行 `?topic=wind&view=gallery&machine=wind-nacelle` 時，應能看到機艙外殼。
- 按下 `X` (透視) 後，外殼變半透明，可見內部的軸、軸承、齒輪箱、發電機與變流器。
- 按下 `E` (拆解) 時，內部元件應正確向外散開。
- `mechanical` token 進入後轉化為 `electrical-lv` token 並往下走。
