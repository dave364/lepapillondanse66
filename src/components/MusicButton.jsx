import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SITE } from '../config/site'

// Música del sitio original. No arranca sola: el visitante decide.
export default function MusicButton() {
  const { t } = useTranslation()
  const audio = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState(true)

  useEffect(() => {
    const a = new Audio(SITE.music)
    a.loop = true
    a.volume = 0.5
    a.addEventListener('error', () => setAvailable(false))
    audio.current = a
    return () => a.pause()
  }, [])

  if (!available) return null

  const toggle = async () => {
    const a = audio.current
    if (!a) return
    if (playing) {
      a.pause()
      setPlaying(false)
    } else {
      try {
        await a.play()
        setPlaying(true)
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
