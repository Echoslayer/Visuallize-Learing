import { RoundedBox } from '@react-three/drei'
import type { Part } from './schema'

// C1:單一中性材質;C2 會由 materials.ts 依 part.material 提供。
const PLACEHOLDER_COLOR = '#9aa3ad'

/**
 * 幾何工廠:讀一個 part,依 geometry.shape 生成 primitive。
 * 與題目無關;每個 mesh 設 name/userData.partId,供之後選取與拆解定位。
 * kind === "model" 的載入留到後續(MVP 不需要)。
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
  }
  const mat = <meshStandardMaterial color={PLACEHOLDER_COLOR} />

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
