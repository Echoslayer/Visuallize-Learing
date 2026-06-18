import { SceneRoot } from '../engine/SceneRoot'
import { Scene } from '../engine/Scene'
import aiServer from '../content/ai-server.json'
import type { SceneContent } from '../engine/schema'

const content = aiServer as unknown as SceneContent

/**
 * 元件畫廊:供 shoot.mjs 截圖自查。
 * C1:渲染由 schema 驅動的完整場景,證明資料驅動可運作。
 * 之後會用 query 參數(?part=...&exploded=1&lang=en)挑選單一零件與狀態。
 */
export function Gallery() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#1b1e23' }}>
      <SceneRoot camera={content.camera}>
        <Scene content={content} />
      </SceneRoot>
    </div>
  )
}
