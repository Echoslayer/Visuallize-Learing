# GIS / 斷路器 machine spec (`gis-breaker`)

> 由 `/design-machine gis-breaker` 依 `docs/research/machines/gis-breaker.md` 產出。確認後由 `/add-component` 實作。
- type: machine
- 研究來源: docs/research/machines/gis-breaker.md
- 對應 topic: `grid`

## 1. 目標

把 `grid` 的高壓開關保護節點做成可辨認的 GIS / GCB bay:高壓左進,經密封 GIS tank 與斷路器腔保護切換,右側送往 transformer。

## 2. Pattern 選擇

採 **Piping Skid + Process Tool** 混合,不抽 kit:

- 用水平三相管/槽表現 GIS/GIL 導體腔,避免變成普通控制櫃。
- 用較大的 breaker chamber 與 side drive box 表現斷路器和操作機構。
- 用小 box/cylinder 表現 disconnector、earthing switch、gas monitor。
- GIS tank 標 `enclosure:true`;機台頁 `xray=1` 可看見 breaker chamber。

## 3. Primitive 組合(world 座標,root anchor `[-2.15, 0.78, 0]`)

| part id | 部位 | geometry | transform | material | label/partOf | enclosure | explode.magnitude |
|---|---|---|---|---|---|---|---|
| gis | GIS tank / annotation anchor | `box` [0.9,0.62,0.58] bevel 0.04 | pos [-2.15,0.78,0] | metal-dark | label `GIS / 斷路器` + annotation | true | 0.9 |
| gis-phase-tubes | 三相母線筒 | horizontal `cylinder` repeat x3 | tank 上半部,沿 x 軸,沿 z 排 | metal-light | partOf, label empty | false | 1.1 |
| gis-breaker-chamber | 斷路器腔 | vertical `cylinder` | tank 中央 | accent | partOf,label `Breaker` | false | 1.2 |
| gis-drive | 操作機構箱 | `box` | 前側或右側凸出 | chip | partOf,label `Drive` | false | 1.0 |
| gis-disconnector | 隔離開關 | small `box` | 左上方 | metal-light | partOf,label `Disconnector` | false | 1.0 |
| gis-earthing-switch | 接地開關 | small `box` + `cylinder` | 下側 | metal-light | partOf,label `Earthing` | false | 1.0 |
| gis-bushings-in | 進線套管 | `cone` repeat x3 | 左上方 | metal-light | partOf,label empty | false | 1.1 |
| gis-bushings-out | 出線套管 | `cone` repeat x3 | 右上方 | metal-light | partOf,label empty | false | 1.1 |
| gis-gil-out | GIL / 出線管 | horizontal `cylinder` | 往 transformer 方向 | metal-light | partOf,label `GIL` | false | 0.8 |
| gis-monitor | 氣壓/狀態監測 | small `box` | tank 前上方 | chip | partOf,label `Monitor` | false | 1.0 |
| gis-base | 底座 | `box` | tank 下方 | metal-dark | partOf,label empty | false | 0.5 |

## 4. 機台級 process(machine-local 座標 = world - anchor;scale 0.42)

- station `gis-breaker-station`: partId `gis`, processTime 0.5, input `high-voltage-ac`, output `protected-high-voltage-ac`。
- route `gis-hv-in`(main, accent): `[[-0.95,0.28,0.05],[-0.45,0.1,0.02],[0,0,0]]`, stop point 2 → breaker station。
- route `gis-hv-out`(main, accent): `[[0,0,0],[0.45,0.08,0.02],[0.95,0.22,0.05]]`, stop point 0 → breaker station。
- route `gis-signal-in`(side, metal-light): `[[0.55,0.25,-0.75],[0.3,0.1,-0.35],[0.1,0.02,-0.08]]`, stop point 2 → breaker station。
- tokens:
  - `gis-hv-token`: `gis-hv-in`, material `accent`, count 2, radius 0.05, duration 3.5。
  - `gis-out-token`: `gis-hv-out`, material `accent`, count 2, radius 0.05, duration 3.5。
  - `gis-signal-token`: `gis-signal-in`, material `metal-light`, count 1, radius 0.035, duration 4.4。

介面契約:輸入/輸出仍是高壓側;轉換不在 GIS 發生。GIS 只做保護、切換、隔離。

## 5. 互動與 gallery 驗收

- 單機 URL:`?view=gallery&topic=grid&machine=gis`
- 透視 URL:`?view=gallery&topic=grid&machine=gis&xray=1&names=1`
- 驗收:
  - 剪影讀得出 GIS / GCB:金屬槽 + 三相管 + 斷路器腔 + 操作箱。
  - 高壓 token 左進、右出;signal route 從後側進入,不混主電力流。
  - `xray=1` 看得到 breaker chamber。
  - names 不因 repeat 造成滿屏重複。

## 6. 實作注意

- 目標 topic:`src/content/grid.json`。
- 新增主 id `gis`;子部位用 `partOf:"gis"`。
- companies.csv 先掛 `grid,gis`:中興電、亞力、士電,全部需人類查證。
- 不新增材質、不新增依賴、不改 engine schema。
