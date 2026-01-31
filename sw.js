const CACHE = "digital-card-v1";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => 
      c.addAll([
        "./",
        "./index.html",
        "./card.html",
        "./manifest.json"
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE && caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
