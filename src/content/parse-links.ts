import type { Company } from '../engine/schema'

// 解析 companies.csv(edge list: topic,part,ticker,name)成 (topic|part) -> Company[]。
// 純函式、node 可跑(不碰 Vite)。ponytail: 欄位不可含逗號(本資料集無逗號),夠用。
export function linkKey(topic: string, part: string): string {
  return `${topic}|${part}`
}

export function parseLinks(csv: string): Map<string, Company[]> {
  const map = new Map<string, Company[]>()
  const lines = csv.trim().split(/\r?\n/).slice(1) // 跳過標題列
  for (const line of lines) {
    if (!line.trim()) continue
    const [topic, part, ticker, name] = line.split(',').map((s) => s.trim())
    if (!topic || !part || !ticker) continue
    const key = linkKey(topic, part)
    const arr = map.get(key) ?? []
    arr.push({ name: name ?? ticker, ticker })
    map.set(key, arr)
  }
  return map
}
