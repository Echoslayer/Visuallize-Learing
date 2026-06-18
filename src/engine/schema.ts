// content schema 的型別 = 引擎與內容的契約(單一事實來源)。
// content/*.json 是這些型別的實例。此檔與題目無關,不得出現任何題目字眼。

export type Lang = 'zh' | 'en'
export type LocalizedText = Record<Lang, string>

export type Vec3 = [number, number, number]

export type GeometryShape = 'box' | 'cylinder' | 'cone'

/**
 * args 直接對應 three 幾何體建構子參數:
 *   box      → [width, height, depth]
 *   cylinder → [radiusTop, radiusBottom, height, radialSegments?]
 *   cone     → [radius, height, radialSegments?]
 * bevel 僅對 box 有意義(圓角半徑)。
 */
export interface Geometry {
  shape: GeometryShape
  args: number[]
  bevel?: number
}

export interface Transform {
  position: Vec3
  rotation?: Vec3
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
