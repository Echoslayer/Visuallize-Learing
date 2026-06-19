# 控制保護 / SCADA machine spec (`control-protection`)

> 由 `/design-machine control-protection` 依 `docs/research/machines/control-protection.md` 產出。確認後由 `/add-component` 實作。
- type: machine
- 研究來源: docs/research/machines/control-protection.md
- 對應 topic: `grid`

## 1. 目標

新增 `control` 節點,讓 `grid` 的控制保護不是抽象 token,而是一台可辨認的保護電驛 / SCADA 控制盤:field status 進、trip/command 出。

## 2. Pattern 選擇

採 **Rack** pattern,不抽 kit:

- 直立控制櫃是主體。
- 小型 relay modules 用 repeat,避免只是普通螢幕。
- HMI/SCADA screen + mimic one-line 表達監控與操作。
- terminal blocks / comms / UPS 補出控制盤供應鏈部位。

## 3. Primitive 組合(world 座標,root anchor `[0.1, 0.92, -1.05]`)

| part id | 部位 | geometry | transform | material | label/partOf | enclosure | explode.magnitude |
|---|---|---|---|---|---|---|---|
| control | 控制櫃 / annotation anchor | `box` [0.68,1.05,0.28] bevel 0.03 | pos [0.1,0.92,-1.05] | metal-dark | label `控制保護 / SCADA` + annotation | false | 0.9 |
| control-door-frame | 盤面框 | thin `box` | 前面板 | metal-light | partOf,label empty | false | 0.7 |
| control-relays | 保護電驛 | small `box` repeat x6 | 前面板中上方 | chip | partOf,label empty | false | 1.0 |
| control-screen | HMI / SCADA | thin `box` | 前面板上方 | metal-light | partOf,label `SCADA` | false | 1.0 |
| control-mimic-line | 單線圖 | tiny `box` repeat/manual | screen 下方 | accent | partOf,label empty | false | 1.0 |
| control-terminals | 端子排 | tiny `box` repeat x8 | 前面板下方 | metal-light | partOf,label empty | false | 0.9 |
| control-comms | 通訊處理器 | small `box` | 側邊 | chip | partOf,label `Comms` | false | 1.0 |
| control-ups | 控制電源 / UPS | low `box` | 底部 | metal-light | partOf,label `UPS` | false | 0.8 |

## 4. 機台級 process(machine-local 座標 = world - anchor;scale 0.36)

- station `control-logic`: partId `control`, processTime 0.4, input `field-status`, output `trip-command`。
- route `control-status-in`(side, metal-light): `[[-0.9,0.2,0.35],[-0.35,0.1,0.16],[0,0.05,0]]`, stop point 2 → logic。
- route `control-command-out`(side, metal-light): `[[0,0.05,0],[0.45,0.15,0.18],[0.95,0.25,0.36]]`, stop point 0 → logic。
- tokens:`control-status-token` and `control-command-token`, material `metal-light`, count 1。

介面契約:這台只處理 signal/control;不承載主電力。

## 5. 互動與 gallery 驗收

- 單機 URL:`?view=gallery&topic=grid&machine=control`
- 名稱 URL:`?view=gallery&topic=grid&machine=control&names=1`
- 驗收:
  - 剪影讀得出控制盤 / relay cabinet。
  - relay modules、SCADA screen、terminal blocks 可辨認。
  - signal token 單向進出,不使用 accent/chip 主電力顏色。
  - names 不因 repeat 造成滿屏重複。

## 6. 實作注意

- 目標 topic:`src/content/grid.json`。
- 新增主 id `control`;子部位用 `partOf:"control"`。
- companies.csv 先掛中興電、亞力、台達電,需人類查證。
- 不新增材質、不新增依賴、不改 engine schema。
