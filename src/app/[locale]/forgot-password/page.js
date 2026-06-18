"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { authApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const t = useTranslations("ForgotPassword");
  const locale = useLocale();
  const prefix = locale === "fr" ? "/fr" : "";

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function validate(val) {
    const v = val.trim();
    if (!v) return t("email_required");
    if (!v.includes("@")) return locale === "fr" ? "Il manque le symbole @" : "Missing @ symbol";
    const [local, domain] = v.split("@");
    if (!local) return locale === "fr" ? "Entrez quelque chose avant le @" : "Enter something before @";
    if (!domain || !domain.includes(".")) return locale === "fr" ? "Domaine invalide (ex: gmail.com)" : "Invalid domain (ex: gmail.com)";
    if (domain.endsWith(".")) return locale === "fr" ? "Le domaine est incomplet" : "Domain is incomplete";
    return "";
  }

  function handleChange(e) {
    const val = e.target.value;
    setEmail(val);
    if (error) setError(validate(val));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate(email);
    if (err) { setError(err); return; }

    setLoading(true);
    setError("");
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch (apiErr) {
      const status = apiErr?.response?.status;
      if (status >= 500) {
        setError(t("server_error"));
      } else {
        // Sécurité : ne pas révéler si l'email existe ou non
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-160 flex flex-col items-center gap-6">

        <Link href={`${prefix}/`}>
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
                {t("title")}
              </h1>
              <p className="text-center mb-8" style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: "150%" }}>
                {t("subtitle")}
              </p>

              <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col gap-1.5">
                  <label style={{ fontSize: 14, fontWeight: 400, color: "#FFFFFF" }}>{t("label_email")}</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
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
                  {loading ? t("submitting") : t("submit")}
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
                {t("sent_title")}
              </h1>
              <p className="text-center mt-3" style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: "150%" }}>
                {t.rich("sent_body", {
                  email,
                  strong: (chunks) => <strong className="text-white">{chunks}</strong>,
                })}
              </p>
            </>
          )}

          <p className="text-center mt-8" style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
            <Link href={`${prefix}/login`} className="text-white font-semibold hover:text-secondary transition-colors flex items-center justify-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t("back_to_login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
