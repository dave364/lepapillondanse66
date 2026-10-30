import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BOOKING_ENABLED, bookingHref } from '../config/booking'
import OrnateButton from './OrnateButton'

// Botón "Réserver": va a la página de reservas propia o, si todavía no está
// configurada, a Setmore (en otra pestaña).
// serviceKey: 'tarot', 'call'… o nada para la lista de todos los servicios.
// plain: link de texto en lugar de botón.
export default function BookLink({ serviceKey, plain = false, children, ...props }) {
  const { i18n } = useTranslation()
  const href = bookingHref(i18n.language, serviceKey)
  const linkProps = BOOKING_ENABLED
    ? { as: Link, to: href }
    : { as: 'a', href, target: '_blank', rel: 'noopener' }

  if (plain) {
    const { as: Tag, ...rest } = linkProps
    return <Tag {...rest} {...props}>{children}</Tag>
  }
  return <OrnateButton {...linkProps} {...props}>{children}</OrnateButton>
}
