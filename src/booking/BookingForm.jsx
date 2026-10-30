import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import OrnateButton from '../components/OrnateButton'
import { usePrice } from '../components/ServiceCard'

// Formulario de datos de la clienta (reservas y eventos).
// onSubmit(values) devuelve una promesa; si falla con { code } se muestra
// el mensaje traducido.
export function BookingForm({ onSubmit, submitLabel }) {
  const { t } = useTranslation()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  async function handle(e) {
    e.preventDefault()
    const values = Object.fromEntries(new FormData(e.currentTarget))
    setSending(true)
    setError(null)
    try {
      await onSubmit(values)
    } catch (err) {
      setError(err.code || 'generic')
      setSending(false)
    }
  }

  const msg = error && (t(`booking.errors.${error}`, { defaultValue: '' }) || t('booking.errors.generic'))

  return (
    <form className="bk-form" onSubmit={handle}>
      <label className="bk-field">
        <span>{t('booking.name')}</span>
        <input name="name" required maxLength={120} autoComplete="name" />
      </label>
      <label className="bk-field">
        <span>{t('booking.email')}</span>
        <input name="email" type="email" required maxLength={200} autoComplete="email" dir="ltr" />
      </label>
      <label className="bk-field">
        <span>{t('booking.phone')}</span>
        <input name="phone" type="tel" maxLength={40} autoComplete="tel" dir="ltr" />
      </label>
      <label className="bk-field">
        <span>{t('booking.notes')}</span>
        <textarea name="notes" rows={3} maxLength={2000} />
      </label>
      {/* Trampa para robots: las personas no ven este campo */}
      <label className="bk-hp" aria-hidden="true">
        Website <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      {msg && <p className="bk-error" role="alert">{msg}</p>}

      <p className="bk-privacy">{t('booking.privacy')}</p>
      <OrnateButton type="submit" className="ornate--book" disabled={sending}>
        {sending ? t('booking.sending') : submitLabel}
      </OrnateButton>
    </form>
  )
}

// Pantalla final: reservado + botón de PayPal si hay que pagar
export function BookingSuccess({ title, email, booking }) {
  const { t, i18n } = useTranslation()
  const price = usePrice()
  const amount = price(booking?.price)
  return (
    <div className="bk-success" role="status">
      <h2 className="bk-success__title">{title || t('booking.successTitle')}</h2>
      <p>{t('booking.successEmail', { email })}</p>
      {booking?.paypalUrl && (
        <>
          <p>{t('booking.successPay', { amount })}</p>
          <p className="center bk-success__pay">
            <OrnateButton as="a" className="ornate--book" href={booking.paypalUrl} target="_blank" rel="noopener">
              {t('booking.payNow', { amount })}
            </OrnateButton>
          </p>
          <p className="info--small">{t('book.payNote')}</p>
        </>
      )}
      <p className="bk-success__home">
        <Link to={`/${i18n.language}`}>{t('booking.backHome')}</Link>
      </p>
    </div>
  )
}
