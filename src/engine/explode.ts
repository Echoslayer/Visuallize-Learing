import type { Explode, Vec3 } from './schema'

/**
 * 拆解位移向量 = normalize(vector) × magnitude。
 * 向量為零或 magnitude 為 0 → 不位移(框體類零件即靠此固定不動)。
 * 與題目無關的純函式。
 */
export function explodeOffset(explode: Explode): Vec3 {
  const [x, y, z] = explode.vector
  const len = Math.hypot(x, y, z)
  if (len === 0 || explode.magnitude === 0) return [0, 0, 0]
  const k = explode.magnitude / len
  return [x * k, y * k, z * k]
}
