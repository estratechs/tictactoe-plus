
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { registerSW } from './pwa/registerSW'
import './styles.css'

registerSW()

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
