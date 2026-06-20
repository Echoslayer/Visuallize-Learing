# Spec 28: Machine Design - Wind Rotor (`wind-rotor`)

## 1. 幾何與抽象 (Geometry & Abstraction)
轉子系統必須由 Primitive 組合，避免單一方塊，以展現風電設備的幾何特徵。
*   **Hub (輪轂)**:
    *   形狀: `cone` 或 `cylinder` (圓柱/圓錐)。
    *   位置: `[0, 0, 0]`
    *   角色: `hub`，連接葉片與主軸。
*   **Blades (葉片)** (共 3 片, 彼此夾角 120 度):
    *   形狀: 瘦長的 `cone`，模擬葉片根部粗、尖端細的流線型。
    *   位置: 圍繞 Y/X 軸放射狀分佈。
    *   角色: `blade`
*   **Pitch Mechanism (變槳機構)** (共 3 個):
    *   形狀: 扁平 `cylinder`。
    *   位置: 夾在 Hub 與 Blade 根部之間。
    *   角色: `pitch-system` (供應鏈關鍵節點，對應 Moog 等公司)。

## 2. 結構樹與命名 (Hierarchy & `partOf`)
*   `wind-rotor` (Root)
    *   `hub` (帶公司: Vestas)
    *   `pitch-system-1` (帶公司: Moog)
    *   `blade-1` (帶公司: TPI Composites) -> 可設 `partOf: "rotor-blades"` 或直接獨立。為了供應鏈展示，我們讓 `blade` 獨立對應 TPI Composites。
    *   `pitch-system-2`, `blade-2`
    *   `pitch-system-3`, `blade-3`

## 3. 機台級能量流 (Process Layer)
*   **Scale**: `0.4`
*   **Stations**:
    *   `capture-point` (位於 hub 正前方): 接收自然風。
    *   `hub-center` (位於 hub 中心): 風能轉換為機械旋轉力矩。
    *   `shaft-out` (位於 hub 後方): 輸出機械能。
*   **Routes**:
    *   `wind-in`: 從 `capture-point` 到 `hub-center`，`token: wind` (青色)。
    *   `mech-out`: 從 `hub-center` 到 `shaft-out`，`token: mechanical` (銀色)。
*   **介面契約**: Input 接收 `wind`，Output 送出 `mechanical` 給下一個節點 `wind-nacelle`。
