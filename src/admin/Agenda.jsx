import { useCallback, useEffect, useState } from 'react'
import { supabase, notify } from '../booking/api'
import BookingRow from './BookingRow'
import { dateInput, errText, fDay, money, nameOf, parisToIso, todayParis } from './util'

const SELECT = '*, service:services(key, name), event:events(title)'

const FILTERS = {
  upcoming: { label: 'Próximas', q: (q) => q.neq('status', 'cancelled').gte('ends_at', new Date().toISOString()).order('starts_at') },
  pending: { label: 'Pendientes de pago', q: (q) => q.eq('status', 'pending_payment').order('starts_at') },
  past: {
    label: 'Pasadas',
    q: (q) => q.neq('status', 'cancelled').lt('ends_at', new Date().toISOString())
      .gte('starts_at', new Date(Date.now() - 120 * 86400000).toISOString()).order('starts_at', { ascending: false }),
  },
  cancelled: { label: 'Canceladas', q: (q) => q.eq('status', 'cancelled').order('starts_at', { ascending: false }) },
}

export default function Agenda() {
  const [filter, setFilter] = useState('upcoming')
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)
  const [adding, setAdding] = useState(false)
  const [pendingTotal, setPendingTotal] = useState(null)

  const load = useCallback(async () => {
    setError(null)
    const { data, error } = await FILTERS[filter].q(supabase.from('bookings').select(SELECT)).limit(300)
    if (error) setError(errText(error))
    else setRows(data)
    const { data: p } = await supabase.from('bookings').select('price').eq('status', 'pending_payment')
    setPendingTotal(p ? { count: p.length, sum: p.reduce((a, r) => a + Number(r.price), 0) } : null)
  }, [filter])

  useEffect(() => {
    setRows(null)
    load()
  }, [load])

  const update = (b) => setRows((list) => list.map((x) => (x.id === b.id ? b : x)))

  // Agrupadas por día (hora de Francia)
  const groups = []
  for (const b of rows ?? []) {
    const k = dateInput(b.starts_at)
    if (groups.at(-1)?.k !== k) groups.push({ k, iso: b.starts_at, items: [] })
    groups.at(-1).items.push(b)
  }

  return (
    <section>
      <div className="adm-bar">
        <h1>Agenda</h1>
        <button className="adm-btn adm-btn--main" onClick={() => setAdding((a) => !a)}>
          {adding ? 'Cerrar' : '+ Cargar reserva'}
        </button>
      </div>

      {pendingTotal?.count > 0 && (
        <p className="adm-note">
          Hay <strong>{pendingTotal.count}</strong> reserva{pendingTotal.count > 1 ? 's' : ''} pendiente
          {pendingTotal.count > 1 ? 's' : ''} de pago ({money(pendingTotal.sum)}).{' '}
          <button className="adm-link" onClick={() => setFilter('pending')}>Ver</button>
        </p>
      )}

      {adding && <NewBooking onDone={() => { setAdding(false); load() }} />}

      <div className="adm-filters">
        {Object.entries(FILTERS).map(([k, f]) => (
          <button key={k} className={filter === k ? 'is-active' : ''} onClick={() => setFilter(k)}>{f.label}</button>
        ))}
        <button className="adm-link" onClick={load}>↻ Actualizar</button>
      </div>

      {error && <p className="adm-error">{error}</p>}
      {!rows ? (
        <p>Cargando…</p>
      ) : rows.length === 0 ? (
        <p className="adm-empty">No hay reservas acá.</p>
      ) : (
        groups.map((g) => (
          <div key={g.k} className="adm-day">
            <h2 className="adm-day__title">{fDay(g.iso)}</h2>
            <ul className="adm-list">
              {g.items.map((b) => <BookingRow key={b.id} b={b} onChange={update} />)}
            </ul>
          </div>
        ))
      )}
    </section>
  )
}

