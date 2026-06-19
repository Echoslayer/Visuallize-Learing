# PLAN.md — 資料驅動 3D 供應鏈解說引擎

> 這份計劃是寫給「在終端自主迭代的 coding agent（Claude Code）」看的。
> **開工前先讀 [CONTEXT.md](./CONTEXT.md)**（專案緣起、核心原則、為什麼這樣選）。
> **現況（2026-06-19）**：階段一 C0–C6 與第一輪階段二 backlog 已完成。
> 本檔保留「架構與歷史計畫」。新增/更新供應鏈題目的現行流程以
> [topic-playbook.md](./topic-playbook.md) 為準。
>
> 規則：每個工作單元都要通過 §7 的自我驗證迴圈才能 commit；
> 階段二新增題目走三段管線（研究 → 設計 → 建模）。每個查核點 = 一個 git commit。
>
> **工具鏈：** Node/React 用 **`pnpm`**（指令一律 `pnpm`，非 `npm`）；若用到 Python（如 CadQuery）用 **`uv`**；需要時可用 Docker。

---

## 1. 目標與範圍

做一台**與議題無關**的可探索 3D 解說引擎。供應鏈只是第一份內容。
核心原則：**幾何是程式碼，不是二進位檔**。工業/機械元件一律程式生成，AI 改得動；
只有有機造型才借外部模型，且借了不拆（整隻當一個零件）。

階段一只做一個垂直切片（walking skeleton）：**一個 AI 伺服器機櫃場景**，
能旋轉、點選、拆解、看浮動標籤、切中英，且全部由一份 JSON 驅動。

---

## 2. 不可動的原則（GUARDRAILS）

1. **engine/ 與 content/ 嚴格分離。** `engine/` 內**不得出現**任何題目字眼（"AI 伺服器"、"台積電"、股票代號…）。題目資訊只能存在於 `content/*.json`。
2. **新增題目 = 新增一份 content JSON，engine 一行不改。** 若為了新題目要動 engine，先停下回報——代表 schema 設計有缺口。
3. **每個零件都要有穩定 `id` 與 `name`/`userData.partId`**，拆解與標註靠它定位。
4. **版本鎖定**（見 §3），不得自行升級或引入鎖定清單外的依賴；需要新依賴先回報。
5. **不得自行下載外部 GLB 素材**：需要時把「檔名 + 來源 + 授權」列出來請人類確認。
6. **零件小而純**：同一種 primitive 拼法出現 ≥2 次 → 抽成 `kit/` 元件。
7. **每個查核點一個 commit**，訊息格式 `C{n}: <描述>`；未過驗證不准 commit。

---

## 3. 技術棧與版本鎖定

| 用途 | 套件 | 版本 |
|---|---|---|
| 渲染 | `react` / `react-dom` | `^19` |
| R3F | `@react-three/fiber` | `^9`（**必須配 React 19**）|
| 3D 核心 | `three` | 跟隨 fiber@9 相容版 |
| 輔助 | `@react-three/drei` | 最新相容 |
| 布林運算 | `three-bvh-csg` | 選用；真正需要 CSG 時再引入/保留 |
| 狀態 | `zustand` | `^5` |
| 動畫 | `@react-spring/three` | 最新相容 |
| 型別 | `typescript` | `^6`（官方範本實裝）|
| 打包 | `vite` | `^8`（官方範本實裝）|
| 視覺自查 | `playwright` | 最新（dev 依賴）|
| 靜態檢查 | `eslint` + `typescript-eslint` | `^10` / `^8`（Vite react-ts 範本內建）|
| i18n | 自寫極簡 dict（MVP 不引 i18next）| — |

> **真正的相容性鎖定是 `react@19` + `@react-three/fiber@9`**（錯配會壞）；vite/ts/eslint 跟隨
> `pnpm create vite@latest --template react-ts` 官方範本當下版本即可（C0 實裝：vite 8 / ts 6 / eslint 10，
> 比本表原訂的 vite6/ts5 新——刻意採用官方範本版本，不逆向降版）。
> 套件管理器固定 **pnpm**：`pnpm add` 執行期依賴、`pnpm add -D` dev 依賴。

---

## 4. 資料夾結構

