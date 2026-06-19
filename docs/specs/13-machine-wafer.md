# 矽晶圓 machine spec (`wafer`)

> 由 `/design-machine wafer` 依 `docs/research/machines/wafer.md` 產出。確認後由 `/add-component` 實作。
- type: machine
- 研究來源: docs/research/machines/wafer.md
- 機台級流機制: 見 `docs/progress/semiconductor-machine-redo.md` Phase 0(Part.process + ProcessSpec.scale)

## 1. 目標

把 `wafer` 節點從「單一晶棒圓柱 + 疊片 + 卡匣」重做成可辨認的 **長晶 → 切片 → 拋光** 晶圓製造單元,並加機台級物料流:多晶矽(灰)進 → 長晶站 → 矽晶圓(藍)出。

## 2. Pattern 選擇

採文件級 pattern **Crystal-Growth Cell**(先不抽進 `engine/kit`):

- 核心是直立長晶爐(`cylinder` 腔體,`enclosure` 可透視看晶棒)+ 旁邊切片/拋光小站。
- 保留有供應鏈意義部位:爐體、坩堝、晶種桿、晶棒、線鋸、晶圓疊、卡匣、CMP 盤。
- 省略爐體管路、控制櫃細節(無供應鏈意義)。
- root 仍是 `wafer`(維持 annotation / companies.csv / 整線 process station 對應)。

## 3. Primitive 組合(world 座標,root anchor `[-2.0, 1.0, 0]`)

| part id | 部位 | geometry | transform | material | label/partOf | enclosure | explode |
|---|---|---|---|---|---|---|---|
| wafer | 長晶爐腔體 / anchor | `cylinder` [0.24,0.24,0.92,16] | pos [-2.0,1.0,0] | metal-light | label `矽晶圓/Silicon Wafer` + annotation | true | 1.1 |
| wafer-ingot | 單晶晶棒 | `cylinder` [0.1,0.13,0.56,16] | pos [-2.0,1.0,0] | accent | partOf,label `晶棒/Ingot` | false | 1.3 |
| wafer-crucible | 石英坩堝+熔湯 | `cylinder` [0.17,0.13,0.13,16] | pos [-2.0,0.66,0] | metal-dark | partOf,label `坩堝/Crucible` | false | 1.2 |
| wafer-seed | 晶種桿 | `cylinder` [0.018,0.018,0.26,12] | pos [-2.0,1.52,0] | metal-dark | partOf,label `晶種桿/Seed` | false | 1.5 |
| wafer-saw | 線鋸切片站 | `box` [0.3,0.22,0.3] bevel 0.02 | pos [-1.55,0.7,0.02] | metal-dark | partOf,label `線鋸切片/Wire Saw` | false | 1.2 |
| wafer-discs | 晶圓片(疊) | `cylinder` [0.2,0.2,0.018,20] repeat ×3 step[0,0.05,0] | pos [-1.55,0.84,0] | accent | partOf,label `晶圓片/Wafer` | false | 1.4 |
| wafer-holder | 卡匣 | `box` [0.34,0.1,0.34] bevel 0.02 | pos [-1.55,0.64,0] | metal-dark | partOf,label `卡匣/Cassette` | false | 1.0 |
| wafer-polish | CMP 拋光盤 | `cylinder` [0.17,0.17,0.04,20] | pos [-1.5,0.66,-0.34] | metal-light | partOf,label `拋光/CMP` | false | 1.2 |

## 4. 機台級 process(machine-local 座標 = world − anchor;scale 0.4)

- station `wafer-grow`: partId `wafer`, processTime 0.8, input `silicon`, output `wafer`。
- route `wafer-in`(side, metal-light): `[[-0.95,0.25,0.4],[-0.4,0.05,0.15],[0,-0.05,0]]`, stop point 2 → wafer-grow。
- route `wafer-out`(main, accent): `[[0,-0.05,0],[0.5,-0.12,0.18],[1.0,0.0,0.36]]`, stop point 0 → wafer-grow。
- tokens: `wafer-in-tok`(wafer-in, metal-light, count 2, r0.06, dur 3.6)、`wafer-out-tok`(wafer-out, accent, count 2, r0.06, dur 3.6)。

> 介面契約:output `wafer` = accent(藍),對齊整線 `wafer-route` 材質與 foundry input。

## 5. 互動與 gallery 驗收

- 單機 URL:`?view=gallery&topic=semiconductor&machine=wafer`(+`&names=1` 近看,+`&xray=1` 看爐內晶棒)
- 驗收:
  - 剪影讀得出「長晶爐 + 晶棒 + 切片 + 晶圓疊」,不是單一圓柱。
  - 透視看得到爐體內晶棒。
  - 物料:灰多晶矽單向進 → 長晶站 dwell → 藍矽晶圓單向出;in/out 分色;箭頭單向;token 過站心。
  - 拆解/名稱/股票皆可用。
