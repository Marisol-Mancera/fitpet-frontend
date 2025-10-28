import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './app/routes/Router.jsx'
import './shared/styles/themes.css'
import { StrictMode } from 'react'


ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
