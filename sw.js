// sw.js — cache-first app shell, network-first for API
const CACHE = 'edughana-v1';
const APP_SHELL = [
  'index.html','lessons.html','quizzes.html','admin.js','app.js','manifest.json',
  'https://cdn.tailwindcss.com',
  'assets/icon-192.png','assets/icon-512.png','assets/hero.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isAPI = url.pathname.startsWith('/api/');
  if (isAPI) {
    // network-first for APIs
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(()=> caches.match(e.request))
    );
  } else {
    // cache-first for static
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }))
    );
  }
});
