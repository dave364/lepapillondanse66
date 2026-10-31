import { useEffect, useState } from 'react'
import { supabase } from '../booking/api'
import { errText, nameOf } from './util'

const CATEGORY = { call: 'Llamada', dance: 'Danza', care: 'Soins' }

// Precios, duraciones y qué se puede reservar. Los textos de cada servicio
// están en el sitio (los cambia David).
export default function Services() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase.from('services').select('*').order('sort').then(({ data, error }) => {
      if (error) setError(errText(error))
      else setRows(data)
    })
  }, [])

  return (
    <section>
      <h1>Servicios</h1>
      <p className="adm-help">
        Lo que cambies acá se ve enseguida en el sitio (precio y duración) y es lo que se cobra en las reservas
        nuevas. En los paquetes, el precio es el total y se cobra al reservar la primera sesión; las siguientes
        las cargás vos en la Agenda (con precio 0). Si desactivás un servicio, deja de aparecer y no se puede reservar.
      </p>
      {error && <p className="adm-error">{error}</p>}
      {!rows ? <p>Cargando…</p> : (
        <ul className="adm-cards">
          {rows.map((s) => <ServiceRow key={s.id} s={s} />)}
        </ul>
      )}
    </section>
  )
}

function ServiceRow({ s }) {
  const [msg, setMsg] = useState(null)
  async function save(e) {
    e.preventDefault()
    const v = Object.fromEntries(new FormData(e.currentTarget))
    const { error } = await supabase.from('services').update({
      price: Number(v.price) || 0,
      minutes: Number(v.minutes),
      sessions: Number(v.sessions) || 1,
      online: !!v.online,
      active: !!v.active,
    }).eq('id', s.id)
    setMsg(error ? { error: errText(error) } : { ok: 'Guardado ✓' })
  }
  return (
    <li className="adm-box">
      <form className="adm-service" onSubmit={save} onChange={() => setMsg(null)}>
        <div className="adm-service__name">
          <strong>{nameOf(s.name)}</strong>
          <small>{CATEGORY[s.category]}</small>
        </div>
        <label className="adm-field"><span>Precio (€)</span><input name="price" type="number" min="0" step="0.5" defaultValue={Number(s.price)} /></label>
        <label className="adm-field"><span>Sesiones (paquete)</span><input name="sessions" type="number" min="1" max="50" required defaultValue={s.sessions ?? 1} /></label>
        <label className="adm-field"><span>Duración (min)</span><input name="minutes" type="number" min="5" max="480" required defaultValue={s.minutes} /></label>
        <label className="adm-check"><input type="checkbox" name="online" defaultChecked={s.online} /> En línea</label>
        <label className="adm-check"><input type="checkbox" name="active" defaultChecked={s.active} /> Se puede reservar</label>
        <button className="adm-btn">Guardar</button>
        {msg?.ok && <span className="adm-ok">{msg.ok}</span>}
        {msg?.error && <span className="adm-error">{msg.error}</span>}
      </form>
    </li>
  )
}
