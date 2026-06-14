"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { authApi } from "@/lib/api";

function validate(email) {
  if (!email.trim()) return "L'email est requis";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Format d'email invalide";
  return "";
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate(email);
    if (err) { setError(err); return; }

    setLoading(true);
    setApiError("");
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      // API retourne 200 systématiquement pour éviter l'énumération d'emails
      // On affiche le succès dans tous les cas sauf erreur réseau
      if (err?.response?.status >= 500) {
        setApiError("Erreur serveur. Veuillez réessayer.");
      } else {
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-160 flex flex-col items-center gap-6">

        <Link href="/">
          <Image src="/images/logo Sunaala.png" alt="SUNALA" width={130} height={34} className="object-contain" priority />
        </Link>

        <div className="w-full bg-white/10 backdrop-blur-md border-[3px] border-white/70 rounded-4xl"
          style={{ paddingTop: 70, paddingBottom: 70, paddingLeft: 91, paddingRight: 91 }}>

          {!sent ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="white" strokeWidth="2"/>
                    <path d="M2 8l10 6 10-6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>

              <h1 className="text-center mb-2" style={{ fontSize: 38, fontWeight: 700, color: "#FFFFFF" }}>
                Mot de passe oublié ?
              </h1>
              <p className="text-center mb-8" style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: "150%" }}>
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              {apiError && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 text-[13px]">
                  {apiError}
                </div>
              )}

              <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col gap-1.5">
                  <label style={{ fontSize: 14, fontWeight: 400, color: "#FFFFFF" }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); setApiError(""); }}
                    placeholder="username@gmail.com"
                    autoComplete="email"
                    className={`w-full bg-white text-gray-700 text-sm placeholder:text-[#BCBEC0] outline-none focus:ring-2 transition ${error ? "ring-2 ring-red-400" : "focus:ring-secondary/50"}`}
                    style={{ height: 50, borderRadius: 10, border: `1px solid ${error ? "#f87171" : "#BCBEC0"}`, padding: "17px 23px" }}
                  />
                  {error && <p className="text-red-400 text-[12px] mt-0.5">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-secondary text-white font-semibold text-[15px] py-3.5 rounded-xl hover:brightness-90 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                  )}
                  {loading ? "Envoi en cours..." : "Envoyer le lien"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-center mb-2" style={{ fontSize: 38, fontWeight: 700, color: "#FFFFFF" }}>
                Email envoyé !
              </h1>
              <p className="text-center mt-3" style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: "150%" }}>
                Si un compte existe avec <strong className="text-white">{email}</strong>, vous recevrez un lien de réinitialisation sous peu.
              </p>
            </>
          )}

          <p className="text-center mt-8" style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
            <Link href="/login" className="text-white font-semibold hover:text-secondary transition-colors flex items-center justify-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
