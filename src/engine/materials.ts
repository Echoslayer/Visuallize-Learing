// 共用材質登錄表 = 統一畫風的唯一來源。只管「顏色」;
// 金屬度/粗糙度等表面手感是全域旋鈕,放 config.ts(可由 leva 即時調)。
// 與題目無關;新材質在此登錄,元件不得硬塞顏色。

const FALLBACK = '#9aa3ad'

export const MATERIAL_COLORS: Record<string, string> = {
  'metal-light': '#dfe3e8',
  'metal-dark': '#414751',
}

export function materialColor(id: string): string {
  return MATERIAL_COLORS[id] ?? FALLBACK
}
