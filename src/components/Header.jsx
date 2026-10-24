import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import Butterfly from './Butterfly'

export default function Header() {
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
    { to: `/${lang}/cours`, label: t('nav.courses') },
    { to: `/${lang}/en-ligne`, label: t('nav.online') },
    { to: `/${lang}/contact`, label: t('nav.contact') },
  ]

  return (
    <header className="header">
      <div className="header__inner">
        <Link to={`/${lang}`} className="brand">
          <Butterfly className="brand__mark" />
          <span>Le Papillon Danse <span className="brand__num">66</span></span>
        </Link>

        <button
          className="header__toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="visually-hidden">{open ? t('nav.closeMenu') : t('nav.openMenu')}</span>
          <span className="burger" data-open={open} aria-hidden="true" />
        </button>

        <nav id="main-nav" className="nav" data-open={open}>
          <ul>
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end}>{l.label}</NavLink>
              </li>
            ))}
          </ul>
          <div className="nav__actions">
            <LanguageSwitcher />
            <Link to={`/${lang}/inscription`} className="btn btn--gold btn--small">
              {t('nav.signup')}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
