import type { CSSProperties } from 'react'
import { TOPIC_LIST } from '../content/registry'
import { useSelection } from '../engine/selection'

// 題目切換器:左側清單,點一下用 ?topic= 導航(整頁重載 → 相機/狀態乾淨,URL 可分享)。
const panel: CSSProperties = {
  position: 'fixed',
  left: 14,
  top: 14,
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
  padding: 8,
  background: 'rgba(22, 26, 32, 0.9)',
  borderRadius: 12,
  boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
}
const item: CSSProperties = {
  display: 'block',
  padding: '7px 12px',
  borderRadius: 8,
  fontSize: 13,
  textDecoration: 'none',
  color: '#cfd5dd',
  whiteSpace: 'nowrap',
  fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
}
const active: CSSProperties = { ...item, background: '#2f6df6', color: '#fff', fontWeight: 600 }
const tool: CSSProperties = { ...item, borderTop: '1px solid rgba(255,255,255,0.12)' }

export function TopicSwitcher({ current }: { current: string }) {
  const lang = useSelection((s) => s.lang)
  return (
    <nav style={panel}>
      {TOPIC_LIST.map((t) => (
        <a key={t.id} href={`?topic=${t.id}`} style={t.id === current ? active : item}>
          {t.title[lang]}
        </a>
      ))}
      <a href={`?view=gallery&topic=${current}`} style={tool}>
        {lang === 'zh' ? '機台' : 'Machines'}
      </a>
    </nav>
  )
}
