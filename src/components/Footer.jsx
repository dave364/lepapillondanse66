import { useTranslation } from 'react-i18next'
import { SITE } from '../config/site'
import Butterfly from './Butterfly'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Butterfly className="footer__mark" />
          <p className="footer__name">{SITE.name}</p>
          <p>{t('footer.tagline')}</p>
        </div>

        <address className="footer__contact">
          <p>{t('contact.address')}</p>
          <p><a href={SITE.phoneHref} dir="ltr">{SITE.phone}</a></p>
          <p><a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
        </address>

        <ul className="footer__social">
          <li><a href={SITE.social.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
          <li><a href={SITE.social.facebook} target="_blank" rel="noreferrer">Facebook</a></li>
          <li><a href={SITE.social.youtube} target="_blank" rel="noreferrer">YouTube</a></li>
        </ul>
      </div>
      <p className="footer__legal">© {year} {SITE.name}. {t('footer.rights')}</p>
    </footer>
  )
}
