import { useState } from 'react'
import { supabase, notify } from '../booking/api'
import { STATUS, errText, fShort, fTime, money, nameOf, waLink } from './util'

const LANG = { fr: 'Francés', es: 'Español', en: 'Inglés', ar: 'Árabe' }

// Una reserva con sus acciones: pagada, cancelar, reenviar email…
// onChange(bookingActualizada) para refrescar la lista.
export default function BookingRow({ b, onChange, showDate = false }) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)
  const st = STATUS[b.status]
  const title = b.service ? nameOf(b.service.name) : nameOf(b.event?.title)
  const wa = waLink(b.client_phone)

  async function setStatus(status, { ask, kind } = {}) {
    if (status === 'cancelled' && !confirm(`¿Cancelar la reserva de ${b.client_name}?`)) return
    const tell = kind && confirm(ask)
    setBusy(true)
    setMsg(null)
    const { data, error } = await supabase.from('bookings').update({ status }).eq('id', b.id)
      .select('*, service:services(key, name), event:events(title)').single()
    if (error) {
      setMsg({ error: errText(error) })
    } else {
      onChange(data)
      if (tell) {
        try {
          await notify(b.id, kind)
          setMsg({ ok: 'Email enviado a la clienta.' })
        } catch {
          setMsg({ error: 'El cambio se guardó, pero no se pudo enviar el email.' })
        }
      }
    }
    setBusy(false)
  }

  async function resend() {
    setBusy(true)
    setMsg(null)
    try {
      await notify(b.id, 'confirmation')
      setMsg({ ok: 'Email de confirmación reenviado.' })
    } catch {
      setMsg({ error: 'No se pudo enviar el email.' })
    }
    setBusy(false)
  }

  return (
    <li className={`adm-bk adm-bk--${st.tone}`}>
      <button className="adm-bk__head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="adm-bk__time">{showDate ? fShort(b.starts_at) : `${fTime(b.starts_at)}–${fTime(b.ends_at)}`}</span>
        <span className="adm-bk__who">
          <strong>{b.client_name}</strong>
          <small>{b.event ? '★ ' : ''}{title}</small>
        </span>
        <span className="adm-bk__price">{money(b.price)}</span>
        <span className={`adm-badge adm-badge--${st.tone}`}>{st.label}</span>
      </button>

      {open && (
        <div className="adm-bk__body">
          <dl className="adm-dl">
            <dt>Email</dt><dd><a href={`mailto:${b.client_email}`}>{b.client_email}</a></dd>
            <dt>Teléfono</dt>
            <dd>{b.client_phone ? <>{b.client_phone}{wa && <> · <a href={wa} target="_blank" rel="noopener">WhatsApp</a></>}</> : '—'}</dd>
            <dt>Idioma</dt><dd>{LANG[b.lang] ?? b.lang}</dd>
            {b.notes && <><dt>Mensaje</dt><dd className="adm-pre">{b.notes}</dd></>}
            <dt>Reservó</dt><dd>{fShort(b.created_at)}{b.source === 'admin' ? ' (cargada a mano)' : ''}</dd>
            {b.paid_at && <><dt>Pagó</dt><dd>{fShort(b.paid_at)}</dd></>}
            {b.reminder_sent_at && <><dt>Recordatorio</dt><dd>enviado {fShort(b.reminder_sent_at)}</dd></>}
          </dl>
          <div className="adm-actions">
            {b.status === 'pending_payment' && (
              <button className="adm-btn adm-btn--main" disabled={busy}
                onClick={() => setStatus('paid', { kind: 'paid', ask: '¿Le mando un email a la clienta avisando que recibiste el pago?' })}>
                ✓ Marcar como pagada
              </button>
            )}
            {b.status === 'paid' && (
              <button className="adm-btn" disabled={busy} onClick={() => setStatus('pending_payment')}>
                Volver a pendiente de pago
              </button>
            )}
            {b.status !== 'cancelled' && (
              <>
                <button className="adm-btn" disabled={busy} onClick={resend}>Reenviar email de confirmación</button>
                <button className="adm-btn adm-btn--danger" disabled={busy}
                  onClick={() => setStatus('cancelled', { kind: 'cancelled', ask: '¿Le mando un email a la clienta avisando la cancelación?' })}>
                  Cancelar reserva
                </button>
              </>
            )}
            {b.status === 'cancelled' && (
              <button className="adm-btn" disabled={busy}
                onClick={() => setStatus(Number(b.price) > 0 ? 'pending_payment' : 'confirmed')}>
                Reactivar
              </button>
            )}
          </div>
          {msg?.ok && <p className="adm-ok">{msg.ok}</p>}
          {msg?.error && <p className="adm-error">{msg.error}</p>}
        </div>
      )}
    </li>
  )
}
