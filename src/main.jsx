import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './Components/Router'
import { BrowserRouter } from 'react-router-dom'
// import App from './Pages/App'
// import { Router } from './Components/Router.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Router/>
    </BrowserRouter>
)
