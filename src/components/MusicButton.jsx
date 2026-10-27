import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SITE } from '../config/site'

// Volumen final de la música (0 a 1). Bajo para no molestar.
const VOLUME = 0.15
// Duración de la entrada suave, en milisegundos
const FADE_MS = 2500
// Si el visitante pausó la música, no la volvemos a arrancar en esta visita
const PAUSED_KEY = 'music-paused'

const wasPausedByUser = () => {
  try {
    return sessionStorage.getItem(PAUSED_KEY) === '1'
  } catch {
    return false
  }
}
const rememberPaused = (paused) => {
  try {
    if (paused) sessionStorage.setItem(PAUSED_KEY, '1')
    else sessionStorage.removeItem(PAUSED_KEY)
  } catch {
    /* sin almacenamiento */
  }
}

// Sube el volumen de 0 a VOLUME de forma gradual
function fadeIn(audio) {
  audio.volume = 0
  const start = performance.now()
  const step = (now) => {
    const progress = Math.min((now - start) / FADE_MS, 1)
    audio.volume = VOLUME * progress
    if (progress < 1 && !audio.paused) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

// Música del sitio. Intenta sonar al cargar la página; si el navegador
// lo bloquea (pasa casi siempre), arranca con el primer toque o clic.
export default function MusicButton() {
  const { t } = useTranslation()
  const audio = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState(true)

  useEffect(() => {
    const a = new Audio(SITE.music)
    a.loop = true
    a.volume = 0
    a.preload = 'auto'
    audio.current = a

    const onError = () => setAvailable(false)
    a.addEventListener('error', onError)

    const events = ['pointerdown', 'keydown', 'touchend']
    const removeListeners = () =>
      events.forEach((e) => window.removeEventListener(e, startOnInteraction))

    let cancelled = false

    const start = async () => {
      if (cancelled) return false
      try {
        await a.play()
        if (cancelled) {
          a.pause()
          return false
        }
        fadeIn(a)
        setPlaying(true)
        removeListeners()
        return true
      } catch {
        return false
      }
    }

    // Primer toque o clic en cualquier parte de la página
    function startOnInteraction(e) {
      // Si tocaron el botón de música, que lo maneje el botón
      if (e.target.closest?.('.music')) return removeListeners()
      start()
    }

    if (!wasPausedByUser()) {
      start().then((ok) => {
        if (!ok && !cancelled) {
          events.forEach((e) => window.addEventListener(e, startOnInteraction))
        }
      })
    }

    return () => {
      cancelled = true
      removeListeners()
      a.removeEventListener('error', onError)
      a.pause()
    }
  }, [])

  if (!available) return null

  const toggle = async () => {
    const a = audio.current
    if (!a) return
    if (playing) {
      a.pause()
      setPlaying(false)
      rememberPaused(true)
    } else {
      try {
        await a.play()
        fadeIn(a)
        setPlaying(true)
        rememberPaused(false)
      } catch {
        setAvailable(false)
      }
    }
  }

  return (
    <button
      className="music"
      onClick={toggle}
      aria-pressed={playing}
      title={playing ? t('hero.musicPause') : t('hero.musicPlay')}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        {playing ? (
          <path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor" />
        ) : (
          <path d="M8 5l11 7-11 7z" fill="currentColor" />
        )}
      </svg>
      <span>{t('hero.music')}</span>
    </button>
  )
}
