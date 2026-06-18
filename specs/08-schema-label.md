# schema-change:元件名稱標籤 + 節點歸屬(點選顯示名+節點卡;全部顯示按鈕;放射狀拆解)

> 使用者要求(含澄清)。**schema 變更 + 互動/UI → 動 `engine/`**,先寫此 spec 報人類,**確認後才實作**。

## Metadata
- type: `schema-change`
- slug: `label`
- date: 2026-06-19

## 需求(使用者澄清後)
1. **點選一個 primitive → 顯示它自己的名稱**(小元件名,如「光罩」「滾輪」)。
2. **點選小元件 → 同時顯示它所屬「大元件(節點)」的名稱 + 公司名**(不是二選一,兩個都出)。
3. **新按鈕「名稱」→ 顯示所有元件的名稱**(含會動的 flow),字小。
4. **拆解改成放射狀**:零件向前後左右上「遠離中心」散開 → 散開後全部顯示才不擠。(此項**純內容**,見 §6。)

## Schema 變更(engine/schema.ts)
```ts
export interface Part {
  // ...既有不變(annotation 仍只掛在節點 part)...
  label?: LocalizedText // 元件自己的名字(子部位用)
  node?: string         // 子部位 → 所屬節點 part 的 id(用來顯示節點卡)
}
```
- **顯示名 = `label` ?? `annotation.title`** → 節點 part 沿用 title,只有子部位要補 `label`。
- 向後相容:無 label/無 annotation/無 node 的 part 行為不變。

## Engine 變更(三處)
1. `engine/schema.ts`:`Part` 加 `label?`、`node?`。
2. `engine/selection.ts`:加 `showAllNames: boolean` + `toggleAllNames()`。
3. **新 `engine/NameTag.tsx`**:drei `<Html>` 小字名牌(比公司卡小、純文字)。
4. `engine/GeometryFactory.tsx`:
   - **名牌**:`displayName = label ?? annotation?.title`;顯示於 `(selected || showAllNames) && displayName`,錨在元件上方。
   - **節點卡(公司)**:
     - `selected` → 顯示 `part.card`(= 自己的 annotation,或 `node` 指向的節點 annotation)→ 點子部位也看到大元件名+公司。
     - `exploded` → 只顯示 `part.annotation`(節點自己的)→ 展開時不會每個子部位都冒卡(避免擠)。
   - flow 名牌錨在 path 中段固定點(粒子在動、名牌不動)。

## 組合層(非 engine)
- `content/registry.ts`:enrich 時多解析 `part.card`:`annotation ?? nodes.get(part.node)`(沿用現有 company join 後的節點 annotation)。
  → 為此 `Part` 加 `card?: Annotation | null`(**載入時解析,內容不手寫**)。
- `ui/Controls.tsx`:加一顆「名稱 / Names」按鈕,接 `toggleAllNames`(active 高亮)。

## 內容(本次只補 semiconductor)
- 子部位加 `label`(螢幕/光罩/晶柱/晶圓片/EFEM/裝載埠/製程腔/排氣管/機台陣列/微影機/鏡頭/天車軌/載板/打線臂/測試機/測試座/伺服盤/滾輪/支腳/晶圓 flow)+ `node`(指向所屬節點 id)。
- 主節點沿用 annotation.title,不必加 label。
- **放射狀拆解(純內容)**:把六節點的 `explode.vector` 從一律 `[0,1,0]` 改為**從場景中心往外**的方向
  (左端往左、右端往右、中間往上,加些前後 z)→ 各節點放射散開。子部位沿用所屬節點向量。**engine 不動**(explodeOffset 早支援任意方向)。

## Acceptance Criteria
- [ ] 點任一 primitive → 出現它的名稱 +(子部位時)所屬節點名+公司;點空白清掉。
- [ ] 按「名稱」按鈕 → 所有元件(含流動晶圓)同時顯示名稱(小字);再按關閉。
- [ ] 拆解時零件放射狀遠離中心散開;散開後按「名稱」不會太擠。
- [ ] 切中英,名稱與節點卡跟著 zh/en。
- [ ] 既有題目無回歸。`git diff src/engine` 只動 schema/selection/NameTag(新)/GeometryFactory。

## Validation
```bash
pnpm check && pnpm typecheck && pnpm lint && pnpm build
pnpm shoot "?view=gallery&topic=semiconductor&exploded=1" semi-radial
# 點選 / showAll 用 Playwright(點 part、window.__selection 設 showAllNames)
```

## Notes / 待確認
- 放射狀拆解只先套 semiconductor;其他題目要不要也改放射,之後再說(現有設計向量大多 OK)。
- showAll 時 semiconductor ~29 名牌,靠放射散開 + 小字應夠;仍擠的話再做名牌錯位。

## 等待
**請確認後我再實作。**
