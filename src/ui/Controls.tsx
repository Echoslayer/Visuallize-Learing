import type { CSSProperties } from 'react'
import { useSelection } from '../engine/selection'

// 最小 UI 殼:拆解/收合、重置視角、中/EN。全部接到 store。
// 與題目無關;文案用 lang 切換。
const bar: CSSProperties = {
  position: 'fixed',
  left: '50%',
  bottom: 20,
  transform: 'translateX(-50%)',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 8,
  maxWidth: 'calc(100vw - 24px)',
  padding: 8,
  background: 'rgba(22, 26, 32, 0.92)',
  borderRadius: 12,
  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
}
const btn: CSSProperties = {
  appearance: 'none',
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(255,255,255,0.06)',
  color: '#eef1f5',
  fontSize: 14,
  fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
  padding: '8px 14px',
  borderRadius: 8,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}
const btnActive: CSSProperties = {
  ...btn,
  background: '#2f6df6',
  borderColor: '#2f6df6',
}

export function Controls() {
  const exploded = useSelection((s) => s.exploded)
  const showAllNames = useSelection((s) => s.showAllNames)
  const showAllCards = useSelection((s) => s.showAllCards)
  const lang = useSelection((s) => s.lang)
  const toggleExploded = useSelection((s) => s.toggleExploded)
  const toggleAllNames = useSelection((s) => s.toggleAllNames)
  const toggleAllCards = useSelection((s) => s.toggleAllCards)
  const setLang = useSelection((s) => s.setLang)
  const resetView = useSelection((s) => s.resetView)

  const t = (zh: string, en: string) => (lang === 'zh' ? zh : en)

  return (
    <div style={bar}>
      <button
        data-action="explode"
        style={exploded ? btnActive : btn}
        onClick={toggleExploded}
      >
        {exploded ? t('收合', 'Collapse') : t('拆解', 'Explode')}
      </button>
      <button
        data-action="names"
        style={showAllNames ? btnActive : btn}
        onClick={toggleAllNames}
      >
        {t('名稱', 'Names')}
      </button>
      <button
        data-action="cards"
        style={showAllCards ? btnActive : btn}
        onClick={toggleAllCards}
      >
        {t('股票', 'Stocks')}
      </button>
      <button data-action="reset" style={btn} onClick={resetView}>
        {t('重置視角', 'Reset')}
      </button>
      <button
        data-action="lang"
        style={btn}
        onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
      >
        {lang === 'zh' ? 'EN' : '中'}
      </button>
    </div>
  )
}
