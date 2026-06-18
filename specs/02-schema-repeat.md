# schema-change:parts[].repeat(陣列展開)

> 階段二 backlog ②(機房/機架陣列)。**這是 schema 變更 → 要動 `engine/`**,依守則先寫此 spec 報人類,
> **確認後才實作**。觸發 ADR-0010 邊界①(engine 出現非視覺演算法)→ 隨附一個 `node:assert` 自查。

## Metadata
- type: `schema-change`
- slug: `repeat`
- date: 2026-06-18
- backlog item: ② 機房/機架陣列

## 問題
重複排列的零件(一排機櫃、一列風機)若在 content 手列,JSON 會爆長且難維護。
PLAN §5 早已預留:`parts[].repeat = { count, step:[x,y,z] }` 讓引擎自動展開。

## 解法(最小)
給 `Part` 加**選用** `repeat`;在 engine 用一個**純函式**把帶 repeat 的 part 展開成多份,
再交給現有 `GeometryFactory` 渲染。**MVP 只支援單軸(一個 step)**;2D 格用多筆 repeat 列(每列一筆)達成,
真正的多軸/格狀留未來(屆時再開 spec)。

## Schema 變更(engine/schema.ts)
```ts
export interface Repeat {
  count: number   // 總份數(含原件)。count <= 1 視為不重複。
  step: Vec3      // 每份相對前一份的位移
}
export interface Part {
  // ...既有欄位不變...
  repeat?: Repeat // 選用;無此欄 = 原樣一份(向後相容)
}
```
**向後相容**:現有 `ai-server.json` / `grid.json` 不含 repeat → 行為不變。

## Engine 變更(只動這些;其餘 engine 一行不改)
1. `engine/schema.ts`:加上面型別。
2. **新檔 `engine/expand.ts`** — 純函式,與題目無關:
   ```ts
   export function expandParts(parts: Part[]): Part[]
   ```
   規則:
   - 無 `repeat`(或 `count <= 1`)→ 原樣保留一份。
   - 有 `repeat`:展開 `count` 份,第 i 份(i=0..count-1):
     - `id` = `${part.id}-${i}`(i=0 也加,保持一致、selection 不撞)
     - `transform.position` = base + step × i(i=0 即原位)
     - geometry / material / explode / annotation **照抄**(同節點,點任一份都顯示標籤)
     - **移除 `repeat` 欄**(GeometryFactory 永遠看不到 repeat)
3. `engine/Scene.tsx`:`content.parts` → `expandParts(content.parts)` 再 map。**GeometryFactory 不改。**

> 邊界檢查:除 schema/expand/Scene 三處外不得動 engine。動到別處 → 停下回報。

## 自查(ADR-0010:純函式 + 有邏輯 → 一個 assert,無框架)
**新檔 `tools/check-expand.ts`**(`pnpm check` 串起來跑):
- 無 repeat 的 part → 回傳 1 份、id 不變、無 repeat 欄。
- `repeat {count:3, step:[1,0,0]}`、base `[0,0,0]` → 3 份,id `x-0/x-1/x-2`,position `[0,0,0]/[1,0,0]/[2,0,0]`。
- `count: 1` 與 `count: 0` → 各只 1 份(邊界:不可產出 0 份或負數迴圈)。

## 內容示範(新題目,證明 repeat 有效)
**新檔 `content/datacenter.json`**(topic `datacenter`,註冊到 `registry.ts`):
- floor(box)+ 3 列機櫃,每列一個 part 帶 `repeat {count:4, step:[1.1,0,0]}` → **3 個 part → 12 台機櫃**。
- 每台機櫃用簡化單 box(陣列示範重點是 repeat,不是單櫃細節)。
- 列間用 3 個 part 的不同 z 位置區隔。

## Acceptance Criteria
- [ ] `?topic=datacenter` 顯示 12 台機櫃(3 列×4),但 content 只列了 3 個帶 repeat 的 part + floor。
- [ ] `pnpm check` 含 expand 斷言且通過。
- [ ] 點任一台機櫃可選取(id 不撞)、顯示標籤。
- [ ] 既有 `ai-server` / `grid` 無回歸(它們沒 repeat,畫面不變)。
- [ ] `git diff src/engine` 只動到 `schema.ts`、`expand.ts`(新)、`Scene.tsx` 三者。

## Validation Commands
```bash
pnpm check                         # 含 check-expand
pnpm typecheck && pnpm lint && pnpm build
pnpm shoot "?view=gallery&topic=datacenter" datacenter
pnpm shoot "?view=gallery" regress-aiserver      # 回歸:仍是機櫃
git diff --stat -- src/engine                    # 只 schema/expand/Scene
```

## Notes / 風險
- 多軸/格狀、`repeat` 巢狀 → **未來**,本 spec 不做。
- 展開後零件數量上升(12 台 ×… 將來更多)→ 若效能掉,考慮 instancedMesh,但**現在不做**(YAGNI)。
- annotation 照抄到每份:同陣列每台都顯示同一標籤;若未來要「整排一個標籤」再議。
- datacenter 的公司/代號一樣**待人工查證**。

## 等待
**這是 schema 變更 spec。請人類確認設計後我再實作**(依 §9 守則)。
