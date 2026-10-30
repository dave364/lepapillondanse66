import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IMAGES } from '../config/site'
import { COURSE_SERVICES, findService } from '../config/booking'
import SafeImg from './SafeImg'
import OrnateButton from './OrnateButton'
import { ServiceActions, ServiceMeta } from './ServiceCard'

export default function CourseList() {
  const { t, i18n } = useTranslation()
  const items = t('courses.items', { returnObjects: true })

  return (
    <ul className="courses">
      {items.map((c, i) => {
        const service = findService(COURSE_SERVICES[i])
        return (
          <li key={c.title} className="course">
            <h3 className="course__title">{c.title}</h3>
            <div className="course__body">
              <p className="course__text">{c.text}</p>
              {service ? (
                <>
                  <ServiceMeta service={service} />
                  <ServiceActions service={service} />
                </>
              ) : (
                <div className="service-actions">
                  <OrnateButton as={Link} size="sm" to={`/${i18n.language}/contact`}>
                    {t('atelierCta')}
                  </OrnateButton>
                </div>
              )}
            </div>
            {/* Foto redonda con borde dorado, como en el sitio original */}
            <div className="round">
              <SafeImg src={IMAGES.courses[i]} alt={c.title} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
