const CACHE_NAME = "netpulse-v1";
const SHELL = ["./index.html", "./manifest.json", "./icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Only cache-serve the app shell itself. Never intercept ping-test requests
// (favicon fetches to Google/Cloudflare/etc) — those must hit the real network
// with real timing, or the diagnostic tool becomes useless.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isShell = SHELL.some((s) => url.pathname.endsWith(s.replace("./", "")));
  if (!isShell) return; // let it pass through untouched

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
