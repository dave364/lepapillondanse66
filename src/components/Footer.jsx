import { useTranslation } from 'react-i18next'
import { SITE, IMAGES } from '../config/site'

const Icon = {
  facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#1877f2" />
      <path d="M13.4 19v-6h2l.3-2.4h-2.3V9.1c0-.7.2-1.2 1.2-1.2h1.2V5.8c-.2 0-1-.1-1.8-.1-1.8 0-3 1.1-3 3.1v1.8H9V13h2v6z" fill="#fff" /></svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#feda75" /><stop offset=".4" stopColor="#d62976" /><stop offset="1" stopColor="#4f5bd5" /></linearGradient></defs>
      <circle cx="12" cy="12" r="12" fill="url(#ig)" />
      <rect x="6.5" y="6.5" width="11" height="11" rx="3.2" fill="none" stroke="#fff" strokeWidth="1.5" /><circle cx="12" cy="12" r="2.6" fill="none" stroke="#fff" strokeWidth="1.5" /><circle cx="15.3" cy="8.7" r=".8" fill="#fff" /></svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#ff0000" /><path d="M10 8.5v7l6-3.5z" fill="#fff" /></svg>
  ),
}

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="footer sky">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src={IMAGES.logo} alt="" className="footer__logo" loading="lazy" />
          <p className="footer__name">{SITE.name}<br /><a href={SITE.phoneHref} dir="ltr">{SITE.phone}</a></p>
          <p><a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
        </div>
        <div className="footer__end">
          <ul className="footer__social">
            {Object.entries(Icon).map(([k, svg]) => (
              <li key={k}>
                <a href={SITE.social[k]} target="_blank" rel="noreferrer" aria-label={k}>{svg}</a>
              </li>
            ))}
          </ul>
          <p>{t('contact.address')}</p>
        </div>
      </div>
      <p className="footer__legal">© {year} {SITE.name}. {t('footer.rights')}</p>
    </footer>
  )
}
