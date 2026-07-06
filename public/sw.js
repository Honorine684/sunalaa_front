const CACHE_STATIC = "sunalaa-static-v3";
const CACHE_PAGES  = "sunalaa-pages-v3";

const STATIC_PREFIXES = ["/_next/static/", "/images/"];
const STATIC_EXT = /\.(png|jpg|jpeg|svg|ico|webp|avif|woff2?|ttf)$/;

const BYPASS = [
  "/api/", "/admin", "/profil", "/fr/profil",
  "/login", "/register", "/verify-email", "/forgot-password", "/reset-password",
];

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_STATIC && k !== CACHE_PAGES)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Ne jamais intercepter les API calls ni les pages auth/admin
  if (BYPASS.some((p) => url.pathname.includes(p))) return;

  const isStatic =
    STATIC_PREFIXES.some((p) => url.pathname.startsWith(p)) ||
    STATIC_EXT.test(url.pathname);

  if (isStatic) {
    // Cache-first : JS/CSS/images ne changent pas (hash dans l'URL)
    e.respondWith(
      caches.open(CACHE_STATIC).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          }).catch(() => new Response("", { status: 503 }));
        })
      )
    );
    return;
  }

  // Navigation HTML → stale-while-revalidate
  // Retourne le cache immédiatement (vitesse), met à jour en arrière-plan
  if (request.headers.get("accept")?.includes("text/html")) {
    e.respondWith(
      caches.open(CACHE_PAGES).then((cache) =>
        cache.match(request).then((cached) => {
          const networkFetch = fetch(request).then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          }).catch(() => cached || new Response("", { status: 503 }));

          // Retourne le cache tout de suite si dispo, sinon attend le réseau
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  // Autres requêtes (fonts Google, etc.) → network avec fallback cache
  e.respondWith(
    fetch(request).catch(() =>
      caches.match(request).then((c) => c || new Response("", { status: 503 }))
    )
  );
});

/* ─── Push notifications ─────────────────────────────────────────── */
self.addEventListener("push", (e) => {
  if (!e.data) return;
  let payload;
  try { payload = e.data.json(); } catch { return; }

  const {
    title = "SUNALAA", body = "", icon = "/icon-192.png",
    badge = "/icon-192.png", url = "/", tag = "sunalaa",
  } = payload;

  e.waitUntil(
    self.registration.showNotification(title, {
      body, icon, badge, tag, data: { url }, requireInteraction: false,
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const target = e.notification.data?.url || "/";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.includes(self.location.origin) && "focus" in c);
      if (existing) return existing.focus().then((c) => c.navigate(target));
      return clients.openWindow(target);
    })
  );
});
