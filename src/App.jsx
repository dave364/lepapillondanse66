import { Navigate, Route, Routes } from 'react-router-dom'
import { detectLanguage } from './i18n'
import LangLayout from './components/LangLayout'
import Home from './pages/Home'
import Sully from './pages/Sully'
import Courses from './pages/Courses'
import Contact from './pages/Contact'
import Services from './pages/Services'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      {/* La raíz redirige al idioma del navegador */}
      <Route path="/" element={<Navigate to={`/${detectLanguage()}`} replace />} />
      <Route path="/:lang" element={<LangLayout />}>
        <Route index element={<Home />} />
        <Route path="sully" element={<Sully />} />
        <Route path="cours" element={<Courses />} />
        <Route path="soins" element={<Services />} />
        {/* "Expérience en ligne" e "Inscription" se integraron en Soins & coaching */}
        <Route path="en-ligne" element={<Navigate to="../soins#danse" replace />} />
        <Route path="contact" element={<Contact />} />
        <Route path="inscription" element={<Navigate to="../soins" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
