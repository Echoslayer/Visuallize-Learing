import { create } from 'zustand'

// 集中所有「可調的視覺旋鈕」。DEV 由 leva 面板即時改;正式版用這份預設值。
// 與題目無關。調到滿意的數值後,把 DEFAULT_CONFIG 改成新值 bake 起來即可。
export interface Config {
  labelDistance: number // 標籤離零件多遠(引線長度)
  labelOpacity: number // 標籤卡背景不透明度
  ambient: number // 環境光
  hemisphere: number // 半球補光
  directional: number // 主方向光
  metalness: number // 材質金屬度
  roughness: number // 材質粗糙度
}

export const DEFAULT_CONFIG: Config = {
  labelDistance: 1.95,
  labelOpacity: 0.5,
  ambient: 1.05,
  hemisphere: 0.45,
  directional: 1.3,
  metalness: 0.35,
  roughness: 0.35,
}

interface ConfigStore extends Config {
  set: (patch: Partial<Config>) => void
}

export const useConfig = create<ConfigStore>((set) => ({
  ...DEFAULT_CONFIG,
  set: (patch) => set(patch),
}))
