import { useTranslation } from 'react-i18next'
import OrnateButton from './OrnateButton'

// Precio con el formato del idioma (45 €, €45, ٤٥ €…)
export function usePrice() {
  const { t, i18n } = useTranslation()
  return (amount) =>
    amount
      ? new Intl.NumberFormat(i18n.language, {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 0,
        }).format(amount)
      : t('book.free')
}

export function useDuration() {
  const { t } = useTranslation()
  return (minutes) =>
    minutes >= 60 && minutes % 60 === 0
      ? `${minutes / 60} ${t('book.hour')}`
      : `${minutes} ${t('book.min')}`
}

// Duración · precio + etiquetas (En ligne, 1er cours offert)
export function ServiceMeta({ service }) {
  const { t } = useTranslation()
  const price = usePrice()
  const duration = useDuration()
  return (
    <div className="service-meta">
      <span className="service-meta__main">
        {duration(service.minutes)} · <strong>{price(service.price)}</strong>
      </span>
      {service.online && <span className="tag">{t('book.online')}</span>}
      {service.freeTrial && <span className="tag tag--gem">{t('book.freeTrial')}</span>}
    </div>
  )
}

// Botón Réserver (Setmore). El link de pago por PayPal le llega a la
// clienta en el email de confirmación de Setmore, después de reservar.
export function ServiceActions({ service }) {
  const { t } = useTranslation()
  return (
    <div className="service-actions">
      <OrnateButton as="a" size="sm" className="ornate--book" href={service.url} target="_blank" rel="noopener">
        {t('book.cta')}
      </OrnateButton>
    </div>
  )
}

export default function ServiceCard({ service }) {
  const { t } = useTranslation()
  const item = t(`services.items.${service.key}`, { returnObjects: true })
  return (
    <article className="service">
      <h3 className="service__title">{item.title}</h3>
      {item.subtitle && <p className="service__subtitle">{item.subtitle}</p>}
      <ServiceMeta service={service} />
      <p className="service__text">{item.text}</p>
      <ServiceActions service={service} />
    </article>
  )
}
