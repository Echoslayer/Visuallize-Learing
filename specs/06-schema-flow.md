# schema-change:flow 流動粒子(產線/材料流動畫)

> 階段二 backlog 後的新需求。**schema 變更 + 持續動畫 → 動 `engine/`**,先寫此 spec 報人類,**確認後才實作**。
> 動機:參考產品的場景會「活」——小球沿產線往前送、循環、晶圓在傳輸。目前場景全靜止,缺這個。

## Metadata
- type: `schema-change`
- slug: `flow`
- date: 2026-06-18

## 問題
場景目前只有「拆解」一種動畫(toggle 才動),平時全靜止,顯得粗糙。需要**持續流動**的元件來表現
「材料/資料在環節間流動」(產線小球往前送、循環、晶圓傳輸)。

## 解法(最小)
新增 `shape: "flow"`:沿一條 `path`(複用 tube 的 CatmullRom 曲線)撒 N 顆小球,`useFrame` 讓它們
持續沿曲線前進、到尾端循環回頭。一個機制涵蓋「往前送」+「循環」+「晶圓在跑」。

## Schema 變更(engine/schema.ts)
```ts
export type GeometryShape = 'box' | 'cylinder' | 'cone' | 'tube' | 'flow' // +flow

export interface Geometry {
  // ...既有 shape / args / bevel / path / radius 不變...
  count?: number  // flow:粒子數(預設 8)
  speed?: number  // flow:每秒跑完路徑的比例(預設 0.2 = 5 秒一圈)
}
```
flow 複用既有 `path`(控制點)+ `radius`(球大小)。向後相容,既有形狀不受影響。

## Engine 變更(三處)
1. `engine/schema.ts`:`GeometryShape` 加 `flow`;`Geometry` 加 `count?`/`speed?`。
2. **新檔 `engine/FlowParticles.tsx`**:
   - `useMemo` 把 path 做成 `CatmullRomCurve3`;渲染 `count` 顆小球(`sphereGeometry`,個別 mesh)。
   - `useFrame((state)) => 每顆球位置 = curve.getPointAt(((t*speed) + i/count) % 1)`,t = `state.clock.elapsedTime`。
   - 材質用 part.material 顏色(`materialColor`)。粒子數小(~8),個別 mesh 即可(instancedMesh 留未來)。
3. `engine/GeometryFactory.tsx`:`case 'flow'` → `<FlowParticles>`(仍在現有 group 內;flow 不參與拆解,explode magnitude 設 0)。

> 邊界:除 schema / FlowParticles(新)/ GeometryFactory 外不動 engine。

## 截圖決定性(ADR-0007 的例外,需確認)
flow 是**持續動畫** → 含 flow 的場景截圖**不會 byte-identical**(球的位置每次不同)。
- 自查改為「讀回截圖判斷球有在路徑上」即可(視覺判斷,非 byte 比對)。
- 既有 explode「收合零漂移」byte 測試**只在無 flow 的場景**(ai-server)跑,不受影響。
- 不為 flow 加 `pnpm check`(three/useFrame 視覺膠水,無純邏輯邊界,ADR-0010)。

## 內容示範
**最小機制驗證**:在 `pipeline.json` 既有兩條 tube 旁,加 1~2 個 `flow` part(沿同樣 path),
小球在管線裡流動 = 「流體在管中跑」。複用 path,內容改動最小。

**(可選,sign-off 時決定)** 新 `semiconductor` 題目(半導體/晶圓產線):
一條輸送帶(box)+ `flow` 沿帶子跑的「晶圓」小球 → 直接對應你說的「demo 晶圓」。屬 `/add-topic`,flow 機制過了再做。

## Acceptance Criteria
- [ ] `?topic=pipeline` 管線內有小球沿 path 持續流動、到尾循環。
- [ ] 既有 5 題目無回歸(沒用 flow)。
- [ ] `git diff src/engine` 只動 `schema.ts`、`FlowParticles.tsx`(新)、`GeometryFactory.tsx`。
- [ ] typecheck/lint/build 全綠;`pnpm check` 不變。

## Validation Commands
```bash
pnpm check && pnpm typecheck && pnpm lint && pnpm build
pnpm shoot "?view=gallery&topic=pipeline" pipeline-flow   # 球在管上(位置不固定 OK)
pnpm shoot "?view=gallery" regress-aiserver               # 仍是機櫃
git diff --stat -- src/engine
```

## Notes / 風險
- 效能:粒子數小、個別 mesh;若日後要大量(整廠)再上 instancedMesh(YAGNI)。
- 「元件循環/旋轉」(如風機葉片轉)是**另一種運動**(繞共同軸心轉,需把多 part 群組化),架構較動,**本 spec 不含**;先做 flow,旋轉之後另開 spec。
- 「場景做更細(不粗糙)」是元件細節/kit 那條軸線,與運動無關,另議。

## 等待
**這是 schema 變更 spec。請人類確認(尤其:截圖決定性的例外、要不要順便做 semiconductor 晶圓題目)後我再實作。**
