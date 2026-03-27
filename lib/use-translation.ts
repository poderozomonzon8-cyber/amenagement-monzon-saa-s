'use client'

import { useLanguage } from '@/lib/i18n-context'
import { getTranslation } from '@/lib/translations'

/**
 * Hook to get translation function
 * Usage: const { t } = useTranslation()
 *        t("nav.home") => "Home" or "Accueil" based on current language
 */
export function useTranslation() {
  const { language } = useLanguage()

  const t = (key: string): string => {
    return getTranslation(key, language)
  }

  return { t, language }
}
