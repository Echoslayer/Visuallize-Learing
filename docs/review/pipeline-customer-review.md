# 製程管線供應鏈 (pipeline) 顧客視角驗收報告

## 一、整體場景

![pipeline overview](../../.agent/shots/pipeline-overview.png)

| 項目 | 判定 | 顧客視角意見 |
|---|---|---|
| 一眼辨識度 | ✅ 通過 | 不看標題也能看出是流體處理 skid：左側原料槽、中段泵/閥/換熱/過濾設備、右側產品槽都在同一底座上。 |
| Spec 符合度 | ✅ 通過 | spec 34 的主要節點都出現：feed tank、pump skid、valve manifold、heat exchanger、filter/separator、product tank、instrument panel。 |
| 相機/構圖 | 🟡 可接受 | 總覽主體清楚；overview 仍出現右上角 dev tuning 面板，顧客畫面不乾淨。 |
| 材質/色彩 | ✅ 通過 | 深色設備、白色管件、藍/綠流體 token 可區分設備與製程流。 |
| 拆解效果 | ✅ 通過 | 拆解後主要部件分離清楚，沒有明顯亂飛或無法辨識。 |
| Enclosure 透視 | N/A | 本題目前沒有 `enclosure: true` 設備需要驗。 |

![pipeline exploded](../../.agent/shots/pipeline-exploded.png)

## 二、逐台設備審查

### 1. 儲槽 / Feed Tank (`tank-1`) — ✅ 通過

![tank-1 frame 0](../../.agent/shots/pipeline-tank-1-0.png)
![tank-1 frame 1](../../.agent/shots/pipeline-tank-1-1.png)

| 維度 | 判定 | 顧客意見 |
|---|---|---|
| 一眼辨識度 | ✅ | 圓筒槽、錐形頂蓋、支腿與底部出口可辨識為原料儲槽。 |
| Spec 符合度 | ✅ | main body、roof、supports、outlet 都有出現。 |
| 相機/構圖 | 🟡 | 單機台視角偏近，底部支腿與出口接近底部控制列。 |
| 動態 | N/A | 此節點沒有需要驗證的 machine-local token。 |

### 2. 產品槽 / Product Tank (`tank-2`) — ✅ 通過

![tank-2 frame 0](../../.agent/shots/pipeline-tank-2-0.png)
![tank-2 frame 1](../../.agent/shots/pipeline-tank-2-1.png)

| 維度 | 判定 | 顧客意見 |
|---|---|---|
| 一眼辨識度 | ✅ | 大型圓筒槽、錐形頂蓋、上方入口與支腿可讀，已像產品儲槽。 |
| Spec 符合度 | ✅ | product tank 應有的 body、roof/supports/inlet 已可見。 |
| 相機/構圖 | 🟡 | 單機台視角仍偏近，底部支腿局部被控制列壓到。 |
| CSV 對應 | ✅ | `tank-2` 已有 pipeline CSV 對應，且 part id 存在。 |

### 3. 泵浦機組 (`pump-skid`) — ✅ 通過

![pump-skid frame 0](../../.agent/shots/pipeline-pump-skid-0.png)
![pump-skid frame 1](../../.agent/shots/pipeline-pump-skid-1.png)

| 維度 | 判定 | 顧客意見 |
|---|---|---|
| 一眼辨識度 | ✅ | 底座、水平馬達、泵殼與法蘭組合可辨識為 pump skid。 |
| Spec 符合度 | ✅ | baseplate、motor、casing、flanges 都有出現。 |
| 動態 | ✅ | Frame 0/1 可見藍色流體 token 明確位移。 |
| 構圖 | 🟡 | 主體偏小，但足以驗收。 |

### 4. 閥門管匯 (`valve-manifold`) — ✅ 通過

![valve-manifold frame 0](../../.agent/shots/pipeline-valve-manifold-0.png)
![valve-manifold frame 1](../../.agent/shots/pipeline-valve-manifold-1.png)

| 維度 | 判定 | 顧客意見 |
|---|---|---|
| 一眼辨識度 | ✅ | 水平管、閥體、上方 actuator/handwheel、法蘭特徵清楚。 |
| Spec 符合度 | ✅ | pipes、valve body、actuator、handwheel、flanges 都符合 spec。 |
| 動態 | ✅ | Frame 0/1 可見 token 沿管線方向移動。 |

### 5. 熱交換器 / 反應器 (`heat-exchanger`) — ✅ 通過

