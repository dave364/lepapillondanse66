import { useTranslation } from 'react-i18next'
import { SITE } from '../config/site'

// Aquí irán más adelante las meditaciones, ebooks y la tienda
export default function Online() {
  const { t } = useTranslation()
  return (
    <section className="section page">
      <div className="container prose">
        <h1>{t('online.title')}</h1>
        <p className="page__lead">{t('online.text')}</p>
        <p>
          <a href={SITE.social.youtube} className="btn btn--plum" target="_blank" rel="noreferrer">
            {t('online.youtube')}
          </a>
        </p>
      </div>
    </section>
  )
}
