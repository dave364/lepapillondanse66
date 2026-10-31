import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './i18n'
import './styles/global.css'
import App from './App'

// Los links de invitación y de "olvidé mi contraseña" de Supabase pueden
// llegar a cualquier página del sitio con el inicio de sesión en el #hash:
// se llevan al panel, que es el que lo procesa.
if (/[#&](access_token|error_description)=/.test(window.location.hash) && !window.location.pathname.startsWith('/admin')) {
  window.location.replace(`/admin${window.location.hash}`)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
