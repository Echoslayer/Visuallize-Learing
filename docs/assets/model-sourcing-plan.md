# 模型取得計畫：手動 Poly Pizza → 未來 MCP 自動找

決策：素材站定為 **Poly Pizza**。
分兩階段：現在人工取得（⑤ 飛機），未來開 MCP 讓 coding agent 自己找，找不到才回退人類。

---

## 階段 A — 現在：人工 + ⑤ 飛機落地

agent 不自行下載，這階段照守則由人類操作素材。

1. **人類**在 poly.pizza 搜 airplane/jet，挑一個 low-poly 模型，下載 GLB。
2. 記下授權：CC0（免標）或 CC-BY（**法律要求標註作者**，attribution 文字 Poly Pizza 會給）。
3. GLB 放 `public/models/`（Vite 靜態資源，`useGLTF('/models/xxx.glb')` 直接吃）。
4. **寫 ⑤ schema-change spec**：新增 `kind: "model"` 零件型別（drei `useGLTF` 載入），
   含 `src` 路徑、`attribution` 欄位（CC-BY 用）。先 sign-off 再動 `engine/`。
   - 「借了不拆」：整個 GLB 是**一個**零件，不參與 explode 子件拆解。
5. CC-BY 的 attribution 要在畫面或 README 露出（content JSON 帶著，UI 顯示）。

產出：⑤ 飛機可渲染 + `kind:"model"` 進 schema，引擎驗證收尾。

---

## 階段 B — 未來：MCP 讓 agent 自己找模型

目標：agent 缺有機造型時，自己 search Poly Pizza → 下載 GLB → 落地，**找不到才停下交人類**。

### 先決條件（要人類做，照守則 agent 不碰金鑰）
- [ ] 申請 Poly Pizza API key（poly.pizza/docs/api/v1.1）。
- [ ] key 存環境變數，**不進 git**。

### 接法：採選項 1（人類 2026-06-18 拍板）

**選項 1（已選，最省）— 不裝 MCP server，用 REST API。**
Poly Pizza API 就一個 GET：search 關鍵字 → 回傳 model 清單含 GLB 直連 url + 授權。
agent 用內建 WebFetch + key 就能查；下載 GLB 也是一個 url。
**不需要任何 MCP server**，現有工具就夠。
→ 適合：只要「搜 + 抓 url」。本專案就這需求。

**選項 2 — 真要 MCP，包一個薄的。**
現有社群 MCP（HaD0Yun / matthewhall）都是 **Unity 導向**（自動轉 Unity Prefab），
本專案 R3F 用不到那段，硬接反而多餘。
若仍要 MCP 介面，自己包 2~3 個 tool（`search_models`、`get_glb_url`）即可，
別引整包 Unity MCP。
→ 適合：未來想讓 agent 在多個對話/專案重複用、要標準化 tool 介面時。

### agent 自動流程（B 上線後）
1. 需要某有機模型 → `search`（選項 1 的 WebFetch 或選項 2 的 MCP tool）。
2. 有結果 → 下載 GLB 進 `public/models/`，**記錄授權 + attribution**。
3. 寫進 content JSON（`kind:"model"` + `src` + `attribution`），跑 `/verify`。
4. **找不到合適模型 / 授權不明 / 非 CC0·CC-BY → 停下，回報人類**（守則 §9）。

---

## 落地順序

1. **先做階段 A**（⑤ 飛機），不依賴 API key，馬上能收尾階段二。
2. 階段 B 等階段二全收完、確實出現「重複要找模型」需求時再開。
   ponytail：選項 1（REST，無 MCP）先試；證明不夠用再爬到選項 2。

## 來源
- [Poly Pizza API docs v1.1](https://poly.pizza/docs/api/v1.1)
- [Poly Pizza](https://poly.pizza/)
- [Poly.Pizza Unity MCP (HaD0Yun) — LobeHub](https://lobehub.com/mcp/had0yun-poly-pizza-mcp)
- [Poly Pizza MCP (matthewhall) — LobeHub](https://lobehub.com/mcp/matthewhallcom-polypizza-mcp)
