import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SITE } from '../config/site'
import { BOOKING } from '../config/booking'
import OrnateButton from './OrnateButton'

// Clases presenciales en Perpignan: horarios, sala, parking y mapa.
// compact: versión corta para la home (sin mapa, con link a la página de cursos)
export default function InPerson({ compact = false }) {
  const { t, i18n } = useTranslation()
  const schedule = t('inPerson.schedule', { returnObjects: true })
  const { studio } = SITE

  return (
    <aside className={`in-person ${compact ? 'in-person--compact' : ''}`} id="presentiel">
      <p className="in-person__eyebrow">{t('inPerson.title')}</p>
      <h2 className="in-person__title">{t('inPerson.class')}</h2>
      <p className="in-person__text">{t('inPerson.text')}</p>

      <div className="in-person__grid">
        <dl className="in-person__info">
          <div>
            <dt>{t('inPerson.scheduleTitle')}</dt>
            {schedule.map((s) => <dd key={s} dir="auto">{s}</dd>)}
          </div>
          <div>
            <dt>{t('inPerson.placeTitle')}</dt>
            <dd>{studio.name}</dd>
            <dd dir="ltr">{studio.street}, {studio.city}</dd>
          </div>
          {!compact && (
            <div>
              <dt>{t('inPerson.parkingTitle')}</dt>
              <dd>{t('inPerson.parking')}</dd>
            </div>
          )}
        </dl>
        {!compact && (
          <iframe
            className="in-person__map"
            title={studio.name}
            src={studio.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>

      <p className="in-person__actions">
        <OrnateButton as="a" size="sm" className="ornate--book" href={BOOKING.all} target="_blank" rel="noopener">
          {t('nav.book')}
        </OrnateButton>
        {compact ? (
          <OrnateButton as={Link} size="sm" to={`/${i18n.language}/cours#presentiel`}>{t('inPerson.more')}</OrnateButton>
        ) : (
          <OrnateButton as="a" size="sm" href={studio.directions} target="_blank" rel="noopener">{t('inPerson.directions')}</OrnateButton>
        )}
      </p>
    </aside>
  )
}
