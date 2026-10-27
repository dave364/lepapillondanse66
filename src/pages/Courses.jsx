import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CourseList from '../components/CourseList'
import OrnateButton from '../components/OrnateButton'

export default function Courses() {
  const { t, i18n } = useTranslation()
  return (
    <section className="block sky">
      <h1 className="block__title">{t('courses.title')}</h1>
      <p className="info">{t('courses.intro')}</p>
      <CourseList />
      <p className="center">
        <OrnateButton as={Link} to={`/${i18n.language}/inscription`}>{t('closing.cta')}</OrnateButton>
      </p>
    </section>
  )
}
