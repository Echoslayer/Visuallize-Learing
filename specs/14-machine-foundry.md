# 晶圓代工 machine spec (`foundry`)

> 由 `/design-machine foundry` 依 `docs/machines/foundry.md` 產出。確認後由 `/add-component` 實作。
- type: machine
- 研究來源: docs/machines/foundry.md
- 機台級流機制: Phase 0(Part.process + ProcessSpec.scale)

## 1. 目標

把 `foundry` 從「外殼 + 屋頂上一排機台 + 軌道」重做成可辨認的 **無塵室製程 bay**:外殼內藏微影機 / 蝕刻沉積 / CMP / 製程晶圓(透視可見),頂部 AMHS + FOUP;機台級流:空白晶圓(藍)+ 設備(灰)進 → 製程站 → 已加工晶圓(綠)出。

## 2. Pattern 選擇

採文件級 pattern **Fab Cleanroom Bay**(先不抽 `engine/kit`):

- root 是大 `box` 外殼(enclosure),內部製程模組透視才看得到。
- 內部:微影機(box 機柱)+ 投影鏡頭(cone)+ 製程晶圓(薄 cylinder)+ 蝕刻/沉積腔體(box repeat)+ CMP(扁 cylinder)。
- 頂部:AMHS 軌道(box)+ FOUP(box),表 fab 物流。
- 省略管路/control rack 細節。root 仍是 `foundry`(維持 annotation / csv / 整線 station)。

## 3. Primitive 組合(world 座標,root anchor `[0, 1.14, 0]`;box 內部 y∈[0.59,1.69])

| part id | 部位 | geometry | transform | material | label/partOf | enclosure | explode |
|---|---|---|---|---|---|---|---|
| foundry | 無塵室 bay / anchor | `box` [1.0,1.1,0.9] bevel0.05 | pos [0,1.14,0] | metal-light | label `晶圓代工/Foundry` + annotation | true | 1.3 |
| foundry-scanner | 微影機 scanner | `box` [0.34,0.5,0.34] bevel0.02 | pos [-0.26,1.12,0.12] | metal-dark | partOf,label `微影機/Litho Scanner` | false | 1.5 |
| foundry-lens | 投影鏡頭 | `cone` [0.09,0.18,12] | pos [-0.26,0.8,0.12] rot[π,0,0] | accent | partOf,label `投影鏡頭/Lens` | false | 1.5 |
| foundry-wafer | 製程晶圓(卡盤) | `cylinder` [0.16,0.16,0.02,20] | pos [-0.26,0.68,0.12] | accent | partOf,label `製程晶圓/Wafer` | false | 1.4 |
| foundry-etch | 蝕刻/沉積腔體 | `box` [0.18,0.5,0.18] bevel0.01 repeat ×2 step[0,0,0.32] | pos [0.24,1.1,-0.16] | metal-dark | partOf,label `蝕刻/沉積/Etch & Depo` | false | 1.6 |
| foundry-cmp | CMP 平坦化 | `cylinder` [0.14,0.14,0.05,16] | pos [0.2,0.66,0.22] | metal-light | partOf,label `平坦化/CMP` | false | 1.4 |
| foundry-foup | FOUP 晶圓盒 | `box` [0.16,0.16,0.16] bevel0.01 | pos [0,1.82,0] | metal-light | partOf,label `晶圓盒/FOUP` | false | 1.7 |
| foundry-rail | AMHS 天車軌道 | `box` [1.2,0.05,0.1] | pos [0,1.94,0] | metal-dark | partOf,label `天車軌道/AMHS Rail` | false | 1.6 |

## 4. 機台級 process(machine-local = world − anchor;scale 0.4)

- station `foundry-proc`: partId `foundry`, processTime 1.2, input `wafer`, output `processed-wafer`。
- route `foundry-in`(main, accent): `[[-1.0,0.1,0.0],[-0.5,0.0,0.0],[0,-0.05,0.0]]`, stop point 2 → foundry-proc。
- route `foundry-supply`(side, metal-light): `[[-0.6,0.4,-0.95],[-0.3,0.15,-0.45],[0,-0.05,0]]`, stop point 2 → foundry-proc。
- route `foundry-out`(main, chip): `[[0,-0.05,0],[0.55,-0.1,0.18],[1.0,0.05,0.38]]`, stop point 0 → foundry-proc。
- tokens: `foundry-in-tok`(foundry-in, accent, 2, r0.06, dur 4.2)、`foundry-supply-tok`(foundry-supply, metal-light, 1, r0.05, dur 4.6)、`foundry-out-tok`(foundry-out, chip, 2, r0.06, dur 4.2)。

> 介面契約:input accent(=矽晶圓 output);output chip(綠,已加工晶圓)。Phase 6 決定整線變色點。

## 5. 互動與 gallery 驗收

- 單機 URL:`?view=gallery&topic=semiconductor&machine=foundry`(+`&xray=1` 看內部製程,+`&names=1` 近看)
- 驗收:
  - 剪影讀得出「無塵室 bay + 頂部天車/FOUP」。
  - 透視看得到內部微影機 + 鏡頭 + 製程晶圓 + 蝕刻腔體 + CMP。
  - 物料:藍空白晶圓 + 灰設備側入 → 製程站 dwell(最長)→ 綠已加工晶圓出;單向;箭頭;in/out 分色。
  - 拆解/名稱/股票皆可用。
