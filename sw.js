self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open('nw-v3-full').then(c => c.addAll(['./','./index.html','./app.js','./manifest.json']))
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  );
  return self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request, {cache: 'no-store'}).then(r => {
      return r;
    }).catch(() => caches.match(e.request))
  );
});
