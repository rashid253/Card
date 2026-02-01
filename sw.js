const CACHE = "digital-card-v5";

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

  // Agar navigation request hai (page open)
  if (e.request.mode === "navigate") {

    // App ke andar sirf card.html
    if (!url.pathname.endsWith("card.html")) {
      e.respondWith(
        caches.match("./card.html")
      );
      return;
    }
  }

  // Baqi sab normal network (Supabase, JS, images)
  e.respondWith(
    fetch(e.request).catch(() =>
      caches.match(e.request)
    )
  );
});
