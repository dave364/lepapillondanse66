import { useTranslation } from 'react-i18next'
import { SITE } from '../config/site'

// Aquí irán más adelante las meditaciones, ebooks y la tienda
export default function Online() {
  const { t } = useTranslation()
  return (
    <section className="block sky block--short">
      <h1 className="block__title">{t('online.title')}</h1>
      <p className="info">{t('online.text')}</p>
      <p className="center">
        <a href={SITE.social.youtube} className="btn-gold" target="_blank" rel="noreferrer">{t('online.youtube')}</a>
      </p>
    </section>
  )
}
