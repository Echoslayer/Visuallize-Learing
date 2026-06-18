import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Lightformer, OrbitControls } from '@react-three/drei'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import type { CameraSpec } from './schema'
import { useConfig } from './config'
import { useSelection } from './selection'

const DEFAULT_CAMERA: CameraSpec = { position: [4, 3, 5], target: [0, 0, 0] }

// 監聽 resetNonce,復位 OrbitControls 到初始相機(position0/target0)。
function CameraController() {
  const resetNonce = useSelection((s) => s.resetNonce)
  const controls = useThree((s) => s.controls) as { reset?: () => void } | null
  useEffect(() => {
    if (resetNonce > 0) controls?.reset?.()
  }, [resetNonce, controls])
  return null
}

/**
 * 引擎的場景外殼:Canvas + 統一柔影打光 + OrbitControls + 依 schema 設定相機。與題目無關。
 * 打光走「程序化 Environment(Lightformer)+ 軟陰影」——不抓外部 HDR,離線可跑、截圖具決定性。
 */
export function SceneRoot({
  camera = DEFAULT_CAMERA,
  children,
}: {
  camera?: CameraSpec
  children: ReactNode
}) {
  const clear = useSelection((s) => s.clear)
  const ambient = useConfig((s) => s.ambient)
  const hemisphere = useConfig((s) => s.hemisphere)
  const directional = useConfig((s) => s.directional)
  return (
    <Canvas
      shadows
      camera={{ position: camera.position, fov: 50 }}
      dpr={[1, 2]}
      onPointerMissed={() => clear()}
    >
      {/* 霧白棚拍底:讓柔影清楚可見(對齊參考產品的 airy 質感)。 */}
      <color attach="background" args={['#dadee4']} />

      {/* 均勻柔光:hemisphere 當天空/地面補光,一盞主光給方向感與柔影。強度由 config 控制。 */}
      <hemisphereLight args={['#ffffff', '#c4c8cf', hemisphere]} />
      <ambientLight intensity={ambient} />
      <directionalLight
        position={[5, 9, 7]}
        intensity={directional}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={9}
        shadow-camera-bottom={-7}
        shadow-camera-near={0.1}
        shadow-camera-far={40}
      />

      {/* 程序化棚拍環境:給材質一點柔和反射,免外部 HDR。對稱配置避免不均的高光。 */}
      <Environment resolution={256}>
        <Lightformer intensity={1.2} position={[0, 6, 4]} scale={[10, 10, 1]} />
        <Lightformer intensity={0.8} position={[-6, 2, 2]} scale={[6, 8, 1]} />
        <Lightformer intensity={0.8} position={[6, 2, 2]} scale={[6, 8, 1]} />
      </Environment>

      {/* 接收柔影的地面(透明,只顯示陰影,不蓋掉背景色)。 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <shadowMaterial transparent opacity={0.28} />
      </mesh>

      {children}

      <OrbitControls target={camera.target} makeDefault enableDamping={false} />
      <CameraController />
    </Canvas>
  )
}
