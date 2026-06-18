import aiServer from './ai-server.json'
import grid from './grid.json'
import type { SceneContent } from '../engine/schema'

// 題目註冊表(組合層,非 engine)。新增題目 = 加一筆 + 一份 JSON,engine 不動。
export const TOPICS: Record<string, SceneContent> = {
  'ai-server': aiServer as unknown as SceneContent,
  grid: grid as unknown as SceneContent,
}

export const DEFAULT_TOPIC = 'ai-server'

export function getTopic(name: string | null): SceneContent {
  return (name && TOPICS[name]) || TOPICS[DEFAULT_TOPIC]
}
