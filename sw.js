const CACHE_NAME = 'napoles-v2'; // <--- Cambiar el nombre de la versión es CLAVE
const urlsToCache = [
  './',
  './index.html',
  './estilos.css',
  './api.js', // Asegúrate de incluir api.js
  './nav.js'
];

// Instalación y almacenamiento en caché
self.addEventListener('install', event => {
  self.skipWaiting(); // Obliga al nuevo SW a activarse de inmediato
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Limpieza de cachés antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Borrando caché antiguo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Estrategia: Network First (Prioriza la red para ver cambios de diseño)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
