import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Ponto de entrada da aplicação
// IMPORTANTE: não usar BrowserRouter aqui pois o App.jsx já usa
// createBrowserRouter + RouterProvider (padrão do professor)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Registro do Service Worker (PWA)
// O vite-plugin-pwa gera o sw.js automaticamente no build (npm run build)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(r => console.log('✅ SW registrado:', r.scope))
      .catch(() => console.info('ℹ️ SW não ativo em dev – normal.'))
  })
}
