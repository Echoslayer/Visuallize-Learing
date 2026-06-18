import { lazy, Suspense } from 'react'
import { SceneRoot } from './engine/SceneRoot'
import { Scene } from './engine/Scene'
import { Controls } from './ui/Controls'
import aiServer from './content/ai-server.json'
import type { SceneContent } from './engine/schema'

// 內容載入發生在組合層(App/Gallery),不在 engine——維持 engine 與題目無關。
const content = aiServer as unknown as SceneContent

// DEV 才載入的 leva 調參面板;正式版 import.meta.env.DEV 為常數 false → 不載入此 chunk。
const Tuning = lazy(() => import('./ui/Tuning'))

export default function App() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#dadee4' }}>
      <SceneRoot camera={content.camera}>
        <Scene content={content} />
      </SceneRoot>
      <Controls />
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <Tuning />
        </Suspense>
      )}
    </div>
  )
}
