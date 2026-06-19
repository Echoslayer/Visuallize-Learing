# 重電 / 電網 demo 設計(topic `grid`)

> 由 `/design-demo grid` 依 `docs/supply-chains/grid.md` 產出。教學用、抽象。人類確認後 `/add-topic grid` 或後續逐設備 `/add-component` 建。
- type: topic
- 研究來源: docs/supply-chains/grid.md

## 1. 教學目標 + 取捨

目標是讓使用者看懂「重電不是一個變壓器盒子」,而是一條電力設備鏈:高壓進線先經 GIS/斷路器保護,再進變壓器降壓,經母線/電纜送到配電/用電端,控制保護系統在旁監控與跳脫。

採 **小型變電站方案** 作為預設設計,不走單台 transformer close-up。理由:

- 研究指出完整重電供應鏈包含 GIS/GCB、變壓器、母線/電纜、控制保護、配電;只畫變壓器會重複舊 `grid.json` 的限制。
- 小型變電站可直接表現電力流,更適合 topic-level `process`。
- 節點控制在 5 個,不塞完整電網,降低實作風險。

> 人類已確認:採小型變電站方案,並保留 `signal-token` 控制保護側向流。

保留節點:

1. `gis` 高壓 GIS / 斷路器
2. `transformer` 電力變壓器
3. `busbar` 母線 / 電纜
4. `control` 控制保護 / SCADA
5. `distribution` 配電 / 用電端

省略/合併:

- 上游材料如矽鋼片、銅材、絕緣油不獨立成 topic 節點,而是變壓器子部位與公司卡呈現。
- 工程施工/維修不獨立建模,先併入對應設備節點。
- 發電端與終端用戶只用進線/負載符號表示,不做發電廠或完整城市。

## 2. 布局 + 相機

整體做成橫向小型變電站,主電力流由左到右:

`高壓進線 → GIS/斷路器 → 變壓器 → 母線/電纜 → 配電/用電端`

- 場景尺度:寬約 6.5,深約 2.4,高約 2.2。
- `gis` 放左側 x=-2.6,z=0。
- `transformer` 放中央 x=-0.8,z=0,最大。
- `busbar` 做為 transformer 到 distribution 的連接,橫跨 x=0.3→1.6。
- `distribution` 放右側 x=2.4,z=0。
- `control` 放後方 x=0.6,z=-1.0,用 side route 接 GIS/transformer/distribution。
- 相機起手:position `[4.8, 3.2, 6.2]`, target `[0, 1.0, 0]`。

## 3. 元件設計(每節點是 primitive 組合,非單一形狀)

| 節點 id | machine pattern | primitive 組合(招牌特徵) | 相對大小 | 位置(概) | 材質 | 代表什麼 |
|---|---|---|---|---|---|---|
| `gis` | Process Tool / Piping Skid 混合 | 金屬箱 `box` + 三相水平圓筒 `cylinder` + 斷路器操作箱 `box` + 套管/避雷器 `cone/cylinder` + 接地刀小 `box` | 中 | x=-2.6 | metal-dark + metal-light | 高壓保護、切換、GIS/GCB |
| `transformer` | Transformer | 油箱 `box enclosure` + 頂蓋 `box` + 鐵芯 `box` + 銅繞組 `cylinder`/短 `tube` + 高/低壓套管 `cone repeat` + 散熱片 `box repeat` + 油枕 `cylinder` + 分接開關 `box/cylinder` | 最大 | x=-0.8 | metal-dark + metal-light + accent | 降壓與核心供應鏈材料 |
| `busbar` | Piping Skid | 三相母線 `tube` 或細長 `box` + 絕緣支撐 `cylinder repeat` + 電纜終端 `cylinder` | 小/長 | x=0.5→1.7 | accent + metal-light | 變壓後大電流連接 |
| `control` | Rack | 控制盤 `box` + 儀表/電驛小格 `box repeat` + 監控螢幕 `box` + signal line `tube` | 中小 | x=0.6,z=-1.0 | metal-dark + chip | 保護電驛、SCADA、控制訊號 |
| `distribution` | Rack / Process Tool | 配電盤 `box` + 低壓開關抽屜/盤面 `box repeat` + 出線端子 `cylinder repeat` + 小型負載 rack `box` | 中 | x=2.4 | metal-dark + metal-light | 配電與用電端 |

