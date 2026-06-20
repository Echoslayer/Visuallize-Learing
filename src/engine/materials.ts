// 共用材質登錄表 = 統一畫風的唯一來源。只管「顏色」;
// 金屬度/粗糙度等表面手感是全域旋鈕,放 config.ts(可由 leva 即時調)。
// 與題目無關;新材質在此登錄,元件不得硬塞顏色。

const FALLBACK = '#9aa3ad'

export const MATERIAL_COLORS: Record<string, string> = {
  'metal-light': '#dfe3e8',
  'metal-dark': '#414751',
  primary: '#fbbf24', // 主色(黃色/Amber)，用於離岸風電基礎防撞色及電能 token
  accent: '#3b82f6', // 強調色(如流動粒子),讓運動更醒目
  chip: '#34d399', // 成品晶片流(綠);與 accent 藍的晶圓流對比,表「晶圓→晶片」變形
  heat: '#f97316', // 廢熱流(橘);AI 伺服器散熱 token 用,與 power/data 區隔
  'fluid-raw': '#9ca3af', // 原料(灰)
  'fluid-treated': '#3b82f6', // 處理中(藍)
  'fluid-finished': '#34d399', // 成品(綠)
}

export function materialColor(id: string): string {
  return MATERIAL_COLORS[id] ?? FALLBACK
}
