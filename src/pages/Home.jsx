import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IMAGES, SITE } from '../config/site'
import { SERVICES } from '../config/booking'
import BookLink from '../components/BookLink'
import CourseList from '../components/CourseList'
import InPerson from '../components/InPerson'
import SafeImg from '../components/SafeImg'
import OrnateButton from '../components/OrnateButton'

export default function Home() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const about = t('about.paragraphs', { returnObjects: true })
  const philo = t('philosophy.paragraphs', { returnObjects: true })
  const stages = t('philosophy.stages', { returnObjects: true })
  const accomp = t('sully.paragraphs', { returnObjects: true })
  const closing = t('closing.lines', { returnObjects: true })

  return (
    <>
      {/* L'Association */}
      <section className="block sky">
        <h2 className="block__title">{t('about.title')}</h2>
        <div className="about">
          <div className="about__text">
            <p className="strong">{t('about.lead')}</p>
            <p className="strong">{t('about.question')}</p>
            {about.map((p) => <p key={p}>{p}</p>)}
            <p className="motto">{t('about.motto')}</p>
          </div>
          <SafeImg src={IMAGES.about} alt={t('nav.sully')} className="about__img dreamy" />
        </div>
      </section>

      {/* Philosophie et expérience */}
      <section className="block lilac">
        <h2 className="block__title">{t('philosophy.title')}</h2>
        <div className="philo" style={{ '--philo-bg': `url(${IMAGES.philosophyBg})` }}>
          <SafeImg src={IMAGES.sully} alt="" className="philo__img img-blend fade-edges" />
          <div className="philo__text">
            {philo.map((p) => <p key={p}>{p}</p>)}

            <h3>{t('philosophy.accompTitle')}</h3>
            {accomp.map((p) => <p key={p}>{p}</p>)}
            <p className="motto">{t('philosophy.motto')}</p>
          </div>
        </div>

        {/* Méthode Mariposa: las tres etapas de la transformación */}
        <div className="method">
          <h3 className="method__title">{t('services.method')}</h3>
          <p className="method__subtitle">{t('philosophy.stagesTitle')}</p>
          <p className="method__intro">{t('philosophy.methodIntro')}</p>
          <ol className="method__stages">
            {stages.map((s, i) => (
              <li key={s.name} className="method__stage">
                <SafeImg src={IMAGES.stages[i]} alt="" className="method__img" />
                <div className="method__body">
                  <h4>{s.name}</h4>
                  <p className="method__stage-sub">{s.subtitle}</p>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Les cours et expériences */}
      <section className="block sky">
        <h2 className="block__title">{t('courses.title')}</h2>
        <InPerson compact />
        <CourseList />
      </section>

      {/* Soins & accompagnement (Méthode Mariposa) */}
      <section className="block lilac">
        <h2 className="block__title">{t('services.careTitle')}</h2>
        <p className="mariposa__method center-text">{t('services.method')}</p>
        <p className="info">{t('services.careIntro')}</p>
        <ul className="care-list">
          {SERVICES.care.map((s) => (
            <li key={s.key}>
              <Link to={`/${lang}/soins#soins`}>{t(`services.items.${s.key}.title`)}</Link>
            </li>
          ))}
        </ul>
        <p className="center">
          <OrnateButton as={Link} to={`/${lang}/soins`}>{t('services.discover')}</OrnateButton>
        </p>
      </section>

      {/* Information et tarifs */}
      <section className="block sky block--short">
        <h2 className="block__title">{t('info.title')}</h2>
        <p className="info">{t('info.text')}</p>
        <p className="center">
          <BookLink>{t('nav.book')}</BookLink>
        </p>
        <p className="info info--small">{t('book.payNote')}</p>
      </section>

      {/* Instagram */}
      <section className="block sky block--short insta">
        <h2 className="block__title">{t('insta.title')}</h2>
        <p className="info">{t('insta.text')}</p>
        <p className="center">
          <OrnateButton as="a" size="sm" href={SITE.social.instagram} target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
            </svg>
            {t('insta.cta')}
          </OrnateButton>
        </p>
      </section>

      {/* Cierre */}
      <section className="block sky closing">
        <h2 className="closing__title">
          {closing.map((l) => <span key={l}>{l}</span>)}
        </h2>
        <BookLink>{t('closingCta.book')}</BookLink>
        <p className="closing__call">
          <BookLink serviceKey="call" plain>{t('closingCta.call')}</BookLink>
        </p>
      </section>
    </>
  )
}