```
src/
  engine/                # 通用、與題目無關，可重用
    SceneRoot.tsx        # <Canvas>、燈光、Environment、OrbitControls
    GeometryFactory.tsx  # 讀 part.kind 生成 primitive 或載 model
    kit/                 # 可重用 primitive 積木：BeveledBox, RoundedCylinder, BusBar...
    materials.ts         # 共用材質登錄表（統一畫風的唯一來源）
    explode.ts           # 放射拆解位移計算 + react-spring 綁定
    Annotation.tsx       # drei <Html> 浮動標籤
    selection.ts         # zustand store：selectedId / exploded / lang
    schema.ts            # content schema 的 TypeScript 型別（單一事實來源）
  ui/                    # UI 殼：拆解鈕、重置、語言切換
  content/
    *.json               # 題目資料（元件結構 + annotation.title，不含公司）
    companies.csv        # 公司↔元件 edge list 的唯一來源
  gallery/               # 元件畫廊：每個零件/場景單獨渲染一格，供截圖自查
  App.tsx
tools/
  shoot.mjs              # Playwright headless 截圖腳本，輸出到 .agent/shots/
docs/specs/
  _TEMPLATE.md           # 階段二每個工作單元的規格範本（spec-driven 迭代）
.claude/
  commands/              # 可重用 slash command：prime / add-component / add-topic / verify
.agent/
  log.md                 # agent 每輪的成敗紀錄
  backlog.md             # 階段二待辦佇列
  shots/                 # 自查截圖
docs/
  references/            # 人類從原影片擷取的參考截圖，供視覺校準（agent 不自行下載；gitignored）
  plan/                  # CONTEXT.md（緣起/原則）、PLAN.md（本檔）
```

---

## 5. CONTENT SCHEMA（引擎與內容的契約）

`engine/schema.ts` 是單一型別來源；`content/*.json` 是實例。現行慣例以
[topic-playbook.md](./topic-playbook.md) 為準，重點如下：

- `geometry.shape` 支援 `box / cylinder / cone / tube / flow`；有機造型才用 `kind:"model"`。
- `explode` 只寫 `magnitude`。方向由 `explode.ts` 依相機 target 自動放射；舊 `vector` 已廢棄。
- 每個 part 都要可顯示名稱：有意義的節點給 `label`，小部位用 `partOf` 繼承父名。
- 擋住內部的外殼標 `enclosure: true`，讓「透視」模式看穿並點到內部。
- 公司不要寫進 JSON；只寫 `src/content/companies.csv`，由 `registry.ts` join 到 annotation。
- 重複件用 `repeat`；非產線/裝飾性流動可用 `flow + stops/dwell`。
- 產線/物流語意用 topic-level `process`：`stations / routes / tokens`，不要用閉合 `flow` 冒充單向產線。

---

## 6. 階段一：最小核心 demo 與查核點（已完成）

依序完成，每點都要過 §7 才 commit。

**C0 — 骨架可跑 + 自查 harness（先建 harness，否則後面盲改）**
- 用 Vite 建 React+TS 專案（`pnpm create vite . --template react-ts`），裝 §3 鎖定依賴。
- `engine/SceneRoot` 內 `<Canvas>` 渲染一顆測試方塊。
- **建立 §7 依賴的兩個 harness（這是 C0 的硬性產出，不可延後）：**
  - `gallery/` 路由：每個零件/場景單獨一格渲染，且能用 query 控制狀態（`?part=...&exploded=1&lang=en`）。
  - `tools/shoot.mjs`：Playwright 開 `http://localhost:5173/<route>`，等場景穩定後存 PNG 到 `.agent/shots/`。
  - `package.json` scripts 補齊：`dev`、`build`、`typecheck`、`lint`、`shoot`。
  - 設定 ESLint（用 Vite react-ts 範本內建設定即可）。
- 驗收：`pnpm build` exit 0；`pnpm dev` 起得來；`pnpm typecheck`/`pnpm lint` 0 error；
  `pnpm shoot` 能對 gallery 路由產出一張看得到方塊的 PNG（證明自查迴圈本身可運作）。

**C1 — schema 驅動渲染**
- `GeometryFactory` 讀 `content/ai-server.json`，依 `parts` 用 primitive 生成幾何體（先支援 `box`、`cylinder`、`cone`，`bevel` 用倒角）。
- 驗收：場景物件數量 == schema parts 數量；把某 part 的 `args` 改大，截圖看到對應變大。

**C2 — 統一材質 + 打光 + 相機**
- `materials.ts` 登錄 `metal-light`/`metal-dark`；`SceneRoot` 加 `<Environment>`、軟陰影、`OrbitControls`，相機讀 schema.camera。
- 驗收：可拖曳旋轉與縮放；全部零件同一套柔影金屬質感（截圖檢查無突兀材質）。

**C3 — 選取**
- 點零件 → `selection` store 存 `selectedId` → 該零件高亮（emissive 提升或描邊）；點空白取消。
- 驗收：點不同零件高亮會切換；點背景清除高亮（兩張截圖對比）。

