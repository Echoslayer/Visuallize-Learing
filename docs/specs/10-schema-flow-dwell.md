# schema 變更:flow dwell(站點停頓)

> 由人類要求(半導體 demo:料球要「進站停頓加工」而非等速繞)。擴充 [ADR-0012](../adr/0012-flow-motion-nondeterministic.md) 的 flow。
- type: schema-change
- 動到:`engine/schema.ts`(Geometry)、`engine/FlowParticles.tsx`、新 `engine/flow-dwell.ts`(純函式)+ `tools/check-flow-dwell.ts`。

## 動機

原 flow 是等速、等間距、無停頓的閉環 → 料球只是「路過」機台,讀不出「在每站被加工」。
要讓粒子**到站頓一下**(dwell),像進腔體處理。

## 設計

- **schema** Geometry 加兩欄(僅 flow 用,選配,向後相容):
  - `stops?: number[]` — 停留的 path **點索引**(粒子在這些點頓住)。
  - `dwell?: number` — 每個 stop 停留秒數(預設 0;需搭 stops)。
- **純函式** `flowParam(phase, stopParams, dwell, travel)`:把循環相位映到曲線參數 t——
  在停點鎖住 t 達 dwell 秒,其餘區段等速。`stopParams = stops.map(i => i/N)` 升冪。
  用 `getPoint`(參數版)而非 `getPointAt`(arc-length):closed 曲線 `getPoint(i/N)` 正好落在點 i,停點精準。
- **FlowParticles**:有 `stops + dwell` → 走 dwell 時間軸;否則**原等速路徑不變**(其他題目零回歸)。
- **check**:`flowParam` 帶迴圈/分支 → `tools/check-flow-dwell.ts`(node:assert:單調、端點、停頓鎖值、dwell=0 退回線性)。比照 check-explode(ADR-0010 邊界①)。

## 用法(content)

```json
"stops": [1, 3, 5], "dwell": 0.7   // 在 path 第 1/3/5 點各停 0.7 秒
```
半導體:wafer-flow stops [1,3,5](矽晶圓/代工/封測 的爬升點)、chip-flow stops [0,2](封測/下游)。

## 驗證

抓粒子 y 隨時間:爬到站點高度(代工 1.3、封測 1.0)各**鎖住 ~0.5–0.6s** 再走 → dwell 生效。
`pnpm check` 綠;build/typecheck/lint 綠。
