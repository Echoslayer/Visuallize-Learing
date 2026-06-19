import { Suspense } from 'react'
import { expandParts } from './expand'
import { GeometryFactory } from './GeometryFactory'
import { ProcessLayer } from './ProcessLayer'
import type { SceneContent } from './schema'

/**
 * 把一份 content 的 parts 全部渲染出來。與題目無關——只認識 schema。
 * 先 expandParts 展開 repeat;Suspense 包住(kind:"model" 的 useGLTF 會 suspend)。
 */
export function Scene({ content }: { content: SceneContent }) {
  const parts = expandParts(content.parts)
  return (
    <Suspense fallback={null}>
      {parts.map((part) => (
        <GeometryFactory key={part.id} part={part} center={content.camera.target} />
      ))}
      <ProcessLayer process={content.process} parts={parts} />
    </Suspense>
  )
}
