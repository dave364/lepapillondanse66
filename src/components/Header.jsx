import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IMAGES } from '../config/site'
import { BOOKING } from '../config/booking'
import LanguageSwitcher from './LanguageSwitcher'
import MusicButton from './MusicButton'
import OrnateButton from './OrnateButton'

// Cabecera igual a la del sitio original: logo centrado, título con las
// disciplinas y menú de botones. En la home se muestra completa; en las
// demás páginas, compacta.
export default function Header({ full = false }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Cierra el menú móvil al cambiar de página
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const links = [
    { to: `/${lang}`, label: t('nav.home'), end: true },
    { to: `/${lang}/sully`, label: t('nav.sully') },
    { to: `/${lang}/inscription`, label: t('nav.signupOpen') },
    { to: `/${lang}/en-ligne`, label: t('nav.online') },
    { to: `/${lang}/cours`, label: t('nav.courses') },
    { to: `/${lang}/soins`, label: t('nav.services') },
    { to: `/${lang}/contact`, label: t('nav.location') },
  ]
  const lines = t('hero.lines', { returnObjects: true })

  return (
    <header className={`header sky ${full ? 'header--full' : ''} ${open ? 'header--menu-open' : ''}`}>
      <div className="header__tools">
        <MusicButton />
        <LanguageSwitcher />
      </div>

      <Link to={`/${lang}`} className="header__logo">
        <img src={IMAGES.logo} alt="Le Papillon Danse" width="591" height="751" />
      </Link>

      {full && (
        <h1 className="header__title">
          {lines.map((l) => <span key={l}>{l}</span>)}
        </h1>
      )}

      <OrnateButton
        size="sm"
        className="header__toggle"
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="burger" data-open={open} aria-hidden="true" />
        {open ? t('nav.closeMenu') : t('nav.openMenu')}
      </OrnateButton>

      <nav id="main-nav" className="nav" data-open={open}>
        <ul>
          {links.map((l) => (
            <li key={l.to}>
              <OrnateButton as={NavLink} size="sm" to={l.to} end={l.end}>{l.label}</OrnateButton>
            </li>
          ))}
          <li>
            <OrnateButton as="a" size="sm" className="ornate--book" href={BOOKING.all} target="_blank" rel="noopener">
              {t('nav.book')}
            </OrnateButton>
          </li>
        </ul>
      </nav>
    </header>
  )
}
