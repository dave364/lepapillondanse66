import { useEffect, useState } from 'react'
import { supabase } from '../booking/api'
import { errText } from './util'

const FIELDS = [
  ['admin_email', 'Email donde te llegan los avisos de reservas', 'email',
    'También es la dirección a la que responde la clienta si contesta un email.'],
  ['paypal_url', 'Link de PayPal.me', 'url', 'El monto se agrega solo: …/zulgeycastro/45EUR'],
  ['min_notice_hours', 'Anticipación mínima para reservar (horas)', 'number', 'Por ejemplo 12: nadie puede reservar para dentro de 2 horas.'],
  ['max_days_ahead', 'Hasta cuántos días adelante se puede reservar', 'number', ''],
  ['buffer_minutes', 'Margen entre sesiones (minutos)', 'number', 'Tiempo libre antes y después de cada sesión.'],
  ['slot_step_minutes', 'Cada cuántos minutos empiezan los turnos', 'number', '15 = 9:00, 9:15, 9:30…'],
  ['cancel_hours', 'Hasta cuántas horas antes puede cancelar la clienta', 'number', 'Después de ese plazo, el link de cancelar le pide que escriba por WhatsApp.'],
  ['reminder_hours', 'Recordatorio: cuántas horas antes', 'number', 'Si todavía no pagó, el recordatorio incluye el link de PayPal.'],
  ['session_location', 'Lugar de las sesiones presenciales (va en el email)', 'text', ''],
  ['site_url', 'Dirección del sitio', 'url', 'Para los links de los emails (cancelar, volver a reservar).'],
]

export default function Settings() {
  const [s, setS] = useState(null)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    supabase.from('settings').select('*').eq('id', 1).single().then(({ data, error }) => {
      if (error) setMsg({ error: errText(error) })
      else setS(data)
    })
  }, [])

  async function save(e) {
    e.preventDefault()
    const v = Object.fromEntries(new FormData(e.currentTarget))
    const row = Object.fromEntries(FIELDS.map(([k, , type]) => [k, type === 'number' ? Number(v[k]) : v[k].trim()]))
    const { error } = await supabase.from('settings').update(row).eq('id', 1)
    setMsg(error ? { error: errText(error) } : { ok: 'Guardado ✓' })
  }

  if (!s) return <p>{msg?.error || 'Cargando…'}</p>
  return (
    <section>
      <h1>Ajustes</h1>
      <form className="adm-box adm-form" onSubmit={save} onChange={() => setMsg(null)}>
        {FIELDS.map(([k, label, type, help]) => (
          <label key={k} className="adm-field">
            <span>{label}</span>
            <input name={k} type={type} required defaultValue={s[k]} min={type === 'number' ? 0 : undefined} />
            {help && <small className="adm-muted">{help}</small>}
          </label>
        ))}
        {msg?.ok && <p className="adm-ok">{msg.ok}</p>}
        {msg?.error && <p className="adm-error">{msg.error}</p>}
        <button className="adm-btn adm-btn--main">Guardar</button>
      </form>
    </section>
  )
}
