const CACHE_NAME = "faisalabad-bazar-v1";

const FILES_TO_CACHE = [
  "./bazar.html",
  "./index.html",
  "./card.html",
  "./edit.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./clocktower.png",
  "./offline.html"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => caches.match(event.request).then(r => r || caches.match("./offline.html")))
  );
});
