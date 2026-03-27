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

const defaultT = (key: string) => getTranslation(key, 'fr')

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('am-language') as Language | null
      if (saved && ['en', 'fr', 'es'].includes(saved)) {
        setLanguageState(saved)
      }
    } catch {
      // ignore
    }
    setMounted(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('am-language', lang)
    } catch {
      // ignore
    }
  }

  const t = useCallback((key: string): string => {
    return getTranslation(key, language)
  }, [language])

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: 'fr', setLanguage, t: defaultT }}>
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
