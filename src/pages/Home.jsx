import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IMAGES } from '../config/site'
import ArchImage from '../components/ArchImage'
import CourseList from '../components/CourseList'
import Butterfly from '../components/Butterfly'

const STAGE_ICONS = [
  // oruga
  <svg key="c" viewBox="0 0 64 32" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="10" cy="18" r="6" /><circle cx="22" cy="16" r="6" /><circle cx="34" cy="18" r="6" /><circle cx="46" cy="16" r="6" /><circle cx="56" cy="14" r="5" />
  </g></svg>,
  // crisálida
  <svg key="h" viewBox="0 0 64 32" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M32 2v4" /><path d="M32 6c-8 0-10 8-10 12s4 12 10 12 10-8 10-12-2-12-10-12z" /><path d="M24 14h16M23 20h18" />
  </g></svg>,
  <Butterfly key="b" />,
]

export default function Home() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const words = t('hero.title').split(/,\s*|،\s*/)
  const about = t('about.paragraphs', { returnObjects: true })
  const stages = t('journey.stages', { returnObjects: true })
  const disciplines = t('disciplines', { returnObjects: true })

  return (
    <>
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__text">
            <h1 className="hero__title" aria-label={t('hero.title')}>
              {words.map((w, i) => (
                <span key={w} className="hero__word" style={{ '--i': i }} aria-hidden="true">{w}</span>
              ))}
            </h1>
            <p className="hero__lead">{t('hero.lead')}</p>
            <div className="hero__ctas">
              <Link to={`/${lang}/inscription`} className="btn btn--gold">{t('hero.ctaPrimary')}</Link>
              <Link to={`/${lang}/cours`} className="btn btn--ghost">{t('hero.ctaSecondary')}</Link>
            </div>
          </div>
          <ArchImage src={IMAGES.hero} alt={t('hero.imageAlt')} className="hero__img" eager />
        </div>
        <ul className="disciplines">
          {disciplines.map((d) => <li key={d}>{d}</li>)}
        </ul>
      </section>

      <section className="section about">
        <div className="container about__grid">
          <ArchImage src={IMAGES.about} alt="" className="about__img" />
          <div className="prose">
            <h2>{t('about.title')}</h2>
            {about.map((p) => <p key={p}>{p}</p>)}
          </div>
        </div>
      </section>

      <section className="section journey">
        <div className="container">
          <h2>{t('journey.title')}</h2>
          <p className="section__intro">{t('journey.intro')}</p>
          <ol className="stages">
            {stages.map((s, i) => (
              <li key={s.name} className="stage">
                <span className="stage__icon">{STAGE_ICONS[i]}</span>
                <h3>{s.name}</h3>
                <p className="stage__sub">{s.subtitle}</p>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{t('courses.title')}</h2>
          <p className="section__intro">{t('courses.intro')}</p>
          <CourseList />
        </div>
      </section>

      <section className="closing">
        <div className="container closing__inner">
          <h2>{t('closing.title')}</h2>
          <p>{t('closing.text')}</p>
          <Link to={`/${lang}/inscription`} className="btn btn--gold">{t('hero.ctaPrimary')}</Link>
        </div>
      </section>
    </>
  )
}
