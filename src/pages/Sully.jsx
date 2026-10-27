import { useTranslation } from 'react-i18next'
import { IMAGES } from '../config/site'
import SafeImg from '../components/SafeImg'

export default function Sully() {
  const { t } = useTranslation()
  const paragraphs = t('sully.paragraphs', { returnObjects: true })
  return (
    <section className="block sky">
      <h1 className="block__title">{t('sully.title')}</h1>
      <div className="about">
        <div className="about__text">
          <p className="strong">{t('sully.lead')}</p>
          {paragraphs.map((p) => <p key={p}>{p}</p>)}
        </div>
        <SafeImg src={IMAGES.sully} alt={t('sully.title')} className="about__img img-blend fade-edges" loading="eager" />
      </div>
    </section>
  )
}
