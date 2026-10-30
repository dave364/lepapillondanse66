// Utilidades compartidas por las funciones de servidor (Supabase Edge Functions)
import { createClient } from 'npm:@supabase/supabase-js@2'

export const LANGS = ['fr', 'es', 'en', 'ar'] as const
export type Lang = (typeof LANGS)[number]

export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })

// Cliente con permisos de servidor (nunca se expone al navegador)
export const admin = () =>
  createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  })

export type Settings = {
  timezone: string
  reminder_hours: number
  admin_email: string
  paypal_url: string
  site_url: string
  session_location: string
}

export type Booking = {
  id: string
  service_id: string | null
  event_id: string | null
  starts_at: string
  ends_at: string
  status: 'pending_payment' | 'paid' | 'confirmed' | 'cancelled'
  price: number
  client_name: string
  client_email: string
  client_phone: string | null
  lang: Lang
  notes: string | null
  cancel_token: string
  created_at: string
}

export type Full = {
  booking: Booking
  settings: Settings
  // nombre en 4 idiomas del servicio o título del evento
  title: Record<string, string>
  minutes: number
  online: boolean
  location: string | null
  isEvent: boolean
}

// Reserva con todo lo necesario para armar los emails
export async function loadFull(id: string): Promise<Full> {
  const db = admin()
  const [{ data: booking, error }, { data: settings }] = await Promise.all([
    db.from('bookings')
      .select('*, service:services(name, minutes, online), event:events(title, location, online)')
      .eq('id', id)
      .single(),
    db.from('settings').select('*').eq('id', 1).single(),
  ])
  if (error || !booking || !settings) throw new Error('booking_not_found')
  const { service, event, ...b } = booking
  const minutes = Math.round((Date.parse(b.ends_at) - Date.parse(b.starts_at)) / 60000)
  return {
    booking: { ...b, price: Number(b.price) },
    settings,
    title: service?.name ?? event?.title ?? {},
    minutes,
    online: service?.online ?? event?.online ?? false,
    location: event ? event.location : service?.online ? null : settings.session_location,
    isEvent: !!event,
  }
}

// Link de PayPal.me con el monto ya puesto: https://paypal.me/zulgeycastro/45EUR
export const amountText = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2))
export const paypalLink = (base: string, amount: number) =>
  `${base.replace(/\/+$/, '')}/${amountText(amount)}EUR`

export const cancelLink = (s: Settings, b: Booking) =>
  `${s.site_url.replace(/\/+$/, '')}/${b.lang}/reserver/annuler?t=${b.cancel_token}`

export const isEmail = (s: unknown) =>
  typeof s === 'string' && s.length <= 200 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.trim())

export const clean = (s: unknown, max: number) =>
  typeof s === 'string' ? s.trim().slice(0, max) : ''

// Errores de la base que se muestran a la clienta con un mensaje propio
export const KNOWN_ERRORS = [
  'service_not_found', 'slot_unavailable', 'event_not_found', 'event_past',
  'event_full', 'already_registered', 'booking_not_found', 'already_cancelled',
  'booking_past',
]
export const errorCode = (message = '') =>
  KNOWN_ERRORS.find((c) => message.includes(c)) ??
  (message.includes('bookings_no_overlap') ? 'slot_unavailable' : 'server_error')
