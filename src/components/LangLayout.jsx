import { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { LANGUAGES, DEFAULT_LANG, getDir, isSupported } from '../i18n'
import { SITE } from '../config/site'
import Header from './Header'
import Footer from './Footer'

export default function LangLayout() {
  const { lang } = useParams()
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()

  const valid = isSupported(lang)

  useEffect(() => {
    if (!valid) return
    if (i18n.language !== lang) i18n.changeLanguage(lang)
    document.documentElement.lang = lang
    document.documentElement.dir = getDir(lang)
  }, [lang, valid, i18n])

  // Vuelve arriba al cambiar de página
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (!valid) return <Navigate to={`/${DEFAULT_LANG}`} replace />
  if (i18n.language !== lang) i18n.changeLanguage(lang)

  const rest = pathname.split('/').slice(2).join('/')
  const urlFor = (code) => `${SITE.url}/${code}${rest ? `/${rest}` : ''}`

  return (
    <>
      <Helmet>
        <html lang={lang} dir={getDir(lang)} />
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <meta property="og:title" content={t('meta.title')} />
        <meta property="og:description" content={t('meta.description')} />
        <meta property="og:locale" content={lang} />
        <link rel="canonical" href={urlFor(lang)} />
        {LANGUAGES.map((l) => (
          <link key={l.code} rel="alternate" hrefLang={l.code} href={urlFor(l.code)} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={urlFor(DEFAULT_LANG)} />
      </Helmet>
      <a href="#main" className="skip-link">↓</a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
