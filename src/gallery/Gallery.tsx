import { useEffect } from 'react'
import { SceneRoot } from '../engine/SceneRoot'
import { Scene } from '../engine/Scene'
import { Credits } from '../ui/Credits'
import { DevHandle } from '../ui/DevHandle'
import { useSelection } from '../engine/selection'
import { getTopic } from '../content/registry'
import type { Part, SceneContent, Vec3 } from '../engine/schema'

const q = new URLSearchParams(window.location.search)
const content = focusMachine(getTopic(q.get('topic')), q.get('machine'))

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

function rootId(parts: Part[], id: string): string {
  return parts.find((p) => p.id === id)?.partOf ?? id
}

function focusMachine(content: SceneContent, id: string | null): SceneContent {
  if (!id) return content
  const root = rootId(content.parts, id)
  const parts = content.parts.filter((p) => p.id === root || p.partOf === root)
  const anchor = content.parts.find((p) => p.id === root)?.transform.position
  if (!parts.length || !anchor) return content
  return {
    ...content,
    process: undefined,
    camera: { position: [1.6, 1.4, 2.8], target: [0, 0.35, 0] },
    parts: parts.map((p) => ({
      ...p,
      transform: { ...p.transform, position: sub(p.transform.position, anchor) },
    })),
  }
}

/** 讀 URL query 把狀態灌進 store(?exploded=1&lang=en&part=id),供截圖自查分別取狀態。 */
function useQueryState() {
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get('exploded') === '1') useSelection.setState({ exploded: true })
    if (q.get('xray') === '1') useSelection.setState({ xray: true })
    if (q.get('names') === '1') useSelection.setState({ showAllNames: true })
    if (q.get('cards') === '1') useSelection.setState({ showAllCards: true })
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
 * 元件畫廊:供 shoot.mjs 截圖自查。`?machine=id` 可單獨看一台機台(含 partOf 子部位)。
 * 狀態由 URL query 控制(展開/語言/選取/機台聚焦)。
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
