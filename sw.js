const CACHE = 'wirdi-v1'

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(['/', '/index.html']))
  )
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ))
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  )
})

// Daily notification scheduling
self.addEventListener('message', e => {
  if (e.data?.type === 'SCHEDULE_NOTIF') {
    const { time } = e.data // "HH:MM"
    scheduleDaily(time)
  }
})

function scheduleDaily(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const now = new Date()
  const next = new Date()
  next.setHours(h, m, 0, 0)
  if (next <= now) next.setDate(next.getDate() + 1)
  const delay = next - now
  setTimeout(() => {
    self.registration.showNotification('WirdiApp 📖', {
      body: "C'est l'heure de ta révision quotidienne !",
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'wirdi-daily',
      renotify: true,
    })
    scheduleDaily(timeStr) // reschedule tomorrow
  }, delay)
}
