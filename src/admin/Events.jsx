import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../booking/api'
import BookingRow from './BookingRow'
import { dateInput, errText, fDay, fTime, money, nameOf, parisToIso, timeInput, todayParis } from './util'

const LANGS = [['fr', 'Francés'], ['es', 'Español'], ['en', 'Inglés'], ['ar', 'Árabe']]
const BK = '*, service:services(key, name), event:events(title)'

export default function Events() {
  const [events, setEvents] = useState(null)
  const [past, setPast] = useState(false)
  const [editing, setEditing] = useState(null) // null | 'new' | evento
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    const now = new Date().toISOString()
    let q = supabase.from('events').select('*, bookings(status)')
    q = past ? q.lt('ends_at', now).order('starts_at', { ascending: false }).limit(50) : q.gte('ends_at', now).order('starts_at')
    const { data, error } = await q
    if (error) setError(errText(error))
    else setEvents(data)
  }, [past])

  useEffect(() => { load() }, [load])

  return (
    <section>
      <div className="adm-bar">
        <h1>Eventos</h1>
        <button className="adm-btn adm-btn--main" onClick={() => setEditing(editing ? null : 'new')}>
          {editing ? 'Cerrar' : '+ Nuevo evento'}
        </button>
      </div>
      <p className="adm-help">
        Clases gratis de prueba, talleres, haflas… Cada evento tiene un cupo; cuando se llena, en el sitio aparece
        «Complet». Si es pago, la inscripción queda pendiente de pago como cualquier reserva.
      </p>

      {editing && (
        <EventForm event={editing === 'new' ? null : editing} onDone={() => { setEditing(null); load() }} />
      )}

      <div className="adm-filters">
        <button className={!past ? 'is-active' : ''} onClick={() => setPast(false)}>Próximos</button>
        <button className={past ? 'is-active' : ''} onClick={() => setPast(true)}>Pasados</button>
      </div>
      {error && <p className="adm-error">{error}</p>}
      {!events ? <p>Cargando…</p> : events.length === 0 ? <p className="adm-empty">No hay eventos.</p> : (
        <ul className="adm-cards">
          {events.map((ev) => (
            <EventCard key={ev.id} ev={ev} onEdit={() => { setEditing(ev); window.scrollTo({ top: 0, behavior: 'smooth' }) }} onChange={load} />
          ))}
        </ul>
      )}
    </section>
  )
}

function EventCard({ ev, onEdit, onChange }) {
  const [list, setList] = useState(null)
  const taken = ev.bookings.filter((b) => b.status !== 'cancelled').length

  async function toggle() {
    if (list) return setList(null)
    const { data } = await supabase.from('bookings').select(BK).eq('event_id', ev.id).order('created_at')
    setList(data ?? [])
  }

  async function remove() {
    const msg = taken
      ? `Este evento tiene ${taken} inscripta(s). Si lo borrás, se borran también sus inscripciones (no se les avisa). ¿Borrar igual?`
      : '¿Borrar este evento?'
    if (!confirm(msg)) return
    const { error } = await supabase.from('events').delete().eq('id', ev.id)
    if (error) alert(errText(error))
    else onChange()
  }

  return (
    <li className="adm-box adm-event">
      <div className="adm-event__head">
        <div>
          <h3>{nameOf(ev.title)} {!ev.published && <span className="adm-badge adm-badge--off">Oculto</span>}</h3>
          <p>{fDay(ev.starts_at)} · {fTime(ev.starts_at)}–{fTime(ev.ends_at)} · {money(ev.price)} · {ev.online ? 'En línea' : ev.location || 'Sin lugar'}</p>
        </div>
        <span className={`adm-badge adm-badge--${taken >= ev.capacity ? 'warn' : 'ok'}`}>{taken} / {ev.capacity}</span>
      </div>
      <div className="adm-actions">
        <button className="adm-btn" onClick={toggle}>{list ? 'Ocultar inscriptas' : 'Ver inscriptas'}</button>
        <button className="adm-btn" onClick={onEdit}>Editar</button>
        <button className="adm-btn adm-btn--danger" onClick={remove}>Borrar</button>
      </div>
      {list && (list.length === 0 ? <p className="adm-empty">Todavía nadie se inscribió.</p> : (
        <ul className="adm-list">
          {list.map((b) => (
            <BookingRow key={b.id} b={b} showDate={false}
              onChange={(nb) => { setList((l) => l.map((x) => (x.id === nb.id ? nb : x))); onChange() }} />
          ))}
        </ul>
      ))}
    </li>
  )
}

