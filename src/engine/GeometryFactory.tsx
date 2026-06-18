import { RoundedBox } from '@react-three/drei'
import { animated, useSpring } from '@react-spring/three'
import type { ThreeEvent } from '@react-three/fiber'
import { explodeOffset } from './explode'
import { materialProps } from './materials'
import { useSelection } from './selection'
import type { Part, Vec3 } from './schema'

const HIGHLIGHT = '#2f6df6'

/**
 * 幾何工廠:讀一個 part,依 geometry.shape 生成 primitive。
 * - 位置交給 animated.group:展開時位移 explodeOffset,react-spring 補間;收合復位。
 * - 內層 mesh 設 name/userData.partId、castShadow、onClick,被選取時加 emissive 高亮。
 * 與題目無關;材質一律走 materials.ts。kind === "model" 的載入留到後續。
 */
export function GeometryFactory({ part }: { part: Part }) {
  const select = useSelection((s) => s.select)
  const selected = useSelection((s) => s.selectedId === part.id)
  const exploded = useSelection((s) => s.exploded)

  // hooks 必須無條件呼叫 → 在 early return 之前算好 spring
  const base = part.transform.position
  const off = explodeOffset(part.explode)
  const target: Vec3 = exploded
    ? [base[0] + off[0], base[1] + off[1], base[2] + off[2]]
    : base
  const { pos } = useSpring({ pos: target, config: { tension: 170, friction: 24 } })

  const { geometry, transform, id } = part
  if (!geometry) return null

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation() // 只選最前面那塊,不穿透被遮擋的零件
    select(id)
  }

  const meshProps = {
    name: id,
    userData: { partId: id },
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

  let inner: React.ReactNode
  switch (geometry.shape) {
    case 'box': {
      const args = geometry.args as [number, number, number]
      inner =
        geometry.bevel && geometry.bevel > 0 ? (
          <RoundedBox {...meshProps} args={args} radius={geometry.bevel} smoothness={4}>
            {mat}
          </RoundedBox>
        ) : (
          <mesh {...meshProps}>
            <boxGeometry args={args} />
            {mat}
          </mesh>
        )
      break
    }
    case 'cylinder': {
      const args = geometry.args as [number, number, number, number?]
      inner = (
        <mesh {...meshProps}>
          <cylinderGeometry args={args} />
          {mat}
        </mesh>
      )
      break
    }
    case 'cone': {
      const args = geometry.args as [number, number, number?]
      inner = (
        <mesh {...meshProps}>
          <coneGeometry args={args} />
          {mat}
        </mesh>
      )
      break
    }
    default:
      return null
  }

  return (
    <animated.group position={pos} rotation={transform.rotation}>
      {inner}
    </animated.group>
  )
}
