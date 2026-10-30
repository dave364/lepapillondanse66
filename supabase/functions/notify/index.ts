// POST /functions/v1/notify   (solo desde el panel, con la sesión de Zulgey)
// Body: { bookingId, kind: 'paid' | 'cancelled' | 'confirmation' }
// Avisa a la clienta cuando Zulgey marca una reserva como pagada, la cancela
// o quiere reenviarle el email de confirmación (con el link de pago).
import { createClient } from 'npm:@supabase/supabase-js@2'
import { cors, json, loadFull } from '../_shared/common.ts'
import { sendEmail } from '../_shared/email.ts'
import { cancelledEmail, confirmationEmail, paidEmail } from '../_shared/templates.ts'

const KINDS = { paid: paidEmail, cancelled: cancelledEmail, confirmation: confirmationEmail }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  // Comprueba que quien llama es administradora
  const auth = req.headers.get('authorization') ?? ''
  const userDb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: auth } },
    auth: { persistSession: false },
  })
  const { data: isAdmin } = await userDb.rpc('is_admin')
  if (!isAdmin) return json({ error: 'unauthorized' }, 401)

  const { bookingId, kind } = await req.json().catch(() => ({}))
  const make = KINDS[kind as keyof typeof KINDS]
  if (typeof bookingId !== 'string' || !make) return json({ error: 'invalid_input' }, 400)

  try {
    await sendEmail(make(await loadFull(bookingId)))
    return json({ ok: true })
  } catch (e) {
    console.error(e)
    return json({ error: 'email_failed' }, 500)
  }
})
