# CLAUDE.md

給在這個 repo 工作的 Claude Code 的指引。**先讀 `docs/plan/CONTEXT.md` 與 `docs/plan/PLAN.md`**（或直接跑 `/prime`）。

## 多 agent 交接

- 本 repo 可能在 Claude Code、Codex 或其他工作 agent 之間切換；不要假設上一輪記憶仍在。
- 開工先讀本檔、`git status --short`、最近 commit/log，再接續現有變更；不要覆蓋未提交修改。
- Codex 只是 Claude Code 的助手；跨 agent 規則仍以本檔為唯一來源，`AGENTS.md` 只做重導向。
- 完成可延續的流程/決策時，同步 `/update-docs` 相關活文件，讓下一個 agent 不必重建脈絡。

## 這是什麼

一台**與議題無關的資料驅動 3D 解說引擎**。第一份內容是「AI 伺服器供應鏈」：
點 3D 零件 → 拆解 → 浮出該環節的代表公司與股票代號。供應鏈只是餵給引擎的第一份資料。

## 核心原則（不可違反）

1. **幾何是程式碼，不是二進位檔。** 工業/機械件一律程式生成 primitive（Box/Cylinder/Cone/Tube），
   不建模、不存 GLB。只有有機造型（飛機/機器人）才借外部模型，且**借了不拆**（整隻一個零件）。
2. **engine/ 與 content/ 嚴格分離。** `engine/` 內**不得出現**任何題目字眼（公司名、股票代號、產業名）；
   題目資訊只能存在於 `content/*.json`。換議題 = 換一份 JSON，engine 一行不改。
3. **每個零件有穩定 `id` 與 `name`/`userData.partId`**，拆解與標註靠它定位。

## 工程取捨（Ponytail）

- 先刪再加:能刪舊欄位/舊資產/舊流程,就不要新增抽象。
- 新依賴預設拒絕:先用 stdlib、browser/native、現有依賴;真需要再回報。
- schema 變更要有理由:只有既有 schema 做不到、且可跨題目重用時才改 `engine/`。
- 不為未來預留架構:等第二個真實案例出現再抽象;例外是明確 reusable pattern。
- 非平凡邏輯要有一個最小 check:用 `node:assert`,不引測試框架。
- 有已知天花板的捷徑要標 `ponytail:` 註解,寫清楚何時升級。
- 視覺/互動功能以截圖驗收為準;不要用測試框架假裝驗到畫面。

## 工具鏈

- Node/React → **`pnpm`**（指令一律 `pnpm`，非 `npm`）。
- Python（CadQuery/OpenSCAD 等）→ **`uv`**。需要時可用 Docker。
- **相容性鎖定:react@19 + @react-three/fiber@9**(錯配會壞,勿動)。vite/ts/eslint 跟隨官方
  react-ts 範本當下版本(實裝 vite8/ts6/eslint10);**不擅自加鎖定清單外的依賴**(要加先回報)。

## 專案結構

- `src/engine/` — 與題目無關、可重用。**不得出現任何題目字眼。**
  已建:`schema.ts`、`GeometryFactory.tsx`(box/cylinder/cone/tube/flow + model)、`Scene.tsx`、`SceneRoot.tsx`、
  `materials.ts`、`selection.ts`、`explode.ts`(**全域自動放射**,見 ADR-0014)、`Annotation.tsx`(公司卡)、
  `NameTag.tsx`(元件名牌)、`ModelPart.tsx`、`FlowParticles.tsx`(裝飾/循環流動,ADR-0012)、
  `ProcessLayer.tsx`(產線語意:station/route/token,spec 11)、`flow-dwell.ts`(站點停頓純函式,spec 10)、
  `process-motion.ts`(process 停站純函式,spec 11)、`config.ts`(ADR-0009)。
  之後:`kit/`(primitive 積木)。
- **content 慣例(ADR-0014)**:`explode` 只需 `magnitude`(方向自動;vector 已廢棄)。每個 part 要有名字:
  有意義的給 `label`;形狀小塊給 `partOf`(指向父節點 → 繼承父名 + 點選顯示父卡)。companies 仍走 `companies.csv`。
  擋住內部的箱體/機殼標 `enclosure: true`(ADR-0015)→「透視」按鈕看穿。
  產線/物流題目用 topic-level `process`(station/route/token);`flow` 只保留裝飾性循環流動。
- `src/ui/` — UI 殼。已建:`Controls.tsx`(拆解/名稱/股票/透視/重置/語言)、`TopicSwitcher.tsx`(左側題目切換,`?topic=` 導航)、
  `Hotkeys.tsx`(E 拆解/X 透視/數字鍵切題目)、`Credits.tsx`(借用模型 CC-BY 標註)、
  `Tuning.tsx`(leva 調參,**僅 DEV、僅 App**)、`DevHandle.tsx`(**DEV 截圖驅動縫**:`window.__view` = camera/controls/scene/store,延伸 ADR-0008,別當垃圾清掉)。
- **視覺數值一律走 `engine/config.ts`**,別在元件硬寫;調好 bake 進 `DEFAULT_CONFIG`。
- `src/gallery/` — 畫廊路由(`/?view=gallery`),可用 `?machine=<partId>` 單獨看一台機台(含 partOf 子部位)供截圖調試。
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
- **供應鏈題目三段管線**:`/research-supply-chain <產業>`(查證事實 → `docs/supply-chains/`)→ `/design-demo <slug>`(設計取捨:精選/形狀/大小/互動/物流 → `specs/`)→ `/add-topic`(依設計實作)。
  **單台機台**也走小三段:`/research-machine <machine>`(→ `docs/machines/`)→ `/design-machine <slug>`(→ `specs/<NN>-machine-*.md`)→ `/add-component`(依 spec 實作到 content)。
  **完整建置步驟 + 慣例 + 最終驗收清單見 [`docs/plan/topic-playbook.md`](docs/plan/topic-playbook.md)** —— 每條供應鏈照它跑。
- `/add-component <name>` / `/add-topic <name>` — 階段二迭代（先有 `specs/` 規格;供應鏈題目的 spec 由 `/design-demo` 產出）。
- **skills**:`object-abstraction`(設計時:真實物件 → primitive 組合;細節跟供應鏈意義走,**別用單一方塊**)、
  `r3f-industrial-component`(實作時:R3F 蓋法/材質/拆解配方)。設計形狀套前者,寫程式套後者。

## 現在該做什麼

- **階段一 C0–C6 全部 ✅ 完成(DoD 達成)** —— 完整垂直切片,engine/content 分離守住。
- **階段二第一輪已完成**:grid/datacenter/pipeline/wind/aerospace/semiconductor 已驗證 primitive、repeat、tube、model、flow/dwell、process layer、label/partOf、enclosure。
- **semiconductor 已用三段管線重做為深度範本**:深度研究(36 公司查證)→ design-demo v2(spec 09,修動線/互動)→ 重建;
  含 enclosure 透視、process layer 單向產線(spec 11)、flow/dwell 舊能力(spec 10)。其他供應鏈照 `topic-playbook.md` 跟進。
- 採互動式節奏:**每個查核點完成後停下,給人類看截圖再續**(本專案不用 ADW 自動化,見 ADR-0004)。
- 下一步看 `.agent/backlog.md`:先清 `docs/reveiw/architecture-audit.md` 的低風險項,再人工校對 `companies.csv` 對應,之後新增供應鏈題目(research → design-demo → add-topic)。build chunk code-split 只有造成問題再做。

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
