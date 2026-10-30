import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { ServiceMeta } from '../components/ServiceCard'
import { findService } from '../config/booking'
import Calendar from './Calendar'
import { BookingForm, BookingSuccess } from './BookingForm'
import { book, dayKey, fetchService, fetchSlots, formatDay, formatTime, sameOffset, visitorTz } from './api'

// /:lang/reserver/:key → elegir día, horario y completar datos
export default function BookService() {
  const { key, lang } = useParams()
  const { t } = useTranslation()
  const [service, setService] = useState(null)
  const [days, setDays] = useState(null)
  const [failed, setFailed] = useState(false)
  const [day, setDay] = useState(null)
  const [slot, setSlot] = useState(null)
  const [done, setDone] = useState(null)

  const load = () =>
    Promise.all([fetchService(key), fetchSlots(key)])
      .then(([s, d]) => {
        setService(s)
        setDays(d)
        // Abre con el primer día libre ya elegido (o mantiene el elegido si sigue libre)
        setDay((cur) => (cur && d.has(cur) ? cur : [...d.keys()].sort()[0] ?? null))
      })
      .catch(() => setFailed(true))

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const isCall = key === 'call'
  const title = isCall ? t('book.call.title') : t(`services.items.${key}.title`, { defaultValue: service?.name?.[lang] || '' })
  const text = isCall ? t('book.call.text') : t(`services.items.${key}.text`, { defaultValue: '' })
  // Precio y duración: los de la base (los que edita Zulgey) o los del sitio
  const meta = service
    ? { price: Number(service.price), minutes: service.minutes, online: service.online, freeTrial: service.free_trial }
    : findService(key)

  const tz = visitorTz()
  const showLocal = slot && !sameOffset(slot, 'Europe/Paris', tz)

  async function submit(values) {
    try {
      const res = await book({ ...values, lang, serviceKey: key, startsAt: slot })
      setDone({ email: values.email, booking: res.booking })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      if (e.code === 'slot_unavailable') {
        // Alguien lo tomó primero: se recargan los horarios
        setSlot(null)
        load()
      }
      throw e
    }
  }

  if (failed || (service === null && days)) {
    return (
      <section className="block sky bk">
        <p className="bk-error" role="alert">{t(failed ? 'booking.errors.generic' : 'booking.errors.service_not_found')}</p>
        <p className="center"><Link to={`/${lang}/reserver`}>{t('booking.all')}</Link></p>
      </section>
    )
  }

  return (
    <section className="block sky bk">
      <Helmet><title>{`${title} | ${t('booking.title')} | Le Papillon Danse 66`}</title></Helmet>
      <p className="bk-back"><Link to={`/${lang}/reserver`}>{lang === 'ar' ? '→' : '←'} {t('booking.all')}</Link></p>
      <h1 className="block__title">{title}</h1>
      {meta && <div className="bk-meta"><ServiceMeta service={meta} /></div>}
      {text && !done && <p className="info bk-text">{text}</p>}

      <div className="bk-card">
        {done ? (
          <BookingSuccess email={done.email} booking={done.booking} />
        ) : !days ? (
          <p className="bk-loading">{t('booking.loading')}</p>
        ) : days.size === 0 ? (
          <p className="bk-empty">{t('booking.noSlots')}</p>
        ) : slot ? (
          <>
            <div className="bk-chosen">
              <span>
                <strong>{formatDay(slot, lang)} · {formatTime(slot, lang)}</strong>
                <small> ({t('booking.tzNote').replace(/\.$/, '')}{showLocal ? ` ${t('booking.localTime', { time: formatTime(slot, lang, tz) })}` : ''})</small>
              </span>
              <button type="button" className="bk-link" onClick={() => setSlot(null)}>{t('booking.change')}</button>
            </div>
            <h2 className="bk-step">{t('booking.details')}</h2>
            <BookingForm onSubmit={submit} submitLabel={t('booking.submit')} />
          </>
        ) : (
          <div className="bk-pick">
            <div>
              <h2 className="bk-step">{t('booking.pickDay')}</h2>
              <Calendar days={days} today={dayKey(new Date())} selected={day} onSelect={setDay} />
            </div>
            <div className="bk-times-wrap">
              <h2 className="bk-step">{t('booking.pickTime')}</h2>
              {day && days.has(day) && (
                <>
                  <p className="bk-day">{formatDay(days.get(day)[0], lang)}</p>
                  <ul className="bk-times">
                    {days.get(day).map((iso) => (
                      <li key={iso}>
                        <button type="button" className="bk-time" onClick={() => setSlot(iso)}>
                          {formatTime(iso, lang)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <p className="bk-tz">{t('booking.tzNote')}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
