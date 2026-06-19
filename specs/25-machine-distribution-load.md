# 配電 / 用電端 machine spec (`distribution-load`)

> 由 `/design-machine distribution-load` 依 `docs/machines/distribution-load.md` 產出。確認後由 `/add-component` 實作。
- type: machine
- 研究來源: docs/machines/distribution-load.md
- 對應 topic: `grid`

## 1. 目標

新增 `distribution` 節點,讓 `grid` 的右端不是空白,而是可辨認的低壓配電盤 + 用電負載:load-power 進、served-load 出。

## 2. Pattern 選擇

採 **Rack / Panel** 變體,不抽 kit:

- 直立 cabinet 表達 switchboard / panelboard。
- breaker modules 用 repeat,表達多回路分配。
- meter/HMI、terminal blocks、feeder cables 補出配電盤供應鏈部位。
- 小 load rack 作為終端用電端,不另做一台完整機器。

## 3. Primitive 組合(world 座標,root anchor `[2.05, 0.88, 0.15]`)

| part id | 部位 | geometry | transform | material | label/partOf | enclosure | explode.magnitude |
|---|---|---|---|---|---|---|---|
| distribution | 配電櫃 / annotation anchor | `box` [0.72,1.05,0.36] bevel 0.03 | pos [2.05,0.88,0.15] | metal-dark | label `配電 / 用電端` + annotation | false | 0.9 |
| distribution-front | 盤面 | thin `box` | front | metal-light | partOf,label empty | false | 0.7 |
| distribution-meter | 電表 / HMI | thin `box` | upper front | chip | partOf,label `Meter` | false | 1.0 |
| distribution-main-breaker | 主斷路器 | `box` | mid front | accent | partOf,label `Main Breaker` | false | 1.0 |
| distribution-breakers-left/right | 分路 breakers | small `box` repeat x4 each | front columns | chip | partOf,label empty | false | 1.0 |
| distribution-terminals | 出線端子 | small `cylinder` repeat x4 | lower front | metal-light | partOf,label empty | false | 0.9 |
| distribution-load | 負載 rack | stacked `box` | right side | metal-dark/light | partOf,label `Load` | false | 0.8 |
| distribution-feeder-a/b | 出線電纜 | `tube` local path | cabinet → load rack | chip | partOf,label empty | false | 0.8 |

## 4. 機台級 process(machine-local 座標 = world - anchor;scale 0.38)

- station `distribution-feed`: partId `distribution`, processTime 0.4, input `load-power`, output `served-load`。
- route `distribution-in`(main, chip): `[[-0.95,0.18,0.18],[-0.45,0.1,0.05],[0,0.05,0]]`, stop point 2 → distribution-feed。
- route `distribution-out`(main, chip): `[[0,0.05,0],[0.45,0.0,0.1],[0.92,-0.02,0.28]]`, stop point 0 → distribution-feed。
- tokens:`distribution-in-token` and `distribution-out-token`, material `chip`, count 2。

介面契約:input `load-power` 對齊 busbar output;output `served-load` 為 grid demo 終端。

## 5. 互動與 gallery 驗收

- 單機 URL:`?view=gallery&topic=grid&machine=distribution`
- 名稱 URL:`?view=gallery&topic=grid&machine=distribution&names=1`
- 驗收:
  - 剪影讀得出配電盤 + 下游負載。
  - breaker modules、meter、terminals、load rack 可辨認。
  - token 單向左進、右出。
  - names 不因 repeat 造成滿屏重複。

## 6. 實作注意

- 目標 topic:`src/content/grid.json`。
- 新增主 id `distribution`;子部位用 `partOf:"distribution"`。
- companies.csv 先掛士電、亞力、中興電、台達電,需人類查證。
- 不新增材質、不新增依賴、不改 engine schema。
