// ponytail: CSV 解析 + 對應是資料轉換邏輯(ADR-0010 邊界①)→ 一個 assert,無框架。`pnpm check`。
// 驗「機制」(解析 + 多對多 + 完整性),不綁特定公司資料 → 改 companies.csv 不會弄壞此檢查。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { linkKey, parseLinks } from '../src/content/parse-links.ts'

const csv = readFileSync('src/content/companies.csv', 'utf8')
const m = parseLinks(csv)
const entries = [...m.entries()]

// 一個元件可對多家公司:至少有一個 part 對到 ≥2 家
assert.ok(
  entries.some(([, cs]) => cs.length >= 2),
  '應有元件對應多家公司',
)

// 一家公司可跨多個元件:至少有一個 ticker 出現在 ≥2 個 part
const perTicker = new Map<string, number>()
for (const [, cs] of entries)
  for (const c of cs) perTicker.set(c.ticker, (perTicker.get(c.ticker) ?? 0) + 1)
assert.ok([...perTicker.values()].some((n) => n >= 2), '應有公司跨多個元件')

// 標題列被跳過 + 每筆都有 ticker/name(完整性)
for (const [, cs] of entries)
  for (const c of cs) {
    assert.notEqual(c.ticker, 'ticker')
    assert.ok(c.ticker && c.name, 'ticker/name 不可空')
  }

// 不存在的對應 → 空陣列
assert.deepEqual(m.get(linkKey('nope', 'nope')) ?? [], [])

console.log('companies.check ok')
