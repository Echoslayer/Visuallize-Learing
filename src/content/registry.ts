import aiServer from './ai-server.json'
import grid from './grid.json'
import datacenter from './datacenter.json'
import pipeline from './pipeline.json'
import wind from './wind.json'
import aerospace from './aerospace.json'
import { companiesFor } from './companies'
import type { LocalizedText, SceneContent } from '../engine/schema'

// 題目註冊表(組合層,非 engine)。新增題目 = 加一筆 + 一份 JSON,engine 不動。
export const TOPICS: Record<string, SceneContent> = {
  'ai-server': aiServer as unknown as SceneContent,
  grid: grid as unknown as SceneContent,
  datacenter: datacenter as unknown as SceneContent,
  pipeline: pipeline as unknown as SceneContent,
  wind: wind as unknown as SceneContent,
  aerospace: aerospace as unknown as SceneContent,
}

export const DEFAULT_TOPIC = 'ai-server'

// 給題目切換器:id + 各題目的標題(沿用 content.title,免另維護清單)。
export const TOPIC_LIST: { id: string; title: LocalizedText }[] = Object.entries(TOPICS).map(
  ([id, c]) => ({ id, title: c.title }),
)

// 把 companies.csv 的公司對應接到每個 part 的 annotation(不改 JSON、不改 engine)。
function withCompanies(content: SceneContent): SceneContent {
  return {
    ...content,
    parts: content.parts.map((p) =>
      p.annotation
        ? { ...p, annotation: { ...p.annotation, companies: companiesFor(content.topic, p.id) } }
        : p,
    ),
  }
}

export function getTopic(name: string | null): SceneContent {
  return withCompanies((name && TOPICS[name]) || TOPICS[DEFAULT_TOPIC])
}
