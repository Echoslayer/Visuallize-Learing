import { useGLTF } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useMemo } from 'react'
import type { ModelRef } from './schema'

/**
 * 借來的有機模型:整隻 GLB 當一個零件渲染(借了不拆,ADR-0002)。
 * 沿用模型自帶材質(不套 materials 登錄表,保留外觀)。選取靠整隻 onClick;
 * 動畫/標籤由外層 GeometryFactory 的 animated.group 處理。
 */
export function ModelPart({
  model,
  id,
  onClick,
}: {
  model: ModelRef
  id: string
  onClick: (e: ThreeEvent<MouseEvent>) => void
}) {
  const gltf = useGLTF(model.url)
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene])
  return <primitive object={scene} name={id} userData={{ partId: id }} onClick={onClick} />
}
