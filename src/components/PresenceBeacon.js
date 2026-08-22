"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function PresenceBeacon() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const displayName =
      user.username ||
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      null;

    const ping = () => {
      fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          displayName,
          email: user.email || null,
        }),
      }).catch(() => {});
    };

    ping();
    const id = setInterval(ping, 30_000);
    return () => clearInterval(id);
  }, [user?.id]);

  return null;
}
