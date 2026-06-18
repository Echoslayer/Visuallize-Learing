import { Canvas } from '@react-three/fiber'
import type { ReactNode } from 'react'

/**
 * 引擎的場景外殼:<Canvas> + 基本打光。與題目無關。
 * C0 只放最小打光;C2 會在此加 <Environment>、軟陰影、OrbitControls。
 */
export function SceneRoot({ children }: { children: ReactNode }) {
  return (
    <Canvas
      camera={{ position: [4, 3, 5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      {children}
    </Canvas>
  )
}
