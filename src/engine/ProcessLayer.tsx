import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { CatmullRomCurve3, Quaternion, Vector3, type Mesh } from 'three'
import { materialColor } from './materials'
import { processPoint } from './process-motion'
import type { Part, ProcessSpec, Vec3 } from './schema'

function v(p: Vec3) {
  return new Vector3(p[0], p[1], p[2])
}

function Arrow({ path, material, scale }: { path: Vec3[]; material: string; scale: number }) {
  const quaternion = useMemo(() => {
    const end = v(path[path.length - 1])
    const prev = v(path[path.length - 2] ?? path[path.length - 1])
    const dir = end.sub(prev).normalize()
    return new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir)
  }, [path])
  const end = path[path.length - 1] ?? [0, 0, 0]
  return (
    <mesh position={end} quaternion={quaternion}>
      <coneGeometry args={[0.09 * scale, 0.22 * scale, 12]} />
      <meshStandardMaterial color={materialColor(material)} metalness={0.25} roughness={0.45} />
    </mesh>
  )
}

function RouteLine({ path, material, scale }: { path: Vec3[]; material: string; scale: number }) {
  const curve = useMemo(() => new CatmullRomCurve3(path.map(v), false), [path])
  if (path.length < 2) return null
  return (
    <>
      <mesh>
        <tubeGeometry args={[curve, 48, 0.025 * scale, 8, false]} />
        <meshStandardMaterial color={materialColor(material)} metalness={0.25} roughness={0.5} />
      </mesh>
      <Arrow path={path} material={material} scale={scale} />
    </>
  )
}

function StopMarker({ position, material, scale }: { position: Vec3; material: string; scale: number }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.18 * scale, 0.014 * scale, 8, 28]} />
      <meshStandardMaterial
        color={materialColor(material)}
        emissive={materialColor(material)}
        emissiveIntensity={0.35}
      />
    </mesh>
  )
}

function ProcessTokens({ process }: { process: ProcessSpec }) {
  const refs = useRef<Record<string, Mesh | null>>({})
  const routes = useMemo(() => new Map(process.routes.map((r) => [r.id, r])), [process.routes])
  const processTimes = useMemo(
    () => Object.fromEntries(process.stations.map((s) => [s.id, s.processTime ?? 0])),
    [process.stations],
  )

  useFrame((state) => {
    for (const token of process.tokens) {
      const route = routes.get(token.routeId)
      if (!route) continue
      const spacing = token.spacing ?? 1 / Math.max(token.count, 1)
      for (let i = 0; i < token.count; i++) {
        const key = `${token.id}-${i}`
        const phase = state.clock.elapsedTime / (token.duration ?? 6) + i * spacing
        const p = processPoint(route.path, route.stops, processTimes, phase, token.duration ?? 6)
        refs.current[key]?.position.set(p[0], p[1], p[2])
      }
    }
  })

  return (
    <>
      {process.tokens.flatMap((token) =>
        Array.from({ length: token.count }).map((_, i) => {
          const key = `${token.id}-${i}`
          return (
            <mesh
              key={key}
              ref={(el) => {
                refs.current[key] = el
              }}
              castShadow
            >
              <sphereGeometry args={[token.radius ?? 0.1, 16, 16]} />
              <meshStandardMaterial
                color={materialColor(token.material)}
                emissive={materialColor(token.material)}
                emissiveIntensity={0.15}
                metalness={0.2}
                roughness={0.35}
              />
            </mesh>
          )
        }),
      )}
    </>
  )
}

export function ProcessLayer({ process, parts }: { process?: ProcessSpec; parts: Part[] }) {
  const partMap = useMemo(() => new Map(parts.map((p) => [p.id, p])), [parts])
  if (!process) return null
  const scale = process.scale ?? 1

  return (
    <>
      {process.routes.map((route) => (
        <RouteLine key={route.id} path={route.path} material={route.material ?? 'accent'} scale={scale} />
      ))}
      {process.routes.flatMap((route) =>
        (route.stops ?? []).map((stop) => (
          <StopMarker
            key={`${route.id}-${stop.point}-${stop.station}`}
            position={route.path[stop.point] ?? [0, 0, 0]}
            material={route.material ?? 'accent'}
            scale={scale}
          />
        )),
      )}
      {process.stations.map((station) => {
        const part = partMap.get(station.partId)
        if (!part) return null
        return (
          <StopMarker
            key={station.id}
            position={part.transform.position}
            material={station.output ? 'chip' : 'accent'}
            scale={scale}
          />
        )
      })}
      <ProcessTokens process={process} />
    </>
  )
}
