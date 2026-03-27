import en from './en.json'
import fr from './fr.json'
import es from './es.json'

export type Language = 'en' | 'fr' | 'es'

export const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'fr', label: 'Français', flag: 'FR' },
  { code: 'es', label: 'Español', flag: 'ES' },
]

const translations: Record<Language, Record<string, unknown>> = { en, fr, es }

/**
 * Get a nested translation value using dot notation.
 * e.g. t("nav.home", "en") => "Home"
 * Falls back to English, then returns the key if missing.
 */
export function getTranslation(key: string, language: Language): string {
  const dict = translations[language] as Record<string, unknown>
  const fallback = translations['en'] as Record<string, unknown>

  const resolve = (obj: Record<string, unknown>, parts: string[]): string => {
    const [head, ...rest] = parts
    const value = obj[head]
    if (rest.length === 0) return typeof value === 'string' ? value : key
    if (typeof value === 'object' && value !== null) {
      return resolve(value as Record<string, unknown>, rest)
    }
    return key
  }

  const parts = key.split('.')
  const result = resolve(dict, parts)

  // Fallback to English if result is just the key (missing translation)
  if (result === key && language !== 'en') {
    return resolve(fallback, parts)
  }

  return result
}
