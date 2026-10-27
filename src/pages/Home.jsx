import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IMAGES } from '../config/site'
import CourseList from '../components/CourseList'
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
          <SafeImg src={IMAGES.about} alt={t('nav.sully')} className="about__img" />
        </div>
      </section>

      {/* Philosophie et expérience */}
      <section className="block lilac">
        <h2 className="block__title">{t('philosophy.title')}</h2>
        <div className="philo" style={{ '--philo-bg': `url(${IMAGES.philosophyBg})` }}>
          <SafeImg src={IMAGES.sully} alt="" className="philo__img" />
          <div className="philo__text">
            {philo.map((p) => <p key={p}>{p}</p>)}

            <h3>{t('philosophy.stagesTitle')}</h3>
            {stages.map((s) => (
              <div key={s.name} className="philo__stage">
                <h4>{s.name} — {s.subtitle}</h4>
                <p>{s.text}</p>
              </div>
            ))}

            <h3>{t('philosophy.accompTitle')}</h3>
            {accomp.map((p) => <p key={p}>{p}</p>)}
            <p className="motto">{t('philosophy.motto')}</p>
          </div>
        </div>
      </section>

      {/* Les cours et expériences */}
      <section className="block sky">
        <h2 className="block__title">{t('courses.title')}</h2>
        <CourseList />
      </section>

      {/* Information et tarifs */}
      <section className="block sky block--short">
        <h2 className="block__title">{t('info.title')}</h2>
        <p className="info">{t('info.text')}</p>
      </section>

      {/* Cierre */}
      <section className="block sky closing">
        <h2 className="closing__title">
          {closing.map((l) => <span key={l}>{l}</span>)}
        </h2>
        <OrnateButton as={Link} to={`/${lang}/inscription`}>{t('closing.cta')}</OrnateButton>
      </section>
    </>
  )
}
