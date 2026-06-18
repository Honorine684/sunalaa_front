"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { authApi, getApiError } from "@/lib/api";

const TEXT = {
  en: {
    title:        "New password",
    subtitle:     "Choose a strong new password.",
    label_pass:   "New password",
    label_confirm:"Confirm password",
    placeholder_pass:    "Min. 8 characters",
    placeholder_confirm: "Repeat password",
    submit:       "Update password",
    submitting:   "Updating…",
    err_required: "Password is required",
    err_min:      "Minimum 8 characters",
    err_confirm:  "Please confirm your password",
    err_match:    "Passwords do not match",
    done_title:   "Password updated!",
    done_desc:    "Redirecting to login in a few seconds…",
    invalid_title:"Invalid link",
    invalid_desc: "Access this page from the link received in your email.",
    invalid_cta:  "Request a new link",
    loading:      "Loading…",
  },
  fr: {
    title:        "Nouveau mot de passe",
    subtitle:     "Choisissez un nouveau mot de passe sécurisé.",
    label_pass:   "Nouveau mot de passe",
    label_confirm:"Confirmer le mot de passe",
    placeholder_pass:    "Minimum 8 caractères",
    placeholder_confirm: "Répétez le mot de passe",
    submit:       "Modifier le mot de passe",
    submitting:   "Modification en cours…",
    err_required: "Le mot de passe est requis",
    err_min:      "Minimum 8 caractères",
    err_confirm:  "Veuillez confirmer le mot de passe",
    err_match:    "Les mots de passe ne correspondent pas",
    done_title:   "Mot de passe modifié !",
    done_desc:    "Redirection vers la connexion dans quelques secondes…",
    invalid_title:"Lien invalide",
    invalid_desc: "Accédez à cette page depuis le lien reçu dans votre email.",
    invalid_cta:  "Demander un nouveau lien",
    loading:      "Chargement…",
  },
};

function ResetPasswordForm() {
  const router     = useRouter();
  const searchParams = useSearchParams();
  const locale     = useLocale();
  const t          = TEXT[locale] ?? TEXT.en;
  const prefix     = locale === "fr" ? "/fr" : "";
  const token      = searchParams.get("token");

  const [fields, setFields]   = useState({ password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  function validate() {
    const e = {};
    if (!fields.password)                           e.password = t.err_required;
    else if (fields.password.length < 8)            e.password = t.err_min;
    if (!fields.confirm)                            e.confirm  = t.err_confirm;
    else if (fields.password !== fields.confirm)    e.confirm  = t.err_match;
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError("");
    try {
      await authApi.resetPassword({ token, password: fields.password });
      setDone(true);
      setTimeout(() => router.push(`${prefix}/login`), 3000);
    } catch (err) {
      setApiError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
            <path d="M12 8v4M12 16h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="text-white font-bold text-[28px] mb-3">{t.invalid_title}</h1>
        <p className="text-white/70 text-[14px] mb-8">{t.invalid_desc}</p>
        <Link href={`${prefix}/forgot-password`}
          className="inline-flex items-center justify-center bg-secondary text-white font-semibold text-[14px] px-8 py-3.5 rounded-xl hover:brightness-90 transition">
          {t.invalid_cta}
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-white font-bold text-[28px] mb-3">{t.done_title}</h1>
        <p className="text-white/70 text-[14px]">{t.done_desc}</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-white font-bold mb-2" style={{ fontSize: 28 }}>{t.title}</h1>
      <p className="text-white/60 text-[14px] mb-7">{t.subtitle}</p>

      {apiError && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 text-[13px]">
          {apiError}
        </div>
      )}

      <form className="flex flex-col gap-4.5" onSubmit={handleSubmit} noValidate>

        {/* Nouveau mot de passe */}
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: 14, color: "#FFFFFF" }}>{t.label_pass}</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={fields.password}
              onChange={(e) => { setFields((p) => ({ ...p, password: e.target.value })); setErrors((p) => ({ ...p, password: "" })); setApiError(""); }}
              placeholder={t.placeholder_pass}
              autoComplete="new-password"
              className={`w-full bg-white text-gray-700 text-sm placeholder:text-[#BCBEC0] outline-none focus:ring-2 transition ${errors.password ? "ring-2 ring-red-400" : "focus:ring-secondary/50"}`}
              style={{ height: 42, borderRadius: 10, border: `1px solid ${errors.password ? "#f87171" : "#BCBEC0"}`, padding: "12px 40px 12px 16px" }}
            />
            <button type="button" onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                {showPass
                  ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>
                  : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></>
                }
              </svg>
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-[12px]">{errors.password}</p>}
        </div>

        {/* Confirmation */}
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: 14, color: "#FFFFFF" }}>{t.label_confirm}</label>
          <input
            type={showPass ? "text" : "password"}
            value={fields.confirm}
            onChange={(e) => { setFields((p) => ({ ...p, confirm: e.target.value })); setErrors((p) => ({ ...p, confirm: "" })); setApiError(""); }}
            placeholder={t.placeholder_confirm}
            autoComplete="new-password"
            className={`w-full bg-white text-gray-700 text-sm placeholder:text-[#BCBEC0] outline-none focus:ring-2 transition ${errors.confirm ? "ring-2 ring-red-400" : "focus:ring-secondary/50"}`}
            style={{ height: 42, borderRadius: 10, border: `1px solid ${errors.confirm ? "#f87171" : "#BCBEC0"}`, padding: "12px 16px" }}
          />
          {errors.confirm && <p className="text-red-400 text-[12px]">{errors.confirm}</p>}
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-secondary text-white font-semibold text-[15px] py-3.5 rounded-xl hover:brightness-90 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1">
          {loading && <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
          {loading ? t.submitting : t.submit}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  const locale = useLocale();
  const t = TEXT[locale] ?? TEXT.en;

  return (
    <div className="min-h-screen bg-[#1A4338] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-160 flex flex-col items-center gap-6">
        <Link href={locale === "fr" ? "/fr" : "/"}>
          <Image src="/images/logo Sunaala.png" alt="SUNALA" width={130} height={34} className="object-contain" priority />
        </Link>
        <div className="w-full bg-white/10 backdrop-blur-md border-[3px] border-white/70 rounded-4xl px-6 sm:px-22.75" style={{ paddingTop: 40, paddingBottom: 40 }}>
          <Suspense fallback={<div className="text-white text-center">{t.loading}</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
