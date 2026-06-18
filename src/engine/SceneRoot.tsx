import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, OrbitControls } from '@react-three/drei'
import type { ReactNode } from 'react'
import type { CameraSpec } from './schema'
import { useSelection } from './selection'

const DEFAULT_CAMERA: CameraSpec = { position: [4, 3, 5], target: [0, 0, 0] }

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
  return (
    <Canvas
      shadows
      camera={{ position: camera.position, fov: 50 }}
      dpr={[1, 2]}
      onPointerMissed={() => clear()}
    >
      {/* 霧白棚拍底:讓柔影清楚可見(對齊參考產品的 airy 質感)。 */}
      <color attach="background" args={['#dadee4']} />

      <ambientLight intensity={0.5} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-camera-near={0.1}
        shadow-camera-far={40}
      />

      {/* 程序化棚拍環境:給金屬反射,免外部 HDR。 */}
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 6, -4]} scale={[12, 12, 1]} />
        <Lightformer intensity={1.1} position={[-5, 3, 3]} scale={[6, 6, 1]} />
        <Lightformer intensity={1.1} position={[5, 2, 4]} scale={[6, 6, 1]} />
      </Environment>

      {/* 接收柔影的地面(透明,只顯示陰影,不蓋掉背景色)。 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <shadowMaterial transparent opacity={0.28} />
      </mesh>

      {children}

      <OrbitControls target={camera.target} makeDefault enableDamping={false} />
    </Canvas>
  )
}
