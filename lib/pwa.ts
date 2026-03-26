'use client'

import { useEffect } from 'react'

export function PWAInstaller() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered successfully:', registration)
        })
        .catch((error) => {
          console.log('[PWA] Service Worker registration failed:', error)
        })
    }

    // Listen for install prompt
    let deferredPrompt: any = null

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt = e
      console.log('[PWA] Install prompt available')
    })

    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully')
      deferredPrompt = null
    })

    // Periodically check for updates
    if ('serviceWorker' in navigator) {
      const updateInterval = setInterval(() => {
        navigator.serviceWorker.ready.then((registration) => {
          registration.update()
        })
      }, 60000) // Check every minute

      return () => clearInterval(updateInterval)
    }
  }, [])

  return null // No UI needed
}

// Hook to request notification permission
export function usePushNotifications() {
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.log('[PWA] Notifications not supported')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }

  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('[PWA] Push notifications not supported')
      return null
    }

    const hasPermission = await requestPermission()
    if (!hasPermission) return null

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      console.log('[PWA] Subscribed to push notifications')
      return subscription
    } catch (error) {
      console.error('[PWA] Failed to subscribe to push notifications:', error)
      return null
    }
  }

  return { requestPermission, subscribeToPush }
}
