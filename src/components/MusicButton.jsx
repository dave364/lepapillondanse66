import { useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import OrnateButton from './OrnateButton'
import { isAvailable, isPlaying, pauseMusic, playMusic, subscribe } from '../lib/music'

// Botón para pausar o volver a poner la música
export default function MusicButton() {
  const { t } = useTranslation()
  const playing = useSyncExternalStore(subscribe, isPlaying, () => false)
  const available = useSyncExternalStore(subscribe, isAvailable, () => true)

  if (!available) return null

  return (
    <OrnateButton
      size="sm"
      className="music"
      onClick={() => (playing ? pauseMusic() : playMusic())}
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
    </OrnateButton>
  )
}
