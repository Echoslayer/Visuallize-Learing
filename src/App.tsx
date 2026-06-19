import { lazy, Suspense } from 'react'
import { SceneRoot } from './engine/SceneRoot'
import { Scene } from './engine/Scene'
import { DevHandle } from './ui/DevHandle'
import { Controls } from './ui/Controls'
import { Credits } from './ui/Credits'
import { TopicSwitcher } from './ui/TopicSwitcher'
import { getTopic } from './content/registry'

// 內容載入發生在組合層(App/Gallery),不在 engine——維持 engine 與題目無關。
// 題目由 ?topic= 決定(預設 ai-server)。
const content = getTopic(new URLSearchParams(window.location.search).get('topic'))

// DEV 才載入的 leva 調參面板;正式版 import.meta.env.DEV 為常數 false → 不載入此 chunk。
const Tuning = lazy(() => import('./ui/Tuning'))

export default function App() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#dadee4' }}>
      <SceneRoot camera={content.camera}>
        <Scene content={content} />
        {import.meta.env.DEV && <DevHandle />}
      </SceneRoot>
      <TopicSwitcher current={content.topic} />
      <Controls />
      <Credits content={content} />
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <Tuning />
        </Suspense>
      )}
    </div>
  )
}
