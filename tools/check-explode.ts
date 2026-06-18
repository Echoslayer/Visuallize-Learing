// ponytail: 唯一的單元檢查——explodeOffset 是純數學且有除零邊界(會吐 NaN 讓場景消失)。
// 其餘程式靠 §7 截圖 harness 驗。無框架,Node 24 直接跑:`pnpm check`
import assert from 'node:assert/strict'
import { explodeOffset } from '../src/engine/explode.ts'

// 零向量 / 零 magnitude → 不位移(框體類零件靠此固定)
assert.deepEqual(explodeOffset({ vector: [0, 0, 0], magnitude: 5 }), [0, 0, 0])
assert.deepEqual(explodeOffset({ vector: [0, 1, 0], magnitude: 0 }), [0, 0, 0])

// normalize(vector) × magnitude
assert.deepEqual(explodeOffset({ vector: [0, 2, 0], magnitude: 3 }), [0, 3, 0])
assert.deepEqual(explodeOffset({ vector: [3, 4, 0], magnitude: 10 }), [6, 8, 0])

console.log('explode.check ok')
