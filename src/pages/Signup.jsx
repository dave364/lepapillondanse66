import { useTranslation } from 'react-i18next'
import { SITE } from '../config/site'
import SignupForm from '../components/SignupForm'

export default function Signup() {
  const { t } = useTranslation()
  return (
    <section className="block sky">
      <h1 className="block__title">{t('signup.title')}</h1>
      <p className="info">{t('signup.intro')}</p>
      <p className="center">
        <a href={SITE.signupPdf} className="btn-gold" download>{t('signup.pdf')}</a>
      </p>
      <div className="panel">
        <h2 className="panel__title">{t('signup.formTitle')}</h2>
        <SignupForm />
      </div>
    </section>
  )
}
