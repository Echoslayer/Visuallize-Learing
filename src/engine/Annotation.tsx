import { Html } from '@react-three/drei'
import type { CSSProperties } from 'react'
import type { Annotation as AnnotationData, Lang, Vec3 } from './schema'

// 浮動標籤卡:drei <Html> 把 DOM 釘在零件 3D 座標,隨相機移動自動追蹤。
// 與題目無關——只認 schema 的 annotation 結構。背景不透明度由 config 控制。
const cardBase: CSSProperties = {
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  color: '#eef1f5',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8,
  padding: '8px 11px',
  boxShadow: '0 6px 18px rgba(0,0,0,0.28)',
  fontSize: 13,
  lineHeight: 1.3,
  fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
}
const titleStyle: CSSProperties = { fontWeight: 600, marginBottom: 4 }
const chip: CSSProperties = {
  display: 'inline-block',
  marginRight: 6,
  padding: '1px 7px',
  borderRadius: 5,
  background: 'rgba(255,255,255,0.1)',
  fontSize: 12,
}

export function Annotation({
  data,
  lang,
  anchor,
  opacity = 0.92,
}: {
  data: AnnotationData
  lang: Lang
  anchor: Vec3
  opacity?: number
}) {
  const card: CSSProperties = {
    ...cardBase,
    background: `rgba(22, 26, 32, ${opacity})`,
  }
  return (
    <Html position={anchor} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
      <div style={card}>
        <div style={titleStyle}>{data.title[lang]}</div>
        <div>
          {data.companies.map((c) => (
            <span key={c.ticker} style={chip}>
              {c.name} <b>{c.ticker}</b>
            </span>
          ))}
        </div>
      </div>
    </Html>
  )
}
