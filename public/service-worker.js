// Service Worker for Aménagement Monzon PWA
const CACHE_NAME = 'amenagement-monzon-v1'
const ASSETS_TO_CACHE = [
  '/',
  '/offline.html',
  '/app/layout.tsx',
  '/app/dashboard/page.tsx',
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching assets')
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Silently fail if some assets can't be cached
        console.log('[Service Worker] Some assets could not be cached')
      })
    })
  )
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - Network first, then cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip API calls (let them fail without cache)
  if (event.request.url.includes('/api/')) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // Return cached version or offline page
        return caches
          .match(event.request)
          .then((response) => {
            return (
              response || caches.match('/offline.html')
            )
          })
      })
  )
})

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: data.tag || 'notification',
    requireInteraction: data.requireInteraction || false,
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (let client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus()
          }
        }
        // Open app if not already open
        if (clients.openWindow) {
          return clients.openWindow('/')
        }
      })
  )
})
