import aiServer from './ai-server.json'
import grid from './grid.json'
import datacenter from './datacenter.json'
import pipeline from './pipeline.json'
import wind from './wind.json'
import aerospace from './aerospace.json'
import semiconductor from './semiconductor.json'
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
  semiconductor: semiconductor as unknown as SceneContent,
}

export const DEFAULT_TOPIC = 'ai-server'

// 給題目切換器:id + 各題目的標題(沿用 content.title,免另維護清單)。
export const TOPIC_LIST: { id: string; title: LocalizedText }[] = Object.entries(TOPICS).map(
  ([id, c]) => ({ id, title: c.title }),
)

// 1) 把 companies.csv 的公司接到節點 annotation;2) 解析每個 part 的 card(自己或 partOf 的節點卡)。
// 都在組合層,不改 JSON、不改 engine。
function enrich(content: SceneContent): SceneContent {
  const parts = content.parts.map((p) =>
    p.annotation
      ? { ...p, annotation: { ...p.annotation, companies: companiesFor(content.topic, p.id) } }
      : p,
  )
  const nodeCard = new Map(parts.filter((p) => p.annotation).map((p) => [p.id, p.annotation]))
  // 每個 part 的「自己的名字」= label 或節點 title;供子部位繼承。
  const ownName = new Map(parts.map((p) => [p.id, p.label ?? p.annotation?.title]))
  return {
    ...content,
    parts: parts.map((p) => ({
      ...p,
      card: p.annotation ?? (p.partOf ? (nodeCard.get(p.partOf) ?? null) : null),
      // 顯示名:自己的 label → 父元件名(partOf)→ 自己的節點 title。形狀小塊靠這繼承父名。
      resolvedLabel: p.label ?? (p.partOf ? ownName.get(p.partOf) : undefined) ?? p.annotation?.title,
    })),
  }
}

export function getTopic(name: string | null): SceneContent {
  return enrich((name && TOPICS[name]) || TOPICS[DEFAULT_TOPIC])
}
