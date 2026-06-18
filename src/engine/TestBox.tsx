/**
 * C0 的佔位幾何:一顆靜止的方塊,證明 Canvas 與 harness 能跑。
 * 刻意不旋轉,讓截圖具決定性(自查迴圈才能穩定比對)。C1 起由 schema 驅動的幾何取代。
 */
export function TestBox() {
  return (
    <mesh>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#9aa3ad" />
    </mesh>
  )
}
