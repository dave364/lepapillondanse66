// Emails en los 4 idiomas del sitio (a la clienta) y en español (a Zulgey)
import { amountText, cancelLink, type Full, type Lang, paypalLink } from './common.ts'
import type { Mail } from './email.ts'

const PHONE = '+33 7 59 74 15 77'

const T = {
  fr: {
    hello: 'Bonjour {name},',
    confirmSubject: 'Votre réservation : {title}',
    introPending: 'Merci pour votre réservation ! Votre place est retenue et en attente de paiement.',
    introConfirmed: 'Merci pour votre réservation, elle est confirmée !',
    when: 'Date', duration: 'Durée', place: 'Lieu', amount: 'Montant', free: 'Gratuit',
    tz: 'heure de France', min: 'min',
    online: 'En ligne : vous recevrez le lien de connexion avant le rendez-vous.',
    payText: 'Pour confirmer votre réservation, merci de régler {amount} via PayPal :',
    payBtn: 'Payer {amount} avec PayPal',
    payNote: 'Le paiement est fait au nom de Zulgey Castro. Si vous avez déjà payé, ne tenez pas compte de ce message.',
    cancelText: 'Un empêchement ? Vous pouvez annuler votre réservation ici :',
    cancelBtn: 'Annuler ma réservation',
    questions: `Une question ? Répondez simplement à cet e-mail ou écrivez-nous sur WhatsApp au ${PHONE}.`,
    sign: 'À très bientôt,<br>Sully — Le Papillon Danse 66',
    reminderSubject: 'Rappel : {title}, {date}',
    reminderIntro: 'Petit rappel : votre rendez-vous approche.',
    reminderPay: "Nous n'avons pas encore reçu votre paiement. Pour garder votre place, merci de régler {amount} :",
    cancelledSubject: 'Réservation annulée : {title}',
    cancelledIntro: 'Votre réservation a bien été annulée.',
    rebook: 'Vous pouvez réserver un nouveau créneau quand vous le souhaitez :',
    rebookBtn: 'Réserver',
    paidSubject: 'Paiement reçu : {title}',
    paidIntro: 'Nous avons bien reçu votre paiement de {amount}. Votre réservation est confirmée !',
  },
  es: {
    hello: 'Hola {name}:',
    confirmSubject: 'Tu reserva: {title}',
    introPending: '¡Gracias por tu reserva! Tu lugar quedó guardado y está pendiente de pago.',
    introConfirmed: '¡Gracias por tu reserva, ya está confirmada!',
    when: 'Fecha', duration: 'Duración', place: 'Lugar', amount: 'Monto', free: 'Gratis',
    tz: 'hora de Francia', min: 'min',
    online: 'En línea: te enviaremos el link de conexión antes del encuentro.',
    payText: 'Para confirmar tu reserva, aboná {amount} por PayPal:',
    payBtn: 'Pagar {amount} con PayPal',
    payNote: 'El pago se hace a nombre de Zulgey Castro. Si ya pagaste, ignorá este mensaje.',
    cancelText: '¿Te surgió un imprevisto? Podés cancelar tu reserva acá:',
    cancelBtn: 'Cancelar mi reserva',
    questions: `¿Alguna pregunta? Respondé este email o escribinos por WhatsApp al ${PHONE}.`,
    sign: '¡Hasta pronto!<br>Sully — Le Papillon Danse 66',
    reminderSubject: 'Recordatorio: {title}, {date}',
    reminderIntro: 'Un pequeño recordatorio: tu encuentro se acerca.',
    reminderPay: 'Todavía no recibimos tu pago. Para mantener tu lugar, aboná {amount}:',
    cancelledSubject: 'Reserva cancelada: {title}',
    cancelledIntro: 'Tu reserva fue cancelada.',
    rebook: 'Podés reservar un nuevo horario cuando quieras:',
    rebookBtn: 'Reservar',
    paidSubject: 'Pago recibido: {title}',
    paidIntro: 'Recibimos tu pago de {amount}. ¡Tu reserva está confirmada!',
  },
  en: {
    hello: 'Hello {name},',
    confirmSubject: 'Your booking: {title}',
    introPending: 'Thank you for your booking! Your place is held and awaiting payment.',
    introConfirmed: 'Thank you for your booking, it is confirmed!',
    when: 'Date', duration: 'Duration', place: 'Place', amount: 'Amount', free: 'Free',
    tz: 'French time', min: 'min',
    online: 'Online: you will receive the meeting link before the session.',
    payText: 'To confirm your booking, please pay {amount} via PayPal:',
    payBtn: 'Pay {amount} with PayPal',
    payNote: 'The payment goes to Zulgey Castro. If you have already paid, please ignore this message.',
    cancelText: 'Something came up? You can cancel your booking here:',
    cancelBtn: 'Cancel my booking',
    questions: `Any questions? Just reply to this email or message us on WhatsApp at ${PHONE}.`,
    sign: 'See you soon,<br>Sully — Le Papillon Danse 66',
    reminderSubject: 'Reminder: {title}, {date}',
    reminderIntro: 'A little reminder: your appointment is coming up.',
    reminderPay: "We haven't received your payment yet. To keep your place, please pay {amount}:",
    cancelledSubject: 'Booking cancelled: {title}',
    cancelledIntro: 'Your booking has been cancelled.',
    rebook: 'You can book a new time whenever you like:',
    rebookBtn: 'Book',
    paidSubject: 'Payment received: {title}',
    paidIntro: 'We have received your payment of {amount}. Your booking is confirmed!',
  },
  ar: {
    hello: 'مرحبًا {name}،',
    confirmSubject: 'حجزك: {title}',
    introPending: 'شكرًا على حجزك! تم حجز مكانك وهو في انتظار الدفع.',
    introConfirmed: 'شكرًا على حجزك، لقد تم تأكيده!',
    when: 'الموعد', duration: 'المدة', place: 'المكان', amount: 'المبلغ', free: 'مجاني',
    tz: 'بتوقيت فرنسا', min: 'دقيقة',
    online: 'عبر الإنترنت: ستصلك رابط الاتصال قبل الموعد.',
    payText: 'لتأكيد حجزك، يُرجى دفع {amount} عبر PayPal:',
    payBtn: 'ادفعي {amount} عبر PayPal',
    payNote: 'يتم الدفع باسم Zulgey Castro. إذا كنتِ قد دفعتِ بالفعل، يُرجى تجاهل هذه الرسالة.',
    cancelText: 'هل طرأ ظرف ما؟ يمكنك إلغاء حجزك من هنا:',
    cancelBtn: 'إلغاء حجزي',
    questions: `لديكِ سؤال؟ يكفي الرد على هذه الرسالة أو مراسلتنا عبر واتساب على ${PHONE}.`,
    sign: 'إلى اللقاء قريبًا،<br>Sully — Le Papillon Danse 66',
    reminderSubject: 'تذكير: {title}، {date}',
    reminderIntro: 'تذكير صغير: موعدك يقترب.',
    reminderPay: 'لم نستلم دفعتك بعد. للاحتفاظ بمكانك، يُرجى دفع {amount}:',
    cancelledSubject: 'تم إلغاء الحجز: {title}',
    cancelledIntro: 'تم إلغاء حجزك.',
    rebook: 'يمكنك حجز موعد جديد متى شئتِ:',
    rebookBtn: 'احجزي',
    paidSubject: 'تم استلام الدفع: {title}',
    paidIntro: 'لقد استلمنا دفعتك بقيمة {amount}. تم تأكيد حجزك!',
  },
} satisfies Record<Lang, Record<string, string>>

