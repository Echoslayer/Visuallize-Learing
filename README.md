# Visual-Learning

一台**與議題無關的資料驅動 3D 解說引擎**。把產業供應鏈做成可拆解的 3D 模型——
點零件 → 拆解 → 浮出該環節的代表公司與股票代號。供應鏈只是引擎的第一份內容；
換議題 = 換一份 JSON，引擎一行不改。

> 復刻參考產品「學投資 learninvest」，學習用模擬、非商用。

## 核心設計

- **幾何是程式碼，不是二進位檔**：機械件程式生成 primitive；有機件才借模型且不細分。
- **engine / content 兩層分離**：`engine/` 不認識題目，題目資訊只在 `content/*.json`。
- 細節見 [`docs/plan/CONTEXT.md`](docs/plan/CONTEXT.md)（為什麼）與 [`docs/plan/PLAN.md`](docs/plan/PLAN.md)（怎麼做）。

## 技術棧

React 19 · @react-three/fiber 9 · three · drei · zustand · @react-spring/three · Vite · TypeScript
（版本鎖定見 PLAN.md §3）

## 開發

```bash
pnpm install
pnpm dev          # 開發伺服器
pnpm typecheck    # tsc --noEmit
pnpm lint
pnpm build
pnpm shoot <route>  # Playwright 截圖到 .agent/shots/（自我驗證用）
```

Python 工具（CadQuery/OpenSCAD，選用）一律用 [`uv`](https://docs.astral.sh/uv/)。

## 給 coding agent

這個 repo 設計成可由終端的 Claude Code 自主迭代。從 `/prime` 開始，遵循 `CLAUDE.md`。
可重用工作流在 `.claude/commands/`：`/prime`、`/verify`、`/commit`、`/add-component`、`/add-topic`。

## 狀態

🚧 規劃完成，階段一（C0–C6 最小核心 demo）尚未開工。
