# 設備 / 材料 machine spec (`equip`)

> 由 `/design-machine equipment` 依 `docs/machines/equipment.md` 產出。確認後由 `/add-component` 實作。
- type: machine
- 研究來源: docs/machines/equipment.md
- 機台級流機制: Phase 0(Part.process + ProcessSpec.scale)

## 1. 目標

把 `equip` 從「單一 cluster tool(EFEM+腔體)」補成 **設備 + 材料供應 hub**:保留設備側 cluster tool,加上材料側(氣體鋼瓶 / 化學品桶 / 光罩盒);機台級流是源頭:原料(深灰)拉進配製站 → `supply`(亮灰)往 fab 出。

## 2. Pattern 選擇

採文件級 pattern **Supply Hub**(先不抽 `engine/kit`):

- 設備側:mainframe(box)+ EFEM + load ports + 製程腔體(cylinder repeat)+ 氣體管路。
- 材料側:氣體鋼瓶(細高 cylinder repeat)+ 化學品桶(cylinder repeat)+ 光罩盒(thin box)。
- 是源頭:machine-local 流以 output 為主,僅短 in-route 表原料拉入。root 仍是 `equip`。

## 3. Primitive 組合(world 座標,root anchor `[-0.9, 1.06, -1.3]`)

| part id | 部位 | geometry | transform | material | label/partOf | explode |
|---|---|---|---|---|---|---|
| equip | mainframe / anchor | `box` [0.65,0.95,0.65] bevel0.04 | pos [-0.9,1.06,-1.3] | metal-dark | label `設備/材料` + annotation | 1.1 |
| equip-efem | EFEM 前端 | `box` [0.65,0.28,0.32] bevel0.03 | pos [-0.9,1.4,-1.02] | metal-light | partOf,label `EFEM 前端模組` | 1.3 |
| equip-ports | 裝載埠 | `box` [0.13,0.18,0.13] bevel0.01 repeat ×3 step[0.22,0,0] | pos [-1.13,1.4,-0.84] | metal-light | partOf,label `裝載埠/Load Port` | 1.5 |
| equip-chamber | 製程腔體 | `cylinder` [0.18,0.18,0.26,16] repeat ×2 step[0.34,0,0] | pos [-1.06,1.66,-1.4] | metal-light | partOf,label `製程腔/Chamber` | 1.4 |
| equip-pipe | 氣體管路 | `cylinder` [0.035,0.035,0.5,8] | pos [-0.58,1.3,-1.4] | metal-dark | partOf,label `氣體管路/Gas Line` | 1.2 |
| equip-gas | 特殊氣體鋼瓶 | `cylinder` [0.05,0.05,0.42,12] repeat ×3 step[0.14,0,0] | pos [-0.5,0.95,-1.45] | metal-light | partOf,label `氣體鋼瓶/Gas` | 1.5 |
| equip-drums | 化學品/光阻桶 | `cylinder` [0.1,0.1,0.22,16] repeat ×2 step[0.26,0,0] | pos [-0.52,0.78,-1.05] | metal-dark | partOf,label `化學品/Chemicals` | 1.4 |
| equip-mask | 光罩盒 | `box` [0.18,0.05,0.18] bevel0.01 | pos [-0.5,0.95,-1.0] | accent | partOf,label `光罩盒/Mask` | 1.6 |

## 4. 機台級 process(machine-local = world − anchor;scale 0.4)

- station `equip-dispense`: partId `equip`, processTime 0.4, output `supply`(源頭,無 input)。
- route `equip-stage`(side, metal-dark): `[[0.6,-0.05,0.3],[0.3,0.0,0.1],[0,0,0]]`, stop point 2 → equip-dispense。
- route `equip-out`(main, metal-light): `[[0,0,0],[0.5,0.05,0.5],[1.0,0.1,0.95]]`, stop point 0 → equip-dispense。
- tokens: `equip-stage-tok`(equip-stage, metal-dark, 2, r0.05, dur 3.0)、`equip-out-tok`(equip-out, metal-light, 3, r0.05, dur 3.4)。

> 介面契約:output metal-light(=整線 supply-route 材質 = foundry 側向 input)。

## 5. 互動與 gallery 驗收

- 單機 URL:`?view=gallery&topic=semiconductor&machine=equip`(+`&names=1` 近看)
- 驗收:
  - 剪影讀得出「設備 cluster tool + 材料(氣瓶/化學桶/光罩盒)」兩類供應。
  - 物料:深灰原料拉進 → 配製站 → 亮灰 supply 往 fab 出;單向;箭頭;in/out 分色。
  - 拆解/名稱/股票皆可用。
