// flow dwell:把循環相位 phase(0..1)映到 path 曲線參數 t(0..1)。
// 在 stopParams 列出的點停留 dwell 秒(粒子頓住像進站加工),其餘區段等速前進。
// 純函式(無 three / 無狀態)→ 比照 check-explode 附一個 node:assert(ADR-0010 邊界①)。
//
// stopParams:已換算成曲線參數(= 點索引 / 點數)且**升冪排序**的停留點。
// travel:跑完整條 path(參數 0→1)的秒數(= 1/speed)。
// 回傳:該 phase 對應的曲線參數 t(交給 CatmullRomCurve3.getPoint —— closed 時 getPoint(i/N) 正好落在點 i)。
export function flowParam(
  phase: number,
  stopParams: number[],
  dwell: number,
  travel: number,
): number {
  let time = phase * (travel + stopParams.length * dwell)
  let prev = 0
  for (const s of stopParams) {
    const seg = (s - prev) * travel // 從 prev 走到 s 的時間
    if (time < seg) return prev + time / travel // 移動中
    time -= seg
    if (time < dwell) return s // 在 s 停留
    time -= dwell
    prev = s
  }
  return prev + Math.min(time / travel, 1 - prev) // 最後一段 → 終點(1 = 閉環回到起點)
}
