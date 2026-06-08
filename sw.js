const CACHE_NAME = 'le-poulailler-v1';
const ASSETS = [
    './',
    './index.html',
    './shared-nav.css',
    './slider.css',
    './slider.js',
    './responsive.css',
    './responsive.js',
    './pwa.js',
    './site.webmanifest',
    './assettes/logo-le-poulailler.png',
    './guide.html',
    './collaboration.html'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(ASSETS).catch(function () {
                return cache.addAll(ASSETS.filter(function (a) { return a !== '/'; }));
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(
                keys.filter(function (k) { return k !== CACHE_NAME; })
                    .map(function (k) { return caches.delete(k); })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(function (cached) {
            var fetched = fetch(event.request).then(function (response) {
                if (response && response.status === 200) {
                    var clone = response.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            }).catch(function () { return cached; });

            return cached || fetched;
        })
    );
});
