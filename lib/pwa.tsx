'use client'

import { useEffect } from 'react'

export function PWAInstaller() {
  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope)
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error)
        })
    }
  }, [])

  return null
}
