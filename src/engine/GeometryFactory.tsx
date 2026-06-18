import { Line, RoundedBox } from '@react-three/drei'
import { animated, useSpring } from '@react-spring/three'
import type { ThreeEvent } from '@react-three/fiber'
import { useMemo } from 'react'
import { CatmullRomCurve3, Vector3 } from 'three'
import { Annotation } from './Annotation'
import { FlowParticles } from './FlowParticles'
import { ModelPart } from './ModelPart'
import { useConfig } from './config'
import { explodeOffset } from './explode'
import { materialColor } from './materials'
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
  const lang = useSelection((s) => s.lang)
  const metalness = useConfig((s) => s.metalness)
  const roughness = useConfig((s) => s.roughness)
  const labelDistance = useConfig((s) => s.labelDistance)
  const labelOpacity = useConfig((s) => s.labelOpacity)

  // hooks 必須無條件呼叫 → 在 early return 之前算好 spring
  const base = part.transform.position
  const off = explodeOffset(part.explode)
  const target: Vec3 = exploded
    ? [base[0] + off[0], base[1] + off[1], base[2] + off[2]]
    : base
  const { pos } = useSpring({ pos: target, config: { tension: 170, friction: 24 } })

  // tube 用:把 path 控制點做成平滑曲線(hook 必須無條件呼叫,故在 early return 前算)。
  const tubeCurve = useMemo(
    () =>
      new CatmullRomCurve3(
        (part.geometry?.path ?? []).map((p) => new Vector3(p[0], p[1], p[2])),
      ),
    [part.geometry?.path],
  )

  const { geometry, transform, id } = part

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
      color={materialColor(part.material)}
      metalness={metalness}
      roughness={roughness}
      emissive={selected ? HIGHLIGHT : '#000000'}
      emissiveIntensity={selected ? 0.55 : 0}
    />
  )

  let inner: React.ReactNode
  if (part.kind === 'model' && part.model) {
    // 借來的有機模型:整隻一件,不細分。
    inner = <ModelPart model={part.model} id={id} onClick={onClick} />
  } else if (!geometry) {
    return null
  } else
    switch (geometry.shape) {
      case 'box': {
      const args = (geometry.args ?? []) as [number, number, number]
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
      const args = (geometry.args ?? []) as [number, number, number, number?]
      inner = (
        <mesh {...meshProps}>
          <cylinderGeometry args={args} />
          {mat}
        </mesh>
      )
      break
    }
    case 'cone': {
      const args = (geometry.args ?? []) as [number, number, number?]
      inner = (
        <mesh {...meshProps}>
          <coneGeometry args={args} />
          {mat}
        </mesh>
      )
      break
    }
    case 'tube': {
      inner = (
        <mesh {...meshProps}>
          <tubeGeometry args={[tubeCurve, 32, geometry.radius ?? 0.1, 12, false]} />
          {mat}
        </mesh>
      )
      break
    }
    case 'flow': {
      // 流動粒子:自帶持續動畫,非單一可選取 mesh。
      inner = <FlowParticles geometry={geometry} material={part.material} />
      break
    }
    default:
      return null
  }

  // 標籤拉到零件右側外一段距離(可由 config 調),用引線連回零件,避免遮擋。
  const halfW = geometry?.shape === 'box' ? (geometry.args?.[0] ?? 2) / 2 : 1
  const lineStart: Vec3 = [halfW + 0.05, 0, 0]
  const anchor: Vec3 = [halfW + labelDistance, 0, 0]
  const annotation = part.annotation
  const showAnnotation = (selected || exploded) && annotation !== null

  return (
    <animated.group position={pos} rotation={transform.rotation} scale={transform.scale}>
      {inner}
      {showAnnotation && annotation && (
        <>
          <Line
            points={[lineStart, anchor]}
            color="#5b6470"
            lineWidth={1.5}
            transparent
            opacity={Math.min(1, labelOpacity)}
          />
          <Annotation
            data={annotation}
            lang={lang}
            anchor={anchor}
            opacity={labelOpacity}
          />
        </>
      )}
    </animated.group>
  )
}
