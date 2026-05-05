const CACHE_NAME = 'napoles-v3';

const urlsToCache = [
  './',
  './index.html',
  './estilos.css',
  './api.js',
  './favicon.png',
  './manifest.json'
];

// INSTALAR
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// ACTIVAR
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.map(n => n !== CACHE_NAME ? caches.delete(n) : null)
      )
    )
  );
});

// FETCH (NETWORK FIRST)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
