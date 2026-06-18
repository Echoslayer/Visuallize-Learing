import { RoundedBox } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { materialProps } from './materials'
import { useSelection } from './selection'
import type { Part } from './schema'

const HIGHLIGHT = '#2f6df6'

/**
 * 幾何工廠:讀一個 part,依 geometry.shape 生成 primitive。
 * 與題目無關;每個 mesh 設 name/userData.partId,供選取與拆解定位。
 * 材質一律走 materials.ts 登錄表;被選取時加 emissive 高亮。
 */
export function GeometryFactory({ part }: { part: Part }) {
  const select = useSelection((s) => s.select)
  const selected = useSelection((s) => s.selectedId === part.id)

  const { geometry, transform, id } = part
  if (!geometry) return null

  const position = transform.position
  const rotation = transform.rotation

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation() // 只選最前面那塊,不穿透到被遮擋的零件
    select(id)
  }

  const common = {
    name: id,
    userData: { partId: id },
    position,
    rotation,
    castShadow: true,
    receiveShadow: true,
    onClick,
  }
  const mat = (
    <meshStandardMaterial
      {...materialProps(part.material)}
      emissive={selected ? HIGHLIGHT : '#000000'}
      emissiveIntensity={selected ? 0.55 : 0}
    />
  )

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
