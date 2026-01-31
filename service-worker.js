const CACHE = "card-app-v3";
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

self.addEventListener("activate", e => {
 e.waitUntil(
  caches.keys().then(keys =>
   Promise.all(
    keys.filter(k => k !== CACHE).map(k => caches.delete(k))
   )
  )
 );
 self.clients.claim();
});

self.addEventListener("fetch", e => {

 const url = new URL(e.request.url);

 // Always serve card.html from cache (ignore ?id)
 if (url.pathname.startsWith(BASE + "/card.html")) {
  e.respondWith(
   caches.match(BASE + "/card.html").then(r => r || fetch(e.request))
  );
  return;
 }

 // Normal behavior
 e.respondWith(
  caches.match(e.request).then(r => r || fetch(e.request))
 );
});
