import { useTranslation } from 'react-i18next'
import { IMAGES } from '../config/site'
import ArchImage from '../components/ArchImage'

export default function Sully() {
  const { t } = useTranslation()
  const paragraphs = t('sully.paragraphs', { returnObjects: true })
  return (
    <section className="section page">
      <div className="container about__grid">
        <ArchImage src={IMAGES.sully} alt={t('sully.title')} className="about__img" eager />
        <div className="prose">
          <h1>{t('sully.title')}</h1>
          <p className="page__lead">{t('sully.lead')}</p>
          {paragraphs.map((p) => <p key={p}>{p}</p>)}
        </div>
      </div>
    </section>
  )
}
