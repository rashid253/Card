const CACHE = "fsd-directory-v1";

const FILES = [
 "./index.html",
 "./create.html",
 "./card.html",
 "./manifest.json",
 "./icon-192.png",
 "./icon-512.png"
];

self.addEventListener("install", e => {
 e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(FILES))
 );
});

self.addEventListener("activate", e => {
 e.waitUntil(
  caches.keys().then(keys =>
   Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  )
 );
});

// ❗ Supabase requests are NOT cached
self.addEventListener("fetch", e => {
 if(e.request.url.includes("supabase")){
  return;
 }

 e.respondWith(
  caches.match(e.request).then(r => r || fetch(e.request))
 );
});
