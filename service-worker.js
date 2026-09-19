const CACHE_NAME = 'physics-learning-app-v2-2026.09.20.001';
const APP_SHELL = ['./', './index.html', './css/main.css', './js/app.js', './js/router.js', './js/core/schema.js', './js/content/question-loader.js', './js/content/content-validator.js', './js/content/question-index.js', './js/content/generated-question-bank.js', './js/storage/database.js', './js/storage/student-store.js', './js/storage/attempt-store.js', './js/ui/dashboard.js', './data/catalog.json', './data/concepts.json', './data/error-types.json', './data/version.json', './data/questions/questions.json', './data/exams/diagnostic-10.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const isContent = new URL(request.url).pathname.includes('/data/');
  if (isContent) {
    event.respondWith(fetch(request, { cache: 'no-store' }).then((response) => { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)); return response; }).catch(() => caches.match(request)));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached ?? fetch(request)));
});