![heat-exchanger frame 0](../../.agent/shots/pipeline-heat-exchanger-0.png)
![heat-exchanger frame 1](../../.agent/shots/pipeline-heat-exchanger-1.png)

| 維度 | 判定 | 顧客意見 |
|---|---|---|
| 一眼辨識度 | ✅ | 板式換熱器的端板、板片堆疊和導桿輪廓可辨識。 |
| Spec 符合度 | ✅ | frames、heat plates、guide bars 都可見。 |
| 動態 | 🟡 | Frame 0/1 可見 token 位移，且接近設備接口；但流體是否穿過板片本體不是非常清楚。 |
| 構圖 | ✅ | 主體大小適中。 |

### 6. 過濾器 / 分離器 (`filter-separator`) — ✅ 通過

![filter-separator frame 0](../../.agent/shots/pipeline-filter-separator-0.png)
![filter-separator frame 1](../../.agent/shots/pipeline-filter-separator-1.png)

| 維度 | 判定 | 顧客意見 |
|---|---|---|
| 一眼辨識度 | ✅ | 立式筒體、底部錐形/底座、側向接口可辨識為過濾/分離設備。 |
| Spec 符合度 | ✅ | body、bottom、top、inlet/outlet ports 都有出現。 |
| 動態 | 🟡 | Frame 0/1 可見 token 位移；token 貼近接口，但通過筒體中心的語意仍可更清楚。 |

### 7. 儀控盤 (`instrument-panel`) — ✅ 通過

![instrument-panel frame 0](../../.agent/shots/pipeline-instrument-panel-0.png)
![instrument-panel frame 1](../../.agent/shots/pipeline-instrument-panel-1.png)

| 維度 | 判定 | 顧客意見 |
|---|---|---|
| 一眼辨識度 | ✅ | 控制櫃、HMI 面板、側邊 sensor/訊號點可辨識為儀控盤。 |
| Spec 符合度 | ✅ | cabinet、HMI、sensor 皆可見。 |
| 動態 | ✅ | Frame 0/1 可見藍色 signal token 位移，單機台 gallery 已能正常截圖。 |

## 三、CSV 對應

| 檢查 | 結果 |
|---|---|
| `pipeline` rows | 15 |
| CSV 對應且存在的 part id | `tank-1`, `tank-2`, `valve-manifold`, `pump-skid`, `heat-exchanger`, `filter-separator`, `instrument-panel` |
| CSV 中不存在的 part id | 無 |
| 根節點但無公司映射 | 無 |
| 內容準確性 | 公司與 ticker 仍需人類校對。 |

## 四、Spec 差距對照

| Spec | 驗收結果 | 差距 |
|---|---|---|
| 34-topic-pipeline | ✅ 已達成 | Compact skid、左到右製程線、儀控側線都可辨識。 |
| 35-machine-storage-tank | ✅ 已達成 | 兩座槽體均具儲槽特徵；單機台相機偏近。 |
| 36-machine-pump-skid | ✅ 已達成 | 無主要差距。 |
| 37-machine-valve-manifold | ✅ 已達成 | 無主要差距。 |
| 38-machine-heat-exchanger | 🟡 大致達成 | 幾何達成；局部流體通過板片本體的視覺語意略弱。 |
| 39-machine-filter-separator | 🟡 大致達成 | 幾何達成；局部 token 通過筒體中心的語意略弱。 |
| 40-machine-instrument-panel | ✅ 已達成 | 單機台 gallery 已可截圖並確認 signal token 位移。 |

## 五、問題清單

### 🔴 Must-Fix

- 無。

### 🟡 Should-Fix

- Overview 截圖出現 dev tuning 面板，顧客視角不夠乾淨。
- `tank-1` / `tank-2` 單機台相機偏近，底部結構接近或被底部控制列遮擋。
- `heat-exchanger` 與 `filter-separator` 的局部 token 雖有位移，但「穿過設備本體」的語意不如 pump/valve 清楚。

### 🟢 Nice-to-Have

- Pump skid 單機台畫面主體偏小，可讀但不夠飽滿。

## 六、結論

**判定：✅ 通過。**

目前 `pipeline` 已能以顧客視角理解為一座製程管線 / fluid processing skid demo。所有根節點可在 gallery 單機台檢視，CSV id 皆存在，雙幀截圖確認 pump、valve、heat、filter、instrument 的 token 有實際位移。剩餘問題是構圖與局部流體語意清晰度，不阻擋通過。
