import raw from './companies.csv?raw'
import { linkKey, parseLinks } from './parse-links'
import type { Company } from '../engine/schema'

// companies.csv 是公司 ↔ 元件對應的唯一來源(edge list,many-to-many)。
// 用 Excel/試算表編輯:加一列 = 加一個對應;刪一列 = 移除。
const LINKS = parseLinks(raw)

/** 某題目某零件對應的公司(可多家)。 */
export function companiesFor(topic: string, partId: string): Company[] {
  return LINKS.get(linkKey(topic, partId)) ?? []
}
