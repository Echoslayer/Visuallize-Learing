import { SceneRoot } from '../engine/SceneRoot'
import { TestBox } from '../engine/TestBox'

/**
 * 元件畫廊:每個零件/場景單獨一格渲染,供 shoot.mjs 截圖自查。
 * 之後會用 query 參數(?part=...&exploded=1&lang=en)挑選要渲染的零件與狀態。
 * C0:單一格渲染測試方塊,證明 gallery 路由 + 截圖 harness 可運作。
 */
export function Gallery() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#1b1e23' }}>
      <SceneRoot>
        <TestBox />
      </SceneRoot>
    </div>
  )
}
