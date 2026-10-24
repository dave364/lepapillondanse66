import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fr from './locales/fr.json'
import es from './locales/es.json'
import en from './locales/en.json'
import ar from './locales/ar.json'

// Idiomas disponibles. Para sumar uno nuevo: crear su JSON y agregarlo acá.
export const LANGUAGES = [
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
]

export const DEFAULT_LANG = 'fr'

export const isSupported = (code) => LANGUAGES.some((l) => l.code === code)

export const getDir = (code) =>
  LANGUAGES.find((l) => l.code === code)?.dir ?? 'ltr'

// Idioma del navegador en la primera visita (solo si lo soportamos)
export const detectLanguage = () => {
  try {
    const saved = localStorage.getItem('lang')
    if (saved && isSupported(saved)) return saved
  } catch {
    /* localStorage no disponible */
  }
  const browser = (navigator.languages || [navigator.language])
    .map((l) => l?.slice(0, 2).toLowerCase())
    .find(isSupported)
  return browser || DEFAULT_LANG
}

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    es: { translation: es },
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: DEFAULT_LANG,
  fallbackLng: DEFAULT_LANG,
  interpolation: { escapeValue: false },
})

export default i18n
