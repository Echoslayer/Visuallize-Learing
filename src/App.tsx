import { SceneRoot } from './engine/SceneRoot'
import { TestBox } from './engine/TestBox'

export default function App() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#1b1e23' }}>
      <SceneRoot>
        <TestBox />
      </SceneRoot>
    </div>
  )
}
