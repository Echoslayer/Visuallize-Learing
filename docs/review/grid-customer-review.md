# 重電 / 電網供應鏈 (grid) 顧客視角驗收報告

## 一、整體場景

![grid overview](../../.agent/shots/grid-overview.png)

| 項目 | 判定 | 顧客視角意見 |
|---|---|---|
| 一眼辨識度 | ✅ 通過 | 不看標題也能看出這是一組小型變電站/重電設備鏈，而不是單一變壓器。左側 GIS、中央變壓器、母線、控制盤、右側配電/負載形成清楚的電力設備序列。 |
| Spec 符合度 | ✅ 通過 | spec 18 指定的 5 個節點皆出現：`gis`, `transformer`, `busbar`, `control`, `distribution`。 |
| 相機/構圖 | 🟡 可接受 | 主體置中、比例可讀；但 overview 截圖右上角出現 dev tuning 面板，對顧客驗收畫面有干擾。 |
| 材質/色彩 | ✅ 通過 | 黑/白金屬建立重電設備質感，藍色/綠色 token 區分高壓、低壓與控制訊號，語意清楚。 |
| 拆解效果 | ✅ 通過 | 拆解後主要部件分離清楚，沒有明顯亂飛或遮蔽到不可辨識。 |

![grid exploded](../../.agent/shots/grid-exploded.png)

## 二、逐台設備審查

### 1. GIS / 斷路器 (`gis`) — ✅ 通過

![grid gis frame 0](../../.agent/shots/grid-gis-0.png)
![grid gis frame 1](../../.agent/shots/grid-gis-1.png)

| 維度 | 判定 | 顧客意見 |
|---|---|---|
| 一眼辨識度 | ✅ | 金屬箱體、三相套管、操作箱、出線管可讀，能辨識為高壓開關/GIS 類設備。 |
| Spec 符合度 | ✅ | GIS tank、三相管、breaker chamber、drive、bushings、monitor 等特徵都有出現。 |
| 動態 | ✅ | Frame 0/1 可見藍色高壓 token 明確位移，方向可讀。 |
| X-Ray | ✅ | 透視模式能看到內部斷路器腔。 |

![grid gis xray](../../.agent/shots/grid-gis-xray.png)

### 2. 電力變壓器 (`transformer`) — ✅ 通過

![grid transformer frame 0](../../.agent/shots/grid-transformer-0.png)
![grid transformer frame 1](../../.agent/shots/grid-transformer-1.png)

| 維度 | 判定 | 顧客意見 |
|---|---|---|
| 一眼辨識度 | ✅ | 油箱、散熱片、油枕、HV/LV 套管讓剪影很像油浸式電力變壓器。 |
| Spec 符合度 | ✅ | 頂蓋、散熱片、套管、油枕、分接開關、保護監測附件都有出現。 |
| 動態 | ✅ | Frame 0/1 可見高壓進線與低壓出線 token 位移，方向符合轉換站語意。 |
| X-Ray | 🟡 可接受 | 可看到內部核心/繞組，但名稱標籤在頂部局部重疊，細節閱讀略受干擾。 |

![grid transformer xray](../../.agent/shots/grid-transformer-xray.png)

### 3. 母線 / 電纜 (`busbar`) — ✅ 通過

![grid busbar frame 0](../../.agent/shots/grid-busbar-0.png)
![grid busbar frame 1](../../.agent/shots/grid-busbar-1.png)

| 維度 | 判定 | 顧客意見 |
|---|---|---|
| 一眼辨識度 | ✅ | 三相母線、絕緣支柱、電纜終端與出線電纜可辨識。 |
| Spec 符合度 | ✅ | busbar bars、insulators、terminations、feeder cables 都有出現。 |
| 動態 | ✅ | Frame 0/1 可見綠色低壓/負載 token 沿母線與出線方向移動。 |
| 構圖 | ✅ | 主體大小適中，沒有被 UI 遮擋。 |

### 4. 控制保護 / SCADA (`control`) — ✅ 通過

![grid control frame 0](../../.agent/shots/grid-control-0.png)
![grid control frame 1](../../.agent/shots/grid-control-1.png)

| 維度 | 判定 | 顧客意見 |
|---|---|---|
| 一眼辨識度 | 🟡 可接受 | 可看出是控制櫃/盤面，但若不看側欄名稱，重電控制保護語意比 GIS 與變壓器弱。 |
| Spec 符合度 | ✅ | relay modules、SCADA screen、terminal blocks、comms/UPS 皆可見。 |
| 動態 | ✅ | Frame 0/1 可見白色 signal token 位移，且沒有混用主電力顏色。 |
| 構圖 | ✅ | 單機視角清楚，盤面模組沒有被遮擋。 |

### 5. 配電 / 用電端 (`distribution`) — ✅ 通過

![grid distribution frame 0](../../.agent/shots/grid-distribution-0.png)
![grid distribution frame 1](../../.agent/shots/grid-distribution-1.png)

| 維度 | 判定 | 顧客意見 |
|---|---|---|
| 一眼辨識度 | ✅ | 配電盤、主斷路器、分路模組、右側負載 rack 一眼可讀。 |
| Spec 符合度 | ✅ | meter/HMI、main breaker、breakers、terminals、feeder cables、load rack 都有出現。 |
| 動態 | ✅ | Frame 0/1 可見綠色 token 從配電盤往負載端移動。 |
| 構圖 | ✅ | 主體大小與角度適合審查。 |

## 三、CSV 對應

| 檢查 | 結果 |
|---|---|
| `companies.csv` 中 grid rows | 19 |
| 對應 part id | `transformer`, `gis`, `busbar`, `control`, `distribution` |
| JSON 中不存在的對應 id | 無 |
| 內容準確性 | 仍依 repo 文件標註，需人類校對公司與股票對應。 |

## 四、Spec 差距對照

| Spec | 驗收結果 | 差距 |
|---|---|---|
| 18-topic-grid | ✅ 已達成 | 5 節點小型變電站、topic-level HV/LV/control process、拆解與 gallery 皆可用。 |
| 19-machine-power-transformer | ✅ 已達成 | X-Ray 內部可讀，但名稱標籤局部重疊。 |
| 20-machine-gis-breaker | ✅ 已達成 | 無明顯差距。 |
| 23-machine-busbar-cable | ✅ 已達成 | 無明顯差距。 |
| 24-machine-control-protection | 🟡 大致達成 | 控制盤可讀，但單靠剪影的重電/SCADA 辨識度較弱。 |
| 25-machine-distribution-load | ✅ 已達成 | 無明顯差距。 |

## 五、問題清單

### 🔴 Must-Fix

- 無。

### 🟡 Should-Fix

- Overview 截圖出現右上角 dev tuning 面板，對顧客視角驗收有干擾。
- Transformer X-Ray 開名稱時，局部標籤重疊，閱讀內部零件名稱稍受影響。

### 🟢 Nice-to-Have

- `control` 控制保護盤的剪影語意略弱；目前可辨識為控制櫃，但不如 GIS、transformer、distribution 一眼有重電特徵。

## 六、結論

**判定：✅ 通過。**

`grid` 已能以顧客視角理解為「重電 / 電網供應鏈」小型變電站 demo。整體電力流、五台根節點、單機 gallery、拆解、X-Ray 與雙幀動態皆可驗收；剩餘問題屬畫面潔淨度與局部可讀性，不阻擋通過。
