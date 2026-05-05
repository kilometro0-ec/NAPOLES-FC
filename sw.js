const CACHE_NAME = 'napoles-v10';

self.addEventListener('install', e=>{
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>{
      return Promise.all(keys.map(k=>caches.delete(k)));
    })
  );
});

// 🚀 SIEMPRE RED (NUNCA CACHE VIEJO)
self.addEventListener('fetch', e=>{
  e.respondWith(fetch(e.request));
});
