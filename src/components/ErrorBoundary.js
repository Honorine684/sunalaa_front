"use client";

import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error) {
    if (process.env.NODE_ENV === "production") {
      fetch("/api/log-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error?.message ?? "Unknown error",
          stack: error?.stack ?? "",
          url: typeof window !== "undefined" ? window.location.href : "",
          ts: new Date().toISOString(),
          level: "boundary",
        }),
      }).catch(() => {});
    } else {
      console.error("[ErrorBoundary]", error);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        style={{
          minHeight: "60vh",
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
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            backgroundColor: "rgba(230,184,76,0.15)",
            border: "2px solid rgba(230,184,76,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#E6B84C" strokeWidth="1.8"/>
            <path d="M12 8v4M12 16h.01" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <h2 style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 700, marginBottom: 8, margin: "0 0 8px" }}>
          Une erreur est survenue
        </h2>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, margin: "0 0 24px" }}>
          Something went wrong
        </p>

        <button
          onClick={() => {
            this.setState({ hasError: false, error: null });
            window.location.reload();
          }}
          style={{
            backgroundColor: "#3FAE8C",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 12,
            padding: "12px 28px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Réessayer / Retry
        </button>
      </div>
    );
  }
}
