import { useControls } from 'leva'
import { useEffect } from 'react'
import { DEFAULT_CONFIG, useConfig } from '../engine/config'

// 開發用調參面板(僅 DEV 掛載)。拖 slider 即時改 config store;
// 調到滿意後把 engine/config.ts 的 DEFAULT_CONFIG 改成新值 bake 起來。
export default function Tuning() {
  const values = useControls({
    labelDistance: { value: DEFAULT_CONFIG.labelDistance, min: 0.5, max: 3, step: 0.05 },
    labelOpacity: { value: DEFAULT_CONFIG.labelOpacity, min: 0, max: 1, step: 0.02 },
    ambient: { value: DEFAULT_CONFIG.ambient, min: 0, max: 1.5, step: 0.05 },
    hemisphere: { value: DEFAULT_CONFIG.hemisphere, min: 0, max: 2, step: 0.05 },
    directional: { value: DEFAULT_CONFIG.directional, min: 0, max: 3, step: 0.05 },
    metalness: { value: DEFAULT_CONFIG.metalness, min: 0, max: 1, step: 0.05 },
    roughness: { value: DEFAULT_CONFIG.roughness, min: 0, max: 1, step: 0.05 },
  })
  const set = useConfig((s) => s.set)
  useEffect(() => set(values), [values, set])
  // DEV:暴露 config store 給自查 harness 驅動。
  useEffect(() => {
    ;(window as unknown as { __config?: typeof useConfig }).__config = useConfig
  }, [])
  return null
}
