"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
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
          level: "global",
        }),
      }).catch(() => {});
    } else {
      console.error("[GlobalError boundary]", error);
    }
  }, [error]);

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Erreur — SUNALA</title>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background-color: #1A3A34;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
          }
          .container {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 480px;
            width: 100%;
          }
          .icon-wrap {
            width: 80px; height: 80px;
            background: rgba(230,184,76,0.15);
            border: 2px solid rgba(230,184,76,0.35);
            border-radius: 20px;
            display: flex; align-items: center; justify-content: center;
            margin-bottom: 24px;
          }
          h1 { color: #FFFFFF; font-size: 24px; font-weight: 700; margin-bottom: 6px; }
          .sub { color: rgba(255,255,255,0.45); font-size: 15px; margin-bottom: 24px; }
          .card {
            width: 100%;
            background: rgba(255,255,255,0.07);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 16px;
            padding: 20px 24px;
            text-align: left;
            margin-bottom: 28px;
          }
          .card p { font-size: 13px; color: rgba(255,255,255,0.80); line-height: 1.75; }
          .card p + p { margin-top: 12px; }
          .card strong { color: #E6B84C; }
          .card a { color: #3FAE8C; }
          .actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
          .btn-primary {
            background: #3FAE8C; color: #fff;
            border: none; border-radius: 12px;
            padding: 13px 28px; font-size: 14px; font-weight: 600;
            cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
          }
          .btn-primary:hover { opacity: 0.88; }
          .btn-secondary {
            background: rgba(255,255,255,0.10);
            color: rgba(255,255,255,0.80);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 12px;
            padding: 13px 28px; font-size: 14px; font-weight: 600;
            cursor: pointer; text-decoration: none;
            display: inline-flex; align-items: center;
          }
          .btn-secondary:hover { opacity: 0.88; }
          .logo { height: 34px; object-fit: contain; margin-bottom: 32px; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <img
            src="/images/logo Sunaala.png"
            alt="SUNALA"
            className="logo"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />

          <div className="icon-wrap">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#E6B84C" strokeWidth="1.8"/>
              <path d="M12 8v4M12 16h.01" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          <h1>Une erreur est survenue</h1>
          <p className="sub">Something went wrong</p>

          <div className="card">
            <p>
              <strong>FR :</strong> Une erreur inattendue s'est produite.
              Veuillez recharger la page. Si le problème persiste, contactez le support à{" "}
              <a href="mailto:honorinedede0@gmail.com">honorinedede0@gmail.com</a>{" "}
              en décrivant ce que vous faisiez au moment de l'erreur.
            </p>
            <p>
              <strong>EN :</strong> An unexpected error occurred.
              Please reload the page. If the problem persists, contact support at{" "}
              <a href="mailto:honorinedede0@gmail.com">honorinedede0@gmail.com</a>{" "}
              and describe what you were doing when the error happened.
            </p>
          </div>

          <div className="actions">
            <button className="btn-primary" onClick={reset}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Réessayer / Retry
            </button>
            <a href="/" className="btn-secondary">
              Accueil / Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
