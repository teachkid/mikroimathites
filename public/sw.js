const CACHE_NAME = 'mikroi-mathites-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sounds/animals/lion.mp3',
  './sounds/animals/cat.mp3',
  './sounds/animals/dog.mp3',
  './sounds/animals/cow.mp3',
  './sounds/animals/sheep.mp3',
  './sounds/animals/pig.mp3',
  './sounds/animals/duck.mp3',
  './sounds/animals/horse.mp3',
  './sounds/animals/elephant.mp3',
  './sounds/animals/frog.mp3',
];

// Install Event: Pre-cache static assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Some assets could not be pre-cached:', err);
      });
    })
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Stale-While-Revalidate strategy for offline support
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Ignore non-GET requests or browser-extension schemes
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Network failed, return cached response if available
        return cachedResponse;
      });

      // Return cached version immediately if found, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