**C4 — 拆解動畫**
- `explode.ts`：`exploded=true` 時每零件依中心放射位移 `direction × magnitude`，用 `@react-spring/three` 補間；`false` 復位。
- 驗收：切換往返平滑；收合後零件回原位無漂移（對比展開/收合兩張截圖，框體不動）。

**C5 — 標籤投影**
- `Annotation` 用 drei `<Html>`，在「股票」或展開狀態顯示 `annotation.title[lang]` + registry join 後的公司名/代號。
- 驗收：標籤貼著零件、隨相機移動不脫離；切 `lang` 文字在 zh/en 間改變。

**C6 — 最小 UI 殼**
- `ui/`：三顆按鈕「拆解/收合」「重置視角」「中/EN」，都接到 store。
- 驗收：三顆都實際生效；視窗縮到 ~380px 寬不破版（截圖檢查）。

**階段一 DoD**：一個 AI 伺服器機櫃，可旋轉/點選/拆解/看標籤/切中英，完全由 `content/ai-server.json` 驅動；`grep -ri "伺服器\|台積\|2330" src/engine` 應為空。

---

## 7. AGENT 自我驗證迴圈（每一輪都要跑）

> 這是讓你能在終端「自己迭代」的關鍵。每改一次程式，照下列順序自查；全綠才 commit。

1. **型別**：`pnpm typecheck`（`tsc --noEmit`）必須 0 error。
2. **靜態檢查**：`pnpm lint` 必須 0 error。
3. **建置**：`pnpm build` 必須 exit 0。
4. **視覺自查**：`pnpm shoot <gallery-route>` 起 headless 截圖到 `.agent/shots/`，
   然後用 Read 工具**讀回那張 PNG**，逐條對照當前查核點的「驗收」描述。看起來不對 → 算失敗。
   - **比例/質感類驗收**：若 `docs/references/` 有對應參考截圖，一併讀進來對照，
     讓畫面往參考圖的比例與質感靠（非像素級比對，是視覺方向校準）。
5. **判定**：
   - 全部通過 → `git add -A && git commit -m "C{n}: ..."`，進入下一個查核點。
   - 任一失敗 → 把「查核點、失敗項、推測原因、下一步」寫進 `.agent/log.md`，修正後重跑本迴圈。
6. **卡關上限**：同一查核點連續失敗 **3 次** → 停下，在 `.agent/log.md` 寫摘要並回報人類，不要硬幹或繞過驗收。

`tools/shoot.mjs` 規格：用 Playwright 開 `http://localhost:5173/<route>`，等場景穩定（固定延遲或等某 DOM 標記），存 PNG。Gallery 路由要能用 query 參數控制狀態（如 `?exploded=1&lang=en`）以便分別截圖。

`package.json` scripts 需含：`dev`、`build`、`typecheck`、`lint`、`shoot`（皆以 `pnpm <script>` 執行）。

參考截圖放在 `docs/references/`（由人類從原影片擷取）。agent **不得**自行抓取或下載外部影像。

---

## 7.5 迭代方法論（借鏡 TAC / ADW 最佳實踐）

> 階段一是「一次性把骨架疊起來」；階段二是「長期重複加東西」。
> 重複的工作要**規格化、命令化、閉環化**，否則 agent 每次都從零摸索、品質飄移。
> 以下四個原則直接借自 TAC（Total Agentic Coding）的 ADW 工作流，但**刻意只取輕量部分**——
> 不引入 worktree 隔離、埠號分配、GitHub issue 自動化那套重機制（對單人專案是過度設計）。

**原則 1：規格驅動（spec-driven）。** 階段二每一個工作單元（加一個元件、加一個題目）=
先寫一份 `docs/specs/` 規格檔，再實作。規格用固定 `Plan Format`（見 `docs/specs/_TEMPLATE.md`），
最關鍵的是末段 **Validation Commands**：把「怎麼證明這次做完且零回歸」寫成可執行指令清單。

**原則 2：命名階段、做成可重用命令（reusable commands）。** 不要每次用自然語言描述流程。
把重複流程固化成 `.claude/commands/` 下的 slash command，agent 每次叫同一個命令，行為一致：

| 命令 | 對應流程 |
|---|---|
| `/prime` | 開工前讀 `CONTEXT.md` + `PLAN.md` + 既有 `engine/` 結構，建立上下文 |
| `/add-component <名稱>` | §8.1 加元件：寫 spec → 實作 → gallery 一格 → `/verify` |
| `/add-topic <名稱>` | §8.2 加題目：只動 content JSON → gallery 頁 → `/verify` |
| `/verify [route]` | 跑 §7 自查迴圈（typecheck→lint→build→shoot→讀回截圖），輸出結構化結果 |
| `/update-docs [scope]` | 同步活文件（README/CLAUDE/log）並按需新增 ADR（不可改寫舊 ADR） |

