const CACHE = "card-app-final";
const BASE = "/Card";

const FILES = [
 BASE + "/",
 BASE + "/index.html",
 BASE + "/card.html",
 BASE + "/edit.html",
 BASE + "/manifest.json",
 BASE + "/icon-192.png",
 BASE + "/icon-512.png"
];

self.addEventListener("install", e => {
 e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(FILES))
 );
 self.skipWaiting();
});

self.addEventListener("fetch", e => {
 const url = new URL(e.request.url);

 // Any card.html with ?id -> always serve cached one
 if (url.pathname.endsWith("/card.html")) {
  e.respondWith(
   caches.match(BASE + "/card.html")
    .then(r => r || fetch(BASE + "/card.html"))
  );
  return;
 }

 e.respondWith(
  caches.match(e.request).then(r => r || fetch(e.request))
 );
});
