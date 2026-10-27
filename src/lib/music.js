// Reproductor de música único para todo el sitio.
// Lo usan la pantalla de bienvenida (para arrancar) y el botón "Musique".
import { SITE } from '../config/site'

// Volumen final (0 a 1). Bajo para no molestar.
export const VOLUME = 0.15
// Duración de la entrada suave, en milisegundos
const FADE_MS = 2500

let audio = null
let available = true
const listeners = new Set()

const notify = () => listeners.forEach((fn) => fn())

function getAudio() {
  if (audio) return audio
  audio = new Audio(SITE.music)
  audio.loop = true
  audio.volume = 0
  audio.preload = 'auto'
  audio.addEventListener('error', () => {
    available = false
    notify()
  })
  audio.addEventListener('play', notify)
  audio.addEventListener('pause', notify)
  return audio
}

function fadeIn(a) {
  a.volume = 0
  const start = performance.now()
  const step = (now) => {
    const progress = Math.min((now - start) / FADE_MS, 1)
    a.volume = VOLUME * progress
    if (progress < 1 && !a.paused) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export async function playMusic() {
  const a = getAudio()
  try {
    await a.play()
    fadeIn(a)
  } catch {
    /* el navegador lo bloqueó o falta el archivo */
  }
}

export function pauseMusic() {
  audio?.pause()
}

// Para useSyncExternalStore
export const subscribe = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
export const isPlaying = () => !!audio && !audio.paused
export const isAvailable = () => available
