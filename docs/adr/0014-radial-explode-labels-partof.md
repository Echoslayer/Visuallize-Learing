# 0014 — 詳細模型的互動:全域放射拆解 + 元件名牌 + partOf 分組繼承

- 狀態:Accepted
- 日期:2026-06-19
- 相關:spec 08;深化拆解(原 [0002](0002-geometry-as-code.md) 的拆解免費)

## Context

把元件做細(一個節點 = 多個 primitive)後,出現幾個需求:
1. 點選任何小 primitive 要看到**它的名字**;且形狀小塊(只為組合而存在)不該逐一命名。
2. 拆解時零件要**散得夠開**,否則「全部顯示名稱」會擠成一團。
3. 原本 explode 是每個 part 手寫 `vector` 方向——題目一多、零件一細,手寫向量不可維護。

## Decision

### A. 拆解改為全域自動放射(explode.vector 廢棄)
- `explodeOffset(explode, position, center)`:方向 = `(part − center)` 在 xz 的水平分量 + 固定上抬,normalize × `magnitude`。
- **方向自動算,不再讀 `vector`**(留欄向後相容、忽略);`magnitude` 0 = 不動(框體/輸送帶/flow)。
- `center` = 該題目 `camera.target`。一個函式、全域生效、各元件依自身位置放射散開。
- 上抬(UP_BIAS)保證「往外+往上」,永不往下穿地;中心的零件直接往上(ai-server 機櫃仍垂直扇開,無回歸)。

### B. 元件名牌 + 點選顯示節點卡
- `Part.label`(元件自己的名字)。點選 / 「名稱」按鈕 → 顯示名牌(小字,`NameTag`)。
- 點選一個 part:名牌(自己名)**＋** 節點卡(公司);節點卡在「展開」時也出(只出節點自身,免子部位刷屏)。

### C. partOf 分組 + 名字繼承(形狀小塊不必命名)
- `Part.partOf` = 所屬節點 id。**顯示名 = `label` ?? 父元件名(partOf)?? 節點 title**。
- 形狀小塊只給 `partOf`,自動**繼承父名 + 點選顯示父卡** → 等於把多個無名小塊「綁定」成一個元件。
- `card` / `resolvedLabel` 在組合層(registry)解析,engine 不知道題目。

## Consequences

- ✅ 拆解可維護:新增/細分零件不必手算方向;全題目一致放射、自動散開,利於「全部顯示名稱」。
- ✅ 每個元件都有名字:有意義的塊命名,形狀塊繼承父名——不必替每顆螺栓取名。
- ✅ `explode` 內容只剩 `magnitude`,更簡潔。
- ⚠️ `explode.vector` 成為 dead field(留著忽略);要清可日後 migration。
- ⚠️ 放射方向固定(水平+上抬),個別題目若想要特殊拆解方向,目前無 per-part override(真需要再加)。
- ⚠️ 「展開 + 全部名稱」資訊量仍大;放射有助散開,極密時可再做名牌錯位。
