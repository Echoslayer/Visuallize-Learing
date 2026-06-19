import type { ProcessRouteStop, Vec3 } from './schema'

export function processCycleDuration(
  path: Vec3[],
  stops: ProcessRouteStop[] = [],
  processTimes: Record<string, number> = {},
  duration = 6,
): number {
  void path
  return duration + stops.reduce((sum, s) => sum + (processTimes[s.station] ?? 0), 0)
}

function lerp(a: Vec3, b: Vec3, t: number): Vec3 {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]
}

function dist(a: Vec3, b: Vec3): number {
  return Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])
}

export function processPoint(
  path: Vec3[],
  stops: ProcessRouteStop[] = [],
  processTimes: Record<string, number> = {},
  phase: number,
  duration = 6,
): Vec3 {
  if (path.length === 0) return [0, 0, 0]
  if (path.length === 1) return path[0]

  const total = processCycleDuration(path, stops, processTimes, duration)
  let time = (((phase % 1) + 1) % 1) * total
  const stopAt = new Map(stops.map((s) => [s.point, processTimes[s.station] ?? 0]))
  const lengths = path.slice(1).map((p, i) => dist(path[i], p))
  const totalLength = lengths.reduce((sum, n) => sum + n, 0) || 1

  for (let i = 0; i < lengths.length; i++) {
    const segTime = (lengths[i] / totalLength) * duration
    if (time <= segTime) return lerp(path[i], path[i + 1], segTime === 0 ? 1 : time / segTime)
    time -= segTime

    const dwell = stopAt.get(i + 1) ?? 0
    if (time <= dwell) return path[i + 1]
    time -= dwell
  }
  return path[path.length - 1]
}
