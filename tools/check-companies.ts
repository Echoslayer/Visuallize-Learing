// ponytail: CSV 解析 + 對應是資料轉換邏輯(ADR-0010 邊界①)→ 一個 assert,無框架。`pnpm check`。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { linkKey, parseLinks } from '../src/content/parse-links.ts'

const csv = readFileSync('src/content/companies.csv', 'utf8')
const m = parseLinks(csv)

// 一個元件多家公司(many → 同一 part)
assert.deepEqual(m.get(linkKey('ai-server', 'tray-gpu-01')), [
  { name: 'NVIDIA', ticker: 'NVDA' },
  { name: '台積電', ticker: '2330' },
])

// 一家公司多個元件(NVDA 出現在多個 part)
const nvdaParts = [...m.entries()].filter(([, cs]) => cs.some((c) => c.ticker === 'NVDA'))
assert.ok(nvdaParts.length >= 3, 'NVDA 應跨多個 part')

// 無對應的 part → 空陣列
assert.deepEqual(m.get(linkKey('ai-server', 'rack-base')) ?? [], [])

// 標題列被跳過(不會有 ticker === "ticker")
assert.ok(![...m.values()].flat().some((c) => c.ticker === 'ticker'))

console.log('companies.check ok')
