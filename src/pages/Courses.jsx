import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CourseList from '../components/CourseList'
import OrnateButton from '../components/OrnateButton'
import InPerson from '../components/InPerson'
import BookLink from '../components/BookLink'

export default function Courses() {
  const { t, i18n } = useTranslation()
  return (
    <section className="block sky">
      <h1 className="block__title">{t('courses.title')}</h1>
      <p className="info">{t('courses.intro')}</p>
      <InPerson />
      <CourseList />
      <p className="center">
        <BookLink>{t('closingCta.book')}</BookLink>
      </p>
      <p className="center">
        <OrnateButton as={Link} size="sm" to={`/${i18n.language}/soins`}>{t('services.discover')}</OrnateButton>
      </p>
    </section>
  )
}
