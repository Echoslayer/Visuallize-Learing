// content schema 的型別 = 引擎與內容的契約(單一事實來源)。
// content/*.json 是這些型別的實例。此檔與題目無關,不得出現任何題目字眼。

export type Lang = 'zh' | 'en'
export type LocalizedText = Record<Lang, string>

export type Vec3 = [number, number, number]

export type GeometryShape = 'box' | 'cylinder' | 'cone' | 'tube' | 'flow'

/**
 * args 直接對應 three 幾何體建構子參數:
 *   box      → [width, height, depth]
 *   cylinder → [radiusTop, radiusBottom, height, radialSegments?]
 *   cone     → [radius, height, radialSegments?]
 * bevel 僅對 box 有意義(圓角半徑)。
 * tube 不用 args,改用 path(控制點,CatmullRom 平滑穿過)+ radius(管半徑)。
 */
export interface Geometry {
  shape: GeometryShape
  args?: number[] // box/cylinder/cone 用;tube 不帶
  bevel?: number
  path?: Vec3[] // tube/flow:路徑控制點(≥2)
  radius?: number // tube:管半徑;flow:粒子球半徑(預設 0.1)
  count?: number // flow:粒子數(預設 8)
  speed?: number // flow:每秒跑完路徑的比例(預設 0.2)
}

export interface Transform {
  position: Vec3
  rotation?: Vec3
  scale?: number | Vec3 // 選用;借來的 model 常需縮放(spec 05)。預設 1。
}

export interface Company {
  name: string
  ticker: string
}

export interface Annotation {
  title: LocalizedText
  companies: Company[]
}

export interface Explode {
  vector: Vec3
  magnitude: number
}

export interface ModelRef {
  url: string
  node?: string
  attribution?: string // CC-BY 等需要的作者標註,UI 顯示
}

// 陣列展開:把一個 part 重複成 count 份,每份相對前一份位移 step(單軸,見 spec 02)。
export interface Repeat {
  count: number // 總份數(含原件);count <= 1 視為不重複
  step: Vec3 // 每份相對前一份的位移
}

export interface Part {
  id: string
  kind: 'primitive' | 'model'
  geometry?: Geometry // kind === "primitive"
  model?: ModelRef // kind === "model"(MVP 不需要,留型別)
  transform: Transform
  material: string
  explode: Explode
  annotation: Annotation | null
  repeat?: Repeat // 選用;無此欄 = 原樣一份(向後相容)
}

export interface CameraSpec {
  position: Vec3
  target: Vec3
}

export interface SceneContent {
  topic: string
  title: LocalizedText
  camera: CameraSpec
  parts: Part[]
}
