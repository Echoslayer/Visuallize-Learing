// ponytail: process layer 是流程時間邏輯 → 一個 assert 檢查,無框架。
import assert from 'node:assert/strict'
import { processCycleDuration, processPoint } from '../src/engine/process-motion.ts'
import type { ProcessRouteStop, Vec3 } from '../src/engine/schema.ts'

const path: Vec3[] = [
  [0, 0, 0],
  [1, 0, 0],
  [2, 0, 0],
]
const stops: ProcessRouteStop[] = [{ point: 1, station: 'a' }]
const times = { a: 2 }

assert.equal(processCycleDuration(path, stops, times, 4), 6)
assert.deepEqual(processPoint(path, stops, times, 0, 4), [0, 0, 0])

// 4 秒 travel over 2 equal segments → point 1 reached at t=2; dwell holds until t=4.
assert.deepEqual(processPoint(path, stops, times, 2.5 / 6, 4), [1, 0, 0])
assert.deepEqual(processPoint(path, stops, times, 3.9 / 6, 4), [1, 0, 0])

const afterDwell = processPoint(path, stops, times, 5 / 6, 4)
assert.ok(afterDwell[0] > 1 && afterDwell[0] < 2)

console.log('process.check ok')
