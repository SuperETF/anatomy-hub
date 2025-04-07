import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.scss' // ✅ 글로벌 SCSS
import './styles/Login.scss'  // ✅ 페이지별 SCSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
