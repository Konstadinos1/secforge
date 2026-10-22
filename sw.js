/* SecForge service worker — network-first, offline fallback (stale content never wins) */
'use strict';
const CACHE = 'secforge-v3';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './js/data-core.js',
  './js/data-mod1-2.js',
  './js/data-mod3-4.js',
  './js/data-mod5-6.js',
  './js/data-mod7-8.js',
  './js/data-mod9-10.js',
  './js/data-labs-a.js',
  './js/data-labs-b.js',
  './js/data-careers.js',
  './js/engine.js',
  './js/app.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // external links pass through

  // network-first for everything same-origin: fresh wins, cache is the offline fallback
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.ok) caches.open(CACHE).then(c => c.put(req, res.clone()));
      return res;
    }).catch(() =>
      req.mode === 'navigate'
        ? caches.match('./index.html')
        : caches.match(req)
    )
  );
});
