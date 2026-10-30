import { useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../booking/api'
import Agenda from './Agenda'
import Events from './Events'
import Schedule from './Schedule'
import Services from './Services'
import Settings from './Settings'
import './admin.css'

// Panel de administración de Le Papillon Danse 66 (/admin)
export default function Admin() {
  const [session, setSession] = useState(undefined)
  const [isAdmin, setIsAdmin] = useState(null)
  // Llegó desde el email de invitación o de "olvidé mi contraseña"
  const [newPassword, setNewPassword] = useState(() => /type=(recovery|invite)/.test(window.location.hash))

  useEffect(() => {
    document.documentElement.lang = 'es'
    document.documentElement.dir = 'ltr'
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s)
      if (event === 'PASSWORD_RECOVERY') setNewPassword(true)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return setIsAdmin(null)
    supabase.rpc('is_admin').then(({ data }) => setIsAdmin(!!data))
  }, [session])

  return (
    <div className="adm">
      <Helmet>
        <title>Panel · Le Papillon Danse 66</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      {session === undefined || (session && isAdmin === null) ? (
        <p className="adm-center">Cargando…</p>
      ) : !session ? (
        <Login />
      ) : newPassword ? (
        <SetPassword onDone={() => setNewPassword(false)} />
      ) : !isAdmin ? (
        <div className="adm-center adm-box">
          <p>Esta cuenta ({session.user.email}) no tiene acceso al panel.</p>
          <button className="adm-btn" onClick={() => supabase.auth.signOut()}>Salir</button>
        </div>
      ) : (
        <Shell email={session.user.email} />
      )}
    </div>
  )
}

function Shell({ email }) {
  const tabs = [
    ['agenda', 'Agenda'],
    ['eventos', 'Eventos'],
    ['horarios', 'Horarios'],
    ['servicios', 'Servicios'],
    ['ajustes', 'Ajustes'],
  ]
  return (
    <>
      <header className="adm-top">
        <a href="/" className="adm-brand">✦ Le Papillon Danse 66</a>
        <nav className="adm-tabs">
          {tabs.map(([to, label]) => (
            <NavLink key={to} to={`/admin/${to}`} className={({ isActive }) => (isActive ? 'is-active' : '')}>
              {label}
            </NavLink>
          ))}
        </nav>
        <span className="adm-user">
          {email}{' '}
          <button className="adm-link" onClick={() => supabase.auth.signOut()}>Salir</button>
        </span>
      </header>
      <main className="adm-main">
        <Routes>
          <Route index element={<Navigate to="agenda" replace />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="eventos" element={<Events />} />
          <Route path="horarios" element={<Schedule />} />
          <Route path="servicios" element={<Services />} />
          <Route path="ajustes" element={<Settings />} />
          <Route path="*" element={<Navigate to="agenda" replace />} />
        </Routes>
      </main>
    </>
  )
}

function Login() {
  const [error, setError] = useState(null)
  const [sending, setSending] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function submit(e) {
    e.preventDefault()
    const { email, password } = Object.fromEntries(new FormData(e.currentTarget))
    setSending(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message.includes('Invalid') ? 'Email o contraseña incorrectos.' : error.message)
    setSending(false)
  }

  async function reset(e) {
    const form = e.currentTarget.closest('form')
    const email = new FormData(form).get('email')
    if (!email) return setError('Escribí tu email y tocá de nuevo "Olvidé mi contraseña".')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin`,
    })
    if (error) setError(error.message)
    else setResetSent(true)
  }

  return (
    <form className="adm-box adm-login" onSubmit={submit}>
      <h1>✦ Panel de reservas</h1>
      <label className="adm-field">
        <span>Email</span>
        <input name="email" type="email" required autoComplete="username" />
      </label>
      <label className="adm-field">
        <span>Contraseña</span>
        <input name="password" type="password" required autoComplete="current-password" />
      </label>
      {error && <p className="adm-error">{error}</p>}
      {resetSent && <p className="adm-ok">Te mandamos un email para crear una contraseña nueva.</p>}
      <button className="adm-btn adm-btn--main" disabled={sending}>{sending ? 'Entrando…' : 'Entrar'}</button>
      <button type="button" className="adm-link" onClick={reset}>Olvidé mi contraseña</button>
    </form>
  )
}

function SetPassword({ onDone }) {
  const [error, setError] = useState(null)
  async function submit(e) {
    e.preventDefault()
    const { password, repeat } = Object.fromEntries(new FormData(e.currentTarget))
    if (password.length < 8) return setError('Usá al menos 8 caracteres.')
    if (password !== repeat) return setError('Las dos contraseñas no coinciden.')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) return setError(error.message)
    window.history.replaceState(null, '', '/admin')
    onDone()
  }
  return (
    <form className="adm-box adm-login" onSubmit={submit}>
      <h1>✦ Elegí tu contraseña</h1>
      <label className="adm-field">
        <span>Contraseña nueva</span>
        <input name="password" type="password" required autoComplete="new-password" />
      </label>
      <label className="adm-field">
        <span>Repetila</span>
        <input name="repeat" type="password" required autoComplete="new-password" />
      </label>
      {error && <p className="adm-error">{error}</p>}
      <button className="adm-btn adm-btn--main">Guardar</button>
    </form>
  )
}
