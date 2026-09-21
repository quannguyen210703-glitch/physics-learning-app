const CACHE_VERSION = '2026.09.21.001';
const CACHE_NAME = `physics-learning-app-v2-${CACHE_VERSION}`;
const APP_BASE = new URL('./', self.location.href);
const APP_SHELL = ['', 'index.html', 'css/main.css?v=2026.09.21.001', 'js/app.js?v=2026.09.21.001', 'js/router.js?v=2026.09.21.001', 'js/core/startup.js?v=2026.09.21.001', 'js/core/schema.js?v=2026.09.21.001', 'js/content/question-loader.js?v=2026.09.21.001', 'js/content/content-validator.js?v=2026.09.21.001', 'js/content/question-index.js?v=2026.09.21.001', 'js/content/generated-question-bank.js?v=2026.09.21.001', 'js/storage/database.js?v=2026.09.21.001', 'js/storage/student-store.js?v=2026.09.21.001', 'js/storage/attempt-store.js?v=2026.09.21.001', 'js/ui/dashboard.js?v=2026.09.21.001', 'data/catalog.json', 'data/concepts.json', 'data/error-types.json', 'data/version.json', 'data/questions/questions.json', 'data/exams/diagnostic-10.json'].map((asset) => new URL(asset, APP_BASE).href);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()).catch((error) => { console.warn('App shell cache failed', error); return self.skipWaiting(); }));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const isContent = new URL(request.url).pathname.includes('/data/');
  const isAppCode = /\.(html|js|css)$/.test(new URL(request.url).pathname);
  if (isContent || isAppCode) {
    event.respondWith(fetch(request, { cache: 'no-store' }).then((response) => { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {}); return response; }).catch(() => caches.match(request).then((cached) => cached ?? new Response('Offline asset unavailable', { status: 503 }))));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached ?? fetch(request)).catch(() => new Response('Offline resource unavailable', { status: 503 })));
});
