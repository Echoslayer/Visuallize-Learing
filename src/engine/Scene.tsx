import { expandParts } from './expand'
import { GeometryFactory } from './GeometryFactory'
import type { SceneContent } from './schema'

/**
 * 把一份 content 的 parts 全部渲染出來。與題目無關——只認識 schema。
 * 先 expandParts 展開 repeat(無 repeat 的 part 原樣通過)。
 */
export function Scene({ content }: { content: SceneContent }) {
  return (
    <>
      {expandParts(content.parts).map((part) => (
        <GeometryFactory key={part.id} part={part} />
      ))}
    </>
  )
}
