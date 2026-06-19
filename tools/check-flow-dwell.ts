// ponytail: flowParam 是帶分支/迴圈的純數學(ADR-0010 邊界①)→ 一個 node:assert,無框架。`pnpm check`。
import assert from 'node:assert/strict'
import { flowParam } from '../src/engine/flow-dwell.ts'

const stops = [0.25, 0.5] // 兩個停點
const dwell = 1
const travel = 2 // 跑完整圈 2 秒
const f = (phase: number) => flowParam(phase, stops, dwell, travel)

// 1) 單調不遞減(相位前進,參數不倒退)
let prev = -1
for (let k = 0; k <= 200; k++) {
  const t = f(k / 200)
  assert.ok(t >= prev - 1e-9, `monotonic at ${k}`)
  prev = t
}

// 2) 端點:phase 0 → 0;接近 1 → 接近終點
assert.equal(f(0), 0)
assert.ok(f(0.999) > 0.9, 'near end approaches 1')

// 3) 停頓:到達 stop0(s=0.25)後的 dwell 窗內,參數鎖在 0.25
// 走到 s=0.25 的時間 = 0.25*travel = 0.5s;dwell 窗 [0.5,1.5)s;總時 = travel+2*dwell = 4s → phase [0.125,0.375)
assert.ok(Math.abs(f(0.2) - 0.25) < 1e-9, 'dwell holds at stop0')
assert.ok(Math.abs(f(0.3) - 0.25) < 1e-9, 'still dwelling at stop0')
// 剛離開停頓窗 → 應已前進超過 0.25
assert.ok(f(0.38) > 0.25, 'moves on after dwell')

// 4) dwell=0 → 線性(無停頓):f(phase)=phase
const lin = (phase: number) => flowParam(phase, [], 0, travel)
assert.ok(Math.abs(lin(0.42) - 0.42) < 1e-9, 'no stops → linear')

console.log('flow-dwell.check ok')
