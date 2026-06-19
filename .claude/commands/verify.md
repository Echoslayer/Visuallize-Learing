# Verify
> 跑 PLAN.md §7 的自我驗證迴圈。這是「完成」的唯一定義——沒過不准 commit。
> （借鏡 TAC `/test`：結構化結果、遇第一個失敗即停。）

## Variables
route: $1 — 要截圖的 gallery 路由（如 `gallery?part=tray-gpu-01&exploded=1&lang=en`）；省略則用預設場景。

## Run（依序執行，遇第一個非零 exit 即停）
1. `pnpm typecheck` — `tsc --noEmit`，0 error。
2. `pnpm lint` — 0 error。
3. `pnpm build` — exit 0。
4. `pnpm shoot {route}` — Playwright headless 截圖到 `.agent/shots/`。
5. **用 Read 工具讀回那張 PNG**，逐條對照當前查核點/spec 的「驗收」。
   比例/質感類驗收：若 `docs/references/` 有對應圖，一併讀進來做視覺方向校準（非像素比對）。
   若題目含 `process`,額外檢查:
   - route 有箭頭且單向,不是閉合跑馬燈。
   - token 穿過 station 中心附近,不是沿邊掠過。
   - token 到站有停留/加工感;station 有 marker。
   - input/output token 材質或路線有區隔。
   - side input 不排在主線上。

## Report（結構化）
```json
[
  { "check": "typecheck", "passed": true,  "command": "pnpm typecheck" },
  { "check": "visual",    "passed": false, "command": "pnpm shoot ...", "error": "標籤未貼齊零件" }
]
```
- 失敗項排最上；通過項省略 error。
- 全綠 → 回報可 commit。
- 任一失敗 → 把「查核點、失敗項、推測原因、下一步」寫進 `.agent/log.md`。
- 同一查核點連續失敗 **3 次** → 停下回報人類，不要硬幹或繞過驗收（§9）。
