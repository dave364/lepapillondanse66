import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../i18n'

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const change = (e) => {
    const next = e.target.value
    try {
      localStorage.setItem('lang', next)
    } catch {
      /* sin almacenamiento */
    }
    // Reemplaza el prefijo de idioma y mantiene la misma página
    const rest = pathname.split('/').slice(2).join('/')
    navigate(`/${next}${rest ? `/${rest}` : ''}`)
  }

  return (
    <label className="lang">
      <span className="visually-hidden">{t('nav.language')}</span>
      <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      <select value={i18n.language} onChange={change}>
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} lang={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  )
}
