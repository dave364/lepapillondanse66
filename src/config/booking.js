// Reservas y pagos (PayPal).
// Si están configuradas las variables de Supabase (VITE_SUPABASE_URL y
// VITE_SUPABASE_ANON_KEY) se usa el sistema de reservas propio (/reserver).
// Si no, los botones siguen llevando a Setmore como antes.
// Datos tomados de la página de Setmore de Sully el 29/10/2026.
// Si cambia un precio o una duración en Setmore, actualizarlo también acá.

const BASE = 'https://lepapillondanse.setmore.com'
const ref = '?utm_source=website'
const service = (id) => `${BASE}/services/${id}${ref}`

// Pagos con PayPal (cuenta personal de Sully, no la de la asociación).
// No se muestra en la web: va en el email de confirmación de Setmore.
export const PAYPAL = 'https://paypal.me/zulgeycastro'
// Link de PayPal con el monto ya cargado, por ej. paypalLink(45) → .../45EUR
export const paypalLink = (amount) => (amount ? `${PAYPAL}/${amount}EUR` : PAYPAL)

export const BOOKING = {
  // Página general con todos los servicios
  all: `${BASE}/book${ref}`,
  // Llamada gratuita de 30 min para conocerse
  call: service('55e44379-758c-4048-b39f-f740ea919603'),
}

// Servicios: los textos están en los archivos de idioma (services.items.<key>)
// price en euros (0 = gratis), minutes = duración
export const SERVICES = {
  dance: [
    { key: 'intuitiveDance', price: 45, minutes: 45, online: true, freeTrial: true,
      url: service('73ecbe7b-ae30-4e90-a0a4-e887201f2e33') },
    { key: 'orientalIntuitive', price: 35, minutes: 45, online: true, freeTrial: true,
      url: service('b680ddc3-931e-440d-89e3-d5ca0ad3d495') },
    { key: 'pilatesOnline', price: 60, minutes: 45, online: true, freeTrial: true,
      url: service('aad8c50e-880d-41b4-b4ad-55c266877270') },
  ],
  care: [
    { key: 'tarot', price: 40, minutes: 30,
      url: service('10777997-582f-45e1-a4b9-ba9c467cf62a') },
    { key: 'pendulum', price: 50, minutes: 30,
      url: service('20559047-0e36-4fda-b407-79f6eacdafdd') },
    { key: 'akashic', price: 100, minutes: 60,
      url: service('0d75eb70-1b0c-4f08-b636-9d3b9d7105d9') },
    { key: 'spiritualCoaching', price: 150, minutes: 60,
      url: service('33f40fa8-41c8-4583-a9a2-18ac7960dcf8') },
    { key: 'empowerment', price: 300, minutes: 60, online: true,
      url: service('c656fc65-d817-4b81-a758-a08360ef7306') },
  ],
}

// Cursos de la home/página de cursos → servicio de Setmore (por posición).
// El 4.º (Ateliers créatifs) no está en Setmore: lleva a la llamada gratuita.
export const COURSE_SERVICES = ['intuitiveDance', 'orientalIntuitive', 'pilatesOnline', null]

export const findService = (key) =>
  [...SERVICES.dance, ...SERVICES.care].find((s) => s.key === key)

// ---------------------------------------------------------------------------
// Sistema de reservas propio
// ---------------------------------------------------------------------------
export const BOOKING_ENABLED = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
)

// Zona horaria de la agenda de Sully
export const TIMEZONE = 'Europe/Paris'

// A dónde lleva "Réserver": página propia o Setmore.
// key: clave del servicio ('tarot', 'call'…) o vacío para ver todos.
export function bookingHref(lang, key) {
  if (BOOKING_ENABLED) return key ? `/${lang}/reserver/${key}` : `/${lang}/reserver`
  if (key === 'call') return BOOKING.call
  return findService(key)?.url ?? BOOKING.all
}
