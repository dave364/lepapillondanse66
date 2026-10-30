// Precios, duraciones y servicios activos tal como están en el panel
// (Supabase), para que las tarjetas del sitio muestren siempre lo mismo que
// se cobra. Se pide una sola vez con un fetch simple (sin cargar la librería
// de Supabase en todas las páginas). Mientras carga, o si el sistema de
// reservas no está configurado, se usan los datos de src/config/booking.js.
import { useSyncExternalStore } from 'react'
import { BOOKING_ENABLED } from '../config/booking'

let live = null // Map key → { price, minutes, online, free_trial }
const listeners = new Set()

function load() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  fetch(`${url}/rest/v1/services?select=key,price,minutes,online,free_trial`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((rows) => {
      live = new Map(rows.map((r) => [r.key, r]))
      listeners.forEach((l) => l())
    })
    .catch(() => {
      /* sin conexión: quedan los datos del sitio */
    })
}

let started = false
function subscribe(cb) {
  if (BOOKING_ENABLED && !started) {
    started = true
    load()
  }
  listeners.add(cb)
  return () => listeners.delete(cb)
}

// Devuelve el servicio con los datos del panel, o null si está desactivado
export function useLiveService(service) {
  const map = useSyncExternalStore(subscribe, () => live, () => null)
  if (!service || !map) return service
  const row = map.get(service.key)
  if (!row) return null
  return {
    ...service,
    price: Number(row.price),
    minutes: row.minutes,
    online: row.online,
    freeTrial: row.free_trial,
  }
}
