# 電源盤 machine spec (`tray-power`)

> design-machine 產出。事實見 `docs/research/supply-chains/ai-server.md` §3⑥(電源);取捨見 `docs/specs/17-topic-ai-server.md`。
- type: machine(ai-server 盤)
- 機台級流機制:reuse Part.process + scale 0.6。

## 1. 目標
把 `tray-power` 從單方塊 → 可辨認的 **電源盤(power shelf)**:一排 PSU 電源模組 + DC 匯流排(busbar)+ 電池備援(BBU)。招牌 = PSU brick 排 + accent 匯流排。機台級流:AC 進 → 整流 → DC 出。

## 2. Primitive 組合(world,root anchor `[0, 0.5, 0]`,footprint 2.0×1.4)
| part id | 部位 | geometry | transform | material | label/partOf | explode |
|---|---|---|---|---|---|---|
| tray-power | 盤底/anchor | `box` [2.0,0.06,1.4] | [0,0.5,0] | metal-dark | `電源盤` + annotation | 0.3 |
| tray-power-psu | 電源模組 | `box` [0.32,0.22,0.6] repeat5 step[0.39,0,0] | [-0.78,0.62,0.05] | metal-light | partOf,`電源模組/PSU` | 0.5 |
| tray-power-busbar | DC 匯流排 | `box` [1.9,0.08,0.12] | [0,0.6,0.6] | accent | partOf,`匯流排/Busbar` | 0.6 |
| tray-power-bbu | 電池備援 | `box` [0.6,0.2,0.3] | [0,0.62,-0.55] | metal-dark | partOf,`電池備援/BBU` | 0.55 |

## 3. 機台級 process(machine-local,scale 0.6;AC→整流→DC,分色)
- station `pwr-rectify`: partId tray-power, processTime 0.4, input AC, output DC。
- `pwr-ac-in`(main, metal-dark): `[[-1.5,0.2,0],[-0.7,0.16,0],[0,0.14,0]]` stop2。
- `pwr-dc-out`(main, metal-light): `[[0,0.14,0],[0.7,0.16,0.1],[1.5,0.2,0.15]]` stop0。
- `pwr-dc-up`(side, metal-light): `[[0,0.14,0.1],[0.1,0.45,0.35],[0.2,0.8,0.55]]` stop0(往匯流排/機櫃上行)。
- tokens:ac-in(metal-dark,2,r0.07,dur3.8)、dc-out(metal-light,2,r0.07,dur3.8)、dc-up(metal-light,2,r0.06,dur3.6)。

## 4. 公司(填 companies.csv)
研究 §5:台達電 2308(電源/busbar/HVDC)、光寶 2301(電源/BBU)。

## 5. 驗收
- 剪影讀得出 PSU 模組排 + 匯流排 + BBU(非單方塊)。
- 流:AC(深灰)進 → 整流 → DC(亮灰)出 + 上行;單向、分色(AC→DC)、過站。
