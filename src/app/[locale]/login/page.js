"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getApiError, authApi } from "@/lib/api";
import { useLocale, useTranslations } from "next-intl";

/* ─── Validation ─────────────────────────────────────────────────── */
function validate(fields, t) {
  const errors = {};
  if (!fields.email) {
    errors.email = t("error_email_required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = t("error_email_invalid");
  }
  if (!fields.password) {
    errors.password = t("error_password_required");
  } else if (fields.password.length < 8) {
    errors.password = t("error_password_min");
  }
  return errors;
}

/* ─── Input ──────────────────────────────────────────────────────── */
function Input({ label, type = "text", placeholder, name, value, onChange, error, children }) {
  const isEmail = type === "email";
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontSize: 14, fontWeight: 400, color: "#FFFFFF" }}>{label}</label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={isEmail ? "email" : "current-password"}
          autoCapitalize={isEmail ? "none" : undefined}
          autoCorrect={isEmail ? "off" : undefined}
          spellCheck={isEmail ? false : undefined}
          className={`w-full bg-white text-gray-700 text-base placeholder:text-[#BCBEC0] outline-none focus:ring-2 transition ${error ? "ring-2 ring-red-400" : "focus:ring-secondary/50"}`}
          style={{ height: 42, borderRadius: 10, border: `1px solid ${error ? "#f87171" : "#BCBEC0"}`, padding: "12px 16px" }}
        />
        {children}
      </div>
      {error && <p className="text-red-400 text-[12px] mt-0.5">{error}</p>}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const t = useTranslations("Auth");
  const locale = useLocale();
  const prefix = locale === "fr" ? "/fr" : "";

  const [fields, setFields] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [twoFaStep, setTwoFaStep] = useState(null);
  const [otpCode, setOtpCode] = useState("");
  const [emailUnverified, setEmailUnverified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState(null); // null | "sent" | "error"

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  }

  function handleGoogleLogin() {
    try { sessionStorage.setItem("snl_oauth_locale", locale); } catch {}
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://api.sunalaa.com/api/v1";
    window.location.href = `${apiBase}/auth/google`;
  }

  function redirect(data) {
    const role = (data?.data?.user?.role ?? data?.user?.role ?? data?.role ?? "user").toLowerCase();
    const redirectParam = searchParams.get("redirect");
    router.push(redirectParam || (role.includes("admin") ? "/admin" : `${prefix}/collecter`));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(fields, t);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError("");
    try {
      const data = await login({ email: fields.email.trim(), password: fields.password });
      const d = data?.data ?? data;
      if (d?.requiresTwoFactor || d?.twoFactorRequired || d?.mfaRequired) {
        setTwoFaStep({ tempToken: d?.tempToken ?? d?.token ?? null });
        return;
      }
      redirect(data);
    } catch (err) {
      const raw = err?.response?.data?.message ?? err?.message ?? "";
      const msg = (Array.isArray(raw) ? raw.join(" ") : raw).toLowerCase();
      const status = err?.response?.status;
      const notVerified =
        msg.includes("verif") ||
        msg.includes("confirm") ||
        msg.includes("not verified") ||
        msg.includes("activat") ||
        msg.includes("no refresh token") ||
        msg.includes("refresh token") ||
        status === 403;
      if (notVerified) {
        setEmailUnverified(true);
      } else {
        setApiError(getApiError(err));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendLoading(true);
    setResendStatus(null);
    try {
      await authApi.resendVerification(fields.email.trim());
      setResendStatus("sent");
    } catch {
      setResendStatus("error");
    } finally {
      setResendLoading(false);
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    if (otpCode.length !== 6) { setApiError(t("twofa_code_error")); return; }
    setLoading(true);
    setApiError("");
    try {
      const data = await login({ email: fields.email.trim(), password: fields.password, twoFactorCode: otpCode });
      redirect(data);
    } catch (err) {
      setApiError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1A4338] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-160 flex flex-col items-center gap-6">

        <Link href={`${prefix}/`}>
          <Image src="/images/logo Sunaala.png" alt="SUNALA" width={130} height={34} className="object-contain" priority />
        </Link>

        <Link href={`${prefix}/`} className="flex items-center gap-1.5 text-white/60 hover:text-white text-[13px] transition-colors -mt-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t("back_to_home")}
        </Link>

        <div className="w-full bg-white/10 backdrop-blur-md border-[3px] border-white/70 rounded-4xl px-6 sm:px-22.75" style={{ paddingTop: 40, paddingBottom: 40 }}>

          {twoFaStep ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2"/>
                    <path d="M8 11V7a4 4 0 018 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-white" style={{ fontSize: 22, fontWeight: 700 }}>{t("twofa_title")}</h1>
                  <p className="text-white/60 text-[13px]">{t("twofa_subtitle")}</p>
                </div>
              </div>

              {apiError && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 text-[13px]">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  inputMode="numeric"
                  value={otpCode}
                  onChange={(e) => { setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setApiError(""); }}
                  placeholder="000000"
                  className="w-full bg-white text-gray-700 text-center text-[24px] font-mono tracking-widest outline-none focus:ring-2 focus:ring-secondary/50"
                  style={{ height: 56, borderRadius: 10, border: "1px solid #BCBEC0", letterSpacing: "0.3em" }}
                  maxLength={6}
                  autoFocus
                />
                <button type="submit" disabled={loading || otpCode.length !== 6}
                  className="w-full bg-secondary text-white font-semibold text-[15px] py-3.5 rounded-xl hover:brightness-90 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {loading && <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
                  {loading ? t("twofa_verifying") : t("twofa_confirm")}
                </button>
                <button type="button" onClick={() => { setTwoFaStep(null); setOtpCode(""); setApiError(""); }}
                  className="text-white/50 text-[13px] hover:text-white transition-colors text-center cursor-pointer">
                  {t("twofa_back")}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-white mb-5" style={{ fontSize: 28, fontWeight: 700 }}>{t("login_title")}</h1>

              {emailUnverified ? (
                <div className="mb-5 rounded-2xl overflow-hidden border border-amber-400/30" style={{ backgroundColor: "rgba(230,184,76,0.08)" }}>
                  <div className="h-1 w-full" style={{ backgroundColor: "#E6B84C" }} />
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(230,184,76,0.15)" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="22,6 12,13 2,6" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <p className="text-[14px] font-semibold" style={{ color: "#E6B84C" }}>
                        {locale === "fr" ? "Email non vérifié" : "Email not verified"}
                      </p>
                    </div>
                    <p className="text-[13px] mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                      {locale === "fr"
                        ? "Vérifiez votre boîte mail et cliquez sur le lien de confirmation avant de vous connecter."
                        : "Check your inbox and click the confirmation link before logging in."}
                    </p>

                    {resendStatus === "sent" ? (
                      <div className="flex items-center gap-2 py-2.5 px-3 rounded-xl mb-3" style={{ backgroundColor: "rgba(63,174,140,0.15)" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-[13px] font-medium" style={{ color: "#3FAE8C" }}>
                          {locale === "fr" ? "Email envoyé ! Vérifiez votre boîte." : "Email sent! Check your inbox."}
                        </span>
                      </div>
                    ) : resendStatus === "error" ? (
                      <p className="text-[13px] mb-3" style={{ color: "#F87171" }}>
                        {locale === "fr" ? "Erreur lors de l'envoi. Réessayez." : "Failed to send. Please try again."}
                      </p>
                    ) : null}

                    {resendStatus !== "sent" && (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendLoading}
                        className="w-full py-2.5 rounded-xl text-[13px] font-semibold transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mb-3"
                        style={{ backgroundColor: "#E6B84C", color: "#1F4E46" }}
                      >
                        {resendLoading && (
                          <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                          </svg>
                        )}
                        {locale === "fr" ? "Renvoyer l'email de vérification" : "Resend verification email"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => { setEmailUnverified(false); setResendStatus(null); }}
                      className="text-[12px] text-center w-full cursor-pointer hover:underline"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {locale === "fr" ? "Utiliser une autre adresse" : "Use a different email"}
                    </button>
                  </div>
                </div>
              ) : apiError ? (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 text-[13px]">
                  {apiError}
                </div>
              ) : null}

              <form className="flex flex-col gap-4.5" onSubmit={handleSubmit} noValidate>
                <Input
                  label={t("email")}
                  type="email"
                  name="email"
                  placeholder="username@gmail.com"
                  value={fields.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <div className="flex flex-col gap-1.5">
                  <label style={{ fontSize: 14, fontWeight: 400, color: "#FFFFFF" }}>{t("password")}</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      name="password"
                      value={fields.password}
                      onChange={handleChange}
                      placeholder={t("password_placeholder")}
                      autoComplete="current-password"
                      className={`w-full bg-white text-gray-700 text-base placeholder:text-[#BCBEC0] outline-none focus:ring-2 transition ${errors.password ? "ring-2 ring-red-400" : "focus:ring-secondary/50"}`}
                      style={{ height: 42, borderRadius: 10, border: `1px solid ${errors.password ? "#f87171" : "#BCBEC0"}`, padding: "12px 40px 12px 16px" }}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      aria-label="Show/hide password">
                      {showPass ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-[12px] mt-0.5">{errors.password}</p>}
                  <div className="flex justify-end mt-1">
                    <Link href={`${prefix}/forgot-password`} className="text-white/50 text-[12px] hover:text-white transition-colors">
                      {t("forgot_password")}
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-secondary text-white font-semibold text-[15px] py-3.5 rounded-xl hover:brightness-90 transition cursor-pointer mt-1 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                  )}
                  {loading ? t("signing_in") : t("sign_in")}
                </button>
              </form>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-white/20" />
                <span className="text-white/50 text-[13px]">{t("or_continue_with")}</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>

              <button type="button" aria-label="Google" onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>

              <p className="text-center text-white/60 text-[13px] mt-6">
                {t("no_account")}{" "}
                <Link href={`${prefix}/register`} className="text-white underline underline-offset-2 hover:text-secondary transition-colors">
                  {t("sign_up")}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
