# 封裝測試 machine spec (`osat`)

> 由 `/design-machine osat` 依 `docs/machines/osat.md` 產出。確認後由 `/add-component` 實作。
- type: machine
- 研究來源: docs/machines/osat.md
- 機台級流機制: Phase 0(Part.process + ProcessSpec.scale)

## 1. 目標

把 `osat` 從「mainframe + 載板 + 打線臂 + 測試機 + 測試座」補成可辨認的 **封裝 → 測試 線**:封裝段(切割/載板/打線/封膠)+ 測試段(測試機/測試座/成品盤);機台級流:藍已加工晶圓進 → 封裝測試站 → 綠成品晶片出(整線藍→綠變色點)。

## 2. Pattern 選擇

採文件級 pattern **Assembly & Test Line**(先不抽 `engine/kit`):

- 封裝段:mainframe(box)上方 切割機 + 封裝載板 + 打線臂 + 封膠壓模。
- 測試段:測試機 handler(box)+ 測試座(box repeat)+ 成品盤(扁 box,chip 材質)。
- 省略 tape&reel、雷射標記細節。root 仍是 `osat`。

## 3. Primitive 組合(world 座標,root anchor `[2.0, 0.98, 0]`)

| part id | 部位 | geometry | transform | material | label/partOf | explode |
|---|---|---|---|---|---|---|
| osat | 封裝 mainframe / anchor | `box` [0.55,0.78,0.55] bevel0.04 | pos [2.0,0.98,0] | metal-dark | label `封裝測試` + annotation | 1.1 |
| osat-dicing | 切割機 | `box` [0.2,0.12,0.2] bevel0.01 | pos [1.8,1.42,0.14] | metal-light | partOf,label `切割/Dicing` | 1.5 |
| osat-substrate | 封裝載板 | `box` [0.36,0.04,0.36] bevel0.01 | pos [2.06,1.41,0.04] | accent | partOf,label `封裝載板/Substrate` | 1.4 |
| osat-arm | 打線臂 | `cylinder` [0.03,0.03,0.26,8] | pos [2.06,1.52,0.04] rot[0.4,0,0] | metal-light | partOf,label `打線臂/Bonder` | 1.3 |
| osat-mold | 封膠壓模 | `box` [0.3,0.16,0.3] bevel0.02 | pos [2.0,1.62,-0.18] | metal-dark | partOf,label `封膠/Molding` | 1.6 |
| osat-handler | 測試機 | `box` [0.4,0.6,0.4] bevel0.03 | pos [2.42,0.9,0] | metal-dark | partOf,label `測試機/Tester` | 1.2 |
| osat-sockets | 測試座 | `box` [0.11,0.07,0.11] bevel0.005 repeat ×2 step[0.16,0,0] | pos [2.34,1.22,0] | metal-light | partOf,label `測試座/Socket` | 1.4 |
| osat-tray | 成品盤 | `box` [0.3,0.04,0.2] bevel0.01 | pos [2.42,1.24,0.22] | chip | partOf,label `成品盤/Chip Tray` | 1.5 |

## 4. 機台級 process(machine-local = world − anchor;scale 0.4)

- station `osat-pkg`: partId `osat`, processTime 0.9, input `processed-wafer`, output `chip`。
- route `osat-in`(main, accent): `[[-1.0,0.1,0.0],[-0.5,0.05,0.0],[0,0.0,0.05]]`, stop point 2 → osat-pkg。
- route `osat-out`(main, chip): `[[0,0.0,0.05],[0.5,0.1,0.15],[1.0,0.15,0.3]]`, stop point 0 → osat-pkg。
- tokens: `osat-in-tok`(osat-in, accent, 2, r0.06, dur 3.8)、`osat-out-tok`(osat-out, chip, 2, r0.06, dur 3.8)。

> 介面契約:input accent(藍,已加工晶圓);output chip(綠,成品晶片)= 整線 chip-route 材質 = downstream input。**整線藍→綠變色點即此節點(與 topic 一致)。**

## 5. 互動與 gallery 驗收

- 單機 URL:`?view=gallery&topic=semiconductor&machine=osat`(+`&names=1` 近看)
- 驗收:
  - 剪影讀得出「封裝段 + 測試段」兩段。
  - 物料:藍已加工晶圓進 → 封測站 dwell → 綠成品晶片出;單向;箭頭;in/out 分色(藍→綠)。
  - 拆解/名稱/股票皆可用。
