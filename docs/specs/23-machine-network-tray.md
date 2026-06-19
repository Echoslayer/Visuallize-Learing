# 網路交換盤 machine spec (`tray-network`)

> design-machine 產出。事實見 `docs/research/supply-chains/ai-server.md` §3⑤(網路+光收發);取捨見 `docs/specs/17-topic-ai-server.md`。
- type: machine(ai-server 盤)
- 機台級流機制:reuse Part.process + scale 0.6。

## 1. 目標
把 `tray-network` 從單方塊 → 可辨認的 **網路交換盤**:交換 ASIC + 散熱器 + 前面板光模組籠陣列(招牌)。招牌 = 前緣一排密集光模組(與其他盤區隔)。

## 2. Primitive 組合(world,root anchor `[0, 1.0, 0]`,footprint 2.0×1.4)
| part id | 部位 | geometry | transform | material | label/partOf | explode |
|---|---|---|---|---|---|---|
| tray-network | 盤底/anchor | `box` [2.0,0.06,1.4] | [0,1.0,0] | metal-dark | `網路交換盤` + annotation | 0.55 |
| tray-network-pcb | 電路板 | `box` [1.9,0.04,1.3] | [0,1.05,0] | chip | partOf,`電路板/PCB` | 0.55 |
| tray-network-asic | 交換晶片 | `box` [0.55,0.1,0.55] | [0,1.13,0] | metal-dark | partOf,`交換晶片/Switch ASIC` | 0.75 |
| tray-network-heatsink | 散熱器 | `box` [0.55,0.06,0.55] | [0,1.2,0] | metal-light | partOf,`散熱器/Heatsink` | 0.85 |
| tray-network-optical | 光模組 | `box` [0.12,0.1,0.22] repeat12 step[0.15,0,0] | [-0.83,1.08,-0.58] | metal-light | partOf,`光模組/Optical Module` | 0.9 |

## 3. 機台級 process(machine-local,scale 0.6)
- station `net-switch`: partId tray-network, processTime 0.5, input data, output data。
- `net-in`(main, accent): `[[-1.5,0.16,0],[-0.7,0.13,0],[0,0.12,0]]` stop2。
- `net-out`(main, accent): `[[0,0.12,0],[0.7,0.15,0.1],[1.5,0.18,0.15]]` stop0。
- `net-optical-out`(side, accent): `[[0,0.12,0],[0,0.1,-0.4],[-0.2,0.08,-0.78]]` stop0(往光模組側出)。
- `net-power-in`(side, metal-light): `[[0.2,-0.15,0.78],[0.05,0,0.4],[0,0.12,0.05]]` stop2。
- tokens:net-in/net-out(accent,2,r0.07,dur3.6)、net-optical-out(accent,2,r0.06,dur3.4)、net-power-in(metal-light,1,r0.06,dur4.2)。

## 4. 公司(填 companies.csv)
研究 §5:Broadcom/Marvell(交換 ASIC/DSP)、智邦 2345(交換系統)、Innolight/Eoptolink(光模組)。

## 5. 驗收
- 剪影讀得出交換 ASIC + 前排光模組陣列(非單方塊)。
- 流:封包 in → 交換 → 封包 out(含光模組側出)+ 電源 in;單向、過站。
