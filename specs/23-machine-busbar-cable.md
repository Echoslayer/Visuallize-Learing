# 母線 / 電纜 machine spec (`busbar-cable`)

> 由 `/design-machine busbar-cable` 依 `docs/machines/busbar-cable.md` 產出。確認後由 `/add-component` 實作。
- type: machine
- 研究來源: docs/machines/busbar-cable.md
- 對應 topic: `grid`

## 1. 目標

新增 `busbar` 節點，讓 transformer 低壓側到 distribution 之間不再只是空白，而是一個可辨認的三相母線 / 電纜終端模組。

## 2. Pattern 選擇

採 **Piping Skid** 的低矮連接件變體，不抽 kit:

- 三相導體用 `box repeat`，比 tube 更像扁母線。
- 絕緣支柱用 `cylinder repeat`，避免母線漂浮。
- 電纜終端用直立 cylinder，出線用 `tube`。
- 不做 enclosure;這是裸露/支撐式連接模組。

## 3. Primitive 組合(world 座標,root anchor `[0.55, 0.66, 0]`)

| part id | 部位 | geometry | transform | material | label/partOf | enclosure | explode.magnitude |
|---|---|---|---|---|---|---|---|
| busbar | frame / annotation anchor | `box` [1.15,0.1,0.48] bevel 0.02 | pos [0.55,0.66,0] | metal-dark | label `母線 / 電纜` + annotation | false | 0.7 |
| busbar-bars | 三相母線 | long thin `box` repeat x3 | frame 上方,沿 x,沿 z 排 | accent | partOf,label empty | false | 0.9 |
| busbar-insulators-a | 左支柱 | vertical `cylinder` repeat x3 | 母線左端下方 | metal-light | partOf,label empty | false | 0.8 |
| busbar-insulators-b | 右支柱 | vertical `cylinder` repeat x3 | 母線右端下方 | metal-light | partOf,label empty | false | 0.8 |
| busbar-terminations | 電纜終端 | vertical `cylinder` repeat x3 | 右側出線端 | metal-light | partOf,label `Cable Termination` | false | 0.9 |
| busbar-cable-a/b/c | 出線電纜 | `tube` local path | 右側往下游彎出 | chip | partOf,label empty | false | 0.8 |
| busbar-ground | 接地排 | thin `box` | frame 前側 | metal-light | partOf,label `Ground Bar` | false | 0.6 |

## 4. 機台級 process(machine-local 座標 = world - anchor;scale 0.38)

- station `busbar-transfer`: partId `busbar`, processTime 0.2, input `stepped-ac`, output `load-power`。
- route `busbar-in`(main, chip): `[[-0.85,0.16,0],[-0.35,0.16,0],[0,0.16,0]]`, stop point 2 → transfer。
- route `busbar-out`(main, chip): `[[0,0.16,0],[0.42,0.12,0],[0.95,0.08,-0.15]]`, stop point 0 → transfer。
- tokens:`busbar-token`: `busbar-in`, material `chip`, count 2; `busbar-out-token`: `busbar-out`, material `chip`, count 2。

介面契約:input `stepped-ac` 對齊 transformer output;output `load-power` 對齊後續 distribution input。

## 5. 互動與 gallery 驗收

- 單機 URL:`?view=gallery&topic=grid&machine=busbar`
- 名稱 URL:`?view=gallery&topic=grid&machine=busbar&names=1`
- 驗收:
  - 剪影讀得出三相母線 + 絕緣支柱 + 電纜終端。
  - token 單向從左進、右出。
  - names 不因 repeat 造成滿屏重複。

## 6. 實作注意

- 目標 topic:`src/content/grid.json`。
- 新增主 id `busbar`;子部位用 `partOf:"busbar"`。
- companies.csv 先掛大亞、華新、中鋼,需人類查證。
- 不新增材質、不新增依賴、不改 engine schema。
