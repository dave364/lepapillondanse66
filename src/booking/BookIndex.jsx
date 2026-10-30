import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { SERVICES } from '../config/booking'
import ServiceCard from '../components/ServiceCard'
import FreeCall from '../components/FreeCall'

// /:lang/reserver → todas las sesiones que se pueden reservar
export default function BookIndex() {
  const { t } = useTranslation()
  return (
    <section className="block sky bk">
      <Helmet><title>{t('booking.metaTitle')}</title></Helmet>
      <h1 className="block__title">{t('booking.title')}</h1>
      <p className="info">{t('booking.intro')}</p>

      <FreeCall />

      <h2 className="events__subtitle">{t('services.danceTitle')}</h2>
      <div className="services">
        {SERVICES.dance.map((s) => <ServiceCard key={s.key} service={s} />)}
      </div>

      <h2 className="events__subtitle">{t('services.careTitle')}</h2>
      <div className="services">
        {SERVICES.care.map((s) => <ServiceCard key={s.key} service={s} />)}
      </div>
      <p className="info info--small">{t('services.disclaimer')}</p>
    </section>
  )
}
