import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../booking/api'
import { WEEKDAYS, errText, fShort, parisToIso, todayParis } from './util'

const hhmm = (t) => t?.slice(0, 5)

export default function Schedule() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    const [a, r, b] = await Promise.all([
      supabase.from('availability').select('*').order('weekday').order('start_time'),
      supabase.from('recurring_blocks').select('*').order('weekday').order('start_time'),
      supabase.from('blocks').select('*').gte('ends_at', new Date().toISOString()).order('starts_at'),
    ])
    const err = a.error || r.error || b.error
    if (err) setError(errText(err))
    else setData({ availability: a.data, recurring: r.data, blocks: b.data })
  }, [])

  useEffect(() => { load() }, [load])

  async function run(promise) {
    setError(null)
    const { error } = await promise
    if (error) setError(errText(error))
    load()
  }

  if (!data) return <p>{error || 'Cargando…'}</p>

  return (
    <section>
      <h1>Horarios</h1>
      <p className="adm-help">
        Todas las horas son de Francia. Las clientas solo pueden reservar dentro del horario de atención, sin pisar
        lo ocupado ni otras reservas (con un margen entre sesiones que se cambia en{' '}
        <Link to="/admin/ajustes">Ajustes</Link>).
      </p>
      {error && <p className="adm-error">{error}</p>}

      <WeeklyTable
        title="Horario de atención"
        help="Cuándo se puede reservar cada día de la semana. Podés poner más de un tramo por día (por ejemplo 9–13 y 15–17)."
        rows={data.availability}
        onAdd={(row) => run(supabase.from('availability').insert(row))}
        onDelete={(id) => run(supabase.from('availability').delete().eq('id', id))}
      />

      <WeeklyTable
        title="Ocupado todas las semanas"
        help="Clases presenciales u otras actividades fijas."
        withLabel
        rows={data.recurring}
        onAdd={(row) => run(supabase.from('recurring_blocks').insert(row))}
        onDelete={(id) => run(supabase.from('recurring_blocks').delete().eq('id', id))}
      />

      <Blocks
        rows={data.blocks}
        onAdd={(row) => run(supabase.from('blocks').insert(row))}
        onDelete={(id) => run(supabase.from('blocks').delete().eq('id', id))}
      />
    </section>
  )
}

function WeeklyTable({ title, help, rows, onAdd, onDelete, withLabel = false }) {
  function add(e) {
    e.preventDefault()
    const v = Object.fromEntries(new FormData(e.currentTarget))
    const row = { weekday: Number(v.weekday), start_time: v.start, end_time: v.end }
    if (withLabel) row.label = v.label || null
    onAdd(row)
    e.currentTarget.reset()
  }
  return (
    <div className="adm-box">
      <h2>{title}</h2>
      <p className="adm-help">{help}</p>
      <ul className="adm-week">
        {WEEKDAYS.map((name, i) => {
          const day = rows.filter((r) => r.weekday === i + 1)
          return (
            <li key={name}>
              <strong>{name}</strong>
              <span className="adm-chips">
                {day.length === 0 && <span className="adm-muted">—</span>}
                {day.map((r) => (
                  <span key={r.id} className="adm-chip">
                    {hhmm(r.start_time)}–{hhmm(r.end_time)}{r.label ? ` · ${r.label}` : ''}
                    <button aria-label="Quitar" onClick={() => confirm('¿Quitar este horario?') && onDelete(r.id)}>×</button>
                  </span>
                ))}
              </span>
            </li>
          )
        })}
      </ul>
      <form className="adm-inline" onSubmit={add}>
        <select name="weekday" defaultValue="1">{WEEKDAYS.map((n, i) => <option key={n} value={i + 1}>{n}</option>)}</select>
        <input name="start" type="time" required aria-label="Desde" />
        <span>a</span>
        <input name="end" type="time" required aria-label="Hasta" />
        {withLabel && <input name="label" placeholder="Qué es (opcional)" />}
        <button className="adm-btn">Agregar</button>
      </form>
    </div>
  )
}

function Blocks({ rows, onAdd, onDelete }) {
  const [allDay, setAllDay] = useState(true)
  function add(e) {
    e.preventDefault()
    const v = Object.fromEntries(new FormData(e.currentTarget))
    const to = v.to || v.from
    const starts_at = parisToIso(v.from, allDay ? '00:00' : v.start)
    // "todo el día" hasta el final del último día
    const ends_at = allDay
      ? parisToIso(new Date(Date.parse(`${to}T12:00:00Z`) + 86400000).toISOString().slice(0, 10), '00:00')
      : parisToIso(to, v.end)
    onAdd({ starts_at, ends_at, label: v.label || null })
    e.currentTarget.reset()
  }
  return (
    <div className="adm-box">
      <h2>Días u horas ocupadas</h2>
      <p className="adm-help">Vacaciones, un turno médico, un día libre… En ese tiempo no se puede reservar.</p>
      {rows.length === 0 ? <p className="adm-muted">Nada cargado.</p> : (
        <ul className="adm-plain">
          {rows.map((b) => (
            <li key={b.id}>
              {fShort(b.starts_at)} → {fShort(b.ends_at)}{b.label ? ` · ${b.label}` : ''}{' '}
              <button className="adm-link" onClick={() => confirm('¿Quitar?') && onDelete(b.id)}>Quitar</button>
            </li>
          ))}
        </ul>
      )}
      <form className="adm-inline" onSubmit={add}>
        <label className="adm-check"><input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} /> Todo el día</label>
        <label>Desde <input name="from" type="date" required defaultValue={todayParis()} /></label>
        {!allDay && <input name="start" type="time" required aria-label="Hora desde" />}
        <label>Hasta <input name="to" type="date" /></label>
        {!allDay && <input name="end" type="time" required aria-label="Hora hasta" />}
        <input name="label" placeholder="Motivo (opcional)" />
        <button className="adm-btn">Agregar</button>
      </form>
    </div>
  )
}
