# schema-change:kind "model"(GLB 載入 / 有機件)

> 階段二 backlog ⑤(飛機)。**schema 變更 → 動 `engine/`**,依守則先寫此 spec 報人類,**確認後才實作**。
> 素材授權已由人類確認(見下)。評估 ADR-0010:GLB 載入是 three/drei 視覺膠水 → **不加單元 check**。

## Metadata
- type: `schema-change`
- slug: `model`
- date: 2026-06-18
- backlog item: ⑤ 有機件試點:一架飛機(借模型、整隻一零件)

## 素材與授權(人類已確認)
- 模型:**Airplane**,作者 **Poly by Google**,來源 **poly.pizza**。
- 授權:**CC-BY(Creative Commons Attribution)** —— 允許使用/修改(含商用),**唯一義務:標註作者**。
- 結論:**符合需求**(本專案非商用學習,CC-BY 綽綽有餘)。**必須在畫面與 README 標註作者** → 本 spec 加 `attribution` 欄 + UI 顯示。
- 檔案:現在 `docs/assets/Airplane.glb`(glTF binary v2, 15KB, low-poly)→ 實作時移到 `public/models/airplane.glb`(Vite 靜態,`useGLTF('/models/airplane.glb')` 直接吃)。

## 核心原則:借了不拆
GLB **整隻當一個零件**(一個 `part`,kind `model`),有自己的 explode/annotation,**不細分子件**——
繞過「AI/借來模型是單一網格、難拆件」的硬傷(CONTEXT §2/§4、ADR-0002)。

## Schema 變更(engine/schema.ts)
`kind: "model"` 與 `ModelRef` 型別**已存在**(C1 預留)。只需加 `attribution`:
```ts
export interface ModelRef {
  url: string          // 例:/models/airplane.glb
  node?: string        // 選用:取 GLB 內某子節點(MVP 不用,整隻)
  attribution?: string // CC-BY 等需要的作者標註,UI 會顯示
}
// Part.kind 已是 'primitive' | 'model';geometry 已選用。向後相容,既有題目不受影響。
```

## Engine 變更(三處)
1. `engine/schema.ts`:`ModelRef` 加 `attribution?`。
2. **新檔 `engine/ModelPart.tsx`**:drei `useGLTF(url)` 載入,`<primitive object={scene.clone()}>` 整隻渲染;
   套 meshProps(name/userData/onClick → 整隻可選);材質沿用模型自帶(有機件不強套 materials,避免破壞貼圖)。
3. `engine/GeometryFactory.tsx`:`if (part.kind === 'model' && part.model)` → 回 `<ModelPart>`(仍包在現有 animated.group 內 → explode/標籤照舊);
   `engine/Scene.tsx`:外層加一個 `<Suspense fallback={null}>`(useGLTF 會 suspend)。

> 邊界:除 schema/ModelPart(新)/GeometryFactory/Scene 外不動 engine。動到別處 → 停下回報。

## 組合層(非 engine)
- 把 GLB 移到 `public/models/airplane.glb`。
- **新 `ui/Credits.tsx`**:收集當前題目所有 `model.attribution`,在畫面角落小字顯示(CC-BY 義務)。App 掛載。
- README 加一行素材出處。
- 新 `content/aerospace.json`(topic `aerospace`,registry 註冊):飛機(model,一節點)。
  可選加 1–2 個 primitive 當情境(如機翼下掛載 cone),示範 model 與 primitive 共存。

## 為何不加單元 check(ADR-0010)
GLB 載入/渲染是 drei `useGLTF` + three 的責任(視覺),無純數學/分支邊界 → 靠截圖 harness 驗,不加 assert。

## Acceptance Criteria
- [ ] `?topic=aerospace` 載入並顯示飛機 GLB(整隻一件)。
- [ ] 點飛機可選取、顯示標籤;展開時整隻一起移動(不散成子件)。
- [ ] **畫面出現 attribution**(作者 Poly by Google)。
- [ ] 既有 5 題目無回歸(沒用 model)。
- [ ] `pnpm check` 不變(不為 model 加 check)。
- [ ] `git diff src/engine` 只動 `schema.ts`、`ModelPart.tsx`(新)、`GeometryFactory.tsx`、`Scene.tsx`。

## Validation Commands
```bash
pnpm check && pnpm typecheck && pnpm lint && pnpm build
pnpm shoot "?view=gallery&topic=aerospace" aerospace
pnpm shoot "?view=gallery&topic=aerospace&exploded=1" aerospace-exploded
pnpm shoot "?view=gallery" regress-aiserver          # 仍是機櫃
git diff --stat -- src/engine
```

## Notes / 風險
- 模型軸向/尺度未知 → content 用 `transform`(position/rotation)+(若需要)scale 調整。
  **若要 scale**:schema `Transform` 目前無 scale → 可能要加 `scale?: Vec3`(再一處 schema 變更,spec 內處理)。
  先試不加 scale(用模型原尺度 + 調 camera);真的太大/小再加 `Transform.scale`。
- model 的 castShadow 需 traverse 設定;MVP 可先不投影,之後再補(YAGNI)。
- drei `useGLTF` 會 cache + preload;`useGLTF.preload(url)` 可選,MVP 不做。
- 整隻不套 materials 登錄表(保留模型外觀);與 primitive 的統一畫風會略有差異 → 可接受(有機件本就不同)。
- aerospace 公司/代號(如漢翔 2634)**待人工查證**。

## 等待
**這是 schema 變更 spec。請人類確認設計(尤其 attribution 做法、要不要加 Transform.scale)後我再實作**(§9)。
