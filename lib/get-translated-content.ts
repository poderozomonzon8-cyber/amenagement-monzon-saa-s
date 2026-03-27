/**
 * Get translated content with fallback to English or French
 */
export function getTranslatedField<T extends Record<string, any>>(
  record: T,
  fieldName: keyof T,
  language: 'en' | 'fr' | 'es'
): any {
  if (language === 'fr') {
    // French is stored directly without suffix
    return record[fieldName]
  }

  // For English and Spanish, look for the suffixed versions
  const suffixedKey = `${String(fieldName)}_${language}` as keyof T
  const translatedValue = record[suffixedKey]

  // Return translated if available, otherwise fall back to French
  return translatedValue || record[fieldName]
}

/**
 * Build SQL select clause for multilingual fields
 */
export function buildMultilingualSelect(
  language: 'en' | 'fr' | 'es',
  fields: Record<string, string>
): Record<string, string> {
  const select: Record<string, string> = {}

  Object.entries(fields).forEach(([alias, column]) => {
    if (language === 'fr') {
      // French uses the base column
      select[alias] = column
    } else {
      // English and Spanish try the suffixed version first
      select[alias] = `COALESCE(${column}_${language}, ${column}) as ${alias}`
    }
  })

  return select
}

/**
 * Get language from user preference or headers
 */
export function getLanguageFromPreference(
  userLanguage?: string | null,
  headerLanguage?: string | null
): 'en' | 'fr' | 'es' {
  const preference = userLanguage || headerLanguage || 'en'

  if (preference.startsWith('fr')) return 'fr'
  if (preference.startsWith('es')) return 'es'
  return 'en'
}
