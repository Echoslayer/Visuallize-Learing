# 0011 — 公司資料移到 CSV(edge list,組合層 join)

- 狀態:Accepted
- 日期:2026-06-18
- 相關:[0001](0001-engine-content-separation.md)(engine/content 分離)

## Context

公司/代號原本硬寫在每個題目 JSON 的 `annotation.companies`。問題:
- 難管理、難更新——散在 6 個 JSON,改一家公司要翻檔。
- 是**多對多**關係:一個元件可有多家公司,一家公司可跨多個元件/題目。硬寫無法表達「公司視角」。
- 內容(公司/代號)本來就**待人工查證**,需要一個非工程師也能編的來源。

## Decision

- 公司↔元件對應抽到單一 **`src/content/companies.csv`**(edge list:`topic,part,ticker,name`)。
  一列 = 一個對應;同 part 多列 = 一個元件多公司;同 ticker 多列 = 一家公司多元件。**天然多對多。**
- 用試算表(Excel/Sheets)就能編、能篩(篩 part 看公司、篩 ticker 看元件兩個方向都行)。
- **JSON 只留元件結構 + `annotation.title`,不再有 companies。** CSV 是公司資料的唯一來源。
- **join 在組合層**:`content/companies.ts` 解析 CSV、`registry.ts` 的 `getTopic` 把公司接到每個 part。
  **engine 與 schema 不動**(`annotation.companies` 仍在型別中,只是改由 CSV 在載入時填)。
- 純解析(`parse-links.ts`)與 Vite `?raw` 載入(`companies.ts`)分離,讓解析可被 `pnpm check` 的 node assert 驗(ADR-0010 邊界①:資料轉換)。

## Consequences

- ✅ 公司資料一檔搞定、非工程師可編、多對多直接表達、查證友善。
- ✅ engine/content 分離更純:JSON 管「長什麼樣」,CSV 管「對應哪家公司」。
- ✅ `pnpm check` 加一條 `check-companies` 守解析/對應。
- ⚠️ **join key 是 `(topic, part_id)`** → CSV 的 part 必須對得上 JSON 的 part id;改 part id 要同步改 CSV。
- ⚠️ **ponytail 取捨**:CSV 欄位不可含逗號(手刻 parser,無 papaparse 依賴)。本資料集(中文公司名 + 數字/英文代號)無逗號,夠用;真要含逗號再換正式 CSV parser。
- ⚠️ 公司名在 CSV 每列重複(denormalized edge list)。優點是好編好讀;若日後要強制公司名一致,再normalize 出 `companies` 主檔(屆時新增 ADR)。
- 未來「點公司 → 看它涉及的所有元件」這種反向查詢,資料天生支援(篩 ticker),要時加 UI 即可。
