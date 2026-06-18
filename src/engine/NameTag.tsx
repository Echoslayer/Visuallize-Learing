import { Html } from '@react-three/drei'
import type { CSSProperties } from 'react'
import type { Vec3 } from './schema'

// 元件名牌:小字、純文字,釘在元件上方。比公司卡小。
const tag: CSSProperties = {
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  background: 'rgba(22, 26, 32, 0.82)',
  color: '#eef1f5',
  borderRadius: 5,
  padding: '2px 6px',
  fontSize: 10,
  lineHeight: 1.2,
  fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
}

export function NameTag({ text, anchor }: { text: string; anchor: Vec3 }) {
  return (
    <Html position={anchor} center zIndexRange={[15, 0]} style={{ pointerEvents: 'none' }}>
      <div style={tag}>{text}</div>
    </Html>
  )
}
