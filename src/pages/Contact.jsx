import { useTranslation } from 'react-i18next'
import { SITE } from '../config/site'

export default function Contact() {
  const { t } = useTranslation()
  return (
    <section className="section page">
      <div className="container">
        <h1>{t('contact.title')}</h1>
        <dl className="contact">
          <div>
            <dt>{t('contact.addressTitle')}</dt>
            <dd>{t('contact.address')}</dd>
          </div>
          <div>
            <dt>{t('contact.phoneTitle')}</dt>
            <dd><a href={SITE.phoneHref} dir="ltr">{SITE.phone}</a></dd>
          </div>
          <div>
            <dt>{t('contact.emailTitle')}</dt>
            <dd><a href={`mailto:${SITE.email}`}>{SITE.email}</a></dd>
          </div>
          <div>
            <dt>{t('contact.socialTitle')}</dt>
            <dd className="contact__social">
              <a href={SITE.social.instagram} target="_blank" rel="noreferrer">Instagram</a>
              <a href={SITE.social.facebook} target="_blank" rel="noreferrer">Facebook</a>
              <a href={SITE.social.youtube} target="_blank" rel="noreferrer">YouTube</a>
            </dd>
          </div>
        </dl>
        <iframe
          className="map"
          title={t('contact.address')}
          src="https://www.google.com/maps?q=Perpignan%2066000%20France&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  )
}
