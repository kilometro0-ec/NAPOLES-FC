const CACHE_NAME = 'napoles-v1.0.4'; // Cambia el número de versión cada vez que actualices
const ASSETS = [
  'login.html',
  'manifest.json',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap'
];

// Instalación: Guarda los archivos en la nueva caché
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Obliga al nuevo SW a tomar el control de inmediato
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activación: Borra todas las cachés antiguas (v1, v2, etc.)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Estrategia Network First: Intenta buscar en internet, si falla, usa la caché
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
