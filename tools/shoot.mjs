// Playwright headless 截圖 harness。供 agent 自查迴圈讀回比對。
// 用法:node tools/shoot.mjs [route] [name]
//   route: 接在 base 後的路徑/query,如 "?view=gallery&part=x&exploded=1"(預設 "?view=gallery")
//   name : 輸出檔名(不含副檔名,預設 "shot")
// 環境變數:
//   SHOOT_BASE: 覆寫預設的 http://localhost:5173
//   SHOOT_FRAMES: 預設為 1。若設定為 > 1（例如 3），則會每隔 500ms 截取一張圖（命名為 name-0.png, name-1.png...），供比對動態變化。
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const route = process.argv[2] ?? '?view=gallery'
const name = process.argv[3] ?? 'shot'
const base = process.env.SHOOT_BASE ?? 'http://localhost:5173'
const url = route.startsWith('http') ? route : `${base}/${route.replace(/^\//, '')}`
const numFrames = parseInt(process.env.SHOOT_FRAMES || '1', 10)

const outDir = path.resolve(process.cwd(), '.agent/shots')
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage()

await page.setViewportSize({ width: 1280, height: 800 })
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForSelector('canvas')

// 讓場景初始繪製穩定
await page.waitForTimeout(800)

for (let i = 0; i < numFrames; i++) {
  const suffix = numFrames > 1 ? `-${i}` : ''
  const out = path.join(outDir, `${name}${suffix}.png`)
  await page.screenshot({ path: out })
  console.log(`shot saved: ${out}`)
  
  if (i < numFrames - 1) {
    // 等待 500ms 讓動態元件（旋轉、粒子等）產生位移
    await page.waitForTimeout(500)
  }
}

await browser.close()
