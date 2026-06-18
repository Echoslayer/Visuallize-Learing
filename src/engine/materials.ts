// 共用材質登錄表 = 統一畫風的唯一來源。
// 不同來源的零件(程式畫/借來)套同一套材質,視覺自動拉齊。
// 與題目無關;新材質在此登錄,元件不得硬塞顏色。

export interface MaterialDef {
  color: string
  metalness: number
  roughness: number
}

const FALLBACK: MaterialDef = { color: '#9aa3ad', metalness: 0.5, roughness: 0.4 }

export const MATERIALS: Record<string, MaterialDef> = {
  'metal-light': { color: '#dde1e6', metalness: 0.5, roughness: 0.4 },
  'metal-dark': { color: '#3f454e', metalness: 0.6, roughness: 0.45 },
}

export function materialProps(id: string): MaterialDef {
  return MATERIALS[id] ?? FALLBACK
}
