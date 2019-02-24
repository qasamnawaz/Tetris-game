var cacheName = '132Cache';
var filesToCache = [
    './src/app.css',
    '/index.html',
    '/materialize.css',
    '/static/js/bundle.js',
    './src/index.js',
    '/font-awesome',
    '/',
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});


self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) { 
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});


self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});