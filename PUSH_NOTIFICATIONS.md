Tu vas implémenter les push notifications PWA dans ce projet. Stack : Next.js 14 (App Router) + NestJS. L'objectif est que l'utilisateur qui installe la PWA reçoive des notifications même quand l'app est fermée.

---

## Contexte et architecture

Le flux complet repose sur trois acteurs :
- Le navigateur gère la subscription et reçoit les notifications via le Service Worker
- Le frontend (Next.js) demande la permission, crée la subscription, l'envoie au backend
- Le backend (NestJS) stocke les subscriptions et envoie les notifications via le protocole Web Push

---

## Ce que tu dois faire côté BACKEND (NestJS)

**1. Installer la librairie `web-push`** et ses types.

```bash
npm install web-push
npm install -D @types/web-push
```

**2. Variables d'environnement** à ajouter dans `.env` :

```env
VAPID_PUBLIC_KEY=générer_avec_web-push
VAPID_PRIVATE_KEY=générer_avec_web-push
VAPID_SUBJECT=mailto:contact@tonapp.com
```

Pour générer les clés une seule fois :
```ts
import webpush from 'web-push';
const keys = webpush.generateVAPIDKeys();
console.log(keys.publicKey, keys.privateKey);
```

Ne jamais régénérer les clés en production — ça invaliderait toutes les subscriptions existantes.

**3. Configuration VAPID au démarrage du module** :

```ts
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);
```

**4. Endpoint `GET /auth/vapid-public-key`** — public, pas d'auth requise :

```ts
@Get('vapid-public-key')
getVapidKey() {
  return { publicKey: process.env.VAPID_PUBLIC_KEY };
}
```

**5. Endpoint `POST /users/me/push-subscription`** — stocker la subscription en base :

```ts
// Body reçu du navigateur
{
  endpoint: "https://fcm.googleapis.com/fcm/send/...",
  keys: {
    p256dh: "...",
    auth: "..."
  }
}
```

Stocker cet objet en base associé à l'utilisateur. Un user peut avoir plusieurs subscriptions (plusieurs appareils) — les identifier par leur `endpoint` (unique par appareil/navigateur).

**6. Endpoint `DELETE /users/me/push-subscription`** :

```ts
// Body
{ endpoint: "https://fcm.googleapis.com/fcm/send/..." }
```

Supprimer la subscription correspondante de la base.

**7. Service d'envoi** — gérer les subscriptions expirées :

```ts
async sendToUser(subscription: PushSubscription, payload: object) {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Titre",
        body: "Message",
        icon: "/icon-192.png",
        url: "/dashboard",
      })
    );
  } catch (err) {
    if (err.statusCode === 410 || err.statusCode === 404) {
      // Subscription expirée — supprimer de la base
      await this.deleteSubscription(subscription.endpoint);
    }
  }
}

// Pour un broadcast (envoyer à tous les users)
async broadcast(payload: object) {
  const subscriptions = await this.getAllSubscriptions();
  await Promise.allSettled(
    subscriptions.map((sub) => this.sendToUser(sub, payload))
  );
}
```

---

## Ce que tu dois faire côté FRONTEND (Next.js)

**1. `manifest.webmanifest`** dans `/public` :

```json
{
  "name": "Mon App",
  "short_name": "App",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1F4E46",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Dans `next.config.mjs`, ajouter les headers :

```js
async headers() {
  return [
    {
      source: "/sw.js",
      headers: [
        { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        { key: "Service-Worker-Allowed", value: "/" },
      ],
    },
    {
      source: "/manifest.webmanifest",
      headers: [
        { key: "Content-Type", value: "application/manifest+json" },
      ],
    },
  ];
}
```

**2. Service Worker `/public/sw.js`** :

```js
// Réception de la notification push
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? "Notification", {
      body: data.body ?? "",
      icon: data.icon ?? "/icon-192.png",
      data: { url: data.url ?? "/" },
    })
  );
});

// Clic sur la notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url === url);
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});

// Fetch avec cache — toujours avoir un fallback pour éviter l'erreur "Failed to convert value to Response"
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
      .catch(() => new Response("", { status: 503 }))
  );
});
```

**3. Enregistrement du SW** dans le layout racine (composant client) :

```jsx
"use client";
import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
```

**4. Fonction utilitaire** pour convertir la clé VAPID (obligatoire avant de l'envoyer à l'API) :

```js
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}
```

**5. Hook `usePushNotifications`** :

```js
"use client";
import { useState, useEffect } from "react";

const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export function usePushNotifications() {
  const [enabled, setEnabled] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    setBlocked(Notification.permission === "denied");
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setEnabled(sub !== null))
      .catch(() => {});
  }, []);

  async function subscribe() {
    setLoading(true);
    try {
      if (Notification.permission === "denied") return { ok: false, reason: "denied" };

      const permission = await Notification.requestPermission();
      if (permission !== "granted") return { ok: false, reason: "denied" };

      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_KEY),
      });

      // Envoyer au backend
      await fetch("/api/proxy/users/me/push-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(subscription),
      });

      setEnabled(true);
      return { ok: true };
    } catch {
      return { ok: false, reason: "error" };
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribe() {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();
      if (!subscription) return;

      await subscription.unsubscribe();

      await fetch("/api/proxy/users/me/push-subscription", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });

      setEnabled(false);
    } finally {
      setLoading(false);
    }
  }

  return { subscribe, unsubscribe, enabled, blocked, loading };
}
```

**6. UI dans les paramètres** — ne jamais déclencher la demande de permission au chargement de la page, uniquement sur action explicite de l'user :

```jsx
const { subscribe, unsubscribe, enabled, blocked, loading } = usePushNotifications();

async function handleToggle() {
  if (enabled) {
    await unsubscribe();
  } else {
    const result = await subscribe();
    if (result.reason === "denied") {
      // Afficher : "Activez les notifications dans les paramètres de votre navigateur"
    }
  }
}
```

---

## Points d'attention importants

**iOS Safari** : les push notifications ne fonctionnent que sur iOS 16.4+ ET uniquement si la PWA est installée via "Ajouter à l'écran d'accueil". Dans le navigateur Safari ordinaire, elles ne fonctionnent pas. Vérifier `('PushManager' in window)` avant toute chose.

**Subscriptions expirées** : toujours gérer les erreurs 410/404 côté backend lors de l'envoi et supprimer les subscriptions invalides automatiquement.

**Un user, plusieurs appareils** : ne pas écraser la subscription existante — en ajouter une nouvelle identifiée par son `endpoint`. Lors d'un broadcast, envoyer à tous les appareils.

**Variable d'environnement frontend** :
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=la_même_valeur_que_VAPID_PUBLIC_KEY_du_backend
```
