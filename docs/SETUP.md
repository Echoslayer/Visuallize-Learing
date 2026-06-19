# SETUP.md — 開工前準備計劃

> 目的:在 agent 開始跑階段一(C0)之前,把「工具、技能、素材」備齊。
> 這份文件把工作分成三類:**A. agent 自己會準備**、**B. 需要你(人類)準備**、**C. 選用/未來**。
> 你只要顧 **B** 那一段就好;B 沒到位,agent 會卡在 §9 停止條件回報你。

---

## 0. 決策結論(先講清楚需不需要)

| 項目 | 結論 | 理由 |
|---|---|---|
| **Slash commands** | ✅ 已備(`/prime` `/verify` `/commit` `/add-component` `/add-topic`) | 重複流程固化成命令,行為一致 |
| **Skill** | ✅ 已建 `r3f-industrial-component` | 「怎麼正確拼工業元件」是領域知識,建元件時自動載入 |
| **ADW(自動化管線)** | ❌ 不採用完整版,提供輕量替代(見 §C) | TAC 那套 worktree+埠號+GitHub issue+API key 對單人專案是過度設計 |
| **權限安全網** | ✅ 已備 `.claude/settings.json`(擋 `rm -rf`、force push、讀 `.env`) | 純設定、零依賴 |

---

## A. agent 會自己準備(不用你動手)

這些寫在 PLAN.md 的 **C0** 裡,agent 第一步就會做:

- `pnpm create vite . --template react-ts`,裝 §3 鎖定依賴。
- 建自查 harness:`gallery/` 路由、`tools/shoot.mjs`、`package.json` scripts、ESLint。
- 建 `engine/`、`content/`、`.agent/` 等資料夾骨架。
- 第一份 `content/ai-server.json`(MVP 先手列 6~8 片 tray)。

> 你不用先建專案;交給 agent 在 C0 做,它才能順手通過自查迴圈。

---

## B. 需要你(人類)準備 ← 重點看這段

按順序,大概 15~30 分鐘:

### B1. 開發環境(必要)
- [ ] **Node ≥ 20**:`node -v` 確認。
- [ ] **pnpm**:`npm i -g pnpm` 或 `corepack enable`。確認 `pnpm -v`。
- [ ] **Git 身分**:`git config user.name` / `user.email` 已設(agent 要 commit)。

> Playwright 的瀏覽器二進位不用你先裝;agent 會在 C0 跑 `pnpm exec playwright install chromium`。
> 但如果你的網路會擋下載,先手動跑一次比較保險。

### B2. 參考截圖(必要,agent 不能自己抓)
- [ ] 從原影片 `2026-06-16 15-51-25.mp4` **擷取 3~6 張關鍵畫面**,放進 `docs/references/`。
  - 至少要有:AI 伺服器機櫃的「收合」與「拆解」兩種狀態、一張帶公司標籤的特寫。
  - 命名建議:`01_rack-closed.png`、`02_rack-exploded.png`、`03_labels.png`。
- 為什麼必要:`/verify` 的視覺自查會讀回自己的截圖,**跟 `docs/references/` 對照比例與質感**。
  沒有參考圖,agent 只能對著文字驗收,做出來容易走鐘(§9 視覺方向無依據)。

### B3. 決策一個問題(回我一句話即可)
- [ ] **ADW 要不要輕量自動化?**(預設:不要,你盯著一個一個查核點跑最穩)
  - 「不要」→ 你在終端互動式跑,每個 C{n} 看一眼截圖再放行。**推薦,尤其階段一。**
  - 「要」→ 我幫你接 `/loop`,讓它在階段二**無人值守**地一個個拉 backlog 跑(見 §C)。

### B4. git 初始化(可選,我可代勞)
- [ ] 這個 repo 還沒 `git init`、沒有任何 commit。
  - 要我幫你 `git init` + 第一個 commit(把現有規劃文件收進去)嗎?回一句就做。

---

## C. 選用 / 未來(現在不用碰)

### C1. ADW 的輕量替代(若 B3 選「要」)
**不搬** TAC 的 `adws/`(那是多 worktree 並行 + GitHub issue 驅動的重機制)。改用最小閉環:
- 用內建 `/loop`,每輪:讀 `.agent/backlog.md` 拉最上面一項 → `/add-component` 或 `/add-topic` → `/verify` → `/commit` → 勾掉 backlog。
- 失敗 3 次或遇 §9 條件 → 停下等你。
- 只在**階段二**用,且建議你仍定期回看截圖把關美術品味(這是 agent 的弱項)。
- 代價:會持續消耗額度;跑前先確認 backlog 每項都自帶明確驗收。

### C2. Python 3D 工具(只有要做精密規律件才需要)
- 用 `uv`。需要 CadQuery/OpenSCAD 時再裝,可選 Docker 隔離環境。階段一用不到。

### C3. 免費 3D 素材(只有做有機件才需要)
- Poly Pizza / Quaternius / Kenney(CC0)。等 backlog 排到「飛機」那項再找。
- 規則:agent **列出檔名+來源+授權**請你確認,**你**下載放進 `assets/`,agent 不自行下載。

---

## D. 準備完成檢查(B 段全打勾就能開工)

- [ ] `node -v` ≥ 20、`pnpm -v` 正常
- [ ] `docs/references/` 有 3~6 張參考截圖
- [ ] 已回答 B3(ADW 要不要)
- [ ] (可選)已 `git init`

全到位後,在終端對 Claude Code 貼 PLAN.md §10 的啟動指令,從 `/prime` 開始跑 C0。
