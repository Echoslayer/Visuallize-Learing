import { useEffect } from 'react'
import { TOPIC_LIST } from '../content/registry'
import { useSelection } from '../engine/selection'

// 鍵盤快捷(人用):E 拆解、X 透視、數字鍵 1..N 切題目。
// 切題目沿用 ?topic= 整頁導航(同 TopicSwitcher)。打字中(input/leva 面板)不攔截。
export function Hotkeys() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const el = e.target as HTMLElement | null
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return
      if (e.key === 'e' || e.key === 'E') useSelection.getState().toggleExploded()
      else if (e.key === 'x' || e.key === 'X') useSelection.getState().toggleXray()
      else if (e.key >= '1' && e.key <= '9') {
        const t = TOPIC_LIST[Number(e.key) - 1]
        if (t) window.location.search = `?topic=${t.id}`
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return null
}
