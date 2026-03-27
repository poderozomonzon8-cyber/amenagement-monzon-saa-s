'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getTranslation } from './translations/index'

export type Language = 'en' | 'fr' | 'es'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('am-language') as Language | null
      if (saved && ['en', 'fr', 'es'].includes(saved)) {
        setLanguageState(saved)
      }
    } catch {
      // localStorage not available
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('am-language', lang)
    } catch {
      // localStorage not available
    }
  }

  const t = useCallback((key: string): string => {
    return getTranslation(key, language)
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  // Return fallback when context not available (SSR or outside provider)
  if (!context) {
    return { 
      language: 'fr' as Language, 
      setLanguage: () => {}, 
      t: (key: string) => getTranslation(key, 'fr') 
    }
  }
  return context
}