**原則 3：閉環（close the loop）。** 每份 spec 的 Validation Commands 是「完成」的唯一定義。
`/verify` 依序執行、**遇到第一個失敗就停**並回報（仿 TAC `/test` 的結構化 JSON：
`{test_name, passed, command, error}`，失敗項排最上）。沒過 = 沒完成，不准 commit。

**原則 4：一次一件、各自 commit。** 一次只從 backlog 拉一項；每個工作單元獨立 commit，
訊息含 spec 檔名。避免一個大 commit 混多個元件，回溯困難。

---

## 8. 階段二：迭代流程（現行）

> 第一輪 backlog 已完成。新增/更新供應鏈題目時走
> [topic-playbook.md](./topic-playbook.md)：**研究 → 設計 → 建模 → `/verify` → commit**。

### 8.1 新增一個元件 — `/add-component`
1. **先研究/設計**：單台機台先跑 `/research-machine <machine>` → `/design-machine <slug>`，產出 `docs/research/machines/` 與 `docs/specs/<NN>-machine-*.md`。
2. **判形狀（選型流程）**：方正機械 → content primitive 群組（真需要時再評估 `three-bvh-csg`）；
   精密規律件 → 程式 CAD（CadQuery/OpenSCAD，Python 用 `uv`，必要時 Docker）產 GLB 當 `kind:"model"`；
   有機 → 借模型（先回報來源/授權），整隻一個零件不細分。
3. 若用到新材質，先登錄到 `materials.ts`。
4. 把零件加進對應 `content/*.json`，設好 `id`、`explode.magnitude`、`label/partOf`、`annotation.title`。
5. 用 `?view=gallery&topic=<topic>&machine=<partId>` 單機檢查，再跑 `/verify`（含讀回截圖對照 spec）。
6. 過了再串進場景的拆解與標註，commit。

### 8.2 新增一個題目/場景 — `/add-topic`
1. **寫 spec**（同上）。
2. 複製 `content/ai-server.json` 為新檔（如 `grid.json`），改 `title`、`camera`、`parts`。
3. **不准動 `engine/`**。動到了代表 schema 缺欄位 → 停下回報，先擴充 schema 與型別（這本身是一個獨立 spec）。
4. Gallery 加該場景頁，跑 `/verify`，commit。

### 8.3 Backlog 佇列
- 待辦寫在 `.agent/backlog.md`，由上而下一次拉一項做，每項自帶驗收，並對應一份 spec 或 review。
- 目前第一輪 backlog 已完成；下一輪優先做 hygiene，再新增題目：
  1. 清理 `docs/review/architecture-audit.md` 指出的低風險項。
  2. 人工校對 `companies.csv` 的公司↔元件對應。
  3. 依 `topic-playbook.md` 新增下一條供應鏈。

### 8.4 重構守則
- primitive 拼法跨 2+ 題目重複且 JSON 難維護 → 再抽 `kit/` 元件（程式版 kitbash）。
- `content/*.json` 出現重複結構 → 考慮 schema `repeat`/`template`，但**先回報**再改 schema（先寫 schema spec）。

---

## 9. 停止 / 回報人類的條件（硬規則）

立刻停下並回報，不要自行決定：
- 需要鎖定清單外的新依賴。
- 需要下載外部 GLB/材質素材（列出檔名、來源、授權）。
- 同一查核點連續失敗 ≥3 次。
- 要動到 `engine/` 才能滿足新題目（schema 缺口）。
- 任何牽涉金鑰、登入、部署、付費、權限變更的動作——一律不做，交還人類。

---

## 10. 啟動指令範例（貼進終端的 Claude Code）

```
先跑 /prime 建立上下文（會讀 CONTEXT.md + PLAN.md + topic-playbook.md）。
先處理 .agent/backlog.md 的最上方工作；若是新增供應鏈，必須走 research → design-demo → add-topic。
每個工作單元完成後跑 /verify（§7 自我驗證迴圈），全綠才 /commit。
同一查核點失敗 3 次就停下，在 .agent/log.md 寫摘要並回報我。
遵守 §2 GUARDRAILS、§9 停止條件，以及 topic-playbook 的最終驗收清單。
```

---

### 附：給人類的快速檢查清單
- [ ] `src/engine/` 不含題目字眼、公司名、股票代號
- [ ] 純內容題目沒有改 `src/engine/`
- [ ] `pnpm check && pnpm typecheck && pnpm lint && pnpm build` 全綠
- [ ] `pnpm shoot "?view=gallery&topic=<slug>" <name>` 截圖讀回後符合 spec
- [ ] 未查證的公司對應明確標 `待查證`
