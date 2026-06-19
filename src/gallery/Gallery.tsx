import { useEffect } from 'react'
import { SceneRoot } from '../engine/SceneRoot'
import { Scene } from '../engine/Scene'
import { Credits } from '../ui/Credits'
import { DevHandle } from '../ui/DevHandle'
import { useSelection } from '../engine/selection'
import { getTopic } from '../content/registry'

const content = getTopic(new URLSearchParams(window.location.search).get('topic'))

/** 讀 URL query 把狀態灌進 store(?exploded=1&lang=en&part=id),供截圖自查分別取狀態。 */
function useQueryState() {
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get('exploded') === '1') useSelection.setState({ exploded: true })
    const lang = q.get('lang')
    if (lang === 'en' || lang === 'zh') useSelection.setState({ lang })
    const part = q.get('part')
    if (part) useSelection.setState({ selectedId: part })
    // DEV:暴露 store 給自查 harness 驅動(toggle 展開/收合驗證無漂移)。
    if (import.meta.env.DEV) {
      ;(window as unknown as { __selection?: typeof useSelection }).__selection =
        useSelection
    }
  }, [])
}

/**
 * 元件畫廊:供 shoot.mjs 截圖自查。渲染由 schema 驅動的完整場景。
 * 狀態由 URL query 控制(展開/語言/選取)。
 */
export function Gallery() {
  useQueryState()
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#dadee4' }}>
      <SceneRoot camera={content.camera}>
        <Scene content={content} />
        {import.meta.env.DEV && <DevHandle />}
      </SceneRoot>
      <Credits content={content} />
    </div>
  )
}