## 4. 互動

- 拆解:沿全域放射拆解即可;不要設 per-part vector。外殼/底座 `magnitude` 低,內部關鍵件 `magnitude` 較高。
- 透視:`transformer` 油箱標 `enclosure:true`,讓鐵芯/繞組可見。若 GIS 做封閉箱體,也標 `enclosure:true`。
- 選取/標籤:每個主設備掛 annotation;子部位用 `partOf` 回主設備卡。
- 名稱優先:保留 `GIS`, `Transformer`, `Busbar`, `Control`, `Distribution`, `Core`, `Winding`, `Bushing`, `Radiator`, `Tap Changer` 等短名。
- Gallery:每台設備都要可用 `?view=gallery&topic=grid&machine=<id>` 單獨看。

## 5. 物流 / process / flow

重電是電力流,使用 topic-level `process`,不用 `flow`。

| token | route | station 停留 | input → output | 側向注入 |
|---|---|---|---|---|
| `hv-token` | `hv-route`: 進線 → GIS → transformer | GIS 0.4s, transformer 0.8s | `high-voltage-ac` → `stepped-ac` | 無 |
| `lv-token` | `lv-route`: transformer → busbar → distribution | busbar 0.2s, distribution 0.5s | `stepped-ac` → `load-power` | 無 |
| `signal-token` | `control-route`: control → GIS/transformer/distribution | 各 0.2s | `status/control` → `trip/command` | 控制保護側向線 |

設計要點:

- `hv-route` 與 `lv-route` 都單向,不閉合。
- token 顏色用現有材質:高壓可 `accent`,低壓可 `chip`,控制訊號可 `metal-light`。
- transformer 是轉換點:高壓 token 進 transformer,低壓 token 從 transformer 出。
- 控制訊號不是主電力,路徑放後方或上方,避免誤讀。

## 6. schema 對應草稿(給 /add-topic)

### parts

- `gis`: annotation `高壓 GIS / 斷路器`;子部位:
  - `gis-tank` enclosure box
  - `gis-phase-tubes` cylinder repeat
  - `gis-bushings` cone/cylinder repeat
  - `gis-breaker-drive` box
- `transformer`: annotation `電力變壓器`;子部位:
  - `transformer-tank` enclosure box
  - `transformer-core` box
  - `transformer-windings` cylinder repeat
  - `transformer-bushings-hv` cone repeat
  - `transformer-bushings-lv` cone repeat
  - `transformer-radiators` box repeat
  - `transformer-conservator` cylinder
  - `transformer-tap-changer` box/cylinder
- `busbar`: annotation `母線 / 電纜`;子部位:
  - `busbar-tubes` tube path 三條或 repeat
  - `busbar-insulators` cylinder repeat
  - `busbar-terminations` cylinder
- `control`: annotation `控制保護 / SCADA`;子部位:
  - `control-cabinet` box
  - `control-relays` box repeat
  - `control-screen` box
- `distribution`: annotation `配電 / 用電端`;子部位:
  - `distribution-cabinet` box
  - `distribution-breakers` box repeat
  - `distribution-load` small rack/box

### companies

公司不寫進 JSON。依 `docs/supply-chains/grid.md` §5 後續填 `companies.csv`:

- `gis`: 中興電、亞力、士電
- `transformer`: 華城、士電、亞力、中興電
- `busbar`: 大亞、華新、中鋼
- `control`: 中興電、亞力、台達電
- `distribution`: 士電、亞力、中興電、台達電

以上都需人類查證。

### validation routes

```bash
pnpm check
pnpm typecheck
pnpm lint
pnpm build
pnpm shoot "?view=gallery&topic=grid" grid-substation
pnpm shoot "?view=gallery&topic=grid&exploded=1&names=1" grid-substation-exploded
pnpm shoot "?view=gallery&topic=grid&machine=transformer&xray=1&names=1" grid-transformer-machine
```

## 7. 待人類確認

- ✅ 已確認採 **小型變電站方案**。
- ✅ 已確認保留 `signal-token` 控制保護側向流。
- 公司對應是否接受目前草稿? 特別是材料節點的大亞/華新/中鋼與 control 節點的台達電。
- `grid` 舊 part id(`tank`,`core`,`bushing-2`,`fin-2`)是否可破壞式替換成新 id? 若要保留舊 CSV 相容,實作時需映射。
