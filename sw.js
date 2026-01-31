const CACHE = "digital-card-v1";

const FILES = [
  "./",
  "index.html",
  "card.html",
  "offline.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).catch(() =>
        caches.match("offline.html")
      );
    })
  );
});
