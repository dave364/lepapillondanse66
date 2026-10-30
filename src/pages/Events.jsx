import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { EVENTS, SITE } from '../config/site'
import OrnateButton from '../components/OrnateButton'
import SafeImg from '../components/SafeImg'
import { pauseMusic } from '../lib/music'
import { BOOKING_ENABLED } from '../config/booking'

// Eventos con cupo e inscripción (solo con el sistema de reservas propio)
const UpcomingEvents = BOOKING_ENABLED ? lazy(() => import('../booking/UpcomingEvents')) : () => null

// Video: si ninguna fuente carga, se oculta en vez de mostrar un reproductor roto
function EventVideo({ title }) {
  const ref = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const last = ref.current?.querySelector('source:last-of-type')
    if (!last) return
    const onError = () => setFailed(true)
    last.addEventListener('error', onError)
    return () => last.removeEventListener('error', onError)
  }, [])

  if (failed) return null
  return (
    <div className="events__video">
      {/* Al darle play al video se pausa la música de fondo */}
      <video ref={ref} onPlay={pauseMusic} controls playsInline preload="metadata" poster={EVENTS.video.poster} title={title}>
        {EVENTS.video.sources.map((src) => <source key={src} src={src} type="video/mp4" />)}
      </video>
    </div>
  )
}

export default function Events() {
  const { t } = useTranslation()
  const { gallery } = EVENTS

  return (
    <section className="block sky">
      <Helmet><title>{t('events.metaTitle')}</title></Helmet>
      <h1 className="block__title">{t('events.title')}</h1>
      <p className="info">{t('events.intro')}</p>

      <EventVideo title={t('events.videoTitle')} />

      <Suspense fallback={null}>
        <UpcomingEvents />
      </Suspense>

      {gallery.length > 0 && (
        <>
          <h2 className="events__subtitle">{t('events.galleryTitle')}</h2>
          <ul className="events__gallery">
            {gallery.map((img) => (
              <li key={img.src}>
                <SafeImg src={img.src} alt={img.alt || ''} loading="lazy" />
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="events__next">
        <h2 className="events__subtitle">{t('events.nextTitle')}</h2>
        <p>{t('events.nextText')}</p>
        <p className="center">
          <OrnateButton as="a" size="sm" href={SITE.social.instagram} target="_blank" rel="noopener">{t('insta.cta')}</OrnateButton>
        </p>
      </div>
    </section>
  )
}
