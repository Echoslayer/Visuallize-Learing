import { create } from 'zustand'
import type { Lang } from './schema'

// 與題目無關的互動狀態:選了哪個零件、是否展開、語言。
// selectedId 用零件 id(穩定),不含任何題目語意。
interface SelectionState {
  selectedId: string | null
  exploded: boolean
  lang: Lang
  select: (id: string) => void
  clear: () => void
  toggleExploded: () => void
  setLang: (lang: Lang) => void
  resetView: () => void
}

export const useSelection = create<SelectionState>((set) => ({
  selectedId: null,
  exploded: false,
  lang: 'zh',
  select: (id) => set({ selectedId: id }),
  clear: () => set({ selectedId: null }),
  toggleExploded: () => set((s) => ({ exploded: !s.exploded })),
  setLang: (lang) => set({ lang }),
  resetView: () => set({ selectedId: null, exploded: false }),
}))
