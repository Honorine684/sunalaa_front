"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { parseFieldErrors, authApi } from "@/lib/api";
import "react-international-phone/style.css";

const PhoneInput = dynamic(
  () => import("react-international-phone").then((m) => ({ default: m.PhoneInput })),
  {
    ssr: false,
    loading: () => (
      <div style={{ height: 42, borderRadius: 10, border: "1px solid #BCBEC0", backgroundColor: "#fff" }} />
    ),
  }
);

/* ─── Validation ─────────────────────────────────────────────────── */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function validate(fields, locale) {
  const fr = locale === "fr";
  const errors = {};

  if (!fields.username.trim()) {
    errors.username = fr ? "Le nom d'utilisateur est requis" : "Username is required";
  } else if (fields.username.trim().length < 3) {
    errors.username = fr ? "Minimum 3 caractères" : "Minimum 3 characters";
  } else if (!/^[a-zA-Z0-9_]+$/.test(fields.username.trim())) {
    errors.username = fr ? "Lettres, chiffres et _ uniquement" : "Letters, numbers and _ only";
  }

  if (!fields.email.trim()) {
    errors.email = fr ? "L'email est requis" : "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = fr ? "Format d'email invalide" : "Invalid email format";
  }

  const digitsOnly = (fields.phone || "").replace(/\D/g, "");
  if (digitsOnly.length < 8) {
    errors.phone = fr ? "Numéro de téléphone valide requis" : "Valid phone number is required";
  }

  if (!fields.password) {
    errors.password = fr ? "Le mot de passe est requis" : "Password is required";
  } else if (!PASSWORD_REGEX.test(fields.password)) {
    errors.password = fr
      ? "Le mot de passe doit contenir au moins 8 caractères avec une majuscule, une minuscule et un chiffre"
      : "Password must be at least 8 characters with uppercase, lowercase and a number";
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = fr ? "Veuillez confirmer votre mot de passe" : "Please confirm your password";
  } else if (fields.password !== fields.confirmPassword) {
    errors.confirmPassword = fr ? "Les mots de passe ne correspondent pas" : "Passwords do not match";
  }

  if (!fields.referralCode.trim()) {
    errors.referralCode = fr ? "Code de parrainage requis" : "Referral code is required";
  }

  if (!fields.agreed) {
    errors.agreed = fr ? "Vous devez accepter les conditions" : "You must accept the terms";
  }

  return errors;
}

