import { Navigate, Route, Routes } from 'react-router-dom'
import { detectLanguage } from './i18n'
import LangLayout from './components/LangLayout'
import Home from './pages/Home'
import Sully from './pages/Sully'
import Courses from './pages/Courses'
import Online from './pages/Online'
import Contact from './pages/Contact'
import Signup from './pages/Signup'
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
        <Route path="en-ligne" element={<Online />} />
        <Route path="contact" element={<Contact />} />
        <Route path="inscription" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
