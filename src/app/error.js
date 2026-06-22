"use client";

import { useEffect } from "react";

export default function AppError({ error, reset }) {
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
      console.error("[AppError boundary]", error);
    }
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        textAlign: "center",
        backgroundColor: "#1A3A34",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <img
        src="/images/logo Sunaala.png"
        alt="SUNALA"
        style={{ height: 34, objectFit: "contain", marginBottom: 28 }}
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />

      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 16,
          backgroundColor: "rgba(230,184,76,0.15)",
          border: "2px solid rgba(230,184,76,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#E6B84C" strokeWidth="1.8"/>
          <path d="M12 8v4M12 16h.01" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <h1 style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
        Une erreur est survenue
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 20 }}>
        Something went wrong
      </p>

      <div
        style={{
          maxWidth: 440,
          backgroundColor: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16,
          padding: "20px 24px",
          textAlign: "left",
          marginBottom: 24,
        }}
      >
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.80)", lineHeight: 1.7, marginBottom: 12 }}>
          <strong style={{ color: "#E6B84C" }}>FR :</strong> Une erreur inattendue s'est produite.
          Veuillez recharger la page. Si le problème persiste, contactez{" "}
          <a href="mailto:honorinedede0@gmail.com" style={{ color: "#3FAE8C" }}>honorinedede0@gmail.com</a>.
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.80)", lineHeight: 1.7 }}>
          <strong style={{ color: "#E6B84C" }}>EN :</strong> An unexpected error occurred.
          Please reload the page. If the problem persists, contact{" "}
          <a href="mailto:honorinedede0@gmail.com" style={{ color: "#3FAE8C" }}>honorinedede0@gmail.com</a>.
        </p>
      </div>

      {process.env.NODE_ENV !== "production" && error?.message && (
        <p style={{ maxWidth: 440, backgroundColor: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: "10px 14px", color: "#fca5a5", fontSize: 11, fontFamily: "monospace", wordBreak: "break-all", marginBottom: 20, textAlign: "left" }}>
          {error.message}
        </p>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={reset}
          style={{ backgroundColor: "#3FAE8C", color: "#FFFFFF", border: "none", borderRadius: 12, padding: "13px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Réessayer / Retry
        </button>
        <a
          href="/"
          style={{ backgroundColor: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.80)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "13px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", textDecoration: "none" }}
        >
          Accueil / Home
        </a>
      </div>
    </div>
  );
}
