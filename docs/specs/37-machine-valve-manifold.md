# 37-machine-valve-manifold: Valve Manifold / Piping Specification

## 1. 模組定位 (Module Positioning)
* **供應鏈環節**: 閥件 (Valves) / 管材 (Piping)
* **代表廠商**: Emerson Electric (EMR) / Tenaris (TS)
* **輸入**: Pressurized Flow (加壓流體)
* **輸出**: Regulated Flow (受控流體)

## 2. 形狀與幾何抽象 (Geometry & Abstraction)
本模組呈現流體經過管線並透過閥門控制的過程。

### 2.1 基礎零件組成
1. **Main Body (閥體)**:
   * **Shape**: `cylinder`
   * **Description**: 閥門主體，連接兩側管線。
2. **Actuator (驅動器)**:
   * **Shape**: `cylinder` (垂直)
   * **Description**: 位於閥體上方，表示接收控制信號的執行機構。
3. **Handwheel (手輪)**:
   * **Shape**: `cylinder` (扁平)
   * **Description**: 位於驅動器上方，代表手動操作介面。
4. **Pipes (進出管線)**:
   * **Shape**: `cylinder`
   * **Description**: 負責傳輸流體的管道。
5. **Flanges (法蘭)**:
   * **Shape**: `cylinder` (扁平)
   * **Description**: 用於管線與閥體之間的連接點。

## 3. 動畫與 Process 設定 (Animation & Process Logic)
* **Process Station**: 
  * **目標零件**: Actuator (`valve-manifold-actuator`)
  * **作用**: 模擬閥門動作，可能表現為 scale 的跳動或旋轉 (在 `pipeline.json` 的 `scale` 屬性設定)。
  * **Input Token**: `pressurized-flow`
  * **Output Token**: `regulated-flow`
* **Route**:
  * Token 沿著進水管 (`pipe-in`) 進入，抵達閥體中心停留進行 Process，隨後沿著出水管 (`pipe-out`) 流出。
