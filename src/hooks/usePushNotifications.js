"use client";

import { useState, useEffect, useCallback } from "react";
import { authApi, usersApi } from "@/lib/api";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

function isSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

const LS_KEY = "snl_push_subscribed";

function lsGetSub() {
  try { return localStorage.getItem(LS_KEY) === "1"; } catch { return false; }
}
function lsSetSub(val) {
  try { val ? localStorage.setItem(LS_KEY, "1") : localStorage.removeItem(LS_KEY); } catch {}
}

export function usePushNotifications() {
  const [permission, setPermission]   = useState(null);
  const [subscribed, setSubscribed]   = useState(false);
  const [loading, setLoading]         = useState(false);
  const [supported, setSupported]     = useState(false);

  useEffect(() => {
    if (!isSupported()) return;
    setSupported(true);
    setPermission(Notification.permission);
    setSubscribed(lsGetSub());
    // Verify the real browser subscription and sync with localStorage
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        const isSubscribed = !!sub;
        setSubscribed(isSubscribed);
        lsSetSub(isSubscribed);
      });
    }).catch(() => {});
  }, []);

  const subscribe = useCallback(async () => {
    if (!isSupported()) return { ok: false, reason: "unsupported" };

    setLoading(true);
    try {
      // 1. Ask permission
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") return { ok: false, reason: "denied" };

      // 2. Get VAPID public key
      const keyRes = await authApi.getVapidPublicKey();
      const d = keyRes.data?.data ?? keyRes.data ?? {};
      const vapidKey =
        d.publicKey ?? d.vapidPublicKey ?? d.vapid_public_key ??
        d.key ?? d.vapidKey ?? d.public_key ?? null;
      if (!vapidKey) {
        console.error("VAPID key not found in response:", keyRes.data);
        throw new Error("No VAPID key");
      }

      // 3. Subscribe via pushManager
      // Clear any stale subscription first (mismatched VAPID key causes silent failure)
      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      if (existing) {
        try { await existing.unsubscribe(); } catch {}
      }
      const pushSub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      // 4. Send subscription to backend
      const subJson = pushSub.toJSON();
      await usersApi.subscribePush({
        endpoint: subJson.endpoint,
        keys: { p256dh: subJson.keys.p256dh, auth: subJson.keys.auth },
      });

      setSubscribed(true);
      lsSetSub(true);
      return { ok: true };
    } catch (err) {
      console.error("Push subscribe error:", err);
      return { ok: false, reason: "error", err };
    } finally {
      setLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    if (!isSupported()) return;
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await usersApi.unsubscribePush(sub.endpoint);
        await sub.unsubscribe();
      }
      setSubscribed(false);
      lsSetSub(false);
    } catch (err) {
      console.error("Push unsubscribe error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { supported, permission, subscribed, loading, subscribe, unsubscribe };
}
