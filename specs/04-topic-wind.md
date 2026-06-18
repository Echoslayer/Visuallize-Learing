# 風力發電機(wind topic)

> 階段二 backlog ④。純 primitive + `transform.rotation`(葉片 120°)→ **無 schema 變更**,走 `/add-topic`(免 sign-off)。

## Metadata
- type: `topic`
- slug: `wind`
- date: 2026-06-18
- backlog item: ④ 風機（葉片 primitive，機艙 box）

## 目標
新增「風力發電機」題目:塔架 + 機艙 + 輪轂 + 3 葉片,拆解露出風電供應鏈環節。

## 子零件(用既有 primitive + rotation,engine 不動)
| part | 幾何 | 重點 | annotation(待查證) |
|---|---|---|---|
| tower | cylinder(微錐) | 塔架,當錨點不動 | 塔架 · 世紀鋼 9958 |
| nacelle | box | 機艙 | 機艙 · 上緯投控 3708 |
| hub | cone(rot x=+90° 朝 +z) | 輪轂鼻錐 | — |
| blade-0/1/2 | box(細長) | 3 葉,繞 z 各轉 0/120/240°(2.094/4.189 rad) | 葉片 · 永冠 1589(掛 blade-0) |

葉片定位:繞 hub 以 0.75 半徑放,方向 (−sinθ, cosθ);rotation z=θ。

## Acceptance Criteria
- [ ] `?topic=wind` 顯示風機(塔 + 機艙 + 3 葉成 Y 字)。
- [ ] 點葉片/機艙可選、標籤;展開各環節分離。
- [ ] 其他題目無回歸。
- [ ] `git diff src/engine` 為空(純內容題目)。

## Validation Commands
```bash
pnpm typecheck && pnpm lint && pnpm build
pnpm shoot "?view=gallery&topic=wind" wind
pnpm shoot "?view=gallery&topic=wind&exploded=1" wind-exploded
git diff --stat -- src/engine   # 應為空
```

## Notes
- 公司/代號待人工查證。
