# schema-change:元件名稱標籤(點選顯示名 + 全部顯示按鈕)

> 使用者要求。**schema 變更 + 互動/UI → 動 `engine/`**,先寫此 spec 報人類,**確認後才實作**。

## Metadata
- type: `schema-change`
- slug: `label`
- date: 2026-06-19

## 需求(使用者原話拆解)
1. **點選某個模型(primitive)→ 跳出該模型的名稱**(小元件的名字,如「光罩」「晶柱」「滾輪」)。
2. **一顆新按鈕 → 顯示所有元件的名稱**(含會動的 flow 粒子)。字小一點。

## 解法(最小)
- 每個 part 加選用 `label`(該元件的名字)。**顯示名 = `label` ?? `annotation.title`**
  → 已有 annotation 的主節點(IC 設計/矽晶圓…)沿用其 title 當名稱,只有子部位(螢幕/光罩/滾輪…)要補 `label`。**內容改動最小。**
- **點選一個 part → 顯示它的名稱**(小字 name tag)。
- **新按鈕「名稱」→ 切換顯示全部 part 的名稱**(store flag,小字)。

## Schema 變更(engine/schema.ts)
```ts
export interface Part {
  // ...既有不變...
  label?: LocalizedText // 該元件自己的名字(子部位用);主節點可省→沿用 annotation.title
}
```
向後相容:無 label 且無 annotation 的 part 點選時不顯示名稱(無害)。

## Engine 變更(四處)
1. `engine/schema.ts`:`Part` 加 `label?`。
2. `engine/selection.ts`:加 `showAllLabels: boolean` + `toggleAllLabels()`。
3. **新 `engine/NameTag.tsx`**:drei `<Html>` 小字名牌(比 annotation 卡更小、純文字)。
4. `engine/GeometryFactory.tsx`:
   - `displayName = part.label ?? part.annotation?.title`。
   - 顯示條件:`(selected || showAllLabels) && displayName`,錨在元件上方。
   - **公司 annotation 改為只在 `exploded` 顯示**(點選改成顯示「名稱」而非公司卡)。
   - flow 的名牌錨點:用 path 平均點 + 上偏(flow group 在原點,不能用 [0,0,0])。

## 組合層
- `ui/Controls.tsx`:加一顆「名稱 / Names」按鈕,接 `toggleAllLabels`(active 時高亮)。

## 內容(本次只補 semiconductor;其他題目之後增量補)
- semiconductor 的子部位加 `label`:螢幕/光罩/晶柱/晶圓片/EFEM/裝載埠/製程腔/排氣管/機台陣列/微影機/鏡頭/天車軌/載板/打線臂/測試機/測試座/伺服盤/滾輪/支腳/晶圓(flow)。
- 主節點(design/wafer/equip/foundry/osat/downstream)沿用 annotation.title,**不必加 label**。

## Acceptance Criteria
- [ ] 點某個小元件 → 跳出它的名稱;點不同元件名稱跟著換;點空白清掉。
- [ ] 按「名稱」按鈕 → 所有元件(含流動晶圓)同時顯示名稱(小字);再按關閉。
- [ ] 切中英,名稱跟著 zh/en。
- [ ] 既有題目無回歸(沒 label 的 part 點選不顯示名稱,公司卡仍在展開時出現)。
- [ ] `git diff src/engine` 只動 schema/selection/NameTag(新)/GeometryFactory。

## Validation
```bash
pnpm check && pnpm typecheck && pnpm lint && pnpm build
pnpm shoot "?view=gallery&topic=semiconductor" semi          # 收合
# 點選 / showAll 用 Playwright 驅動(window.__selection 設 showAllLabels / 點 part)
```

## Notes / 待確認
- **點選行為改變**:點一個 part 現在顯示「名稱」(而非公司卡);公司卡改成只在**展開**時出現。可接受嗎?(或要點選同時顯示名稱+公司?)
- 名牌很多時(showAll,semiconductor ~29 個)會擠;字小 + 只顯示名稱應還好,擠的話再議錯位。
- flow 名牌錨在 path 中段固定點(粒子在動,名牌不動)。

## 等待
**請確認(尤其點選行為、要不要順便補其他題目的 label)後我再實作。**
