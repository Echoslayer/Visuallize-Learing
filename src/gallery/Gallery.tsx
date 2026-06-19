import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { SceneRoot } from '../engine/SceneRoot'
import { Scene } from '../engine/Scene'
import { Credits } from '../ui/Credits'
import { DevHandle } from '../ui/DevHandle'
import { useSelection } from '../engine/selection'
import { getTopic } from '../content/registry'
import type { Part, SceneContent, Vec3 } from '../engine/schema'

const q = new URLSearchParams(window.location.search)
const content = focusMachine(getTopic(q.get('topic')), q.get('machine'))
const original = getTopic(q.get('topic'))
const machine = q.get('machine')

const panel: CSSProperties = {
  position: 'fixed',
  left: 12,
  top: 12,
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
  maxHeight: 'calc(100vh - 24px)',
  overflow: 'auto',
  padding: 8,
  background: 'rgba(22, 26, 32, 0.9)',
  borderRadius: 8,
}
const link: CSSProperties = {
  color: '#dbe2eb',
  textDecoration: 'none',
  fontSize: 12,
  fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
  padding: '5px 8px',
  borderRadius: 5,
  whiteSpace: 'nowrap',
}
const active: CSSProperties = { ...link, background: '#2f6df6', color: '#fff' }

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

function href(id: string | null): string {
  const next = new URLSearchParams(window.location.search)
  if (id) next.set('machine', id)
  else next.delete('machine')
  return `?${next.toString()}`
}

function MachineList({ content, current }: { content: SceneContent; current: string | null }) {
  const lang = useSelection((s) => s.lang)
  const machines = content.parts.filter((p) => p.annotation)
  return (
    <nav style={panel}>
      <a href={href(null)} style={current ? link : active}>
        All
      </a>
      {machines.map((p) => (
        <a key={p.id} href={href(p.id)} style={current === p.id ? active : link}>
          {p.resolvedLabel?.[lang] ?? p.annotation?.title[lang] ?? p.id}
        </a>
      ))}
    </nav>
  )
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
      <MachineList content={original} current={machine} />
      <Credits content={content} />
    </div>
  )
}