// Reserva cargada a mano (por WhatsApp, en persona…). No respeta el horario
// de atención, pero no deja pisar otra sesión.
function NewBooking({ onDone }) {
  const [services, setServices] = useState([])
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    supabase.from('services').select('id, key, name, price, minutes').order('sort').then(({ data }) => setServices(data ?? []))
  }, [])

  async function submit(e) {
    e.preventDefault()
    const v = Object.fromEntries(new FormData(e.currentTarget))
    const svc = services.find((s) => s.id === v.service_id)
    const starts = parisToIso(v.date, v.time)
    const minutes = Number(v.minutes) || svc.minutes
    setBusy(true)
    setError(null)
    const { data, error } = await supabase.from('bookings').insert({
      service_id: svc.id,
      starts_at: starts,
      ends_at: new Date(Date.parse(starts) + minutes * 60000).toISOString(),
      status: v.status,
      price: Number(v.price) || 0,
      client_name: v.name.trim(),
      client_email: v.email.trim().toLowerCase(),
      client_phone: v.phone.trim() || null,
      lang: v.lang,
      notes: v.notes.trim() || null,
      source: 'admin',
    }).select('id').single()
    if (error) {
      setError(errText(error))
      setBusy(false)
      return
    }
    if (v.send) await notify(data.id, 'confirmation').catch(() => alert('Se guardó, pero no se pudo enviar el email.'))
    onDone()
  }

  const [svcId, setSvcId] = useState('')
  const svc = services.find((s) => s.id === svcId)

  return (
    <form className="adm-box adm-form" onSubmit={submit}>
      <h2>Cargar una reserva</h2>
      <div className="adm-grid">
        <label className="adm-field adm-span2">
          <span>Servicio</span>
          <select name="service_id" required value={svcId} onChange={(e) => setSvcId(e.target.value)}>
            <option value="" disabled>Elegí…</option>
            {services.map((s) => <option key={s.id} value={s.id}>{nameOf(s.name)}</option>)}
          </select>
        </label>
        <label className="adm-field"><span>Fecha</span><input name="date" type="date" required defaultValue={todayParis()} /></label>
        <label className="adm-field"><span>Hora (Francia)</span><input name="time" type="time" required step="300" /></label>
        <label className="adm-field"><span>Duración (min)</span><input name="minutes" type="number" min="5" key={`m${svcId}`} defaultValue={svc?.minutes} /></label>
        <label className="adm-field"><span>Precio (€)</span><input name="price" type="number" min="0" step="0.5" key={`p${svcId}`} defaultValue={svc ? Number(svc.price) : ''} /></label>
        <label className="adm-field">
          <span>Estado</span>
          <select name="status" defaultValue="pending_payment">
            <option value="pending_payment">Pendiente de pago</option>
            <option value="paid">Pagada</option>
            <option value="confirmed">Confirmada (gratis)</option>
          </select>
        </label>
        <label className="adm-field">
          <span>Idioma de la clienta</span>
          <select name="lang" defaultValue="fr">
            <option value="fr">Francés</option><option value="es">Español</option>
            <option value="en">Inglés</option><option value="ar">Árabe</option>
          </select>
        </label>
        <label className="adm-field"><span>Nombre</span><input name="name" required /></label>
        <label className="adm-field"><span>Email</span><input name="email" type="email" required /></label>
        <label className="adm-field"><span>Teléfono</span><input name="phone" type="tel" /></label>
        <label className="adm-field adm-span2"><span>Notas</span><textarea name="notes" rows={2} /></label>
      </div>
      <label className="adm-check"><input type="checkbox" name="send" defaultChecked /> Mandarle el email de confirmación (con el link de PayPal si está pendiente)</label>
      {error && <p className="adm-error">{error}</p>}
      <button className="adm-btn adm-btn--main" disabled={busy}>{busy ? 'Guardando…' : 'Guardar reserva'}</button>
    </form>
  )
}
