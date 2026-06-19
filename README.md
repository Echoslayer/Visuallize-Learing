# Visual-Learning

一台**與議題無關的資料驅動 3D 解說引擎**。把產業供應鏈做成可拆解的 3D 模型——
點零件 → 拆解 → 浮出該環節的代表公司與股票代號。供應鏈只是引擎的第一份內容；
換議題 = 換一份 JSON，引擎一行不改。


## 核心設計

- **幾何是程式碼，不是二進位檔**：機械件程式生成 primitive；有機件才借模型且不細分。
- **engine / content 兩層分離**：`engine/` 不認識題目，題目資訊只在 `content/*.json`。
- 設計動機見 [`docs/plan/CONTEXT.md`](docs/plan/CONTEXT.md)（為什麼）與 [`docs/plan/PLAN.md`](docs/plan/PLAN.md)（怎麼做）；
  關鍵決策見 [`docs/adr/`](docs/adr/)（架構決策紀錄）。

## 技術棧

React 19 · @react-three/fiber 9 · three · drei · zustand 5 · @react-spring/three · Vite 8 · TypeScript 6

> 真正的相容性鎖定是 **react@19 + @react-three/fiber@9**；vite/ts/eslint 跟隨官方 react-ts 範本當下版本（見 [ADR-0005](docs/adr/0005-toolchain-versioning.md)）。

## 開發

```bash
pnpm install
pnpm dev                          # 開發伺服器(預設 http://localhost:5173)
pnpm typecheck                    # tsc -b(noEmit)
pnpm lint
pnpm build
pnpm shoot "?view=gallery" name   # Playwright 截圖到 .agent/shots/(自我驗證用)
```

**截圖自查接口(DEV,ADR-0008)**:`?topic=` 切題目、DOM `[data-action]` 按鈕、`?exploded=1&lang=en&part=id`(Gallery)灌初始狀態。
單機台調試:`?view=gallery&topic=semiconductor&machine=foundry&xray=1&names=1`。
相機角度/縮放與狀態驅動走 `window.__view`(Canvas 內 DEV 暴露):

```js
// Playwright page.evaluate 內:
const v = window.__view
v.camera.position.set(0, 2, 6); v.controls.target.set(0, 1, 0); v.controls.update() // 轉角度/縮放
v.selection.setState({ exploded: true, xray: true })                                 // 驅動狀態
```

- 主場景:`/`(左側**題目切換器**可點選 6 個題目);元件畫廊:`/?view=gallery`(供逐一截圖自查)。
- **快捷鍵**:`E` 拆解、`X` 透視、數字 `1`–`7` 切題目(打字/leva 面板中不攔截)。
- Python 工具（CadQuery/OpenSCAD，選用）一律用 [`uv`](https://docs.astral.sh/uv/)。

## 專案結構

```
src/engine/      # 與題目無關的引擎(SceneRoot、之後的 GeometryFactory/kit/materials/explode…)
src/gallery/     # 元件畫廊路由,每個零件單獨一格供截圖
src/content/     # 題目資料(JSON);換議題只動這裡
tools/shoot.mjs  # 截圖 harness
specs/           # 階段二每個工作單元的規格(spec-driven)
docs/plan/       # CONTEXT / PLAN / SETUP
docs/adr/        # 架構決策紀錄
.claude/         # slash commands + r3f-industrial-component skill + 權限安全網
```

## 給 coding agent

這個 repo 設計成可由終端的 Claude Code 自主迭代。從 `/prime` 開始，遵循 `CLAUDE.md`。
可重用工作流在 `.claude/commands/`：`/prime`、`/verify`、`/commit`、`/add-component`、`/add-topic`。

## 狀態

🎉 **階段一完成(C0–C6)** — AI 伺服器機櫃垂直切片:旋轉 / 點選 / 拆解 / 標籤(中英)/ UI 殼,
全由 JSON 驅動,engine 不含題目字眼。

🎉 **7 題目**:`?topic=ai-server`(預設)、`grid`(變壓器)、`datacenter`(機房陣列)、`pipeline`(製程管線)、`wind`(風力發電機)、`aerospace`(航太/飛機)、`semiconductor`(**半導體晶圓產線,含流動動畫**)。
引擎支援 box/cylinder/cone/tube + repeat + rotation + model(GLB)+ **flow(裝飾/循環流動粒子,可設站點停頓 dwell)**+
**process layer(產線語意:station/route/token,單向箭頭、停站加工、物料變化)**;
互動:點選高亮、**元件名牌**(點選/「名稱」按鈕)、**公司卡**(「股票」按鈕)、**放射狀拆解**(全域自中心散開)、**透視**(「透視」按鈕看穿外殼內部,ADR-0015)、中英、**鍵盤快捷**(E/X/數字鍵);engine/content 分離全程守住。
schema 變更皆走 spec + sign-off(`repeat` 02、`tube` 03、`model` 05、`flow` 06、`label` 08、`flow-dwell` 10、`process` 11)。純函式附 `pnpm check` 斷言(見 [ADR-0010])。
供應鏈題目走三段管線(見 [ADR-0013](docs/adr/0013-supply-chain-pipeline-abstraction.md)):
`/research-supply-chain`(事實 → `docs/supply-chains/`)→ `/design-demo`(設計取捨,套 `object-abstraction` skill)→ `/add-topic`(建模)。
模型細節層次跟著**供應鏈意義**走(鏈上有對應的部位就建,只略過無意義造型細節)。
建置步驟 + **最終驗收清單**見 [`docs/plan/topic-playbook.md`](docs/plan/topic-playbook.md)。

## 素材出處 / Credits

- **Airplane**(`aerospace` 題目)— by **Poly by Google**,來源 [poly.pizza](https://poly.pizza/),授權 **CC-BY**。

**已知待辦**:公司**代號**已查證(`companies.csv`);公司↔元件**對應**仍 AI 起草、可再校;build 的 three.js chunk(>500kB)可後續 code-split。
