/**
 * In-memory translation cache with TTL
 */
class TranslationCache {
  private cache = new Map<string, { data: any; expires: number }>()
  private ttl = 1000 * 60 * 60 // 1 hour default

  set(key: string, value: any, ttl = this.ttl): void {
    this.cache.set(key, {
      data: value,
      expires: Date.now() + ttl,
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)

    if (!item) return null

    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

export const translationCache = new TranslationCache()

/**
 * Memoized translation loader with caching
 */
export async function loadTranslationsCached(language: 'en' | 'fr' | 'es') {
  const cacheKey = `translations:${language}`
  const cached = translationCache.get(cacheKey)

  if (cached) {
    return cached
  }

  try {
    const translations = await import(`@/lib/translations/${language}.json`).then(
      (mod) => mod.default
    )
    translationCache.set(cacheKey, translations)
    return translations
  } catch (error) {
    console.error(`Failed to load ${language} translations, falling back to English`)
    const fallback = await import(`@/lib/translations/en.json`).then(
      (mod) => mod.default
    )
    return fallback
  }
}

/**
 * Batch load multiple language translations
 */
export async function preloadTranslations(languages: Array<'en' | 'fr' | 'es'>) {
  return Promise.all(languages.map((lang) => loadTranslationsCached(lang)))
}
