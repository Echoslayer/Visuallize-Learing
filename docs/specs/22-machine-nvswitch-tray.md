# NVSwitch 交換盤 machine spec (`tray-nvswitch`)

> design-machine 產出。事實見 `docs/research/supply-chains/ai-server.md` §3④(NVLink/NVSwitch);取捨見 `docs/specs/17-topic-ai-server.md`。
- type: machine(ai-server 盤)
- 機台級流機制:reuse Part.process + scale 0.6。

## 1. 目標
把 `tray-nvswitch` 從單方塊 → 可辨認的 **NVLink 交換盤**:大顆 NVSwitch ASIC(中央)+ 散熱蓋 + 高密度連接器排 + 銅纜束(藍,arcing 往背板)。招牌 = 中央大晶片 + 銅纜 fabric。

## 2. Primitive 組合(world,root anchor `[0, 1.4, 0]`,footprint 2.0×1.4)
| part id | 部位 | geometry | transform | material | label/partOf | explode |
|---|---|---|---|---|---|---|
| tray-nvswitch | 盤底/anchor | `box` [2.0,0.06,1.4] | [0,1.4,0] | metal-dark | `NVSwitch 交換盤` + annotation | 0.85 |
| tray-nvswitch-pcb | 電路板 | `box` [1.9,0.04,1.3] | [0,1.45,0] | chip | partOf,`電路板/PCB` | 0.85 |
| tray-nvswitch-asic | NVSwitch 晶片 | `box` [0.6,0.12,0.6] | [0,1.53,0] | metal-dark | partOf,`NVSwitch 晶片/ASIC` | 1.0 |
| tray-nvswitch-cover | 散熱蓋 | `box` [0.62,0.05,0.62] | [0,1.61,0] | accent | partOf,`散熱蓋/Heat Spreader` | 1.1 |
| tray-nvswitch-conn | 高密度連接器 | `box` [0.12,0.12,0.08] repeat10 step[0.15,0,0] | [-0.7,1.5,0.62] | metal-light | partOf,`高密度連接器/Connector` | 1.15 |
| tray-nvswitch-cable | NVLink 銅纜 | `tube` path arc radius0.025 repeat5 step[0.25,0,0] | 近 ASIC → 背板 | accent | partOf,`NVLink 銅纜/Copper Cable` | 1.2 |

## 3. 機台級 process(machine-local,scale 0.6;switch fabric 多路 in→交換→多路 out,全 accent)
- station `nvsw-switch`: partId tray-nvswitch, processTime 0.5, input data, output data。
- `nvsw-in-1`(side, accent): `[[-1.5,0.16,-0.3],[-0.7,0.13,-0.15],[0,0.12,0]]` stop2。
- `nvsw-in-2`(side, accent): `[[-0.3,-0.1,0.8],[-0.1,0.05,0.4],[0,0.12,0.05]]` stop2。
- `nvsw-out-1`(main, accent): `[[0,0.12,0],[0.7,0.15,0.1],[1.5,0.18,0.2]]` stop0。
- `nvsw-out-2`(side, accent): `[[0,0.12,0.05],[0.2,0.2,0.4],[0.4,0.25,0.75]]` stop0。
- tokens:in-1/out-1(accent,2,r0.06,dur3.4)、in-2/out-2(accent,1,r0.06,dur3.8)。

## 4. 公司(填 companies.csv)
研究 §5:NVIDIA(NVSwitch)、Amphenol(銅纜/連接器)、嘉澤 3533、貿聯 3665。

## 5. 驗收
- 剪影讀得出中央大 ASIC + 銅纜束 + 連接器排(非單方塊)。
- 流:多路藍資料 in → 交換 → 多路 out;單向、過站。
