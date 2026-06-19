# 控制保護 / SCADA 研究

> 由 `/research-machine control-protection` 產出，供 `/design-machine` 使用。
> 對應 `grid` 題目的 Phase C-3 控制與保護設備。

## 1. 用途

控制保護 / SCADA panel 是變電站的訊號側核心。它接收 GIS、transformer、busbar / distribution 的狀態量,由保護電驛判斷 fault / overcurrent / undervoltage 等異常,再送出 trip / close / alarm 指令。

## 2. 真實外觀

典型外觀是直立控制盤或保護電驛櫃:前面有多個數位保護電驛、HMI/SCADA 螢幕、狀態燈、按鈕、端子排、通訊模組與線槽。它不像大電力設備,而是資訊與控制訊號集中面板。

可視化重點:

- 直立 cabinet / rack。
- Relay modules 要成排,不能只是一塊螢幕。
- HMI / mimic diagram 要表達 SCADA / one-line。
- Terminal block / cable duct 表達訊號接線。
- 輸入是 status,輸出是 trip / command,不是主電力。

## 3. 輸入 → 輸出

- **輸入**:`status/control` 或 field status 從 GIS / transformer / downstream 回來。
- **內部判斷**:protective relays 與 SCADA/RTU 監控電壓、電流、breaker 狀態與告警。
- **輸出**:`trip/command` 往 GIS breaker、tap changer 或 distribution control。

## 4. 關鍵子系統

| 部位 | 功能 | 是否有供應鏈意義 | primitive 提示 |
|---|---|---|---|
| cabinet | 控制盤外殼與安裝框 | 是;盤體/系統整合 | tall `box` |
| relay modules | 保護電驛與測量 IED | 是;保護設備核心 | small `box` + `repeat` |
| HMI / SCADA screen | 監控畫面與操作介面 | 是;SCADA | thin `box` |
| mimic diagram | 單線圖/狀態顯示 | 是;操作語意 | thin line `box` / small blocks |
| terminal blocks | 現場訊號端子 | 是;控制接線 | tiny `box` + `repeat` |
| comms processor | 通訊集中/RTU | 是;自動化 | small `box` |
| battery / UPS | 控制電源備援 | 是但第一版簡化 | small base `box` |

## 5. 可套用 pattern

套用 `docs/machine-patterns.md` 的 **Rack** pattern:

- `control`:主控制櫃 / annotation anchor。
- `control-relays`:成排 relay modules。
- `control-screen`:HMI / SCADA screen。
- `control-mimic`:單線圖。
- `control-terminals`:端子排。
- `control-comms`:通訊處理器。
- `control-ups`:控制電源/UPS。

機台頁 process:

- `control-status-in`:field status 進入 panel。
- `control-command-out`:trip/command 從 panel 輸出。

## 6. 待查證

- 公司對應需人類查證:中興電、亞力可掛 control panel / SCADA / protection;台達是否掛電源/automation 需校對。
- 第一版不區分 relay brands、CT/PT、RTU 與 DFR;若後續做控制系統教學再拆。

## Sources

- [Allis Switchgear](https://www.allis.com.tw/en/product-c39454/Switchgear.html) — high/low-voltage switchgear、control panels、SCADA、protection relays 產品背景。
- [Protective relay](https://en.wikipedia.org/wiki/Protective_relay) — 保護電驛在 fault detected 時 trip breaker,並可由 microprocessor relay 集成多種保護功能。
- [Power-system automation](https://en.wikipedia.org/wiki/Power-system_automation) — IED、RTU、通訊處理器、breaker status 與 SCADA 相關概念。
- [Substation](https://en.wikipedia.org/wiki/Substation) — 變電站控制室包含 protective relays、meters、breaker controls、communications、batteries、recorders。
