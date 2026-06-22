"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function LocaleError({ error, reset }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      fetch("/api/log-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error?.message ?? "Unknown error",
          stack: error?.stack ?? "",
          url: typeof window !== "undefined" ? window.location.href : "",
          ts: new Date().toISOString(),
        }),
      }).catch(() => {});
    } else {
      console.error("[LocaleError boundary]", error);
    }
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-16 text-center"
      style={{ backgroundColor: "#1A3A34" }}
    >
      {/* Logo */}
      <img
        src="/images/logo Sunaala.png"
        alt="SUNALA"
        style={{ height: 36, objectFit: "contain", marginBottom: 32 }}
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />

      {/* Icon */}
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: "rgba(230,184,76,0.15)", border: "2px solid rgba(230,184,76,0.35)" }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#E6B84C" strokeWidth="1.8"/>
          <path d="M12 8v4M12 16h.01" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <h1 className="text-white font-bold mb-2" style={{ fontSize: 26 }}>
        Une erreur est survenue
      </h1>
      <p className="text-white font-bold mb-1" style={{ fontSize: 16, opacity: 0.55 }}>
        Something went wrong
      </p>

      <div
        className="w-full max-w-md rounded-2xl px-6 py-5 mt-5 mb-7 text-left"
        style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <p className="mb-3" style={{ fontSize: 14, color: "rgba(255,255,255,0.80)", lineHeight: 1.7 }}>
          <strong style={{ color: "#E6B84C" }}>FR :</strong> Une erreur inattendue s'est produite.
          Veuillez recharger la page. Si le problème persiste, contactez le support à{" "}
          <a href="mailto:honorinedede0@gmail.com" style={{ color: "#3FAE8C", textDecoration: "underline" }}>
            honorinedede0@gmail.com
          </a>{" "}
          en décrivant ce que vous faisiez au moment de l'erreur.
        </p>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.80)", lineHeight: 1.7 }}>
          <strong style={{ color: "#E6B84C" }}>EN :</strong> An unexpected error occurred.
          Please reload the page. If the problem persists, contact support at{" "}
          <a href="mailto:honorinedede0@gmail.com" style={{ color: "#3FAE8C", textDecoration: "underline" }}>
            honorinedede0@gmail.com
          </a>{" "}
          and describe what you were doing when the error happened.
        </p>
      </div>

      {process.env.NODE_ENV !== "production" && error?.message && (
        <p
          className="w-full max-w-md rounded-xl px-4 py-3 mb-5 font-mono text-left"
          style={{ backgroundColor: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", fontSize: 12, wordBreak: "break-all" }}
        >
          {error.message}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={reset}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition hover:brightness-90 cursor-pointer"
          style={{ backgroundColor: "#3FAE8C", fontSize: 15 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Réessayer / Retry
        </button>
        <Link
          href="/"
          className="flex-1 flex items-center justify-center py-3.5 rounded-xl font-semibold transition cursor-pointer"
          style={{ backgroundColor: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.80)", fontSize: 15, border: "1px solid rgba(255,255,255,0.15)" }}
        >
          Accueil / Home
        </Link>
      </div>
    </div>
  );
}
