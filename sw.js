const CACHE_NAME = 'tohfat-ul-bari-v1';

self.addEventListener('install', (event) => {
    console.log('Service Worker Installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker Activated');
});

self.addEventListener('fetch', (event) => {
    // PWA انسٹال ہونے کے لیے fetch ایونٹ کا ہونا ضروری ہے
    event.respondWith(
        fetch(event.request).catch(() => {
            return new Response('آپ اس وقت آف لائن ہیں۔');
        })
    );
});
