import { create } from 'zustand'
import type { Lang } from './schema'

// 與題目無關的互動狀態:選了哪個零件、是否展開、語言。
// selectedId 用零件 id(穩定),不含任何題目語意。
interface SelectionState {
  selectedId: string | null
  exploded: boolean
  lang: Lang
  showAllNames: boolean // 「名稱」按鈕:同時顯示所有元件名牌
  showAllCards: boolean // 「股票」按鈕:同時顯示所有節點公司卡
  resetNonce: number // 遞增以觸發場景內相機復位(DOM 按鈕無法直接碰 OrbitControls)
  select: (id: string) => void
  clear: () => void
  toggleExploded: () => void
  toggleAllNames: () => void
  toggleAllCards: () => void
  setLang: (lang: Lang) => void
  resetView: () => void
}

export const useSelection = create<SelectionState>((set) => ({
  selectedId: null,
  exploded: false,
  lang: 'zh',
  showAllNames: false,
  showAllCards: false,
  resetNonce: 0,
  select: (id) => set({ selectedId: id }),
  clear: () => set({ selectedId: null }),
  toggleExploded: () => set((s) => ({ exploded: !s.exploded })),
  toggleAllNames: () => set((s) => ({ showAllNames: !s.showAllNames })),
  toggleAllCards: () => set((s) => ({ showAllCards: !s.showAllCards })),
  setLang: (lang) => set({ lang }),
  resetView: () =>
    set((s) => ({ selectedId: null, exploded: false, resetNonce: s.resetNonce + 1 })),
}))
