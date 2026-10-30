import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { SERVICES } from '../config/booking'
import { IMAGES } from '../config/site'
import SafeImg from '../components/SafeImg'
import ServiceCard from '../components/ServiceCard'
import FreeCall from '../components/FreeCall'

// Soins holistiques & accompagnement — Méthode Mariposa
export default function Services() {
  const { t } = useTranslation()
  const how = t('services.how', { returnObjects: true })

  return (
    <>
      <Helmet>
        <title>{t('services.metaTitle')}</title>
      </Helmet>

      {/* Presentación: retrato en óvalo dorado + Méthode Mariposa */}
      <section className="block sky">
        <h1 className="block__title">{t('services.title')}</h1>
        <div className="mariposa">
          <div className="mariposa__portrait">
            <SafeImg src={IMAGES.portrait} alt="Sully" loading="eager" />
          </div>
          <div className="mariposa__text">
            <p className="mariposa__method">{t('services.method')}</p>
            <p className="motto">{t('services.motto')}</p>
            <p className="mariposa__intro">{t('services.intro')}</p>
            <FreeCall />
          </div>
        </div>
      </section>

      {/* Danza y movimiento */}
      <section className="block lilac" id="danse">
        <h2 className="block__title">{t('services.danceTitle')}</h2>
        <p className="info">{t('services.danceIntro')}</p>
        <div className="services">
          {SERVICES.dance.map((s) => <ServiceCard key={s.key} service={s} />)}
        </div>
      </section>

      {/* Terapias y acompañamiento */}
      <section className="block sky" id="soins">
        <h2 className="block__title">{t('services.careTitle')}</h2>
        <p className="info">{t('services.careIntro')}</p>
        <div className="services">
          {SERVICES.care.map((s) => <ServiceCard key={s.key} service={s} />)}
        </div>

        {/* Cómo reservar: es una secuencia, por eso va numerada */}
        <div className="how">
          <h2 className="how__title">{t('services.howTitle')}</h2>
          <ol className="how__steps">
            {how.map((step) => <li key={step}>{step}</li>)}
          </ol>
          <p className="how__note">{t('book.payNote')}</p>
          <p className="how__note">{t('services.disclaimer')}</p>
        </div>
      </section>
    </>
  )
}
