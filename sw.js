// A basic service worker required for iOS PWA installation
self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
    // Leave blank for now; allows live updates from the web
});