import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Gallery } from './gallery/Gallery.tsx'

// 極簡路由(不引 react-router):?view=gallery 走畫廊,否則走主場景。
const isGallery =
  new URLSearchParams(window.location.search).get('view') === 'gallery'

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isGallery ? <Gallery /> : <App />}</StrictMode>,
)
