import { GeometryFactory } from './GeometryFactory'
import type { SceneContent } from './schema'

/**
 * 把一份 content 的 parts 全部渲染出來。與題目無關——只認識 schema。
 */
export function Scene({ content }: { content: SceneContent }) {
  return (
    <>
      {content.parts.map((part) => (
        <GeometryFactory key={part.id} part={part} />
      ))}
    </>
  )
}
