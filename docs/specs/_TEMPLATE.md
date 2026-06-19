# <元件 / 題目名稱>

> 階段二每個工作單元的規格。複製本檔到 `docs/specs/<NN>-<slug>.md` 再填寫。
> 格式借鏡 TAC 的 Plan Format；最關鍵的是末段 **Validation Commands**——閉環的唯一定義。
> 開工前先跑 `/prime`。

## Metadata
- type: `component` | `machine` | `topic` | `schema-change`
- slug: `<kebab-case>`
- date: `<YYYY-MM-DD>`
- backlog item: `<.agent/backlog.md 的哪一項>`

## 目標（一句話）
<這次要做出什麼，對使用者/場景的價值>

## 形狀判定（component / machine 需要）
<方正機械 → content primitive 群組 / 精密規律件 → 程式 CAD GLB / 有機 → 借模型不細分；說明選哪條與理由>

## 子零件與拆解
| part id | 幾何/來源 | material | explode.magnitude | annotation（zh/en + 公司/代號） |
|---|---|---|---|---|
| | | | | |

## 相關檔案
<列出會讀/改的檔案，並說明為何相關。新檔放 `### New Files` 子標題。>
- 一律遵守 §2 GUARDRAILS：題目字眼只能進 `content/*.json`，`engine/` 不得出現。

## Step by Step Tasks（由上到下依序執行）
### 1. <foundational：研究/spec 確認 / 材質登錄>
### 2. <實作：content JSON primitive 群組>
### 3. <gallery 單機 URL 檢查>
### 4. <串進場景的拆解與標註>
### 5. 跑 Validation Commands，零回歸才算完成

## Acceptance Criteria（可量測）
- [ ] <具體、可截圖驗證的條件>
- [ ] 改 content 任一數值 → 畫面即時反映
- [ ] `grep -ri "<題目字眼>" src/engine` 為空

## Validation Commands（閉環；依序執行，遇第一個失敗即停並回報）
```bash
pnpm typecheck      # 0 error
pnpm lint           # 0 error
pnpm build          # exit 0
pnpm shoot <route>  # 產出截圖；之後用 Read 讀回，對照 Acceptance + docs/references/
```

## Notes
<新依賴、授權需確認的素材、未來考量等。新依賴/外部素材一律先回報人類。>
