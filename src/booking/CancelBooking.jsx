import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import OrnateButton from '../components/OrnateButton'
import { bookingByToken, cancelBooking, formatDateTime } from './api'

// /:lang/reserver/annuler?t=<token> → la clienta cancela desde su email
export default function CancelBooking() {
  const { lang } = useParams()
  const [params] = useSearchParams()
  const token = params.get('t') || ''
  const { t } = useTranslation()
  const [booking, setBooking] = useState()
  const [state, setState] = useState('loading') // loading | ask | sending | done | <código de error>

  useEffect(() => {
    bookingByToken(token)
      .then((b) => {
        setBooking(b)
        if (!b) setState('booking_not_found')
        else if (b.status === 'cancelled') setState('already_cancelled')
        else if (new Date(b.starts_at) <= new Date()) setState('booking_past')
        else if (b.cancel_until && new Date(b.cancel_until) <= new Date()) setState('too_late')
        else setState('ask')
      })
      .catch(() => setState('booking_not_found'))
  }, [token])

  async function confirm() {
    setState('sending')
    try {
      await cancelBooking(token)
      setState('done')
    } catch (e) {
      setState(['booking_not_found', 'already_cancelled', 'booking_past', 'too_late'].includes(e.code) ? e.code : 'error')
    }
  }

  const name = booking && ((booking.service_name || booking.event_title)?.[lang] ||
    (booking.service_name || booking.event_title)?.fr)

  return (
    <section className="block sky bk">
      <Helmet><title>{t('booking.cancel.metaTitle')}</title></Helmet>
      <h1 className="block__title">{t('booking.cancel.title')}</h1>
      <div className="bk-card bk-card--narrow">
        {booking && (
          <p className="bk-summary">
            <strong>{name}</strong><br />
            {formatDateTime(booking.starts_at, lang)} <small>({t('booking.tzNote').replace(/\.$/, '')})</small>
          </p>
        )}
        {state === 'loading' && <p className="bk-loading">{t('booking.loading')}</p>}
        {(state === 'ask' || state === 'sending') && (
          <>
            <p>{t('booking.cancel.question')}</p>
            <p className="center">
              <OrnateButton size="sm" onClick={confirm} disabled={state === 'sending'}>
                {state === 'sending' ? t('booking.sending') : t('booking.cancel.confirm')}
              </OrnateButton>
            </p>
          </>
        )}
        {state === 'done' && <p role="status">{t('booking.cancel.done')}</p>}
        {['booking_not_found', 'already_cancelled', 'booking_past', 'too_late'].includes(state) && (
          <p role="alert">{t(`booking.cancel.${state}`)}</p>
        )}
        {state === 'error' && <p className="bk-error" role="alert">{t('booking.errors.generic')}</p>}
        {(state === 'done' || state === 'already_cancelled') && (
          <p className="center">
            <OrnateButton as={Link} size="sm" className="ornate--book" to={`/${lang}/reserver`}>
              {t('booking.cancel.rebook')}
            </OrnateButton>
          </p>
        )}
      </div>
    </section>
  )
}