function EventForm({ event, onDone }) {
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const [online, setOnline] = useState(event?.online ?? false)

  async function submit(e) {
    e.preventDefault()
    const v = Object.fromEntries(new FormData(e.currentTarget))
    const pick = (prefix) => Object.fromEntries(LANGS.map(([l]) => [l, v[`${prefix}_${l}`]?.trim()]).filter(([, x]) => x))
    const starts_at = parisToIso(v.date, v.start)
    const ends_at = parisToIso(v.end_date || v.date, v.end)
    const row = {
      title: pick('title'),
      description: pick('desc'),
      starts_at,
      ends_at,
      capacity: Number(v.capacity),
      price: Number(v.price) || 0,
      online,
      location: online ? null : v.location.trim() || null,
      published: !!v.published,
      blocks_agenda: !!v.blocks_agenda,
    }
    setBusy(true)
    setError(null)
    const { error } = event
      ? await supabase.from('events').update(row).eq('id', event.id)
      : await supabase.from('events').insert(row)
    setBusy(false)
    if (error) setError(errText(error))
    else onDone()
  }

  const d = (k, l) => event?.[k]?.[l] ?? ''
  return (
    <form className="adm-box adm-form" onSubmit={submit}>
      <h2>{event ? 'Editar evento' : 'Nuevo evento'}</h2>
      <fieldset className="adm-fieldset">
        <legend>Título (el francés es obligatorio; los otros, si faltan, se muestra el francés)</legend>
        <div className="adm-grid">
          {LANGS.map(([l, name]) => (
            <label key={l} className="adm-field">
              <span>{name}</span>
              <input name={`title_${l}`} required={l === 'fr'} defaultValue={d('title', l)} dir={l === 'ar' ? 'rtl' : 'ltr'}
                placeholder={l === 'fr' ? 'Cours d’essai gratuit' : ''} />
            </label>
          ))}
        </div>
      </fieldset>
      <details className="adm-fieldset" open={!!event && Object.keys(event.description || {}).length > 0}>
        <summary>Descripción (opcional)</summary>
        <div className="adm-grid">
          {LANGS.map(([l, name]) => (
            <label key={l} className="adm-field">
              <span>{name}</span>
              <textarea name={`desc_${l}`} rows={3} defaultValue={d('description', l)} dir={l === 'ar' ? 'rtl' : 'ltr'} />
            </label>
          ))}
        </div>
      </details>
      <div className="adm-grid">
        <label className="adm-field"><span>Fecha</span><input name="date" type="date" required defaultValue={event ? dateInput(event.starts_at) : todayParis()} /></label>
        <label className="adm-field"><span>Empieza (Francia)</span><input name="start" type="time" required defaultValue={event ? timeInput(event.starts_at) : ''} /></label>
        <label className="adm-field"><span>Termina</span><input name="end" type="time" required defaultValue={event ? timeInput(event.ends_at) : ''} /></label>
        <label className="adm-field"><span>Termina otro día (opcional)</span>
          <input name="end_date" type="date" defaultValue={event && dateInput(event.ends_at) !== dateInput(event.starts_at) ? dateInput(event.ends_at) : ''} /></label>
        <label className="adm-field"><span>Cupo (personas)</span><input name="capacity" type="number" min="1" required defaultValue={event?.capacity ?? 10} /></label>
        <label className="adm-field"><span>Precio (€, 0 = gratis)</span><input name="price" type="number" min="0" step="0.5" defaultValue={event ? Number(event.price) : 0} /></label>
      </div>
      <label className="adm-check"><input type="checkbox" checked={online} onChange={(e) => setOnline(e.target.checked)} /> Es en línea</label>
      {!online && (
        <label className="adm-field"><span>Lugar</span>
          <input name="location" defaultValue={event?.location ?? 'Salle Sweet Om, 1 bis rue de la Pépinière Robin, 66000 Perpignan'} /></label>
      )}
      <label className="adm-check"><input type="checkbox" name="published" defaultChecked={event?.published ?? true} /> Publicado en el sitio</label>
      <label className="adm-check"><input type="checkbox" name="blocks_agenda" defaultChecked={event?.blocks_agenda ?? true} /> Ocupa mi agenda (no se pueden reservar sesiones a esa hora)</label>
      {error && <p className="adm-error">{error}</p>}
      <button className="adm-btn adm-btn--main" disabled={busy}>{busy ? 'Guardando…' : 'Guardar evento'}</button>
    </form>
  )
}
