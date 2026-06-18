import type { Explode, Vec3 } from './schema'

const UP_BIAS = 0.35 // 放射方向的固定上抬:讓零件往外+往上散,永遠不往下(不穿地)

/**
 * 拆解位移 = 「從場景中心往外」的自動放射方向 × magnitude。
 * 方向:水平用 (part − center) 在 xz 平面的分量 + 固定上抬 → normalize。中心點的零件直接往上。
 * magnitude 為 0 → 不動(框體/輸送帶/flow)。全域行為,所有題目共用。純函式。
 */
export function explodeOffset(explode: Explode, position: Vec3, center: Vec3): Vec3 {
  if (explode.magnitude === 0) return [0, 0, 0]
  const dx = position[0] - center[0]
  const dz = position[2] - center[2]
  const len = Math.hypot(dx, UP_BIAS, dz)
  const k = explode.magnitude / len
  return [dx * k, UP_BIAS * k, dz * k]
}
