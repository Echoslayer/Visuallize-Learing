# 重電/變壓器供應鏈(grid topic)

> 階段二第一項(backlog ①)。走 `/add-topic` 流程。**目標:不動 `engine/`**——
> 證明「換議題只動 content + 組合層」。順帶首次實測 cone/cylinder primitive 渲染。

## Metadata
- type: `topic`
- slug: `grid`
- date: 2026-06-18
- backlog item: ① 變壓器(box + bushing,純 primitive)

## 目標(一句話)
新增「重電/變壓器」題目:一台電力變壓器,拆解後露出本體/鐵芯/套管/散熱器等供應鏈環節。

## 子零件與拆解(每個 = 一個供應鏈節點;同節點多 primitive 共用 explode 一起動)
| part id | 幾何 | material | explode | annotation(zh/en + 公司,**待查證**) |
|---|---|---|---|---|
| base | box | dark | 0 | — |
| tank | box(bevel) | dark | 0(本體當錨點不動) | 油箱本體 / Tank · 華城 1519 |
| lid | box | dark | up 0.6 | — |
| core | box(藏 tank 內) | light | up 1.7(升出露餡) | 鐵芯/矽鋼片 / Core · 中鋼 2002 |
| bushing1/2/3 | **cone** | light | up+fwd 0.9(共用) | 高壓套管/礙子 · 士電 1503(掛 bushing2) |
| fin1/2/3 | box(薄) | dark | +x 1.1(共用) | 散熱器 / Radiator · 中興電 1513(掛 fin2) |

## 相關檔案
- 新檔:`src/content/grid.json`(本題目資料)、`src/content/registry.ts`(topic 註冊表,組合層)。
- 改:`src/App.tsx`、`src/gallery/Gallery.tsx` 讀 `?topic=` 從 registry 取內容。**不動 `engine/`。**

## Step by Step Tasks
1. 建 `content/grid.json`(上表 parts;cone 用 `coneGeometry` args `[radius,height,segments]`)。
2. 建 `content/registry.ts`:map `{ 'ai-server', 'grid' }`,`getTopic(name)` 預設 ai-server。
3. App/Gallery 讀 `?topic=` 取內容(預設 ai-server,保持現狀)。
4. `/verify`:`?view=gallery&topic=grid` 收合 + 展開讀回截圖。

## Acceptance Criteria
- [ ] `?topic=grid` 顯示變壓器;`?topic=` 省略仍是 AI 伺服器(現狀不破)。
- [ ] cone/cylinder 正確渲染(套管呈錐狀)。
- [ ] 展開:本體不動,鐵芯升出、套管上移、散熱器側移,同節點零件一起動。
- [ ] 點套管/散熱器任一片 → 顯示該節點標籤。
- [ ] **`engine/` 一行未改**(git diff 確認)。

## Validation Commands
```bash
pnpm typecheck && pnpm lint && pnpm build
pnpm shoot "?view=gallery&topic=grid" grid-collapsed
pnpm shoot "?view=gallery&topic=grid&exploded=1" grid-exploded
git diff --stat -- src/engine   # 必須為空
```

## Notes
- annotation 公司/代號為占位,**待人工查證**(守則)。
- 若發現非動 engine 不可 → 停下回報,代表 schema 缺口(改走 schema-change spec)。
