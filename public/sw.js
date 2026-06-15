const CACHE = "sunala-v1";

const STATIC_PREFIXES = [
  "/_next/static/",
  "/images/",
];

const STATIC_EXT = /\.(png|jpg|jpeg|svg|ico|webp|woff2?|ttf)$/;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Ne jamais intercepter : non-GET, API, admin, auth, pages dynamiques
  if (
    request.method !== "GET" ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/profil") ||
    url.pathname.startsWith("/fr/profil") ||
    url.pathname.includes("/login") ||
    url.pathname.includes("/register") ||
    url.pathname.includes("/verify-email") ||
    url.pathname.includes("/forgot-password") ||
    url.pathname.includes("/reset-password")
  ) {
    return;
  }

  const isStatic =
    STATIC_PREFIXES.some((p) => url.pathname.startsWith(p)) ||
    STATIC_EXT.test(url.pathname);

  if (isStatic) {
    // Cache-first pour les assets statiques
    e.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(request, clone));
            return res;
          })
      )
    );
  } else {
    // Network-first pour les pages
    e.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
  }
});
