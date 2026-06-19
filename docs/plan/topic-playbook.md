# 供應鏈題目 建置 / 驗收 Playbook

> 要新增或更新一條供應鏈題目時,照這份跑。把三段管線 + 所有慣例 + 最終驗收收在一處。
> 半導體(`semiconductor`)是已套完整流程的範例。相關決策見各 ADR。

---

## 三段管線(職責分離,各段產物可審查)

| 段 | 命令 | 產物 | 重點 |
|---|---|---|---|
| ① 研究=事實 | `/research-supply-chain <產業>` | `docs/supply-chains/<slug>.md` | WebSearch 查證實際運作/環節/流動/公司;**代號查證** |
| ② 設計=取捨 | `/design-demo <slug>` | `specs/<NN>-topic-<slug>.md` | 精選節點;套 `object-abstraction`;決定形狀/大小/布局/互動/物流 |
| ③ 建模=實作 | `/add-topic <slug>` | `content/<slug>.json` + registry + `companies.csv` | 依設計建內容 |

人類在每段之間審查、可調:研究錯改研究、設計不滿改設計,再建。

---

## 慣例速查(建內容時遵守)

- **形狀**:`box / cylinder / cone / tube / flow` + `repeat`(陣列)+ `rotation`。有機造型才借 `model`(GLB,CC-BY 要標 attribution,先回報素材)。
- **物件抽象(object-abstraction skill)**:每個節點 = 多個 primitive 組合,**不要單方塊**。
  細節層次 = **供應鏈意義**:鏈上有對應(材料/零件/製程/供應商)的部位就建,只略過無供應鏈意義的造型細節。
- **拆解**:`explode` 只需 `magnitude`(方向自動從 `camera.target` 放射;`0`=不動)。`vector` 已廢棄。
- **命名(每個 part 都要有名)**:有意義的給 `label`;形狀小塊給 `partOf`(指向父節點 → 繼承父名 + 點選顯示父卡)。
- **外殼/黑箱**:把擋住內部的箱體/機殼標 `enclosure: true`(ADR-0015)→「透視」按鈕可看穿,內部元件/flow 才看得見。
- **公司**:不寫進 JSON;寫 `content/companies.csv`(`topic,part,ticker,name`,多對多,keyed 到**節點 part id**)。代號要查證。
- **動態/物流**:產線/物流題目優先用 topic-level `process`(station / route / token),表達單向、進站停留、加工後變形、側向注入。
  `shape:"flow"` 只保留給裝飾性/非語意的循環流動。
- **engine/content 分離**:純內容題目**不得動 `engine/`**;要動 = schema 缺口 → 先寫 schema-change spec 報人類 sign-off。

---

## 可重用 pattern(先看範例,別重造輪子)

新增/更新題目收尾時跑一次 pattern harvest:若某個做法不是單一題目特例、可被其他供應鏈重用、有實作檔可參照、有驗收方式,就在這裡加一列。

- **產線 / process**:`src/content/semiconductor.json` + `specs/11-schema-process-layer.md`。用 `process.stations/routes/tokens` 表單向、進站停留、物料變形、側向注入。
- **透視外殼**:`src/content/semiconductor.json` 的 `foundry.enclosure`、`src/content/grid.json` 的油箱。用 `enclosure:true` + X-Ray 看內部。
- **重複陣列**:`src/content/datacenter.json`。用 `repeat` 展開機櫃/滾輪/盤片,別手列。
- **管線**:`src/content/pipeline.json`。用 `tube` + `path` 表管路,必要時加閥件/法蘭 primitive。
- **有機模型**:`src/content/aerospace.json`。GLB 整隻一件,標 attribution,不拆件。
- **多 primitive 節點 + partOf**:`src/content/semiconductor.json`。主節點有 annotation,小部位用 `partOf` 繼承名牌與公司卡。

---

## 最終驗收清單(一條供應鏈「完成」前逐項打勾)

**內容 / 結構**
- [ ] `docs/supply-chains/<slug>.md` 研究存在;公司**代號已查證**(或明確標 `待查證`)。
- [ ] `specs/<NN>-topic-<slug>.md` 設計存在;每節點是 primitive 組合(非單方塊),細節跟供應鏈意義。
- [ ] `content/<slug>.json` 建好 + `registry.ts` 註冊;`companies.csv` 每節點有對應(多家)。
- [ ] **每個 part 都有名字**:點任一 primitive 都跳得出名稱(label / partOf 繼承 / 節點 title)。

**互動(在 `?topic=<slug>` 實測)**
- [ ] 拆解:零件放射狀散開、不穿地;`magnitude 0` 的框體/底座不動。
- [ ] 「名稱」按鈕:所有元件(含 flow)同時顯示名牌。
- [ ] 「股票」按鈕:不必展開,同時顯示/隱藏所有節點公司卡。
- [ ] 「透視」按鈕(若題目有外殼):標 `enclosure` 的箱體變半透明,看得見內部、且能點選內部元件。
- [ ] 點子部位:顯示其名 + 所屬節點名 + 公司(卡置中、公司超寬會換行)。
- [ ] 中/EN 切換:名稱、公司卡、標題都跟著變。
- [ ] flow(若有):只作非產線/裝飾性循環流動,不冒充製程主線。
- [ ] process(若有):route 有箭頭且單向;token 穿過站心;到站停留;input/output 或側向注入讀得出來。

**工程 / 回歸**
- [ ] 純內容題目:`git diff --stat -- src/engine` 為**空**(動了 engine 代表需 schema-change spec)。
- [ ] 自查全綠:`pnpm check && pnpm typecheck && pnpm lint && pnpm build`。
- [ ] `pnpm shoot "?view=gallery&topic=<slug>"`(收合)+ `&exploded=1`(展開)讀回截圖,對照設計。
- [ ] 題目切換器列出它;其他題目無回歸。
- [ ] commit(含 spec 檔名);公司未經人工查證者在 log/README 標 `待查證`。

---

## 常見坑
- 公司代號靠記憶常錯 → 一律 WebSearch 查證(可參考 `/research-supply-chain` 已驗過的)。
- 單方塊太粗糙 → 套 object-abstraction,每節點拆出有供應鏈意義的部位。
- 想要特殊拆解方向 → 目前 explode 全域放射、無 per-part 方向;真需要再開 spec。
- 節點橫排太多 → 名牌會擠,放射拆解有助散開;極密再議名牌錯位。

## 相關
- ADR/spec:0001(分離)、0002(幾何即程式)、0010(測試邊界)、0011(公司 CSV)、0012(flow)、0013(三段管線+抽象判準)、0014(放射拆解+名牌+partOf)、spec 11(process layer)。
- skills:`object-abstraction`(設計 WHAT)、`r3f-industrial-component`(實作 HOW)。
- 命令:`/research-supply-chain`、`/design-demo`、`/add-topic`、`/verify`、`/update-docs`。
