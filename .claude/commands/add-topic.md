# Add Topic
> 階段二：新增一個題目/場景（換議題只動資料）。遵循 PLAN.md §8.2。先 `/prime`。
> 這個命令的成敗，是驗證 engine/content 分離是否成功的試金石。

## Variables
name: $1 — 題目名稱（如 `grid` 重電電網、`semiconductor` 半導體）。

## Instructions
1. **寫 spec**：複製 `specs/_TEMPLATE.md` 為 `specs/<NN>-topic-{name}.md`，type=`topic`。
2. 複製 `content/ai-server.json` 為 `content/{name}.json`，改 `title`、`camera`、`parts`。
3. 所需元件若不存在 → 先用 `/add-component` 做出來，再回來填 content。
4. `gallery/` 加該場景頁。
5. 跑 `/verify <route>`，全綠才 `/commit`。

## Guardrails（硬規則）
- **絕對不准動 `engine/`。** 若不動 engine 就做不出來 → schema 缺欄位，**停下回報人類**，
  先寫 schema-change spec 擴充 `engine/schema.ts` 型別，再回來加題目（§2 / §9）。
- 內容（公司對應、股票代號、解說文案）**準確性是人類的責任**——agent 可起草，
  但標註「需人工查證」，不要當成已驗證事實（CONTEXT.md §5）。

## Report
- 條列做了什麼 + `git diff --stat`。
- 明確回報：本次有沒有動到 `engine/`？（理想答案：沒有。）
