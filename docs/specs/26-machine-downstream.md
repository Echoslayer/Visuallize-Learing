# 下游應用 machine spec (`downstream`)

> design-machine 產出。事實見 `docs/research/machines/downstream.md`;整線取捨見 `docs/specs/09-topic-semiconductor.md`。
- type: machine(semiconductor 節點)
- 機台級流機制:reuse Part.process + scale 0.4。

## 1. 目標
把 `downstream` 從「單一伺服器機櫃」重做成 **終端市場 showcase**:伺服器 + 手機 + 筆電 + 汽車並陳於一個市場平台,讀得出「同一顆晶片撐起多個終端」。機台級流:綠晶片進 → 整合 → 終端產品出。

## 2. Primitive 組合(world,root anchor `[4.0, 0.74, 0]`)
| part id | 部位 | geometry | transform | material | label/partOf | explode |
|---|---|---|---|---|---|---|
| downstream | 市場平台/anchor | `box` [0.95,0.12,0.75] | [4.0,0.74,0] | metal-dark | `下游應用` + annotation | 1.0 |
| downstream-trays | 伺服器 | `box` [0.22,0.05,0.22] repeat4 step[0,0.11,0] | [3.74,0.92,0.15] | metal-light | partOf,`伺服器/AI Server` | 1.2 |
| downstream-phone | 智慧手機 | `box` [0.12,0.24,0.02] | [4.05,0.92,0.2] | metal-light | partOf,`智慧手機/Smartphone` | 1.3 |
| downstream-laptop-base | 筆電底 | `box` [0.22,0.02,0.15] | [4.18,0.81,-0.12] | metal-light | partOf,`筆電/Laptop` | 1.3 |
| downstream-laptop-screen | 筆電螢幕 | `box` [0.22,0.15,0.02] rot[-0.4,0,0] | [4.18,0.88,-0.19] | metal-light | partOf,`筆電/Laptop` | 1.35 |
| downstream-car-body | 車身 | `box` [0.3,0.08,0.15] | [3.75,0.84,-0.2] | metal-dark | partOf,`車用電子/Automotive` | 1.3 |
| downstream-car-cabin | 座艙 | `box` [0.15,0.07,0.13] | [3.73,0.91,-0.2] | metal-light | partOf,`車用電子/Automotive` | 1.4 |
| downstream-car-wheels | 車輪 | `cylinder` [0.04,0.04,0.05,12] rot[1.5708,0,0] repeat2 step[0.18,0,0] | [3.66,0.78,-0.13] | metal-dark | partOf,`車用電子/Automotive` | 1.45 |

## 3. 機台級 process(machine-local,scale 0.4)
- station `ds-integrate`: partId downstream, processTime 0.6, input chip, output system。
- `ds-in`(main, chip): `[[-0.95,0.3,0],[-0.4,0.18,0],[0,0.12,0]]` stop2。
- `ds-out`(main, metal-light): `[[0,0.12,0],[0.5,0.2,0.1],[0.95,0.3,0.2]]` stop0。
- tokens:ds-in(chip,2,r0.06,dur3.6)、ds-out(metal-light,2,r0.06,dur3.6)。

## 4. 公司(填 companies.csv)
研究 §5:鴻海2317、廣達2382、緯創3231、華碩2357、宏碁2353、Apple。

## 5. 驗收
- 剪影讀得出多個終端(伺服器/手機/筆電/車),非單一機櫃。
- 流:綠晶片進 → 整合 → 亮灰終端出;單向、分色、過站。
