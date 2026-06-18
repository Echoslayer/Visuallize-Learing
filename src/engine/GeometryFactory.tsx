import { RoundedBox } from '@react-three/drei'
import { materialProps } from './materials'
import type { Part } from './schema'

/**
 * 幾何工廠:讀一個 part,依 geometry.shape 生成 primitive。
 * 與題目無關;每個 mesh 設 name/userData.partId,供之後選取與拆解定位。
 * 材質一律走 materials.ts 登錄表(統一畫風)。kind === "model" 的載入留到後續。
 */
export function GeometryFactory({ part }: { part: Part }) {
  const { geometry, transform, id } = part
  if (!geometry) return null

  const position = transform.position
  const rotation = transform.rotation

  const common = {
    name: id,
    userData: { partId: id },
    position,
    rotation,
    castShadow: true,
    receiveShadow: true,
  }
  const mat = <meshStandardMaterial {...materialProps(part.material)} />

  switch (geometry.shape) {
    case 'box': {
      const args = geometry.args as [number, number, number]
      if (geometry.bevel && geometry.bevel > 0) {
        return (
          <RoundedBox {...common} args={args} radius={geometry.bevel} smoothness={4}>
            {mat}
          </RoundedBox>
        )
      }
      return (
        <mesh {...common}>
          <boxGeometry args={args} />
          {mat}
        </mesh>
      )
    }
    case 'cylinder': {
      const args = geometry.args as [number, number, number, number?]
      return (
        <mesh {...common}>
          <cylinderGeometry args={args} />
          {mat}
        </mesh>
      )
    }
    case 'cone': {
      const args = geometry.args as [number, number, number?]
      return (
        <mesh {...common}>
          <coneGeometry args={args} />
          {mat}
        </mesh>
      )
    }
    default:
      return null
  }
}
