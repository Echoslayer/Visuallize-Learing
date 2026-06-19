# CPU 運算盤 machine spec (`tray-cpu`)

> design-machine 產出。事實見 `docs/research/supply-chains/ai-server.md` §3③(CPU);整體取捨見 `docs/specs/17-topic-ai-server.md`。
- type: machine(ai-server 盤)
- 機台級流機制:reuse Part.process + scale 0.6。

## 1. 目標
把 `tray-cpu` 從單方塊 → 可辨認的 **CPU 主機盤**:CPU socket + 散熱器 + DIMM 記憶體條 banks + VRM。視覺招牌 = DIMM 立條陣列(與 GPU 盤的冷板/HBM 區隔)。

## 2. Primitive 組合(world,root anchor `[0, 1.8, 0]`,footprint 2.0×1.4)
| part id | 部位 | geometry | transform | material | label/partOf | explode |
|---|---|---|---|---|---|---|
| tray-cpu | 盤底/anchor | `box` [2.0,0.06,1.4] | [0,1.8,0] | metal-dark | `CPU 運算盤` + annotation | 1.15 |
| tray-cpu-pcb | 電路板 | `box` [1.9,0.04,1.3] | [0,1.85,0] | chip | partOf,`電路板/PCB` | 1.15 |
| tray-cpu-socket | CPU | `box` [0.45,0.1,0.45] repeat2 step[0.9,0,0] | [-0.45,1.92,0.05] | metal-dark | partOf,`CPU/Processor` | 1.3 |
| tray-cpu-heatsink | 散熱器 | `box` [0.5,0.05,0.5] repeat2 step[0.9,0,0] | [-0.45,2.0,0.05] | metal-light | partOf,`散熱器/Heatsink` | 1.4 |
| tray-cpu-dimm | 記憶體條 | `box` [0.04,0.24,0.45] repeat8 step[0.09,0,0] | [-0.35,1.99,-0.5] | metal-light | partOf,`記憶體/DIMM` | 1.45 |
| tray-cpu-vrm | 供電模組 | `box` [0.5,0.08,0.12] | [0,1.88,0.6] | metal-dark | partOf,`供電模組/VRM` | 1.3 |

## 3. 機台級 process(machine-local,scale 0.6)
- station `cpu-proc`: partId tray-cpu, processTime 0.6, input data, output data。
- `cpu-data-in`(main, accent): `[[-1.5,0.16,0],[-0.7,0.13,0],[0,0.12,0]]` stop2。
- `cpu-data-out`(main, accent): `[[0,0.12,0],[0.7,0.15,0.1],[1.5,0.18,0.15]]` stop0。
- `cpu-power-in`(side, metal-light): `[[-0.2,-0.15,0.78],[-0.05,0,0.4],[0,0.12,0.05]]` stop2。
- tokens: data-in/out(accent,2,r0.07,dur3.6)、power-in(metal-light,2,r0.06,dur4.0)。

## 4. 公司(填 companies.csv)
研究 §5:Intel/AMD(x86)、NVIDIA Grace(ARM)、嘉澤 3533(socket)、製造 台積 2330。

## 5. 驗收
- 剪影讀得出 CPU socket + DIMM 立條陣列(非單方塊、非 GPU 盤)。
- 流:資料 in→out + 電源 in;單向、分色、過站。
