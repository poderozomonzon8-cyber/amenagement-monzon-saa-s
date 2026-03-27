'use client'

import { useLanguage } from '@/lib/i18n-context'
import { languages, type Language } from '@/lib/translations/index'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface LanguageSelectorProps {
  /** 'header' shows a dropdown; 'mobile' shows inline pills */
  variant?: 'header' | 'mobile'
}

export function LanguageSelector({ variant = 'header' }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!mounted) return <div className="w-20 h-9" />

  const current = languages.find((l) => l.code === language) ?? languages[0]

  // Mobile variant: simple inline pill buttons
  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-1.5">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as Language)}
            className="px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors"
            style={
              language === lang.code
                ? { backgroundColor: '#C9A84C', color: '#000' }
                : { border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }
            }
            aria-label={`Switch to ${lang.label}`}
          >
            {lang.flag}
          </button>
        ))}
      </div>
    )
  }

  // Header variant: compact dropdown
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold tracking-wide border transition-all duration-200"
        style={{
          borderColor: 'color-mix(in srgb, var(--foreground) 18%, transparent)',
          color: 'var(--primary)',
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
      >
        {current.flag}
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: 'var(--muted-foreground)' }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-32 z-[60] border py-1 shadow-2xl"
          style={{
            backgroundColor: 'var(--popover)',
            borderColor: 'color-mix(in srgb, var(--foreground) 15%, transparent)',
          }}
          role="listbox"
        >
          {languages.map((lang) => {
            const isActive = language === lang.code
            return (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code as Language); setOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors text-left"
                style={{
                  backgroundColor: isActive
                    ? 'color-mix(in srgb, var(--primary) 12%, transparent)'
                    : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                }}
                role="option"
                aria-selected={isActive}
              >
                <span className="text-xs font-bold w-5 shrink-0">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
