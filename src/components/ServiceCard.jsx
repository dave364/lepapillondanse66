import { useTranslation } from 'react-i18next'
import BookLink from './BookLink'
import { useLiveService } from '../lib/liveServices'

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
export function ServiceMeta({ service: base }) {
  const { t } = useTranslation()
  const price = usePrice()
  const duration = useDuration()
  // Con datos del panel si los hay (el sitio de reservas los pasa ya resueltos)
  const live = useLiveService(base?.key ? base : null)
  const service = base?.key ? live : base
  if (!service) return null
  return (
    <div className="service-meta">
      <span className="service-meta__main">
        {service.sessions > 1 && `${service.sessions} × `}{duration(service.minutes)} · <strong>{price(service.price)}</strong>
      </span>
      {service.online && <span className="tag">{t('book.online')}</span>}
      {service.freeTrial && <span className="tag tag--gem">{t('book.freeTrial')}</span>}
    </div>
  )
}

// Botón Réserver. El link de pago por PayPal (con el monto) le llega a la
// clienta en el email de confirmación, después de reservar.
export function ServiceActions({ service }) {
  const { t } = useTranslation()
  if (!useLiveService(service)) return null // desactivado en el panel
  return (
    <div className="service-actions">
      <BookLink serviceKey={service.key} size="sm" className="ornate--book">
        {t('book.cta')}
      </BookLink>
    </div>
  )
}

export default function ServiceCard({ service }) {
  const { t } = useTranslation()
  const active = useLiveService(service)
  const item = t(`services.items.${service.key}`, { returnObjects: true })
  if (!active) return null // desactivado en el panel
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