type Dict = (typeof T)['fr']

const fill = (s: string, v: Record<string, string>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '')

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

const locale = (lang: Lang) => (lang === 'ar' ? 'ar-u-nu-latn' : lang === 'en' ? 'en-GB' : lang)

export function formatDate(iso: string, lang: Lang, tz: string, style: 'full' | 'short' = 'full') {
  return new Intl.DateTimeFormat(locale(lang), {
    timeZone: tz,
    dateStyle: style === 'full' ? 'full' : 'medium',
    timeStyle: 'short',
    hourCycle: 'h23',
  }).format(new Date(iso))
}

const money = (n: number) => `${amountText(n)} €`

// ---------------------------------------------------------------------------
// Diseño del email (colores del sitio: dorado y turquesa)
// ---------------------------------------------------------------------------
const button = (href: string, label: string, color = '#762b87') =>
  `<p style="margin:22px 0;text-align:center">
    <a href="${esc(href)}" style="background:${color};color:#fff;text-decoration:none;
      padding:12px 26px;border-radius:999px;font-weight:bold;display:inline-block">${esc(label)}</a>
  </p>`

function layout(lang: Lang, body: string) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  return `<!doctype html><html lang="${lang}" dir="${dir}"><body style="margin:0;background:#fff3e8">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;font-family:Georgia,'Times New Roman',serif;
    color:#3d244c;line-height:1.55;font-size:16px" dir="${dir}">
    <p style="text-align:center;font-size:20px;letter-spacing:.06em;color:#b08533;margin:0 0 18px">
      ✦ Le Papillon Danse 66 ✦</p>
    <div style="background:#fff;border:1px solid #e8d8b0;border-radius:14px;padding:24px">${body}</div>
  </div></body></html>`
}

