// ponytail: explodeOffset 是純數學 + 邊界(magnitude 0、除零靠 UP_BIAS 保證非零)。`pnpm check`。
import assert from 'node:assert/strict'
import { explodeOffset } from '../src/engine/explode.ts'

const C = [0, 0, 0] as const

// magnitude 0 → 不動
assert.deepEqual(explodeOffset({ magnitude: 0 }, [3, 0, 4], [...C]), [0, 0, 0])

// 在中心的零件 → 直接往上(水平分量為 0,靠 UP_BIAS)
const up = explodeOffset({ magnitude: 2 }, [0, 5, 0], [...C])
assert.equal(up[0], 0)
assert.equal(up[2], 0)
assert.ok(Math.abs(up[1] - 2) < 1e-9, '中心零件應往上 = magnitude')

// 偏右的零件 → 往右 + 往上,長度 = magnitude
const o = explodeOffset({ magnitude: 3 }, [4, 0, 0], [...C])
assert.ok(o[0] > 0 && o[1] > 0, '應往外往上')
assert.ok(Math.abs(Math.hypot(o[0], o[1], o[2]) - 3) < 1e-9, '位移長度 = magnitude')

// 中心可偏移
const off = explodeOffset({ magnitude: 1 }, [1, 0, 0], [1, 0, 0])
assert.equal(off[0], 0) // 與中心同 x → 無水平 x 分量

console.log('explode.check ok')
