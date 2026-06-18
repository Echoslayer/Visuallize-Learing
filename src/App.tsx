import { SceneRoot } from './engine/SceneRoot'
import { Scene } from './engine/Scene'
import aiServer from './content/ai-server.json'
import type { SceneContent } from './engine/schema'

// 內容載入發生在組合層(App/Gallery),不在 engine——維持 engine 與題目無關。
const content = aiServer as unknown as SceneContent

export default function App() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#1b1e23' }}>
      <SceneRoot camera={content.camera}>
        <Scene content={content} />
      </SceneRoot>
    </div>
  )
}
