// Conexión con Supabase (base de datos y funciones de servidor).
// Solo se carga en las páginas de reservas y en el panel, así el resto del
// sitio no suma este peso.
import { createClient } from '@supabase/supabase-js'
import { TIMEZONE } from '../config/booking'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

// Error con el código que manda el servidor ('slot_unavailable', etc.)
async function invoke(name, body) {
  const { data, error } = await supabase.functions.invoke(name, { body })
  if (error) {
    let code = 'generic'
    try {
      code = (await error.context.json()).error || code
    } catch {
      /* sin cuerpo JSON (sin conexión, etc.) */
    }
    throw Object.assign(new Error(code), { code })
  }
  return data
}

// ---------------------------------------------------------------------------
// Fechas en la zona de la agenda (Francia)
// ---------------------------------------------------------------------------
// '2026-11-04' del instante dado, en hora de Francia
export const dayKey = (date, tz = TIMEZONE) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(new Date(date))

// Primera letra en mayúscula ("martes 4 de noviembre" → "Martes 4 de noviembre")
export const cap = (s) => s.charAt(0).toLocaleUpperCase() + s.slice(1)

const locale = (lang) => (lang === 'ar' ? 'ar-u-nu-latn' : lang === 'en' ? 'en-GB' : lang)

export const formatTime = (iso, lang, tz = TIMEZONE) =>
  new Intl.DateTimeFormat(locale(lang), { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .format(new Date(iso))

export const formatDay = (iso, lang, tz = TIMEZONE, opts = { weekday: 'long', day: 'numeric', month: 'long' }) =>
  cap(new Intl.DateTimeFormat(locale(lang), { timeZone: tz, ...opts }).format(new Date(iso)))

export const formatDateTime = (iso, lang, tz = TIMEZONE) =>
  cap(new Intl.DateTimeFormat(locale(lang), { timeZone: tz, dateStyle: 'full', timeStyle: 'short', hourCycle: 'h23' })
    .format(new Date(iso)))

// Zona horaria de quien visita (para mostrarle su hora si no está en Francia)
export const visitorTz = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return TIMEZONE
  }
}

export const sameOffset = (iso, tzA, tzB) => formatTime(iso, 'en', tzA) === formatTime(iso, 'en', tzB)

// ---------------------------------------------------------------------------
// Sitio público
// ---------------------------------------------------------------------------
export async function fetchService(key) {
  const { data, error } = await supabase.from('services').select('*').eq('key', key).maybeSingle()
  if (error) throw error
  return data
}

export async function fetchServices() {
  const { data, error } = await supabase.from('services').select('*').order('sort')
  if (error) throw error
  return data
}

// Horarios libres de los próximos días: Map { '2026-11-04' => [iso, iso…] }
export async function fetchSlots(key, days = 62) {
  const today = dayKey(new Date())
  const until = dayKey(Date.now() + days * 86400000)
  const { data, error } = await supabase.rpc('available_slots', {
    p_service_key: key, p_from: today, p_to: until,
  })
  if (error) throw error
  const byDay = new Map()
  for (const { starts_at } of data) {
    const k = dayKey(starts_at)
    if (!byDay.has(k)) byDay.set(k, [])
    byDay.get(k).push(starts_at)
  }
  return byDay
}

export async function fetchEvents() {
  const { data, error } = await supabase.rpc('public_events')
  if (error) throw error
  return data
}

export async function bookingByToken(token) {
  const { data, error } = await supabase.rpc('booking_by_token', { p_token: token })
  if (error) throw error
  return data?.[0] ?? null
}

export const book = (payload) => invoke('book', payload)
export const cancelBooking = (token) => invoke('cancel', { token })
export const notify = (bookingId, kind) => invoke('notify', { bookingId, kind })
