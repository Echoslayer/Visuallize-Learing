# Customer Review
> 站在顧客角度，用截圖逐台審查指定題目的視覺完成度。
> 對照 spec 設計 vs 實際畫面，產出結構化驗收報告到 `docs/review/`。
> **只提供驗收意見，不提供實作建議。**

## Variables
topic: $1 — 要審查的題目 slug（如 `wind`、`ai-server`、`semiconductor`）。

## Instructions
- 先讀 `CLAUDE.md`、`docs/specs/` 中該題目的所有 spec（topic spec + machine specs）。
- 讀 `docs/progress/` 中該題目的進度文件。
- 讀 `src/content/<topic>.json` 了解實際實作結構。
- 用 `grep` 在 `src/content/companies.csv` 找出該題目的所有公司映射。

## Run（截圖採集）
1. 確認 dev server 已啟動（`pnpm dev`），記下 port。
2. **總覽截圖**：
   - `SHOOT_BASE=http://localhost:<port> node tools/shoot.mjs "?topic=<topic>" "<topic>-overview"`
   - `SHOOT_BASE=http://localhost:<port> node tools/shoot.mjs "?topic=<topic>&view=gallery" "<topic>-gallery"`
   - `SHOOT_BASE=http://localhost:<port> node tools/shoot.mjs "?topic=<topic>&view=gallery&exploded=1" "<topic>-exploded"`
3. **逐台機台截圖（動態捕捉）**：從 JSON 的 `parts` 中，挑出**所有根節點**（沒有 `partOf` 且有 `annotation` 的零件）。
   對每個根節點 `<partId>`，透過 `SHOOT_FRAMES=2` 擷取連續兩幀（間隔 500ms），以捕捉動態：
   - `SHOOT_FRAMES=2 SHOOT_BASE=http://localhost:<port> node tools/shoot.mjs "?topic=<topic>&view=gallery&machine=<partId>" "<topic>-<partId>"`
4. **用 Read 工具逐張讀回所有 PNG**（包括如 `<topic>-<partId>-0.png` 與 `-1.png` 等），以顧客視角審查。

## 審查維度（顧客角度）
> ⚠️ **防幻覺最高指導原則**：如果截圖畫面不清楚、主體太小、離中心太遠，或是你無法明確確認動態位移，**請誠實回報「無法確認」**，絕對不可以為了給出 Pass 而腦補或說謊（參見 ADR-0019）。

對每組截圖，從以下維度評分：
1. **一眼辨識度**：不看標題，看剪影能認出這是什麼嗎？
2. **Spec 符合度**：spec 設計的零件是否都出現了？有沒有缺件？
3. **相機/構圖**：視角合理嗎？有沒有穿牆、太近、太遠、大量留白？
4. **材質/色彩**：色彩區分是否傳達了設計意圖（如能量類型）？
5. **拆解效果**：exploded 狀態下零件分離是否清晰？
6. **Enclosure 透視**：`enclosure: true` 的零件能正常看到內部嗎？
7. **companies.csv 對應**：CSV 中列的零件 ID 在 JSON 中都存在嗎？有沒有死連結？
8. **動態與動畫**（對比第0幀與第1幀）：元件旋轉的軸向與位移是否符合物理常理（如輪轂不該像直升機般轉）？粒子與物料流動（flow/process）的方向是否合理？

## Format（產出的審查報告）
寫到 `docs/review/<topic>-customer-review.md`，格式如下：

```md
# <題目名> — 顧客驗收審查報告

> 審查日期 / 角度 / 對照文件 / 截圖來源

## 一、整體場景總覽
<嵌入總覽截圖 + 整體觀感評語>

## 二、逐台機台截圖審查
### 2-N. <機台名> — <✅/⚠️/❌> <通過/有條件通過/不通過>
<嵌入截圖>
| 驗收項目 | 結果 | 說明 |
<顧客意見（只說問題，不提解法）>

## 三、驗收問題清單
### 🔴 Must-Fix（不修不驗收）
### 🟡 Should-Fix（影響體驗）
### 🟢 Nice-to-Have

## 四、與 Spec 差距對照表
| Spec 設計 | 現況 | 差距 |

## 五、驗收判定
<通過 / 不通過，附理由>
```

## Report
- 回報檔案路徑 + 通過/不通過判定。
- 列出 Must-Fix 數量 + 一行摘要。
- **不提供實作建議或修復方案**——這不是 agent 的工作，是交還人類/設計者判斷的。
