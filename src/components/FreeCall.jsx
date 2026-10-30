import { useTranslation } from 'react-i18next'
import BookLink from './BookLink'

// Llamada gratuita de 30 min: el primer paso para conocerse
export default function FreeCall() {
  const { t } = useTranslation()
  return (
    <aside className="free-call">
      <h2 className="free-call__title">{t('book.call.title')}</h2>
      <p className="free-call__meta">30 {t('book.min')} · {t('book.free')}</p>
      <p className="free-call__text">{t('book.call.text')}</p>
      <BookLink serviceKey="call">{t('book.call.cta')}</BookLink>
    </aside>
  )
}
