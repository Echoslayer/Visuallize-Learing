import { Canvas, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import type { CameraSpec } from './schema'

const DEFAULT_CAMERA: CameraSpec = { position: [4, 3, 5], target: [0, 0, 0] }

function CameraLookAt({ target }: { target: CameraSpec['target'] }) {
  const camera = useThree((s) => s.camera)
  useEffect(() => {
    camera.lookAt(target[0], target[1], target[2])
  }, [camera, target])
  return null
}

/**
 * 引擎的場景外殼:<Canvas> + 基本打光 + 依 schema 設定相機。與題目無關。
 * C2 會在此加 <Environment>、軟陰影、OrbitControls。
 */
export function SceneRoot({
  camera = DEFAULT_CAMERA,
  children,
}: {
  camera?: CameraSpec
  children: ReactNode
}) {
  return (
    <Canvas
      camera={{ position: camera.position, fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <CameraLookAt target={camera.target} />
      {children}
    </Canvas>
  )
}
