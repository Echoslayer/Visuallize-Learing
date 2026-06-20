---
name: review
description: 站在顧客角度截圖審查指定題目的視覺完成度，對照 spec 產出結構化驗收報告到 docs/review/。只提供驗收意見，不提供實作建議。
---

# Review Skill — 顧客視角驗收審查

當使用者執行 `/review <topic>` 時，以終端顧客的視角審查指定題目的 3D 視覺化完成度。

## 前置作業

1. **讀取上下文**：
   - 讀 `CLAUDE.md` 了解專案結構。
   - 讀 `docs/specs/` 中該題目的所有 spec 文件（topic spec + machine specs）。
   - 讀 `docs/progress/` 中該題目的進度文件。
   - 讀 `src/content/<topic>.json` 了解實際實作結構。
   - 用 `grep` 在 `src/content/companies.csv` 中找出該題目的所有公司映射。

2. **辨識根節點**：從 JSON 的 `parts` 中，挑出所有根節點（沒有 `partOf` 且有 `annotation` 的零件）。

## 截圖採集

1. 確認 dev server 已啟動（`pnpm dev`），記下 port。
2. **總覽截圖**：
   - `SHOOT_BASE=http://localhost:<port> node tools/shoot.mjs "?topic=<topic>" "<topic>-overview"`
   - `SHOOT_BASE=http://localhost:<port> node tools/shoot.mjs "?topic=<topic>&view=gallery" "<topic>-gallery"`
   - `SHOOT_BASE=http://localhost:<port> node tools/shoot.mjs "?topic=<topic>&view=gallery&exploded=1" "<topic>-exploded"`
3. **逐台機台截圖（動態捕捉）**：從 JSON 的 `parts` 中，挑出**所有根節點**（沒有 `partOf` 且有 `annotation` 的零件）。
   對每個根節點 `<partId>`，透過 `SHOOT_FRAMES=2` 擷取連續兩幀（間隔 500ms），以捕捉動態：
   - `SHOOT_FRAMES=2 SHOOT_BASE=http://localhost:<port> node tools/shoot.mjs "?topic=<topic>&view=gallery&machine=<partId>" "<topic>-<partId>"`
4. **用 Read 工具逐張讀回所有 PNG**（包括多幀截圖），以顧客視角審查。維度（顧客角度）

> ⚠️ **防幻覺最高指導原則**：如果截圖畫面不清楚、主體太小、離中心太遠，或是你無法明確確認動態位移，**請誠實回報「無法確認」**，絕對不可以為了給出 Pass 而腦補或說謊（參見 ADR-0019）。

對每組截圖，從以下維度評估：

| # | 維度 | 說明 |
|---|------|------|
| 1 | 一眼辨識度 | 不看標題，看剪影能認出這是什麼嗎？ |
| 2 | Spec 符合度 | spec 設計的零件是否都出現了？有沒有缺件？ |
| 3 | 相機/構圖 | 視角合理嗎？有沒有穿牆、太近、太遠、大量留白？ |
| 4 | 材質/色彩 | 色彩區分是否傳達了設計意圖（如能量類型）？ |
| 5 | 拆解效果 | 拆解狀態零件分離是否清晰？ |
| 6 | Enclosure 透視 | `enclosure: true` 零件能正常看到內部嗎？ |
| 7 | CSV 對應 | companies.csv 中的零件 ID 在 JSON 中都存在嗎？ |
| 8 | 動態與動畫 | （對比第0幀與第1幀）元件旋轉的軸向與位移是否符合常理？粒子流動的方向是否正確？ |

## 產出

寫到 `docs/review/<topic>-customer-review.md`，包含：
1. 嵌入截圖的整體場景總覽
2. 逐台機台審查（每台附截圖 + 表格 + 顧客意見）
3. 問題清單（🔴 Must-Fix / 🟡 Should-Fix / 🟢 Nice-to-Have）
4. Spec 差距對照表
5. 通過/不通過判定

> [!IMPORTANT]
> **只提供驗收意見（什麼不對），不提供實作建議（怎麼修）。** 驗收報告的讀者是人類決策者，不是 agent。
