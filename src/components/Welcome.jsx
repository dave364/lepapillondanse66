import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IMAGES } from '../config/site'
import { playMusic } from '../lib/music'

// Pantalla de bienvenida con el logo. Al tocar "Entrer" se abre la página
// y arranca la música (ese toque es el permiso que piden los navegadores).
// El contenido del sitio se carga igual por debajo, así Google lo lee.
export default function Welcome() {
  const { t } = useTranslation()
  const [state, setState] = useState('open') // open | closing | closed
  const button = useRef(null)

  useEffect(() => {
    if (state !== 'open') return
    document.body.style.overflow = 'hidden'
    button.current?.focus()
    return () => {
      document.body.style.overflow = ''
    }
  }, [state])

  if (state === 'closed') return null

  const enter = (withMusic) => {
    if (withMusic) playMusic()
    setState('closing')
    setTimeout(() => setState('closed'), 700)
  }

  return (
    <div
      className={`welcome sky ${state === 'closing' ? 'welcome--closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Le Papillon Danse 66"
      onKeyDown={(e) => e.key === 'Escape' && enter(false)}
    >
      <img src={IMAGES.logo} alt="Le Papillon Danse" className="welcome__logo" width="591" height="751" />
      <button ref={button} className="btn-gold welcome__enter" onClick={() => enter(true)}>
        {t('welcome.enter')}
      </button>
      <button className="welcome__silent" onClick={() => enter(false)}>
        {t('welcome.enterSilent')}
      </button>
    </div>
  )
}
