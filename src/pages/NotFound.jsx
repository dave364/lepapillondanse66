import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t, i18n } = useTranslation()
  return (
    <section className="block sky block--short">
      <h1 className="block__title">{t('notFound.title')}</h1>
      <p className="center">
        <Link to={`/${i18n.language}`} className="btn-gold">{t('notFound.back')}</Link>
      </p>
    </section>
  )
}
