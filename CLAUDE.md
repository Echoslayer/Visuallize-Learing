# CLAUDE.md

給在這個 repo 工作的 Claude Code 的指引。**先讀 `docs/plan/CONTEXT.md` 與 `docs/plan/PLAN.md`**（或直接跑 `/prime`）。

## 這是什麼

一台**與議題無關的資料驅動 3D 解說引擎**。第一份內容是「AI 伺服器供應鏈」：
點 3D 零件 → 拆解 → 浮出該環節的代表公司與股票代號。供應鏈只是餵給引擎的第一份資料。

## 核心原則（不可違反）

1. **幾何是程式碼，不是二進位檔。** 工業/機械件一律程式生成 primitive（Box/Cylinder/Cone/Tube），
   不建模、不存 GLB。只有有機造型（飛機/機器人）才借外部模型，且**借了不拆**（整隻一個零件）。
2. **engine/ 與 content/ 嚴格分離。** `engine/` 內**不得出現**任何題目字眼（公司名、股票代號、產業名）；
   題目資訊只能存在於 `content/*.json`。換議題 = 換一份 JSON，engine 一行不改。
3. **每個零件有穩定 `id` 與 `name`/`userData.partId`**，拆解與標註靠它定位。

## 工具鏈

- Node/React → **`pnpm`**（指令一律 `pnpm`，非 `npm`）。
- Python（CadQuery/OpenSCAD 等）→ **`uv`**。需要時可用 Docker。
- **相容性鎖定:react@19 + @react-three/fiber@9**(錯配會壞,勿動)。vite/ts/eslint 跟隨官方
  react-ts 範本當下版本(實裝 vite8/ts6/eslint10);**不擅自加鎖定清單外的依賴**(要加先回報)。

## 專案結構

- `src/engine/` — 與題目無關、可重用。**不得出現任何題目字眼。**
  已建:`schema.ts`、`GeometryFactory.tsx`、`Scene.tsx`、`SceneRoot.tsx`、`materials.ts`(只留顏色)、
  `selection.ts`、`explode.ts`、`Annotation.tsx`、`config.ts`(視覺旋鈕集中,見 ADR-0009)。
  之後:`kit/`(階段二 primitive 積木)。
- `src/ui/` — UI 殼。已建:`Controls.tsx`(拆解/重置/語言)、`TopicSwitcher.tsx`(左側題目切換,`?topic=` 導航)、
  `Credits.tsx`(借用模型 CC-BY 標註)、`Tuning.tsx`(leva 調參,**僅 DEV、僅 App**)。
- **視覺數值一律走 `engine/config.ts`**,別在元件硬寫;調好 bake 進 `DEFAULT_CONFIG`。
- `src/gallery/` — 畫廊路由(`/?view=gallery`),每個零件單獨一格供截圖。
- `src/content/` — 題目資料 JSON(元件結構 + `annotation.title`,**不含公司**);換議題只動這裡。
- `src/content/companies.csv` — **公司↔元件對應的唯一來源**(edge list `topic,part,ticker,name`,多對多,見 ADR-0011)。
  加公司 = 加一列;**別把公司寫回 JSON**。`registry.ts` 在載入時 join 進 `annotation.companies`。欄位不可含逗號。
- `tools/shoot.mjs` — 截圖 harness;`pnpm shoot "?view=gallery" <name>`。
- 極簡路由:`src/main.tsx` 用 `?view=gallery` 切換,**不引 react-router**(見 ADR-0006)。

## 工作流（slash commands）

- `/prime` — 開工前建立上下文。
- `/verify [route]` — 跑自我驗證迴圈（typecheck→lint→build→shoot→讀回截圖）。**沒過不准 commit。**
- `/commit` — 格式化 commit（階段一 `C{n}: ...`；階段二含 spec 檔名）。
- `/update-docs [scope]` — 同步活文件(README/CLAUDE/log)與按需新增 ADR。
- `/research-supply-chain <產業>` — 先做功課:查證產業供應鏈實際運作,產出研究文件到 `docs/supply-chains/`,作為建模依據。
- `/add-component <name>` / `/add-topic <name>` — 階段二迭代（先寫 `specs/` 規格;題目建模可參考 `docs/supply-chains/` 研究）。
- 建 3D 工業元件時,skill `r3f-industrial-component` 會自動載入配方。

## 現在該做什麼

- **階段一 C0–C6 全部 ✅ 完成(DoD 達成)** —— 完整垂直切片,engine/content 分離守住。
- **現在:等人類確認後才開始階段二**(加元件 `/add-component`、加題目 `/add-topic`,先寫 `specs/`)。
- 採互動式節奏:**每個查核點完成後停下,給人類看截圖再續**(本專案不用 ADW 自動化,見 ADR-0004)。
- 待辦:annotation 內容查證(人類)、build chunk code-split。

## 測試(見 [ADR-0010](docs/adr/0010-no-test-framework.md))

不做 TDD、不引測試框架(vitest 等)——這是視覺/宣告式 R3F 程式,**截圖 harness(§7)就是測試層**。
唯一例外:`tools/check-explode.ts`(純數學 + 除零邊界),`pnpm check`,無框架。想加測試前先問:
這是邏輯還是畫面?畫面 → 截圖驗;純函式有邊界 → 比照 check-explode 加一個 `node:assert`。

**升級階梯**(真需要才往上爬):純函式 assert → Node 內建 `node:test`(stdlib)→ vitest(只有要 jsdom/元件測試)。

**邊界——命中任一就回 ADR-0010 重新評估**:
① engine 出現非視覺演算法(schema 驗證、repeat/layout 展開器、資料轉換);② 出現後端/API/資料管線;
③ 單人變多人;④ 純函式 self-check 超過 ~5–6 個(→ 改用 `node:test` 一次跑);
⑤ 反覆出現截圖抓不到的非視覺 bug;⑥ 變正式產品且數據 correctness 關鍵。
**在這些之前,加測試框架就是 over-design。**

## 決策紀錄

關鍵架構決策記在 [`docs/adr/`](docs/adr/)。改動觸及這些決策前先讀對應 ADR;若要推翻,新增一筆 ADR 標記 supersedes,不要默默改。

## 停止並回報人類的條件（PLAN.md §9）

- 需要鎖定清單外的新依賴；需要下載外部 GLB/材質素材。
- 同一查核點連續失敗 ≥3 次；要動 `engine/` 才能滿足新題目（schema 缺口）。
- 任何牽涉金鑰、登入、部署、付費、權限變更的動作——一律不做，交還人類。
- 供應鏈內容（公司對應、股票代號）**準確性由人類查證**；agent 起草要標註「需查證」。
