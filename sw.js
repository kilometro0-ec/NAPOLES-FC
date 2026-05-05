const CACHE_NAME = 'napoles-dynamic-v1';

const urlsToCache = [
  './',
  './index.html',
  './estilos.css',
  './api.js',
  './nav.js'
];

// instalar
self.addEventListener('install', e=>{
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache=>cache.addAll(urlsToCache))
  );
});

// activar y limpiar
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>{
      return Promise.all(
        keys.map(k=>{
          if(k !== CACHE_NAME) return caches.delete(k);
        })
      );
    })
  );
});

// 🔥 NETWORK FIRST SIEMPRE
self.addEventListener('fetch', e=>{
  e.respondWith(
    fetch(e.request)
      .then(res=>{
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(e.request, copy));
        return res;
      })
      .catch(()=>caches.match(e.request))
  );
});
