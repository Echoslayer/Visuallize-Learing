# 電力變壓器 machine spec (`power-transformer`)

> 由 `/design-machine power-transformer` 依 `docs/research/machines/power-transformer.md` 產出。確認後由 `/add-component` 實作。
- type: machine
- 研究來源: docs/research/machines/power-transformer.md
- 對應 topic: `grid`

## 1. 目標

把 `grid` 的 `transformer` 節點從「簡化油箱」重做成可辨認的油浸式電力變壓器:高壓側進、鐵芯/繞組轉換、低壓側出,並在透視模式看得到核心供應鏈部位。

## 2. Pattern 選擇

採 `docs/machine-patterns.md` 的 **Transformer** pattern,但補足 Phase B 需要的細節:

- 保留油箱、HV/LV 套管、散熱片、鐵芯、繞組。
- 新增油枕、分接開關、保護/監測附件,讓它不像普通箱體。
- 油箱標 `enclosure:true`;內部鐵芯/繞組用 `partOf:"transformer"`。
- 不抽 `engine/kit`;目前文件級 pattern 已足夠。

## 3. Primitive 組合(world 座標,root anchor `[-0.8, 0.75, 0]`)

| part id | 部位 | geometry | transform | material | label/partOf | enclosure | explode.magnitude |
|---|---|---|---|---|---|---|---|
| transformer | 油箱 / annotation anchor | `box` [0.95,0.85,0.62] bevel 0.03 | pos [-0.8,0.75,0] | metal-dark | label `電力變壓器/Power Transformer` + annotation | true | 0.9 |
| transformer-lid | 頂蓋 | thin `box` [1.03,0.08,0.68] | pos [-0.8,1.2,0] | metal-light | partOf,label `Tank Lid` | false | 0.8 |
| transformer-base | 底座滑軌 | `box` repeat x2 | pos [-0.8,0.28,+/-0.24] | metal-dark | partOf | false | 0.6 |
| transformer-core | 三柱鐵芯 | `box` repeat x3 | pos [-0.8,0.78,0], step [0.18,0,0] | metal-light | partOf,label `Core` | false | 1.3 |
| transformer-windings | 一次/二次繞組 | vertical `cylinder` repeat x3 | 包在 core 外側,略高於油箱中心 | accent | partOf,label `Windings` | false | 1.4 |
| transformer-bushings-hv | 高壓套管 | `cone`/`cylinder` repeat x3 | 油箱左上方 x=-1.18, y=1.42 | metal-light | partOf,label `HV Bushings` | false | 1.2 |
| transformer-bushings-lv | 低壓套管 | shorter `cone`/`cylinder` repeat x3 | 油箱右上方 x=-0.42, y=1.35 | metal-light | partOf,label `LV Bushings` | false | 1.2 |
| transformer-radiators-left | 左側散熱片 | thin `box` repeat x8 | 油箱前側 z=0.42,沿 x 排 | metal-light | partOf,label `Radiators` | false | 1.0 |
| transformer-radiators-right | 右側散熱片 | thin `box` repeat x8 | 油箱後側 z=-0.42,沿 x 排 | metal-light | partOf | false | 1.0 |
| transformer-conservator | 油枕 | horizontal `cylinder` | 油箱後上方,沿 x 軸 | metal-light | partOf,label `Conservator` | false | 1.1 |
| transformer-tap-changer | 分接開關箱 | `box` + small `cylinder` | 油箱右側 x=-0.18,z=0.18 | chip | partOf,label `Tap Changer` | false | 1.1 |
| transformer-protection | 保護/監測附件 | small `box`/`cylinder` cluster | 油箱前上側 | chip | partOf,label `Protection` | false | 1.1 |

## 4. 機台級 process(machine-local 座標 = world - anchor;scale 0.45)

- station `transformer-core-station`: partId `transformer`, processTime 0.8, input `high-voltage-ac`, output `stepped-ac`。
- route `transformer-hv-in`(main, accent): `[[-0.9,0.45,0.05],[-0.45,0.2,0.02],[0,0,0]]`, stop point 2 → core station。
- route `transformer-lv-out`(main, chip): `[[0,0,0],[0.45,0.15,0.02],[0.95,0.38,0.05]]`, stop point 0 → core station。
- route `transformer-signal-in`(side, metal-light): `[[0.65,0.15,-0.65],[0.35,0.05,-0.28],[0.15,0.0,-0.08]]`, stop point 2 → tap/protection。
- tokens:
  - `transformer-hv-token`: `transformer-hv-in`, material `accent`, count 2, radius 0.055, duration 3.8。
  - `transformer-lv-token`: `transformer-lv-out`, material `chip`, count 2, radius 0.055, duration 3.8。
  - `transformer-signal-token`: `transformer-signal-in`, material `metal-light`, count 1, radius 0.035, duration 4.6。

介面契約:輸入 `high-voltage-ac` 對齊 topic `hv-token`;輸出 `stepped-ac` 對齊 topic `lv-token`;控制訊號對齊 topic `signal-token`。

## 5. 互動與 gallery 驗收

- 單機 URL:`?view=gallery&topic=grid&machine=transformer`
- 透視 URL:`?view=gallery&topic=grid&machine=transformer&xray=1&names=1`
- 驗收:
  - 剪影讀得出「油浸式電力變壓器」,不是單方塊。
  - HV/LV 套管分左右,高壓進、低壓出方向清楚。
  - `xray=1` 看得到三柱鐵芯與繞組。
  - 散熱片、油枕、分接開關可辨認;子部位點選回 `transformer` 公司卡。
  - 機台級 token 單向進出,高壓進站停留後低壓出站;signal route 不混入主電力流。

## 6. 實作注意

- 目標 topic:`src/content/grid.json`。
- 優先保留主 id `transformer`,讓 Phase B topic process 與 companies.csv 容易對齊。
- 舊 `grid.json` 若有 `tank/core/bushing/fin` legacy id,實作時可破壞式替換;公司仍掛主節點或新子部位,需人類查證。
- 不新增材質、不新增依賴、不改 engine schema。
- 公司對應需人類查證:華城/士電/亞力/中興電可掛主體;中鋼/大亞/華新若要掛材料子部位再由人類校對。
