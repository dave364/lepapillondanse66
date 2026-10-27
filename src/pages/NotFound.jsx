import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import OrnateButton from '../components/OrnateButton'

export default function NotFound() {
  const { t, i18n } = useTranslation()
  return (
    <section className="block sky block--short">
      <h1 className="block__title">{t('notFound.title')}</h1>
      <p className="center">
        <OrnateButton as={Link} to={`/${i18n.language}`}>{t('notFound.back')}</OrnateButton>
      </p>
    </section>
  )
}
