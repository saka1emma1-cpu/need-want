self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open('nw-v2').then(c => c.addAll(['./','./index.html','./app.js','./manifest.json'])));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => { if(k!='nw-v2') return caches.delete(k) }))));
  return self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
