import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { CatmullRomCurve3, Vector3, type Mesh } from 'three'
import { materialColor } from './materials'
import type { Geometry } from './schema'

/**
 * 沿 path 持續流動的小球(產線/材料流)。useFrame 每幀更新位置,跑到尾循環回頭。
 * path 視為閉合迴圈(closed)→ 平滑循環。與題目無關。
 * 註:持續動畫 → 含 flow 的場景截圖非 byte-deterministic(spec 06 / ADR-0007 受控例外)。
 */
export function FlowParticles({
  geometry,
  material,
}: {
  geometry: Geometry
  material: string
}) {
  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        (geometry.path ?? []).map((p) => new Vector3(p[0], p[1], p[2])),
        true, // closed loop → 循環
      ),
    [geometry.path],
  )
  const count = geometry.count ?? 8
  const radius = geometry.radius ?? 0.1
  const speed = geometry.speed ?? 0.2
  const color = materialColor(material)
  const refs = useRef<(Mesh | null)[]>([])

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed
    for (let i = 0; i < count; i++) {
      const u = (((t + i / count) % 1) + 1) % 1
      const p = curve.getPointAt(u)
      refs.current[i]?.position.set(p.x, p.y, p.z)
    }
  })

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          castShadow
        >
          <sphereGeometry args={[radius, 12, 12]} />
          <meshStandardMaterial color={color} metalness={0.4} roughness={0.4} />
        </mesh>
      ))}
    </>
  )
}
