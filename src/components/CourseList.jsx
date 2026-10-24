import { useTranslation } from 'react-i18next'
import { IMAGES } from '../config/site'
import SafeImg from './SafeImg'

export default function CourseList() {
  const { t } = useTranslation()
  const items = t('courses.items', { returnObjects: true })

  return (
    <ul className="courses">
      {items.map((c, i) => (
        <li key={c.title} className="course">
          <h3 className="course__title">{c.title}</h3>
          <p className="course__text">{c.text}</p>
          {/* Foto redonda con borde dorado, como en el sitio original */}
          <div className="round">
            <SafeImg src={IMAGES.courses[i]} alt={c.title} />
          </div>
        </li>
      ))}
    </ul>
  )
}
