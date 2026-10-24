import { useTranslation } from 'react-i18next'
import { IMAGES } from '../config/site'
import ArchImage from './ArchImage'

export default function CourseList() {
  const { t } = useTranslation()
  const items = t('courses.items', { returnObjects: true })

  return (
    <ul className="courses">
      {items.map((c, i) => (
        <li key={c.title} className="course">
          <ArchImage src={IMAGES.courses[i]} alt={c.title} className="course__img" />
          <div className="course__body">
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
