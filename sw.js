const CACHE_NAME = 'napoles-v1';
const urlsToCache = [
  './',
  './index.html',
  './login.html',
  './estilos.css',
  './nav.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
