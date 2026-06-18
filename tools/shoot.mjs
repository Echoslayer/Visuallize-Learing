// Playwright headless 截圖 harness。供 agent 自查迴圈讀回比對。
// 用法:node tools/shoot.mjs [route] [name]
//   route: 接在 base 後的路徑/query,如 "?view=gallery&part=x&exploded=1"(預設 "?view=gallery")
//   name : 輸出檔名(不含副檔名,預設 "shot")
// 前置:dev server 需已啟動(預設 http://localhost:5173,可用 SHOOT_BASE 覆寫)。
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const route = process.argv[2] ?? '?view=gallery'
const name = process.argv[3] ?? 'shot'
const base = process.env.SHOOT_BASE ?? 'http://localhost:5173'
const url = route.startsWith('http') ? route : `${base}/${route.replace(/^\//, '')}`

const outDir = path.resolve(process.cwd(), '.agent/shots')
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setViewportSize({ width: 1280, height: 800 })
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForSelector('canvas')
// 給 WebGL 一點時間繪製(場景靜止,固定延遲即可決定性)
await page.waitForTimeout(800)

const out = path.join(outDir, `${name}.png`)
await page.screenshot({ path: out })
await browser.close()
console.log(`shot saved: ${out}`)
