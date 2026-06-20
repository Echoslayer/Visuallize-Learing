# Spec 27: Wind Farm Topic Redo (Phase B)

## 1. 背景與目標
基於 `docs/progress/wind-redo.md`，我們將重做風力發電 (Wind) 題目。
選定的範圍 (Scope) 為 **Wind-Farm (風場到併網)**，重點展示「能量流動的轉換過程」（風能 → 機械能 → 低壓電 → 高壓電），而非單一台發電機的過度細節。

## 2. 精選節點 (Nodes)
為了維持畫面簡潔且具備教學意義，精選 6 個主要設備節點：

1. **`wind-rotor` (轉子與葉片系統)**: 捕獲風能轉換為旋轉機械能。包含葉片、輪轂與變槳機構。
2. **`wind-nacelle` (機艙傳動與發電)**: 包含主軸、齒輪箱、發電機與變流器。負責將低速高扭矩的機械能轉換為穩定的電能。
3. **`wind-tower-foundation` (塔架與水下基礎)**: 支撐結構，包含塔筒與單樁 (Monopile) 水下基礎，內部有電纜引下。
4. **`wind-cables` (海底電纜)**: 陣列電纜與輸出海纜，負責傳輸電力。
5. **`wind-substation` (海上升壓站)**: 匯集電力並大幅升壓，以減少長途傳輸損耗。包含變壓器與海上平台。
6. **`wind-grid` (陸上併網端)**: 接收海上高壓電並併入陸地主電網。

## 3. 整體佈局 (Layout)
*   **視角與環境**: 以側面透視為主，左側是高聳的風機，右側是海面上的升壓站與陸地網格。
*   **左側 (X: -60, Z: 0)**: 完整的風力發電機。
    *   `wind-tower-foundation` 佇立於海床 (Y=0 到 Y=40)。
    *   `wind-nacelle` 放置於塔頂 (Y=40)。
    *   `wind-rotor` 安裝於機艙前端，面向左側迎風。
*   **中間 (地面/海床)**: `wind-cables` 從塔底 (X: -60, Y: 0) 貼著海床延伸至升壓站底座 (X: 20, Y: 0)。
*   **右側 (X: 20 到 60)**:
    *   `wind-substation` 位於 X: 20，海面上的升壓平台。
    *   `wind-grid` 位於 X: 60，代表最終電網端。

## 4. 能量流設計 (Topic-level Process)
此題目的靈魂是「能量轉換」，因此將大量使用 `ProcessLayer`。
*   **Tokens**:
    *   `wind` (青色/Cyan) - 代表自然風力。
    *   `mechanical` (銀色/Silver) - 代表軸承與齒輪的旋轉物理動能。
    *   `electrical-lv` (綠色/Green) - 代表發電機輸出的低中壓電。
    *   `electrical-hv` (黃色/Yellow) - 代表經過升壓後的高壓電。
*   **Route**:
    *   `R1 (Wind Capture)`: 左側進風口 → `wind-rotor` (Input: wind, Output: mechanical)
    *   `R2 (Drivetrain)`: `wind-rotor` → `wind-nacelle` (Input: mechanical, Output: electrical-lv)
    *   `R3 (Down-Tower)`: `wind-nacelle` → 沿著塔架向下 → `wind-tower-foundation`
    *   `R4 (Subsea Transmission)`: `wind-tower-foundation` → `wind-cables` → `wind-substation` (在此從 lv 轉為 hv)
    *   `R5 (Export to Grid)`: `wind-substation` → 沿海床 → `wind-grid` (Input: electrical-hv)

## 5. 機台級流與抽象規範 (Machine-level Specs)
每一台機台 (Phase C 實作) 必須滿足：
1. **形狀由 Primitive 組成**: 不使用整塊單一方塊。如：機艙外殼是半圓柱與方塊的組合 (`enclosure: true`)，打開後可見內部的齒輪箱 (圓柱) 與發電機 (方塊)。
2. **Process 配方**: 使用 `Part.process`，將節點內的 token 進出接好，`scale` 設為 0.4。例如 `wind-nacelle` 內必須有站點負責接收 mechanical token 並轉出 electrical token。
3. **介面對齊**: 機台的 `in/out` 站點位置必須與 topic-level route 銜接。

## 6. 互動與導航
*   使用者可點擊「葉片系統」、「機艙」、「塔架」、「升壓站」等設備。
*   進入各機台視角後，點擊「透視」可看穿機殼 (`enclosure: true`) 觀察內部的次級組件（如齒輪箱、變流器）及其對應的供應鏈公司。
*   機台級與 topic-level 會共享一致的 token 色彩語言。

> 後續將依據此 Spec，進入 Phase C，開始逐台設備的 `/research-machine` 與 `/design-machine`。
