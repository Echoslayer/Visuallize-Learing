import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import fs from 'node:fs'

const route = process.argv[2] ?? '?view=gallery'
const name = process.argv[3] ?? 'vid'
const base = process.env.SHOOT_BASE ?? 'http://localhost:5173'
const url = route.startsWith('http') ? route : `${base}/${route.replace(/^\//, '')}`

const outDir = path.resolve(process.cwd(), '.agent/shots')
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()
const context = await browser.newContext({ recordVideo: { dir: outDir, size: { width: 1280, height: 800 } } })
const page = await context.newPage()
await page.setViewportSize({ width: 1280, height: 800 })
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForSelector('canvas')
// 錄製 1.5 秒
await page.waitForTimeout(1500)

const videoPath = await page.video().path()
await context.close()
await browser.close()

const out = path.join(outDir, `${name}.webm`)
fs.renameSync(videoPath, out)
console.log(`video saved: ${out}`)
