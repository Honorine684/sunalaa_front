"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { parseFieldErrors } from "@/lib/api";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

/* ─── Validation ─────────────────────────────────────────────────── */
function validate(fields) {
  const errors = {};

  if (!fields.firstName.trim()) errors.firstName = "First name is required";
  if (!fields.lastName.trim()) errors.lastName = "Last name is required";

  if (!fields.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Invalid email format";
  }

  const digitsOnly = (fields.phone || "").replace(/\D/g, "");
  if (digitsOnly.length < 8) {
    errors.phone = "Valid phone number is required";
  }

  if (!fields.password) {
    errors.password = "Password is required";
  } else if (fields.password.length < 8) {
    errors.password = "Minimum 8 characters";
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(fields.password)) {
    errors.password = "Must contain uppercase, lowercase and number";
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (fields.password !== fields.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!fields.referralCode.trim()) errors.referralCode = "Referral code is required";

  if (!fields.agreed) errors.agreed = "You must accept the terms";

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
          className={`w-full bg-white text-gray-700 text-sm placeholder:text-[#BCBEC0] outline-none focus:ring-2 transition ${error ? "ring-2 ring-red-400" : "focus:ring-secondary/50"}`}
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
  const refFromUrl = searchParams.get("ref") ?? "";

  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
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

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError("");
    try {
      await register({
        firstName: fields.firstName.trim(),
        lastName: fields.lastName.trim(),
        email: fields.email.trim(),
        phone: fields.phone,
        password: fields.password,
        referralCode: fields.referralCode.trim(),
        ...(fields.gender && { gender: fields.gender }),
      });
      setSuccess(true);
    } catch (err) {
      const { fieldErrors, apiError: msg } = parseFieldErrors(err);
      if (fieldErrors) setErrors((prev) => ({ ...prev, ...fieldErrors }));
      if (msg) setApiError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg flex flex-col items-center gap-6 text-center">
          <Link href="/"><Image src="/images/logo Sunaala.png" alt="SUNALA" width={130} height={34} className="object-contain" priority /></Link>
          <div className="w-full bg-white/10 backdrop-blur-sm border-[3px] border-white/70 rounded-4xl px-8 py-10">
            <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-white font-bold text-[22px] mb-3">Account created!</h2>
            <p className="text-white/70 text-[14px] leading-relaxed mb-6">
              A verification email has been sent to <strong className="text-white">{fields.email}</strong>.<br />
              Check your inbox to activate your account.
            </p>
            <Link href="/login" className="inline-flex items-center justify-center w-full bg-secondary text-white font-semibold text-[15px] py-3.5 rounded-xl hover:brightness-90 transition">
              Go to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-215 flex flex-col items-center gap-6">

        <Link href="/"><Image src="/images/logo Sunaala.png" alt="SUNALA" width={130} height={34} className="object-contain" priority /></Link>

        <Link href="/" className="flex items-center gap-1.5 text-white/60 hover:text-white text-[13px] transition-colors -mt-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to home
        </Link>

        <div className="w-full bg-white/10 backdrop-blur-sm border-[3px] border-white/70 rounded-4xl px-6 sm:px-22.75" style={{ paddingTop: 36, paddingBottom: 36 }}>

          <h1 className="text-white mb-5" style={{ fontSize: 28, fontWeight: 700 }}>Register</h1>

          {apiError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 text-[13px]">
              {apiError}
            </div>
          )}

          <form className="flex flex-col gap-4.5" onSubmit={handleSubmit} noValidate>

            {/* Prénom / Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First name" name="firstName" placeholder="John" value={fields.firstName} onChange={handleChange} error={errors.firstName} autoComplete="given-name" />
              <Field label="Last name" name="lastName" placeholder="Doe" value={fields.lastName} onChange={handleChange} error={errors.lastName} autoComplete="family-name" />
            </div>

            {/* Email / Téléphone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email" type="email" name="email" placeholder="john@example.com" value={fields.email} onChange={handleChange} error={errors.email} autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 14, fontWeight: 400, color: "#FFFFFF" }}>Phone</label>
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
                    inputStyle={{ width: "100%", fontSize: 14 }}
                  />
                </div>
                {errors.phone && <p className="text-red-400 text-[12px] mt-0.5">{errors.phone}</p>}
              </div>
            </div>

            {/* Mot de passe / Confirmation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: 14, fontWeight: 400, color: "#FFFFFF" }}>Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={fields.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    className={`w-full bg-white text-gray-700 text-sm placeholder:text-[#BCBEC0] outline-none focus:ring-2 transition ${errors.password ? "ring-2 ring-red-400" : "focus:ring-secondary/50"}`}
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
                <label style={{ fontSize: 14, fontWeight: 400, color: "#FFFFFF" }}>Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={fields.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    className={`w-full bg-white text-gray-700 text-sm placeholder:text-[#BCBEC0] outline-none focus:ring-2 transition ${errors.confirmPassword ? "ring-2 ring-red-400" : "focus:ring-secondary/50"}`}
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
              <label style={{ fontSize: 14, fontWeight: 400, color: "#FFFFFF" }}>Gender <span className="text-white/40">(optional)</span></label>
              <select
                name="gender"
                value={fields.gender}
                onChange={handleChange}
                className="w-full bg-white text-gray-700 text-sm outline-none focus:ring-2 focus:ring-secondary/50 transition cursor-pointer"
                style={{ height: 42, borderRadius: 10, border: "1px solid #BCBEC0", padding: "0 16px" }}
              >
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Code de parrainage */}
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 14, fontWeight: 400, color: "#FFFFFF" }}>
                Referral code <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="referralCode"
                value={fields.referralCode}
                onChange={handleChange}
                placeholder="Enter your referral code"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="off"
                className={`w-full bg-white text-gray-700 text-sm placeholder:text-[#BCBEC0] outline-none focus:ring-2 transition ${errors.referralCode ? "ring-2 ring-red-400" : "focus:ring-secondary/50"}`}
                style={{ height: 42, borderRadius: 10, border: `1px solid ${errors.referralCode ? "#f87171" : refFromUrl ? "#3FAE8C" : "#BCBEC0"}`, padding: "12px 16px" }}
              />
              {errors.referralCode && <p className="text-red-400 text-[12px] mt-0.5">{errors.referralCode}</p>}
              {refFromUrl && !errors.referralCode && (
                <p className="text-[12px] flex items-center gap-1" style={{ color: "#3FAE8C" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Code pre-filled from your invitation link
                </p>
              )}
            </div>

            {/* Info parrainage */}
            {!refFromUrl && (
              <div className="rounded-lg px-4 py-3" style={{ backgroundColor: "rgba(230,184,76,0.18)", border: "1px solid rgba(230,184,76,0.55)" }}>
                <p className="text-[13px] font-bold mb-1" style={{ color: "#E6B84C" }}>⚠ Required code</p>
                <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.80)" }}>
                  Every registration requires a referral code.<br />
                  → Default active code <strong style={{ color: "#E6B84C" }}>SUNALAA</strong>. You can replace it if you have another code.
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
                  I accept the{" "}
                  <Link href="/terms" className="text-secondary hover:underline">Terms of Service</Link>{" "}
                  and the{" "}
                  <Link href="/privacy" className="text-secondary hover:underline">Privacy Policy</Link>
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
              {loading ? "Creating account..." : "Create my account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/50 text-[13px]">continue with</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          <div className="flex gap-3">
            <button type="button" aria-label="Google" className="flex-1 flex items-center justify-center gap-2.5 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition cursor-pointer text-sm font-medium text-gray-700">
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
          </div>

          <p className="text-center text-white/60 text-[13px] mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-white font-semibold underline underline-offset-2 hover:text-secondary transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterInner />
    </Suspense>
  );
}