/* ─── Field ──────────────────────────────────────────────────────── */
function Field({ label, type = "text", name, placeholder, value, onChange, error, autoComplete, autoCapitalize, autoCorrect, spellCheck, children }) {
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
          autoComplete={autoComplete || name}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          spellCheck={spellCheck}
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
function RegisterInner() {
  const { register } = useAuth();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("Auth");
  const prefix = locale === "fr" ? "/fr" : "";
  const rawRef = searchParams.get("ref");
  const refFromUrl = rawRef && rawRef !== "undefined" ? rawRef : "";

  function handleGoogleLogin() {
    try { sessionStorage.setItem("snl_oauth_locale", locale); } catch {}
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://api.sunalaa.com/api/v1";
    const url = refFromUrl
      ? `${apiBase}/auth/google?ref=${encodeURIComponent(refFromUrl)}`
      : `${apiBase}/auth/google`;
    window.location.href = url;
  }

  const [fields, setFields] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referralCode: refFromUrl || "SUNALAA",
    gender: "",
    agreed: false,
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // null | "checking" | "available" | "taken"
  const [suggestions, setSuggestions] = useState([]);
  const usernameTimer = useRef(null);

  function generateSuggestions(base) {
    const clean = base.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    if (clean.length < 2) return [];
    const r = () => String(Math.floor(Math.random() * 90) + 10);
    const year = new Date().getFullYear();
    return [
      `${clean}${r()}`,
      `${clean}_${r()}`,
      `${clean}${year}`,
      `${clean}_snl`,
    ].filter((s) => s.length >= 3 && s.length <= 30);
  }

  async function checkUsername(val) {
    try {
      await authApi.checkUsername(val);
      setUsernameStatus("available");
      setSuggestions([]);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409 || status === 400 || status === 422) {
        setUsernameStatus("taken");
        setSuggestions(generateSuggestions(val));
      } else {
        setUsernameStatus(null);
      }
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  }

  function handleUsernameChange(e) {
    handleChange(e);
    const val = e.target.value.trim();
    setUsernameStatus(null);
    setSuggestions([]);
    if (usernameTimer.current) clearTimeout(usernameTimer.current);
    if (val.length < 3 || !/^[a-zA-Z0-9_]+$/.test(val)) return;
    setUsernameStatus("checking");
    usernameTimer.current = setTimeout(() => checkUsername(val), 600);
  }

  function pickSuggestion(username) {
    setFields((prev) => ({ ...prev, username }));
    setErrors((prev) => ({ ...prev, username: "" }));
    setSuggestions([]);
    setApiError("");
    if (usernameTimer.current) clearTimeout(usernameTimer.current);
    setUsernameStatus("checking");
    usernameTimer.current = setTimeout(() => checkUsername(username), 300);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const errs = validate(fields, locale);
      if (Object.keys(errs).length) { setErrors(errs); return; }

      setLoading(true);
      setApiError("");
      try {
        await register({
          username: fields.username.trim(),
          email: fields.email.trim(),
          phone: fields.phone,
          password: fields.password,
          referralCode: fields.referralCode.trim(),
          ...(fields.gender && { gender: fields.gender }),
        });
        setSuccess(true);
      } catch (err) {
        try {
          const { fieldErrors, apiError: msg } = parseFieldErrors(err, locale);
          if (fieldErrors) {
            setErrors((prev) => ({ ...prev, ...fieldErrors }));
            if (fieldErrors.username?.includes("taken")) {
              setUsernameStatus("taken");
              setSuggestions(generateSuggestions(fields.username));
            }
          }
          if (msg) setApiError(msg);
          else if (!fieldErrors) setApiError("Please check your information and try again.");
        } catch {
          setApiError("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    } catch {
      setLoading(false);
      setApiError("An unexpected error occurred. Please try again.");
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg flex flex-col items-center gap-6 text-center">
          <Link href={`${prefix}/`}><Image src="/images/logo Sunaala.png" alt="SUNALA" width={130} height={34} className="object-contain" priority /></Link>
          <div className="w-full bg-white/10 backdrop-blur-sm border-[3px] border-white/70 rounded-4xl px-8 py-10">

            {/* Icône enveloppe */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "rgba(230,184,76,0.15)", border: "2px solid rgba(230,184,76,0.35)" }}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#E6B84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22,6 12,13 2,6" stroke="#E6B84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h2 className="text-white font-bold text-[22px] mb-2">
              {locale === "fr" ? "Vérifiez votre boîte mail !" : "Check your inbox!"}
            </h2>
            <p className="text-white/60 text-[13px] mb-4">
              {locale === "fr" ? "Nous avons envoyé un lien à" : "We sent a verification link to"}
            </p>
            <p className="text-white font-semibold text-[15px] mb-6 break-all">{fields.email}</p>

            {/* Bloc d'instruction */}
            <div className="rounded-2xl px-5 py-4 mb-6 text-left" style={{ backgroundColor: "rgba(230,184,76,0.10)", border: "1px solid rgba(230,184,76,0.30)" }}>
              <p className="text-[13px] font-bold mb-2" style={{ color: "#E6B84C" }}>
                {locale === "fr" ? "⚠ Étape obligatoire avant de vous connecter" : "⚠ Required step before logging in"}
              </p>
              <ol className="flex flex-col gap-1.5 text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                <li>1. {locale === "fr" ? "Ouvrez votre boîte mail" : "Open your email inbox"}</li>
                <li>2. {locale === "fr" ? "Cliquez sur le lien de vérification" : "Click the verification link"}</li>
                <li>3. {locale === "fr" ? "Revenez vous connecter" : "Come back and log in"}</li>
              </ol>
            </div>

            <p className="text-white/40 text-[12px] mb-3">
              {locale === "fr"
                ? "Vous ne pourrez pas vous connecter tant que votre email n'est pas vérifié."
                : "You won't be able to log in until your email is verified."}
            </p>

            {/* Spam tip */}
            <div className="rounded-xl px-4 py-3 flex items-start gap-2.5" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <span className="text-[15px] shrink-0">📩</span>
              <p className="text-[12px] leading-relaxed text-left" style={{ color: "rgba(255,255,255,0.50)" }}>
                {locale === "fr"
                  ? "Vous ne trouvez pas le mail ? Pensez à vérifier vos courriers indésirables ou votre dossier spam."
                  : "Can't find the email? Make sure to check your spam or junk folder."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-215 flex flex-col items-center gap-6">

        <Link href={`${prefix}/`}><Image src="/images/logo Sunaala.png" alt="SUNALA" width={130} height={34} className="object-contain" priority /></Link>

        <Link href={`${prefix}/`} className="flex items-center gap-1.5 text-white/60 hover:text-white text-[13px] transition-colors -mt-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t("back_to_home")}
        </Link>

        <div className="w-full bg-white/10 backdrop-blur-sm border-[3px] border-white/70 rounded-4xl px-6 sm:px-22.75" style={{ paddingTop: 36, paddingBottom: 36 }}>

          <h1 className="text-white mb-5" style={{ fontSize: 28, fontWeight: 700 }}>{t("register_title")}</h1>

          {apiError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 text-[13px]">
              {apiError}
            </div>
          )}

          <form className="flex flex-col gap-4.5" onSubmit={handleSubmit} noValidate>

            {/* Username — check live + suggestions */}
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 14, fontWeight: 400, color: "#FFFFFF" }}>{t("username")}</label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={fields.username}
                  onChange={handleUsernameChange}
                  placeholder="ex: sunalaa_user"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className={`w-full bg-white text-gray-700 text-base placeholder:text-[#BCBEC0] outline-none focus:ring-2 transition ${
                    errors.username || usernameStatus === "taken"
                      ? "ring-2 ring-red-400"
                      : usernameStatus === "available"
                      ? "ring-2 ring-secondary/50"
                      : "focus:ring-secondary/50"
                  }`}
                  style={{
                    height: 42, borderRadius: 10,
                    border: `1px solid ${errors.username || usernameStatus === "taken" ? "#f87171" : usernameStatus === "available" ? "#3FAE8C" : "#BCBEC0"}`,
                    padding: "12px 40px 12px 16px",
                  }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {usernameStatus === "checking" && (
                    <svg className="animate-spin w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                  )}
                  {usernameStatus === "available" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {usernameStatus === "taken" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
              </div>

              {(errors.username || usernameStatus === "taken") && (
                <p className="text-red-400 text-[12px] mt-0.5">
                  {errors.username || t("username_taken")}
                </p>
              )}
              {usernameStatus === "available" && !errors.username && (
                <p className="text-[12px] flex items-center gap-1" style={{ color: "#3FAE8C" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t("username_available")}
                </p>
              )}
              {usernameStatus === "taken" && suggestions.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-0.5">
                  <p className="text-white/50 text-[12px]">{t("username_suggestions")}</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => pickSuggestion(s)}
                        className="px-3 py-1 rounded-full text-[12px] font-semibold bg-white/10 hover:bg-secondary/30 text-white border border-white/20 hover:border-secondary/60 transition cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Email / Téléphone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={t("email")} type="email" name="email" placeholder="john@example.com" value={fields.email} onChange={handleChange} error={errors.email} autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 14, fontWeight: 400, color: "#FFFFFF" }}>{t("phone")}</label>
                <div
                  style={{
                    "--react-international-phone-height": "42px",
                    "--react-international-phone-border-radius": "10px",
                    "--react-international-phone-border-color": errors.phone ? "#f87171" : "#BCBEC0",
                    "--react-international-phone-background-color": "#ffffff",
                    "--react-international-phone-text-color": "#374151",
                    "--react-international-phone-placeholder-color": "#BCBEC0",
                    "--react-international-phone-font-size": "14px",
                    "--react-international-phone-country-selector-background-color": "#ffffff",
                    "--react-international-phone-country-selector-background-color-hover": "#f9fafb",
                  }}
                >
                  <PhoneInput
                    defaultCountry="sn"
                    value={fields.phone}
                    onChange={(phone) => {
                      setFields((prev) => ({ ...prev, phone }));
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                      setApiError("");
                    }}
                    style={{ width: "100%" }}
                    inputStyle={{ width: "100%", fontSize: 16 }}
                  />
                </div>
                {errors.phone && <p className="text-red-400 text-[12px] mt-0.5">{errors.phone}</p>}
              </div>
            </div>

            {/* Mot de passe / Confirmation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 14, fontWeight: 400, color: "#FFFFFF" }}>{t("password")}</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={fields.password}
                    onChange={handleChange}
                    placeholder={t("password_placeholder")}
                    autoComplete="new-password"
                    className={`w-full bg-white text-gray-700 text-base placeholder:text-[#BCBEC0] outline-none focus:ring-2 transition ${errors.password ? "ring-2 ring-red-400" : "focus:ring-secondary/50"}`}
                    style={{ height: 42, borderRadius: 10, border: `1px solid ${errors.password ? "#f87171" : "#BCBEC0"}`, padding: "12px 40px 12px 16px" }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer" aria-label="Show password">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-[12px] mt-0.5">{errors.password}</p>}
              </div>

              {/* Confirm */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 14, fontWeight: 400, color: "#FFFFFF" }}>{t("confirm_password")}</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={fields.confirmPassword}
                    onChange={handleChange}
                    placeholder={t("confirm_password_placeholder")}
                    autoComplete="new-password"
                    className={`w-full bg-white text-gray-700 text-base placeholder:text-[#BCBEC0] outline-none focus:ring-2 transition ${errors.confirmPassword ? "ring-2 ring-red-400" : "focus:ring-secondary/50"}`}
                    style={{ height: 42, borderRadius: 10, border: `1px solid ${errors.confirmPassword ? "#f87171" : "#BCBEC0"}`, padding: "12px 40px 12px 16px" }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer" aria-label="Show confirmation">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-[12px] mt-0.5">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Genre (optionnel) */}
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 14, fontWeight: 400, color: "#FFFFFF" }}>{t("gender_optional")}</label>
              <select
                name="gender"
                value={fields.gender}
                onChange={handleChange}
                className="w-full bg-white text-gray-700 text-sm outline-none focus:ring-2 focus:ring-secondary/50 transition cursor-pointer"
                style={{ height: 42, borderRadius: 10, border: "1px solid #BCBEC0", padding: "0 16px" }}
              >
                <option value="">{t("gender_select")}</option>
                <option value="MALE">{t("gender_male")}</option>
                <option value="FEMALE">{t("gender_female")}</option>
                <option value="OTHER">{t("gender_other")}</option>
              </select>
            </div>

            {/* Code de parrainage */}
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 14, fontWeight: 400, color: "#FFFFFF" }}>
                {t("referral_code_required")} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="referralCode"
                value={fields.referralCode}
                onChange={handleChange}
                placeholder={t("referral_placeholder")}
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="off"
                className={`w-full bg-white text-gray-700 text-base placeholder:text-[#BCBEC0] outline-none focus:ring-2 transition ${errors.referralCode ? "ring-2 ring-red-400" : "focus:ring-secondary/50"}`}
                style={{ height: 42, borderRadius: 10, border: `1px solid ${errors.referralCode ? "#f87171" : refFromUrl ? "#3FAE8C" : "#BCBEC0"}`, padding: "12px 16px" }}
              />
              {errors.referralCode && <p className="text-red-400 text-[12px] mt-0.5">{errors.referralCode}</p>}
              {refFromUrl && !errors.referralCode && (
                <p className="text-[12px] flex items-center gap-1" style={{ color: "#3FAE8C" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t("referral_prefilled")}
                </p>
              )}
            </div>

            {/* Info parrainage */}
            {!refFromUrl && (
              <div className="rounded-lg px-4 py-3" style={{ backgroundColor: "rgba(230,184,76,0.18)", border: "1px solid rgba(230,184,76,0.55)" }}>
                <p className="text-[13px] font-bold mb-1" style={{ color: "#E6B84C" }}>{t("referral_warning_title")}</p>
                <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.80)" }}>
                  {t("referral_warning_desc").split("SUNALAA").map((part, i, arr) =>
                    i < arr.length - 1
                      ? <span key={i}>{part}<strong style={{ color: "#E6B84C" }}>SUNALAA</strong></span>
                      : <span key={i}>{part}</span>
                  )}
                </p>
              </div>
            )}

            {/* CGU */}
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="terms"
                  name="agreed"
                  checked={fields.agreed}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 accent-secondary cursor-pointer shrink-0"
                />
                <label htmlFor="terms" className="cursor-pointer" style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
                  {t("terms_accept")}{" "}
                  <Link href={`${prefix}/cgu`} className="text-secondary hover:underline">{t("terms_of_service")}</Link>{" "}
                  {t("terms_and")}{" "}
                  <Link href={`${prefix}/confidentialite`} className="text-secondary hover:underline">{t("privacy_policy")}</Link>
                </label>
              </div>
              {errors.agreed && <p className="text-red-400 text-[12px] ml-6">{errors.agreed}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-white font-semibold text-[15px] py-3.5 rounded-xl hover:brightness-90 transition mt-1 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              )}
              {loading ? t("register_loading") : t("register_btn")}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/50 text-[13px]">{t("or_continue_with")}</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          <div className="flex gap-3">
            <button type="button" aria-label="Google" onClick={handleGoogleLogin} className="flex-1 flex items-center justify-center gap-2.5 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition cursor-pointer text-sm font-medium text-gray-700">
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {t("continue_google")}
            </button>
          </div>

          <p className="text-center text-white/60 text-[13px] mt-5">
            {t("already_account")}{" "}
            <Link href={`${prefix}/login`} className="text-white font-semibold underline underline-offset-2 hover:text-secondary transition-colors">
              {t("sign_in")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary" />}>
      <RegisterInner />
    </Suspense>
  );
}
