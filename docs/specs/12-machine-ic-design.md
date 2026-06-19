# IC 設計 machine spec (`ic-design`)

> 由 `/design-machine ic-design` 依 `docs/research/machines/ic-design.md` 產出。確認後由 `/add-component` 實作。
- type: machine
- 研究來源: docs/research/machines/ic-design.md

## 1. 目標

把半導體 `design` 節點從「普通控制台 + 光罩片」重做成一個可辨認的 **Design Workbench**：使用者一眼看懂這是 IC 設計 / EDA / IP / tape-out 的資訊流節點，輸出 GDS/reticle plate 給後面的晶圓代工，而不是一台製程機台。

## 2. Pattern 選擇

現有 machine pattern 沒有完全對應。採文件級新 pattern **Design Workbench**，但先不寫進 `engine/kit`：

- 借 `Rack` 的小型 compute rack 表達 EDA compute。
- 借 `Factory Cell` 的「多個內部工作站」概念，但不做外殼；IC 設計不是封閉工廠。
- 保留所有有供應鏈意義的部位：EDA monitors、RTL/code、verification waveform、floorplan chip map、IP blocks、PDK/library stack、signoff checklist、GDS/reticle plate。
- 省略椅子、鍵盤細節、辦公室裝潢；它們沒有供應鏈意義。

## 3. Primitive 組合

| part id | 部位 | geometry | transform 概念 | material | label/partOf | enclosure | explode.magnitude |
|---|---|---|---|---|---|---|---|
| design | 主工作台 / annotation anchor | `box` low desk/console | 取代現有 `design`，放在 semiconductor 主線最左側；寬約 0.9，高 0.18，深 0.55 | `metal-dark` | label `IC 設計 / IC Design` + annotation | false | 0.7 |
| design-monitor-code | RTL/code 螢幕 | thin `box` | 站在工作台後方偏左，直立；表 code lines | `metal-light` | partOf `design`，label `RTL / Code` | false | 0.7 |
| design-monitor-wave | verification/waveform 螢幕 | thin `box` | 後方中間，略高；用子條塊表波形 | `metal-light` | partOf `design`，label `Verification` | false | 0.7 |
| design-monitor-layout | layout/timing 螢幕 | thin `box` | 後方偏右，與其他螢幕成淺弧形 | `metal-light` | partOf `design`，label `EDA` | false | 0.7 |
| design-code-lines | code line stripes | small thin `box` + `repeat` | 疊在 code 螢幕前方，3-5 條水平線 | `accent` | partOf `design` | false | 0.7 |
| design-wave-lines | waveform stripes | small thin `box` 手列 3-4 條 | 疊在 waveform 螢幕前方，高低交錯 | `accent` | partOf `design` | false | 0.7 |
| design-chip-map | floorplan chip map | flat `box` | 工作台前方或右側，扁平晶片版圖 | `chip` | partOf `design`，label `Floorplan` | false | 0.7 |
| design-macro-blocks | macro / IP blocks | small `box` 群 | 放在 chip map 上方，3-5 個大小不同區塊 | `metal-light` / `accent` | partOf `design` | false | 0.7 |
| design-ip-library | IP library blocks | small stacked `box` | 工作台左前方，小積木群 | `metal-light` | partOf `design`，label `IP Library` | false | 0.7 |
| design-pdk-stack | PDK / library stack | thin stacked `box` | 工作台後側或左側，像書本/資料疊 | `metal-light` | partOf `design`，label `PDK` | false | 0.7 |
| design-signoff-board | signoff checklist | thin vertical `box` | 工作台右後方；可加小方塊 ticks | `metal-light` | partOf `design`，label `Signoff` | false | 0.7 |
| design-signoff-ticks | DRC/LVS/timing ticks | tiny `box` 手列 3 個 | 貼在 signoff board 上 | `chip` | partOf `design` | false | 0.7 |
| design-reticle | GDS / reticle plate | very thin `box` | 輸出端，靠近往 foundry 的 process route；可沿用現有 id 以少改 CSV/process | `accent` | partOf `design`，label `Tape-out / GDS` | false | 0.7 |
| design-compute-rack | optional EDA compute rack | small `Rack`-like boxes | 工作台後方小型機櫃，若畫面太擠可省 | `metal-dark` + shelves `metal-light` | partOf `design`，label `EDA Compute` | false | 0.7 |

## 4. 互動與 gallery 驗收

- 單機 URL：`?view=gallery&topic=semiconductor&machine=design`
- 近看 URL：`?view=gallery&topic=semiconductor&machine=design&names=1`
- 驗收：
  - 剪影像「設計工作站 / EDA cockpit」，不是普通單方塊或半導體製程機台。
  - 至少能看出三組螢幕、chip floorplan、IP/PDK、signoff、GDS/reticle 輸出。
  - 點任一子部位都回到 `design` 公司卡；子部位名稱可顯示。
  - `design-reticle` 位於輸出方向，和 process 資訊流概念一致。
  - `names=1` 不應讓名稱互相完全蓋住；若太擠，優先保留 `IC 設計`、`Floorplan`、`Tape-out / GDS` 三個 label。

## 5. 實作注意

- 目標 topic：`src/content/semiconductor.json`。
- 優先保留主 id `design`，並可保留/重用 `design-reticle`，避免 `companies.csv` 與 process route 需要大改。
- 現有 `design-monitor` 太泛，可改成 `design-monitor-code` / `design-monitor-wave` / `design-monitor-layout`，都 `partOf: "design"`。
- 不新增材質；只用 `metal-light`、`metal-dark`、`accent`、`chip`。
- 不新增 `engine/kit`；`Design Workbench` 先停留在文件/spec 層。等第二個題目也需要資訊流設計節點，再更新 `docs/machine-patterns.md`。
- 不修改 `process` schema。IC 設計到晶圓代工是資訊流；若現有 process token 已足夠，沿用即可。
- companies.csv 不需為子部位新增公司；公司仍掛在 `design` 節點。
