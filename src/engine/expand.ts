import type { Part, Vec3 } from './schema'

function stripRepeat(p: Part): Part {
  const clone = { ...p }
  delete clone.repeat
  return clone
}

/**
 * 把帶 repeat 的 part 展開成多份(純函式,與題目無關)。
 * 無 repeat 或 count<=1 → 原樣一份;否則 count 份:
 *   第 i 份 id=`${id}-${i}`、position = base + step×i、其餘照抄、移除 repeat 欄。
 * GeometryFactory 因此永遠看不到 repeat。
 */
export function expandParts(parts: Part[]): Part[] {
  const out: Part[] = []
  for (const part of parts) {
    const count = part.repeat?.count ?? 1
    if (!part.repeat || count <= 1) {
      out.push(stripRepeat(part))
      continue
    }
    const { step } = part.repeat
    const base = part.transform.position
    for (let i = 0; i < count; i++) {
      const position: Vec3 = [
        base[0] + step[0] * i,
        base[1] + step[1] * i,
        base[2] + step[2] * i,
      ]
      out.push({
        ...stripRepeat(part),
        id: `${part.id}-${i}`,
        transform: { ...part.transform, position },
      })
    }
  }
  return out
}
