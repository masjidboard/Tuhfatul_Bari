const CACHE_NAME = 'tohfat-ul-bari-v4'; // ورژن 4

const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/book_data.json',
    '/icon-192.png',
    '/icon-512.png',
    '/AlQalam.ttf',
    '/AlQalam.woff2',
    '/JameelNoori.ttf',
    '/JameelNoori.woff2',
    '/Tohfat%20ul%20Bari%20Complete.pdf' // اسپیسز کی جگہ %20 لگا دیا گیا ہے
];

self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Caching Files...');
            // یہ نیا طریقہ ہے تاکہ اگر کوئی ایک فائل نہ ملے تو باقی سب کیش ہو جائیں
            return Promise.allSettled(
                urlsToCache.map(url => {
                    return cache.add(url).catch(err => console.error('فائل کیش نہیں ہو سکی:', url, err));
                })
            );
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    // صرف GET requests کو کیش کریں (کروم ایکسٹینشنز وغیرہ کو چھوڑ دیں)
    if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // اگر کیش میں موجود ہے تو وہاں سے دیں
            if (cachedResponse) {
                return cachedResponse;
            }

            // اگر کیش میں نہیں ہے تو انٹرنیٹ سے لائیں اور کیش میں محفوظ کر لیں (Dynamic Caching)
            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                let responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch(() => {
                console.log('Offline and file not in cache');
            });
        })
    );
});
