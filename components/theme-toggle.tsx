'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-10 h-10" />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-300"
      style={{
        borderColor: `color-mix(in srgb, var(--foreground) 20%, transparent)`,
        backgroundColor: `color-mix(in srgb, var(--foreground) 5%, transparent)`,
      }}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 transition-all duration-300" style={{ color: 'var(--primary)' }} />
      ) : (
        <Moon className="w-5 h-5 transition-all duration-300" style={{ color: 'var(--primary)' }} />
      )}
    </button>
  )
}
