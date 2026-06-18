import type { CSSProperties } from 'react'
import type { SceneContent } from '../engine/schema'

// 顯示借用模型的作者標註(CC-BY 義務)。收集當前題目所有 model.attribution。
const style: CSSProperties = {
  position: 'fixed',
  left: 12,
  bottom: 12,
  zIndex: 10,
  fontSize: 11,
  lineHeight: 1.4,
  color: 'rgba(40,46,54,0.6)',
  fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
  pointerEvents: 'none',
}

export function Credits({ content }: { content: SceneContent }) {
  const attrs = [
    ...new Set(
      content.parts.map((p) => p.model?.attribution).filter((a): a is string => !!a),
    ),
  ]
  if (attrs.length === 0) return null
  return (
    <div style={style}>
      {attrs.map((a) => (
        <div key={a}>{a}</div>
      ))}
    </div>
  )
}
