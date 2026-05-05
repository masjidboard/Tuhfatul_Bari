const CACHE_NAME = 'tohfat-ul-bari-v3'; // ورژن تبدیل کر دیا ہے تاکہ نیا کیش بنے

// آپ کی GitHub ریپازٹری میں موجود تمام فائلوں کی لسٹ
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
    '/Tohfat ul Bari Complete.pdf' // اگر پی ڈی ایف بڑی ہے تو پہلی بار لوڈ ہونے میں تھوڑا وقت لے سکتی ہے
];

self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching All Files');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    // پرانے کیش کو ڈیلیٹ کرنے کا کوڈ
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
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // اگر فائل کیش میں موجود ہے تو وہاں سے دکھائیں (آف لائن موڈ)
                if (response) {
                    return response;
                }
                // اگر کیش میں نہیں ہے تو انٹرنیٹ سے لائیں
                return fetch(event.request).catch(() => {
                    // آف لائن ہونے کی صورت میں کوئی ایرر نہ آئے
                });
            })
    );
});
