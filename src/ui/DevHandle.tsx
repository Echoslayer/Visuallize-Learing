import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { useSelection } from '../engine/selection'
import { useConfig } from '../engine/config'

// DEV 截圖驅動縫(延伸 ADR-0008 到相機):掛在 Canvas 內,把 camera/controls/store 暴露給 harness。
// Playwright 可 page.evaluate 設角度/縮放 + 驅動狀態,從任意視角截圖自查。組合層元件,engine 保持乾淨。
// 用法:
//   const v = window.__view
//   v.camera.position.set(0, 2, 6); v.controls.target.set(0, 1, 0); v.controls.update() // 轉角度/縮放
//   v.selection.setState({ exploded: true, xray: true })                                 // 驅動狀態
export function DevHandle() {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls)
  const scene = useThree((s) => s.scene)
  useEffect(() => {
    ;(window as unknown as { __view?: unknown }).__view = {
      camera,
      controls,
      scene,
      selection: useSelection,
      config: useConfig,
    }
  }, [camera, controls, scene])
  return null
}
