// ponytail: expandParts 是非視覺邏輯 + 邊界(count<=1)——ADR-0010 邊界① → 一個 assert,無框架。
// `pnpm check`。Node 24 直接跑。
import assert from 'node:assert/strict'
import { expandParts } from '../src/engine/expand.ts'
import type { Part } from '../src/engine/schema.ts'

const mk = (over: Partial<Part>): Part => ({
  id: 'x',
  kind: 'primitive',
  geometry: { shape: 'box', args: [1, 1, 1] },
  transform: { position: [0, 0, 0] },
  material: 'metal-light',
  explode: { vector: [0, 0, 0], magnitude: 0 },
  annotation: null,
  ...over,
})

// 無 repeat → 1 份、id 不變、無 repeat 欄
let r = expandParts([mk({})])
assert.equal(r.length, 1)
assert.equal(r[0].id, 'x')
assert.equal(r[0].repeat, undefined)

// count 3 step [1,0,0] → 3 份,id/position 正確,repeat 已移除
r = expandParts([mk({ repeat: { count: 3, step: [1, 0, 0] } })])
assert.equal(r.length, 3)
assert.deepEqual(
  r.map((p) => p.id),
  ['x-0', 'x-1', 'x-2'],
)
assert.deepEqual(
  r.map((p) => p.transform.position),
  [
    [0, 0, 0],
    [1, 0, 0],
    [2, 0, 0],
  ],
)
assert.ok(r.every((p) => p.repeat === undefined))

// 邊界:count 1 與 0 → 各只 1 份(不可產出 0 份或負迴圈)
assert.equal(expandParts([mk({ repeat: { count: 1, step: [1, 0, 0] } })]).length, 1)
assert.equal(expandParts([mk({ repeat: { count: 0, step: [1, 0, 0] } })]).length, 1)

console.log('expand.check ok')
