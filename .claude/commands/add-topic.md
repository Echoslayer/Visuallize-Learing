# Add Topic
> 階段二：新增一個題目/場景（換議題只動資料）。遵循 PLAN.md §8.2。先 `/prime`。
> 這個命令的成敗，是驗證 engine/content 分離是否成功的試金石。

## Variables
name: $1 — 題目名稱（如 `grid` 重電電網、`semiconductor` 半導體）。

## Instructions
1. **讀 latest topic spec**：優先讀 `specs/<NN>-topic-{name}.md`；供應鏈題目必須先由 `/design-demo` 產出 spec。
2. 建 `content/{name}.json`，依 spec 實作 `title`、`camera`、`parts`。可參考既有 JSON，但不要機械式複製 `ai-server.json`。
   `annotation` 只放 `title`(**公司不寫進 JSON**)。
3. 若 spec 有產線/物流,用 topic-level `process` 寫 station/route/token；不要用閉合 `flow` 冒充單向產線。
4. 在 `content/companies.csv` 加公司↔元件對應列(`topic,part,ticker,name`,多對多;見 ADR-0011)。
5. registry 註冊新題目。所需元件若不存在 → 先 `/add-component`。
6. 跑 `/verify <route>`，全綠才 `/commit`。

## Guardrails（硬規則）
- **絕對不准動 `engine/`。** 若不動 engine 就做不出來 → schema 缺欄位，**停下回報人類**，
  先寫 schema-change spec 擴充 `engine/schema.ts` 型別，再回來加題目（§2 / §9）。
- 內容（公司對應、股票代號、解說文案）**準確性是人類的責任**——agent 可起草，
  但標註「需人工查證」，不要當成已驗證事實（CONTEXT.md §5）。
- 產線題目必須能回答:物料是什麼?從哪到哪?在哪一站停留加工?加工後變成什麼?

## Report
- 條列做了什麼 + `git diff --stat`。
- 明確回報：本次有沒有動到 `engine/`？（理想答案：沒有。）
