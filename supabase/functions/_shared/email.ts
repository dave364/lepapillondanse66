// Envío de emails.
// Por defecto usa el Gmail del proyecto por SMTP (contraseña de aplicación):
//   SMTP_USER = lepapillondanse66.web@gmail.com
//   SMTP_PASS = la contraseña de aplicación de 16 letras
// Si más adelante se usa Resend (dominio propio), alcanza con definir
// RESEND_API_KEY y EMAIL_FROM y deja de usarse el SMTP.
import nodemailer from 'npm:nodemailer@6'

export type Mail = { to: string; subject: string; html: string; replyTo?: string }

const FROM_NAME = 'Le Papillon Danse 66'

let transport: ReturnType<typeof nodemailer.createTransport> | null = null

export async function sendEmail(mail: Mail) {
  // Para probar en local sin mandar nada: EMAIL_LOG=ruta/al/archivo.jsonl
  const log = Deno.env.get('EMAIL_LOG')
  if (log) {
    await Deno.writeTextFile(log, JSON.stringify(mail) + '\n', { append: true })
    return
  }

  const resendKey = Deno.env.get('RESEND_API_KEY')
  if (resendKey) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: Deno.env.get('EMAIL_FROM') ?? `${FROM_NAME} <onboarding@resend.dev>`,
        to: [mail.to],
        subject: mail.subject,
        html: mail.html,
        reply_to: mail.replyTo,
      }),
    })
    if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`)
    return
  }

  const user = Deno.env.get('SMTP_USER')
  const pass = Deno.env.get('SMTP_PASS')
  if (!user || !pass) throw new Error('email_not_configured')
  // Supabase bloquea los puertos 25 y 587: se usa 465 (SSL)
  transport ??= nodemailer.createTransport({
    host: Deno.env.get('SMTP_HOST') ?? 'smtp.gmail.com',
    port: Number(Deno.env.get('SMTP_PORT') ?? 465),
    secure: true,
    auth: { user, pass },
  })
  await transport.sendMail({
    from: `"${FROM_NAME}" <${user}>`,
    to: mail.to,
    subject: mail.subject,
    html: mail.html,
    replyTo: mail.replyTo,
  })
}

// Manda varios y no corta si uno falla (la reserva ya quedó guardada)
export async function sendAll(mails: Mail[]) {
  const results = await Promise.allSettled(mails.map(sendEmail))
  const failed = results.filter((r) => r.status === 'rejected') as PromiseRejectedResult[]
  failed.forEach((r) => console.error('email error:', r.reason))
  return failed.length === 0
}
