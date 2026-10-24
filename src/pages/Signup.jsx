import { useTranslation } from 'react-i18next'
import { SITE } from '../config/site'
import SignupForm from '../components/SignupForm'

export default function Signup() {
  const { t } = useTranslation()
  return (
    <section className="section page">
      <div className="container signup">
        <div className="prose">
          <h1>{t('signup.title')}</h1>
          <p className="page__lead">{t('signup.intro')}</p>
          <a href={SITE.signupPdf} className="btn btn--ghost-dark" download>
            {t('signup.pdf')}
          </a>
        </div>
        <div className="signup__form">
          <h2>{t('signup.formTitle')}</h2>
          <SignupForm />
        </div>
      </div>
    </section>
  )
}
