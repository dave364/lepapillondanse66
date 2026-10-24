import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CourseList from '../components/CourseList'

export default function Courses() {
  const { t, i18n } = useTranslation()
  return (
    <section className="block sky">
      <h1 className="block__title">{t('courses.title')}</h1>
      <p className="info">{t('courses.intro')}</p>
      <CourseList />
      <p className="center">
        <Link to={`/${i18n.language}/inscription`} className="btn-gold">{t('closing.cta')}</Link>
      </p>
    </section>
  )
}
