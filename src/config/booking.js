// Reservas con Setmore (pasados por Sully el 29/10/2026).
// PENDIENTE: verificar en el navegador que cada link abra el servicio correcto.
const BASE = 'https://lepapillondanse.setmore.com'
const ref = '?utm_source=website'

export const BOOKING = {
  // Página general con todos los servicios
  all: `${BASE}/book${ref}`,
  services: {
    meetingCall: `${BASE}/services/55e44379-758c-4048-b39f-f740ea919603${ref}`, // Llamada gratuita para conocernos
    tarot: `${BASE}/services/10777997-582f-45e1-a4b9-ba9c467cf62a${ref}`, // Consultas de tarot
    pendulum: `${BASE}/services/20559047-0e36-4fda-b407-79f6eacdafdd${ref}`, // Péndulo, radiestesia y sanación
    akashic: `${BASE}/services/0d75eb70-1b0c-4f08-b636-9d3b9d7105d9${ref}`, // Vidas pasadas y registros akáshicos
    spiritualCoaching: `${BASE}/services/33f40fa8-41c8-4583-a9a2-18ac7960dcf8${ref}`, // Coaching espiritual y holístico
    intuitiveDance: `${BASE}/services/73ecbe7b-ae30-4e90-a0a4-e887201f2e33${ref}`, // Danza intuitiva y estudios complementarios
    orientalIntuitive: `${BASE}/services/b680ddc3-931e-440d-89e3-d5ca0ad3d495${ref}`, // Danza oriental intuitiva
    pilatesOnline: `${BASE}/services/aad8c50e-880d-41b4-b4ad-55c266877270${ref}`, // Pilates mat work online
    empowerment: `${BASE}/services/c656fc65-d817-4b81-a758-a08360ef7306${ref}`, // Coaching empowerment féminin
  },
}

// Pagos con PayPal (cuenta personal de Sully, no la de la asociación)
export const PAYPAL = 'https://paypal.me/zulgeycastro'

// Link de PayPal con el monto ya cargado, por ej. paypalLink(45) → .../45EUR
export const paypalLink = (amount) =>
  amount ? `${PAYPAL}/${amount}EUR` : PAYPAL
