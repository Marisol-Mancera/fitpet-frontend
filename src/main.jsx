import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from '/src/app/routes/router.jsx'
import '/src/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
)
