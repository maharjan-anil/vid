const CACHE_NAME = 'mero-app-v1';

// ✅ सबै pages र assets को list
const urlsToCache = [
  './',
  './index.html',
  './tools.html',
  './calendar.html',
  './phone.html',
   './videogallery.html',
  './manifest.json',
    './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// Install - Cache गर्नुहोस्
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching all assets');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('[SW] Cache error:', err))
  );
  self.skipWaiting();
});

// Fetch - Cache बाट serve गर्नुहोस्, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache मा छ भने return, नत्र network बाट fetch
        if (response) return response;
        return fetch(event.request);
      })
      .catch(() => {
        // Offline मा HTML pages को लागि fallback
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});

// Activate - पुरानो cache हटाउनुहोस्
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
