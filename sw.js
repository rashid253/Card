const CACHE = "digital-card-v2";

const FILES = [
  "./",
  "index.html",
  "card.html",
  "offline.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png"
];

// INSTALL: cache shell
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
});

// ACTIVATE: cleanup old caches
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
});

// FETCH: network first, cache fallback
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => {
        return caches.match(e.request).then(r => {
          return r || caches.match("offline.html");
        });
      })
  );
});
