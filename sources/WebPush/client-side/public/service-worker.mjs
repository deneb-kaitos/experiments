const cacheName = 'webpush-cache-' + Date.now();
const filesToCache = [
  '/',
  '/favicon.png',
  '/global.css',
  '/index.html',
  '/app.webmanifest',
  '/service-worker.mjs',
  '/build/bundle.css',
  '/build/bundle.mjs',
  '/build/bundle.mjs.map',
];

self.addEventListener('install', function (e) {
  console.log('[sw] install');

  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', e => {
  console.log('[sw] activate');

  e.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (thisCacheName) {
          if (thisCacheName !== cacheName) {
            return caches.delete(thisCacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', e => {
  console.log('[sw] fetch');

  e.respondWith(
    (async function () {
      const response = await caches.match(e.request);
      return response || fetch(e.request);
    })()
  );
});

self.addEventListener('push', e => {
  if (e.data) {
    self.registration.showNotification(e.data.text());
  } else {
    console.log('[push] w/ no data');
  }
});
