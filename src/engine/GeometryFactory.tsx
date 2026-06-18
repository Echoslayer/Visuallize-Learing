import { RoundedBox } from '@react-three/drei'
import { animated, useSpring } from '@react-spring/three'
import type { ThreeEvent } from '@react-three/fiber'
import { useMemo } from 'react'
import { CatmullRomCurve3, Vector3 } from 'three'
import { Annotation } from './Annotation'
import { FlowParticles } from './FlowParticles'
import { ModelPart } from './ModelPart'
import { NameTag } from './NameTag'
import { useConfig } from './config'
import { explodeOffset } from './explode'
import { materialColor } from './materials'
import { useSelection } from './selection'
import type { Part, Vec3 } from './schema'

const HIGHLIGHT = '#2f6df6'

// 名牌錨點:元件上方;flow 用 path 平均點 + 上抬(flow group 在原點)。
function nameTagAnchor(part: Part): Vec3 {
  const g = part.geometry
  if (g?.shape === 'flow' && g.path?.length) {
    const n = g.path.length
    const avg = (i: number) => g.path!.reduce((s, p) => s + p[i], 0) / n
    return [avg(0), avg(1) + 0.3, avg(2)]
  }
  if (g?.shape === 'box') return [0, (g.args?.[1] ?? 0.4) / 2 + 0.12, 0]
  if (g?.shape === 'cylinder') return [0, (g.args?.[2] ?? 0.4) / 2 + 0.12, 0]
  if (g?.shape === 'cone') return [0, (g.args?.[1] ?? 0.4) / 2 + 0.12, 0]
  return [0, 0.3, 0]
}

/**
 * 幾何工廠:讀一個 part,依 geometry.shape 生成 primitive。
 * - 位置交給 animated.group:展開時位移 explodeOffset,react-spring 補間;收合復位。
 * - 內層 mesh 設 name/userData.partId、castShadow、onClick,被選取時加 emissive 高亮。
 * 與題目無關;材質一律走 materials.ts。kind === "model" 的載入留到後續。
 */
export function GeometryFactory({ part, center }: { part: Part; center: Vec3 }) {
  const select = useSelection((s) => s.select)
  const selected = useSelection((s) => s.selectedId === part.id)
  const exploded = useSelection((s) => s.exploded)
  const showAllNames = useSelection((s) => s.showAllNames)
  const lang = useSelection((s) => s.lang)
  const metalness = useConfig((s) => s.metalness)
  const roughness = useConfig((s) => s.roughness)
  const labelOpacity = useConfig((s) => s.labelOpacity)

  // hooks 必須無條件呼叫 → 在 early return 之前算好 spring
  const base = part.transform.position
  const off = explodeOffset(part.explode, base, center) // 自動從中心放射
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

  // 公司卡:點選 → 該 part 的節點卡;展開 → 節點自身的卡。錨在元件中心(無引線),展開時跟著大元件移到中心。
  const card = selected ? (part.card ?? part.annotation) : exploded ? part.annotation : null
  const cardAnchor: Vec3 = [0, 0, 0] // 元件中心

  // 名牌:顯示名(已在組合層解析:label → 父名 → 節點 title);點選或「全部顯示」時出現。
  const name = part.resolvedLabel?.[lang]
  const showName = (selected || showAllNames) && !!name

  return (
    <animated.group position={pos} rotation={transform.rotation} scale={transform.scale}>
      {inner}
      {card && <Annotation data={card} lang={lang} anchor={cardAnchor} opacity={labelOpacity} />}
      {showName && name && <NameTag text={name} anchor={nameTagAnchor(part)} />}
    </animated.group>
  )
}
