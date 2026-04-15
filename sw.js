const CACHE_NAME = 'split-bill-pwa-v2';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // 網路優先策略 (Network First)，保證資料最新，網路失敗時才找快取
    if (event.request.method === 'GET') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
    }
});
