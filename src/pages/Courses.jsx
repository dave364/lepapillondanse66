import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CourseList from '../components/CourseList'

export default function Courses() {
  const { t, i18n } = useTranslation()
  return (
    <section className="section page">
      <div className="container">
        <h1>{t('courses.title')}</h1>
        <p className="section__intro">{t('courses.intro')}</p>
        <CourseList />
        <p className="page__cta">
          <Link to={`/${i18n.language}/inscription`} className="btn btn--plum">{t('nav.signup')}</Link>
        </p>
      </div>
    </section>
  )
}
