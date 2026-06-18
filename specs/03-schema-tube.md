# schema-change:tube 幾何(管線 / TubeGeometry)

> 階段二 backlog ③(管線)。**schema 變更 → 動 `engine/`**,依守則先寫此 spec 報人類,**確認後才實作**。
> 評估 ADR-0010:tube 是 three 的視覺膠水、無純邏輯邊界 → **不加單元 check**(下方說明)。

## Metadata
- type: `schema-change`
- slug: `tube`
- date: 2026-06-18
- backlog item: ③ 管線（`TubeGeometry`）

## 問題
管線是沿一條路徑的圓管,現有 `geometry.args: number[]`(box/cylinder/cone 用)裝不下「一串 3D 控制點」。
需要新的幾何種類 `tube`,吃路徑點 + 半徑。

## 解法(最小)
`Geometry` 加 `shape: "tube"`,並加選用欄 `path`(控制點)、`radius`。三角化交給 three `TubeGeometry`
(以 `CatmullRomCurve3` 通過控制點 → 平滑彎管)。**現有 box/cylinder/cone 不受影響。**

## Schema 變更(engine/schema.ts)
```ts
export type GeometryShape = 'box' | 'cylinder' | 'cone' | 'tube' // +tube

export interface Geometry {
  shape: GeometryShape
  args?: number[]   // box/cylinder/cone 用(tube 不用)→ 改選用
  bevel?: number
  path?: Vec3[]     // tube:路徑控制點(≥2)
  radius?: number   // tube:管半徑(預設 0.1)
}
```
**向後相容**:box/cylinder/cone 仍給 `args`;只是型別上 `args` 變選用(tube 不帶)。

## Engine 變更(只動兩處)
1. `engine/schema.ts`:`GeometryShape` 加 `tube`;`Geometry` 加 `path?`/`radius?`,`args` 改選用。
2. `engine/GeometryFactory.tsx`:加 `case 'tube'`:
   ```tsx
   const curve = useMemo(
     () => new CatmullRomCurve3((geometry.path ?? []).map((p) => new Vector3(...p))),
     [geometry.path],
   )
   inner = <mesh {...meshProps}>
     <tubeGeometry args={[curve, 32, geometry.radius ?? 0.1, 12, false]} />{mat}
   </mesh>
   ```
   - `tubularSegments=32`、`radialSegments=12`、`closed=false` **硬寫合理預設**(不進 schema,YAGNI)。
   - path 點視為零件局部座標;`transform.position` 平移整段;explode 整段一起動。

> 邊界:除 schema 與 GeometryFactory 兩處外不得動 engine。動到別處 → 停下回報。

## 為何不加單元 check(ADR-0010)
tube 的邏輯只是「把點丟給 three 的 Curve/TubeGeometry」——純三角化是 three 的責任、是**視覺**。
無除零/分支/資料轉換的靜默壞掉風險(explode 那種純數學才需要)。→ **靠截圖 harness 驗即可,不加 assert。**
(若日後 path 要做程式生成/驗證等真邏輯,再依邊界補 check。)

## 內容示範(新題目)
**新檔 `content/pipeline.json`**(topic `pipeline`,註冊 registry):
- 2 座直立儲槽(cylinder)+ 跨頂彎管(tube,path 走 U 形)+ 底部直管(tube)。
- 供應鏈節點:儲槽 / 管線 / 閥件,各掛公司(**待查證**)。
- 至少一段 tube 用「有彎」的 path(≥3 點)以證明 CatmullRom 平滑彎曲,一段近直管。

## Acceptance Criteria
- [ ] `?topic=pipeline` 顯示儲槽 + 彎管;tube 呈圓管、彎段平滑。
- [ ] 點管線可選取、顯示標籤;展開整段管一起移動。
- [ ] 既有 `ai-server`/`grid`/`datacenter` 無回歸(沒用 tube)。
- [ ] `pnpm check` 仍只有 explode/expand(不為 tube 加 check)。
- [ ] `git diff src/engine` 只動 `schema.ts`、`GeometryFactory.tsx`。

## Validation Commands
```bash
pnpm check && pnpm typecheck && pnpm lint && pnpm build
pnpm shoot "?view=gallery&topic=pipeline" pipeline
pnpm shoot "?view=gallery&topic=pipeline&exploded=1" pipeline-exploded
pnpm shoot "?view=gallery" regress-aiserver          # 仍是機櫃
git diff --stat -- src/engine                         # 只 schema/GeometryFactory
```

## Notes / 風險
- 標籤錨點:tube 走 `halfW` 的 else 分支(=1),夠用;不為 tube 算 bbox(YAGNI)。
- 直線管也走 CatmullRom(2 點時近直線);若要真折線(硬角)再議。
- tubularSegments 固定 32;極長管若不夠平滑再調(現在不做)。
- pipeline 公司/代號**待人工查證**。

## 等待
**這是 schema 變更 spec。請人類確認設計後我再實作**(§9)。
