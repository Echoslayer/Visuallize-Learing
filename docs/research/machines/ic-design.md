# IC 設計元件研究

> 由 `/research-machine ic-design` 產出，供 `/design-machine` 使用。
> 這不是實體製程機台，而是半導體供應鏈中的「設計 / EDA / IP / tape-out」資訊流節點。

## 1. 用途

IC 設計把產品規格轉成可交給晶圓代工廠製造的晶片版圖資料。典型數位晶片流程是規格/架構 → RTL → 驗證 → synthesis → floorplan / place & route → signoff → GDSII/OASIS → tape-out / 光罩資料。它在供應鏈中輸出的是「設計資料與光罩需求」，不是實體物料；後段晶圓代工才把這些資料轉成矽晶圓上的實體電路。

## 2. 真實外觀

IC 設計本身沒有像曝光機那樣的單一硬體外觀。最可辨認的視覺語彙應是工程工作站 + 多螢幕 EDA 介面 + 晶片 floorplan / layout 圖 + IP block library。真實工作場景通常是辦公室或設計中心，核心資產是 EDA 軟體、PDK、IP、工程師與大量運算資源。

可視化時不要只放一台普通電腦；應讓畫面讀得出「從程式/規格到晶片版圖」：

- 螢幕上有 code / waveform / timing report。
- 旁邊有 chip floorplan 方格，表示巨集、記憶體、I/O、電源網。
- 有一片薄板或光罩/reticle 代表 tape-out 交付物。
- 有幾個可重用 IP block，表示 CPU/GPU/NPU、SerDes、memory controller 等模組。

## 3. 輸入 → 輸出

- **輸入**：市場/產品規格、演算法/架構、PDK、standard cell library、memory compiler、第三方 IP、EDA 工具、設計/驗證人力、雲端或內部 compute。
- **中間物**：RTL、testbench、coverage report、netlist、constraint、floorplan、placement/routing、timing/power/area 報告、DRC/LVS/signoff 報告。
- **輸出**：通過 signoff 的 layout database（常見 GDSII/OASIS）、tape-out package、光罩/reticle 製作需求。
- **供應鏈流向**：資訊流從 IC 設計節點流向晶圓代工；不是晶圓或化學品流動。

## 4. 關鍵子系統

| 部位 | 功能 | 是否有供應鏈意義 | primitive 提示 |
|---|---|---|---|
| 工程工作站 / 設計中心 | 承載工程師與 EDA 操作場景 | 是；代表 fabless / ASIC design service | `box` 桌台 + `box` 主機 / console |
| 多螢幕 EDA 介面 | 顯示 RTL、波形、timing、layout | 是；代表 EDA 工具鏈 | 薄 `box` 螢幕 2-3 片，材質可用 accent |
| RTL / code panel | 設計從 HDL/RTL 開始 | 是；代表前端設計 | 直立薄 `box`，用小條塊表 code line |
| Verification / waveform panel | 驗證功能正確性、coverage | 是；前端 signoff 重要瓶頸 | 薄 `box` + 細 `box` 波形線 |
| Synthesis / netlist block | RTL 轉 gate-level netlist | 是；EDA 核心步驟 | 小方塊群或節點網格 |
| Floorplan / place-route chip map | 巨集、standard cell、routing 的版圖 | 是；最能表達 RTL-to-GDS | 扁平 chip `box` + 多個小 `box` 區塊 |
| IP library blocks | 可重用 CPU/GPU/NPU/SerDes/memory IP | 是；對應 IP 供應與授權 | 小積木群，靠近 chip map |
| PDK / library stack | 製程規則、cell library、memory compiler | 是；設計與 foundry 綁定 | 疊放薄 `box` 或書本狀 |
| Signoff checklist | timing / power / DRC / LVS 通過 | 是；決定能否 tape-out | 直立薄板 + tick-like 小方塊 |
| GDS / reticle plate | 最終交付到 foundry / mask 的資料 | 是；設計節點的輸出物 | 薄透明 `box` 或扁平片，接 process route |
| Compute / cloud rack | EDA run 需要大量 compute | 是；雲端 EDA / HPC 成本 | 小 `Rack` pattern，可選，不要喧賓奪主 |

## 5. 可套用 pattern

現有 `machine-patterns.md` 沒有完全對應，因為 IC 設計是資訊流節點，不是機台。最接近的是：

- **Rack**：可借來表達 compute / EDA server，但不能把整個 IC 設計畫成機櫃。
- **Factory Cell**：可借「外殼 + 多個內部站點」的概念，表達設計中心內有前端、驗證、後端、signoff 幾個區塊。

建議後續 design-machine 新增一個文件級 pattern：**Design Workbench**。

Primitive 起手式：

- base desk / console: `box`
- monitors: `box` + `repeat` 或手列 2-3 片
- chip floorplan: 扁 `box` + 小 `box` 區塊
- IP blocks: 小 `box` 群
- reticle/GDS plate: 薄 `box`，放在輸出端
- optional compute rack: 小型 `Rack`

## 6. 待查證

- 最終模型要偏「fabless 設計公司」還是「ASIC 設計服務 / turnkey」；兩者視覺都像設計中心，但供應鏈公司對應不同。
- 是否要把 EDA 工具供應商（Synopsys/Cadence/Siemens EDA）做成這個節點的子部位，或只留在研究/公司卡。
- 是否要把 GDSII/OASIS 和 photomask/reticle 分成兩個視覺物件。教學上可合併成一片「tape-out plate」。

## Sources

- [Synopsys: What is EDA](https://www.synopsys.com/glossary/what-is-electronic-design-automation.html) — EDA 定義、設計/驗證/製造準備、PPA/automation。
- [Cadence: Digital Design and Signoff](https://www.cadence.com/en_US/home/tools/digital-design-and-signoff.html) — 現代 digital implementation / signoff、RTL-to-GDS integration、PPA。
- [TSMC Open Innovation Platform](https://www.tsmc.com/english/dedicatedFoundry/oip) — IC design 需要 EDA、IP、DFM、製程與後段服務的生態系。
- [OpenROAD documentation](https://openroad.readthedocs.io/en/latest/main/README.html) — 開源 RTL-to-GDSII flow、floorplanning / implementation / GUI 檢視概念。
- [GDSII](https://en.wikipedia.org/wiki/GDSII) — GDSII 作為 layout 資料交換與 photomask 製作相關格式的背景。
- [Tape-out](https://en.wikipedia.org/wiki/Tape-out) — tape-out 是設計交付製造前的最後階段，含 signoff 與光罩資料交付。
