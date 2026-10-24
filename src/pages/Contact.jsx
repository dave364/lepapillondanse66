import { useTranslation } from 'react-i18next'
import { SITE } from '../config/site'

export default function Contact() {
  const { t } = useTranslation()
  return (
    <section className="block sky">
      <h1 className="block__title">{t('contact.title')}</h1>
      <div className="panel">
        <dl className="contact">
          <div><dt>{t('contact.addressTitle')}</dt><dd>{t('contact.address')}</dd></div>
          <div><dt>{t('contact.phoneTitle')}</dt><dd><a href={SITE.phoneHref} dir="ltr">{SITE.phone}</a></dd></div>
          <div><dt>{t('contact.emailTitle')}</dt><dd><a href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>
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
