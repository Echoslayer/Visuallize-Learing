# Add Component
> 階段二：新增一個 3D 元件。遵循 PLAN.md §8.1。先 `/prime`。
> 流程：寫 spec → 實作 → gallery 一格 → `/verify` → `/commit`。

## Variables
name: $1 — 元件名稱（如 `transformer`、`server-rack`）。

## Instructions
1. **寫 spec**：複製 `specs/_TEMPLATE.md` 為 `specs/<NN>-{name}.md`，填完所有區塊，type=`component`。
2. **形狀判定（選型流程，CONTEXT.md §4）**：
   - 方正機械 → `engine/kit/` 加 primitive 積木（必要時 `three-bvh-csg` 挖孔/切角）。
   - 精密規律件 → 程式 CAD（CadQuery/OpenSCAD，Python 用 `uv`，必要時 Docker）產 GLB，當 `kind:"model"`。
   - 有機 → 借外部低多邊形模型，**整隻當一個零件不細分**；素材來源/授權**先回報人類**，不自行下載（§9）。
3. 新材質先登錄 `engine/materials.ts`（統一畫風的唯一來源）。
4. 做成**參數化元件**（`<ServerRack rows={6} />`），不要寫死數值。
5. 零件設好 `id` / `name`(userData.partId) / `explode` / `annotation`，加進對應 `content/*.json`。
6. `gallery/` 加一格單獨渲染它。
7. 跑 `/verify <route>`，全綠才 `/commit`。

## Guardrails（硬規則）
- 題目字眼（公司名、代號、產業名）**只能**進 `content/*.json`，`engine/` 不得出現（§2）。
- primitive 拼法重複 ≥2 次 → 抽成 `engine/kit/` 元件。
- 要動 `engine/` 才能滿足 → 代表 schema 缺口，**停下回報**，先寫 schema-change spec。
- 新依賴 / 外部素材 / 金鑰部署 → 一律停下回報人類（§9）。

## Report
- 條列做了什麼 + `git diff --stat`。
- 回報 spec 路徑與 `/verify` 結果。
