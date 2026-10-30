import { useTranslation } from 'react-i18next'
import { SITE } from '../config/site'

export default function Contact() {
  const { t } = useTranslation()
  return (
    <section className="block sky">
      <h1 className="block__title">{t('contact.title')}</h1>
      <div className="panel">
        <dl className="contact">
          <div><dt>{t('contact.addressTitle')}</dt><dd>{SITE.studio.name}</dd><dd dir="ltr">{SITE.studio.street}, {SITE.studio.city}</dd></div>
          <div><dt>{t('contact.phoneTitle')}</dt><dd><a href={SITE.phoneHref} dir="ltr">{SITE.phone}</a></dd></div>
          <div><dt>{t('contact.emailTitle')}</dt><dd><a href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>
        </dl>
        <iframe
          className="map"
          title={SITE.studio.name}
          src={SITE.studio.mapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  )
}
