const CACHE = "digital-card-v6";

const FILES = [
  "./card.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);

  const isApp =
    self.registration &&
    self.registration.scope &&
    self.clients.matchAll &&
    e.request.mode === "navigate";

  if (isApp) {
    if (!url.pathname.endsWith("card.html")) {
      e.respondWith(caches.match("./card.html"));
      return;
    }
  }

  e.respondWith(
    fetch(e.request).catch(() =>
      caches.match(e.request)
    )
  );
});
