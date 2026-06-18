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

- 主場景:`/`;元件畫廊:`/?view=gallery`(供逐一截圖自查)。
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

🟢 **C0–C3 完成** — 骨架 + 自查 harness;資料驅動 primitive;統一材質 + 柔影 + OrbitControls;
點選零件 → emissive 高亮(zustand store,點空白清除)。
下一步 **C4**:拆解動畫(`@react-spring/three` 補間)。
查核點進度見 [`PLAN.md §6`](docs/plan/PLAN.md)。
