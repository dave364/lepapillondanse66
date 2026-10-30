// Utilidades del panel
import { TIMEZONE } from '../config/booking'

export const STATUS = {
  pending_payment: { label: 'Pendiente de pago', tone: 'warn' },
  paid: { label: 'Pagada', tone: 'ok' },
  confirmed: { label: 'Confirmada (gratis)', tone: 'ok' },
  cancelled: { label: 'Cancelada', tone: 'off' },
}

export const WEEKDAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const fmt = (opts) => new Intl.DateTimeFormat('es', { timeZone: TIMEZONE, ...opts })
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
export const fDay = (iso) => cap(fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso)))
export const fTime = (iso) => fmt({ hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
export const fShort = (iso) => fmt({ dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
export const money = (n) => (Number(n) > 0 ? `${Number(n).toLocaleString('es')} €` : 'Gratis')

// 'AAAA-MM-DD' y 'HH:MM' de un instante, en hora de Francia (para inputs)
export const dateInput = (iso) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso))
export const timeInput = (iso) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: TIMEZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(iso))

// Diferencia entre la hora de Francia y UTC en un instante (ms)
function offset(ts) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: TIMEZONE, hourCycle: 'h23', year: 'numeric', month: '2-digit',
      day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).formatToParts(ts).map((x) => [x.type, x.value]),
  )
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - ts
}

// Fecha y hora "de Francia" → instante ISO (tiene en cuenta el horario de verano)
export function parisToIso(date, time) {
  const guess = Date.parse(`${date}T${time}:00Z`)
  let utc = guess - offset(guess)
  const second = offset(utc)
  if (guess - second !== utc) utc = guess - second
  return new Date(utc).toISOString()
}

export const todayParis = () => dateInput(new Date())

// Link de WhatsApp a partir del teléfono que dejó la clienta
export const waLink = (phone) => {
  const digits = (phone || '').replace(/[^\d]/g, '')
  return digits.length >= 8 ? `https://wa.me/${digits}` : null
}

export const nameOf = (obj) => obj?.es || obj?.fr || Object.values(obj || {})[0] || ''

// Mensaje de error de Supabase en criollo
export function errText(e) {
  const m = e?.message || String(e)
  if (m.includes('bookings_no_overlap')) return 'Ya hay otra sesión en ese horario.'
  if (m.includes('violates check constraint') && m.includes('client_email')) return 'El email no es válido.'
  if (m.includes('end_time') || m.includes('ends_at')) return 'La hora de fin tiene que ser después de la de inicio.'
  if (m.includes('Failed to fetch')) return 'Sin conexión. Probá de nuevo.'
  return m
}