function details(f: Full, t: Dict) {
  const { booking: b, settings: s } = f
  const lang = b.lang
  const rows: [string, string][] = [
    [t.when, `${formatDate(b.starts_at, lang, s.timezone)} (${t.tz})`],
  ]
  if (!f.isEvent) rows.push([t.duration, `${f.minutes} ${t.min}`])
  if (f.online) rows.push([t.place, t.online])
  else if (f.location) rows.push([t.place, f.location])
  rows.push([t.amount, b.price > 0 ? money(b.price) : t.free])
  return `<h2 style="font-size:19px;color:#762b87;margin:18px 0 8px">${esc(title(f))}</h2>
  <table role="presentation" style="border-collapse:collapse;width:100%">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#8a7350;vertical-align:top;white-space:nowrap">${esc(k)}</td>
      <td style="padding:4px 0">${esc(v)}</td></tr>`)
    .join('')}</table>`
}

const title = (f: Full) => f.title[f.booking.lang] || f.title.fr || f.title.es || ''

function payBlock(f: Full, t: Dict, intro: string) {
  const amount = money(f.booking.price)
  return `<p>${esc(fill(intro, { amount }))}</p>
    ${button(paypalLink(f.settings.paypal_url, f.booking.price), fill(t.payBtn, { amount }), '#b08533')}
    <p style="font-size:13px;color:#8a7350">${esc(t.payNote)}</p>`
}

const footer = (f: Full, t: Dict, withCancel = true) => `
  ${withCancel ? `<p style="margin-top:22px">${esc(t.cancelText)}<br>
    <a href="${esc(cancelLink(f.settings, f.booking))}" style="color:#762b87">${esc(t.cancelBtn)}</a></p>` : ''}
  <p>${esc(t.questions)}</p>
  <p>${t.sign}</p>`

const mailTo = (f: Full, subject: string, body: string): Mail => ({
  to: f.booking.client_email,
  subject,
  html: layout(f.booking.lang, body),
  replyTo: f.settings.admin_email,
})

// ---------------------------------------------------------------------------
// Emails a la clienta
// ---------------------------------------------------------------------------
export function confirmationEmail(f: Full): Mail {
  const t = T[f.booking.lang] ?? T.fr
  const pending = f.booking.status === 'pending_payment'
  const body = `<p>${esc(fill(t.hello, { name: f.booking.client_name }))}</p>
    <p>${esc(pending ? t.introPending : t.introConfirmed)}</p>
    ${details(f, t)}
    ${pending ? payBlock(f, t, t.payText) : ''}
    ${footer(f, t)}`
  return mailTo(f, fill(t.confirmSubject, { title: title(f) }), body)
}

export function reminderEmail(f: Full): Mail {
  const t = T[f.booking.lang] ?? T.fr
  const date = formatDate(f.booking.starts_at, f.booking.lang, f.settings.timezone, 'short')
  const body = `<p>${esc(fill(t.hello, { name: f.booking.client_name }))}</p>
    <p>${esc(t.reminderIntro)}</p>
    ${details(f, t)}
    ${f.booking.status === 'pending_payment' ? payBlock(f, t, t.reminderPay) : ''}
    ${footer(f, t)}`
  return mailTo(f, fill(t.reminderSubject, { title: title(f), date }), body)
}

export function cancelledEmail(f: Full): Mail {
  const t = T[f.booking.lang] ?? T.fr
  const site = f.settings.site_url.replace(/\/+$/, '')
  const body = `<p>${esc(fill(t.hello, { name: f.booking.client_name }))}</p>
    <p>${esc(t.cancelledIntro)}</p>
    ${details(f, t)}
    <p style="margin-top:18px">${esc(t.rebook)}</p>
    ${button(`${site}/${f.booking.lang}/reserver`, t.rebookBtn)}
    ${footer(f, t, false)}`
  return mailTo(f, fill(t.cancelledSubject, { title: title(f) }), body)
}

export function paidEmail(f: Full): Mail {
  const t = T[f.booking.lang] ?? T.fr
  const body = `<p>${esc(fill(t.hello, { name: f.booking.client_name }))}</p>
    <p>${esc(fill(t.paidIntro, { amount: money(f.booking.price) }))}</p>
    ${details(f, t)}
    ${footer(f, t)}`
  return mailTo(f, fill(t.paidSubject, { title: title(f) }), body)
}

// ---------------------------------------------------------------------------
// Avisos a Zulgey (en español)
// ---------------------------------------------------------------------------
const STATUS_ES = {
  pending_payment: 'Pendiente de pago',
  paid: 'Pagada',
  confirmed: 'Confirmada (gratis)',
  cancelled: 'Cancelada',
}

const LANG_ES: Record<Lang, string> = { fr: 'francés', es: 'español', en: 'inglés', ar: 'árabe' }

export function adminEmail(f: Full, kind: 'new' | 'cancelled'): Mail {
  const b = f.booking
  const name = f.title.es || f.title.fr || ''
  const date = formatDate(b.starts_at, 'es', f.settings.timezone)
  const rows: [string, string][] = [
    [f.isEvent ? 'Evento' : 'Servicio', name],
    ['Fecha', `${date} (hora de Francia)`],
    ['Clienta', b.client_name],
    ['Email', b.client_email],
    ['Teléfono', b.client_phone ?? '—'],
    ['Idioma', LANG_ES[b.lang] ?? b.lang],
    ['Monto', b.price > 0 ? money(b.price) : 'Gratis'],
    ['Estado', STATUS_ES[b.status]],
  ]
  if (b.notes) rows.push(['Mensaje', b.notes])
  const site = f.settings.site_url.replace(/\/+$/, '')
  const body = `<p>${kind === 'new' ? '¡Nueva reserva!' : 'Una clienta canceló su reserva.'}</p>
    <table role="presentation" style="border-collapse:collapse;width:100%">${rows
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#8a7350;vertical-align:top">${esc(k)}</td>
        <td style="padding:4px 0;white-space:pre-wrap">${esc(v)}</td></tr>`)
      .join('')}</table>
    ${button(`${site}/admin`, 'Abrir el panel')}`
  return {
    to: f.settings.admin_email,
    subject: `${kind === 'new' ? 'Nueva reserva' : 'Reserva cancelada'}: ${name} · ${formatDate(b.starts_at, 'es', f.settings.timezone, 'short')} · ${b.client_name}`,
    html: layout('es', body),
    replyTo: b.client_email,
  }
}
