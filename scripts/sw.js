// example based on Steven's work here
// https://github.com/kunstmusik/csound-serviceworker/blob/master/sw.js

var cacheName = 'NiMPTi-in-Space';
var filesToCache = [
    '/NiMPTi-in-Space/', 
    '/NiMPTi-in-Space/index.html',
    '/NiMPTi-in-Space/csound/CsoundObj.js',
    '/NiMPTi-in-Space/csound/CsoundProcessor.js',
    '/NiMPTi-in-Space/csound/libcsound.js',
    '/NiMPTi-in-Space/csound/libcsound.wasm',
    '/NiMPTi-in-Space/csound/libcsound-worklet.base64.js',
    '/NiMPTi-in-Space/csound/libcsound-worklet.js',
    '/NiMPTi-in-Space/NiMPTiInSpace.html',
    '/NiMPTi-in-Space/scripts/backgroundStar.js',
    '/NiMPTi-in-Space/scripts/csound-p5js.js',
    '/NiMPTi-in-Space/scripts/enemy.js',
    '/NiMPTi-in-Space/scripts/introSketch.js',
    '/NiMPTi-in-Space/scripts/mobileCheck.js',
    '/NiMPTi-in-Space/scripts/p5.dom.min.js',
    '/NiMPTi-in-Space/scripts/p5.min.js',
    '/NiMPTi-in-Space/scripts/p5.sound.min.js',
    '/NiMPTi-in-Space/scripts/require.js',
    '/NiMPTi-in-Space/scripts/sketch.js',
    '/NiMPTi-in-Space/scripts/star.js',
    '/NiMPTi-in-Space/scripts/sw.js',
    '/NiMPTi-in-Space/scripts/textbox.js',
];

self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
          caches.open(cacheName).then(function(cache) {
                  console.log('[ServiceWorker] Caching app shell');
                  return cache.addAll(filesToCache);
                })
        );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});