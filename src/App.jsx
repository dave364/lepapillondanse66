import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { detectLanguage } from './i18n'
import LangLayout from './components/LangLayout'
import Home from './pages/Home'
import Sully from './pages/Sully'
import Courses from './pages/Courses'
import Contact from './pages/Contact'
import Services from './pages/Services'
import Events from './pages/Events'
import NotFound from './pages/NotFound'
import { BOOKING_ENABLED } from './config/booking'

// Reservas y panel: se cargan solo cuando se visitan
const BookIndex = lazy(() => import('./booking/BookIndex'))
const BookService = lazy(() => import('./booking/BookService'))
const CancelBooking = lazy(() => import('./booking/CancelBooking'))
const Admin = lazy(() => import('./admin/Admin'))

const page = (el) => <Suspense fallback={<div className="page-loading" />}>{el}</Suspense>

export default function App() {
  return (
    <Routes>
      {/* La raíz redirige al idioma del navegador */}
      <Route path="/" element={<Navigate to={`/${detectLanguage()}`} replace />} />
      {/* Panel de administración (en español) */}
      <Route path="/admin/*" element={BOOKING_ENABLED ? page(<Admin />) : <Navigate to="/" replace />} />
      <Route path="/:lang" element={<LangLayout />}>
        <Route index element={<Home />} />
        <Route path="sully" element={<Sully />} />
        <Route path="cours" element={<Courses />} />
        <Route path="soins" element={<Services />} />
        <Route path="evenements" element={<Events />} />
        {/* "Expérience en ligne" e "Inscription" se integraron en Soins & coaching */}
        <Route path="en-ligne" element={<Navigate to="../soins#danse" replace />} />
        <Route path="contact" element={<Contact />} />
        {BOOKING_ENABLED ? (
          <>
            <Route path="reserver" element={page(<BookIndex />)} />
            <Route path="reserver/annuler" element={page(<CancelBooking />)} />
            <Route path="reserver/:key" element={page(<BookService />)} />
          </>
        ) : (
          <Route path="reserver/*" element={<Navigate to="../soins" replace />} />
        )}
        <Route path="inscription" element={<Navigate to="../soins" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
