const CACHE = "sunalaa-v2";

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
    e.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
  }
});

/* ─── Push notifications ─────────────────────────────────────────── */
self.addEventListener("push", (e) => {
  if (!e.data) return;
  let payload;
  try { payload = e.data.json(); } catch { return; }

  const { title = "SUNALAA", body = "", icon = "/icon-192.png", badge = "/icon-192.png", url = "/", tag = "sunalaa" } = payload;

  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      tag,
      data: { url },
      requireInteraction: false,
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const target = e.notification.data?.url || "/";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      const existing = clientList.find((c) => c.url.includes(self.location.origin) && "focus" in c);
      if (existing) return existing.focus().then((c) => c.navigate(target));
      return clients.openWindow(target);
    })
  );
});
