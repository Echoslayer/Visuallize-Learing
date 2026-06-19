# Add Component
> 階段二：新增一個 3D 元件。遵循 PLAN.md §8.1。先 `/prime`。
> 流程：讀 machine research/spec → 實作到 content → gallery 單機檢查 → `/verify` → `/commit`。

## Variables
name: $1 — 元件/機台 slug（如 `transformer`、`server-rack`）。

## Instructions
1. **先找 spec**：優先讀 `specs/<NN>-machine-{name}.md`；沒有就先跑 `/research-machine {name}` → `/design-machine {name}`，不要直接憑空建。
2. **形狀判定（選型流程，CONTEXT.md §4）**：
   - 方正機械 → 先用 content JSON primitive 群組實作（必要時 `repeat` / `partOf` / `enclosure`）。
   - 精密規律件 → 程式 CAD（CadQuery/OpenSCAD，Python 用 `uv`，必要時 Docker）產 GLB，當 `kind:"model"`。
   - 有機 → 借外部低多邊形模型，**整隻當一個零件不細分**；素材來源/授權**先回報人類**，不自行下載（§9）。
3. 零件設好穩定 `id`、`label` 或 `partOf`、`explode.magnitude`、必要的 `annotation`，加進對應 `content/*.json`。
4. 用 gallery 單機 URL 檢查：`?view=gallery&topic=<topic>&machine=<partId>`；需要時加 `xray=1&names=1`。
5. 跑 `/verify <route>`，全綠才 `/commit`。

## Guardrails（硬規則）
- 題目字眼（公司名、代號、產業名）**只能**進 `content/*.json`，`engine/` 不得出現（§2）。
- primitive 拼法跨 2+ 題目重複且 JSON 難維護時，才抽成 `engine/kit/`；不要為第一台機台先抽象。
- 要動 `engine/` 才能滿足 → 代表 schema 缺口，**停下回報**，先寫 schema-change spec。
- 新依賴 / 外部素材 / 金鑰部署 → 一律停下回報人類（§9）。

## Report
- 條列做了什麼 + `git diff --stat`。
- 回報 spec 路徑與 `/verify` 結果。
