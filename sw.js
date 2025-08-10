
// Simple service worker for caching static assets (dev/demo)
const CACHE_NAME = 'yssm-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/css/responsive.css',
  '/assets/js/app.js',
  '/assets/js/ui.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request)));
});
