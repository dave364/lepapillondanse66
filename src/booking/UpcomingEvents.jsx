import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import OrnateButton from '../components/OrnateButton'
import { usePrice } from '../components/ServiceCard'
import { BookingForm, BookingSuccess } from './BookingForm'
import { book, fetchEvents, formatDateTime, formatTime } from './api'

// Próximos eventos con cupo e inscripción (página Événements).
// Si no hay eventos publicados no muestra nada.
export default function UpcomingEvents() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const price = usePrice()
  const [events, setEvents] = useState([])
  const [open, setOpen] = useState(null)
  const [done, setDone] = useState({})

  useEffect(() => {
    fetchEvents().then(setEvents).catch(() => setEvents([]))
  }, [])

  if (!events.length) return null

  const pick = (obj) => obj?.[lang] || obj?.fr || Object.values(obj || {})[0] || ''

  async function register(ev, values) {
    try {
      const res = await book({ ...values, lang, eventId: ev.id })
      setDone((d) => ({ ...d, [ev.id]: { email: values.email, booking: res.booking } }))
      setEvents((list) => list.map((e) => (e.id === ev.id ? { ...e, spots_left: e.spots_left - 1 } : e)))
    } catch (e) {
      if (e.code === 'event_full') {
        setEvents((list) => list.map((x) => (x.id === ev.id ? { ...x, spots_left: 0 } : x)))
      }
      throw e
    }
  }

  return (
    <div className="bk-events">
      <h2 className="events__subtitle">{t('booking.events.title')}</h2>
      <ul className="bk-events__list">
        {events.map((ev) => {
          const full = ev.spots_left <= 0
          const result = done[ev.id]
          return (
            <li key={ev.id} className="bk-event">
              <h3 className="bk-event__title">{pick(ev.title)}</h3>
              <p className="bk-event__when">
                {formatDateTime(ev.starts_at, lang)} – {formatTime(ev.ends_at, lang)}
                <small> ({t('booking.tzNote').replace(/\.$/, '')})</small>
              </p>
              <div className="service-meta">
                <span className="service-meta__main"><strong>{price(Number(ev.price))}</strong></span>
                {ev.online ? <span className="tag">{t('booking.events.online')}</span>
                  : ev.location && <span className="tag">{ev.location}</span>}
                <span className={`tag ${full ? '' : 'tag--gem'}`}>
                  {full ? t('booking.events.full') : t('booking.events.spots', { count: ev.spots_left })}
                </span>
              </div>
              {pick(ev.description) && <p className="bk-event__text">{pick(ev.description)}</p>}

              {result ? (
                <BookingSuccess title={t('booking.events.successTitle')} email={result.email} booking={result.booking} />
              ) : open === ev.id ? (
                <>
                  <h4 className="bk-step">{t('booking.events.registerTitle')}</h4>
                  <BookingForm onSubmit={(v) => register(ev, v)} submitLabel={t('booking.events.submit')} />
                </>
              ) : (
                !full && (
                  <p>
                    <OrnateButton size="sm" className="ornate--book" onClick={() => setOpen(ev.id)}>
                      {t('booking.events.register')}
                    </OrnateButton>
                  </p>
                )
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
