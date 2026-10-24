import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SITE } from '../config/site'

// Envía los datos por email usando Formspree (sin backend propio)
export default function SignupForm() {
  const { t } = useTranslation()
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const courses = t('courses.items', { returnObjects: true })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!SITE.formspreeId) return setStatus('notConfigured')
    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${SITE.formspreeId}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.currentTarget),
      })
      if (!res.ok) throw new Error(res.statusText)
      e.target.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form__row">
        <label>
          {t('form.name')}
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          {t('form.email')}
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>
      <div className="form__row">
        <label>
          {t('form.phone')}
          <input name="phone" type="tel" autoComplete="tel" dir="ltr" />
        </label>
        <label>
          {t('form.course')}
          <select name="course" defaultValue="">
            <option value="" disabled>{t('form.coursePlaceholder')}</option>
            {courses.map((c) => (
              <option key={c.title}>{c.title}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        {t('form.message')}
        <textarea name="message" rows="5" />
      </label>

      <button className="btn btn--plum" disabled={status === 'sending'}>
        {status === 'sending' ? t('form.sending') : t('form.submit')}
      </button>

      {['success', 'error', 'notConfigured'].includes(status) && (
        <p className={`form__status form__status--${status}`} role="status">
          {t(`form.${status}`)}{' '}
          {status !== 'success' && <a href={`mailto:${SITE.email}`}>{SITE.email}</a>}
        </p>
      )}
    </form>
  )
}
