import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t, i18n } = useTranslation()
  return (
    <section className="section page">
      <div className="container prose">
        <h1>{t('notFound.title')}</h1>
        <Link to={`/${i18n.language}`} className="btn btn--plum">{t('notFound.back')}</Link>
      </div>
    </section>
  )
}
