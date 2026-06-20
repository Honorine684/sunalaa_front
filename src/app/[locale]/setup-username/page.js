"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { authApi, usersApi } from "@/lib/api";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

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

export default function SetupUsernamePage() {
  const { refreshUser } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const prefix = locale === "fr" ? "/fr" : "";

  // Username
  const [username, setUsername]             = useState("");
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [suggestions, setSuggestions]       = useState([]);

  // Phone
  const [phone, setPhone] = useState("");

  // Referral
  const [refCode, setRefCode]   = useState("SUNALAA");
  const [refStatus, setRefStatus] = useState("checking");
  const [sponsor, setSponsor]   = useState(null);

  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const usernameTimer = useRef(null);
  const refTimer      = useRef(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("snl_ref_code");
      const code = saved || "SUNALAA";
      setRefCode(code);
      checkReferral(code);
    } catch {
      checkReferral("SUNALAA");
    }
  }, []);

  // ── Username ──────────────────────────────────────────────────────
  async function checkUsername(val) {
    try {
      await authApi.checkUsername(val);
      setUsernameStatus("available");
      setSuggestions([]);
    } catch (err) {
      const s = err?.response?.status;
      if (s === 409 || s === 400 || s === 422) {
        setUsernameStatus("taken");
        setSuggestions(generateSuggestions(val));
      } else {
        setUsernameStatus(null);
      }
    }
  }

  function handleUsernameChange(e) {
    const val = e.target.value;
    setUsername(val);
    setError("");
    setUsernameStatus(null);
    setSuggestions([]);
    if (usernameTimer.current) clearTimeout(usernameTimer.current);
    const trimmed = val.trim();
    if (trimmed.length < 3 || !/^[a-zA-Z0-9_]+$/.test(trimmed)) return;
    setUsernameStatus("checking");
    usernameTimer.current = setTimeout(() => checkUsername(trimmed), 600);
  }

  function pickSuggestion(s) {
    setUsername(s);
    setError("");
    setSuggestions([]);
    if (usernameTimer.current) clearTimeout(usernameTimer.current);
    setUsernameStatus("checking");
    usernameTimer.current = setTimeout(() => checkUsername(s), 300);
  }

  // ── Referral ──────────────────────────────────────────────────────
  async function checkReferral(code) {
    try {
      const { data } = await authApi.checkReferral(code);
      const sp = data?.sponsor ?? data?.data?.sponsor ?? null;
      setSponsor(sp);
      setRefStatus("valid");
    } catch {
      setSponsor(null);
      setRefStatus("invalid");
    }
  }

  function handleRefChange(e) {
    const val = e.target.value;
    setRefCode(val);
    setError("");
    setSponsor(null);
    if (refTimer.current) clearTimeout(refTimer.current);
    if (!val.trim()) { setRefStatus(null); return; }
    setRefStatus("checking");
    refTimer.current = setTimeout(() => checkReferral(val.trim()), 600);
  }

  // ── Submit ────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedRef      = refCode.trim();
    const digitsOnly      = phone.replace(/\D/g, "");

    if (!trimmedUsername)                       { setError("Please enter a username"); return; }
    if (trimmedUsername.length < 3)             { setError("Minimum 3 characters"); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) { setError("Letters, numbers and _ only"); return; }
    if (usernameStatus === "taken")             { setError("This username is already taken"); return; }
    if (digitsOnly.length < 8)                 { setError("Please enter a valid phone number"); return; }
    if (!trimmedRef)                            { setError("A referral code is required"); return; }
    if (refStatus === "invalid")               { setError("This referral code is invalid"); return; }
    if (refStatus === "checking")              { setError("Please wait while we verify the referral code"); return; }

    setLoading(true);
    setError("");
    try {
      await usersApi.setUsername(trimmedUsername, phone, trimmedRef);
      await refreshUser();
      try {
        sessionStorage.removeItem("snl_needs_username_setup");
        sessionStorage.removeItem("snl_ref_code");
      } catch {}
      router.replace(`${prefix}/profil`);
    } catch (err) {
      const msg = err?.response?.data?.message;
      const str = typeof msg === "string" ? msg.toLowerCase() : "";
      if (str.includes("taken") || str.includes("username")) {
        setUsernameStatus("taken");
        setSuggestions(generateSuggestions(trimmedUsername));
        setError("This username is already taken");
      } else if (str.includes("referral") || str.includes("code")) {
        setRefStatus("invalid");
        setError("This referral code is invalid");
      } else if (str.includes("phone")) {
        setError("Please enter a valid phone number");
      } else {
        setError(Array.isArray(msg) ? msg.join(". ") : (msg || "An error occurred. Please try again."));
      }
    } finally {
      setLoading(false);
    }
  }

  const canSubmit =
    !loading &&
    usernameStatus === "available" &&
    phone.replace(/\D/g, "").length >= 8 &&
    refStatus === "valid";

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md flex flex-col items-center gap-6">

        <Image src="/images/logo Sunaala.png" alt="SUNALA" width={120} height={32} className="object-contain" priority />

        <div className="w-full bg-white/10 backdrop-blur-sm border-[3px] border-white/70 rounded-4xl px-6 py-8">

          <div className="flex flex-col items-center text-center gap-2 mb-7">
            <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mb-1">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-white font-bold text-[22px]">Finalize your account</h1>
            <p className="text-white/60 text-[13px] leading-relaxed">
              A few details to complete your SUNALA profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* ── Username ── */}
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 14, fontWeight: 500, color: "#FFFFFF" }}>Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="ex: hono_snl"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className={`w-full bg-white text-gray-700 text-sm placeholder:text-[#BCBEC0] outline-none focus:ring-2 transition ${
                    usernameStatus === "taken" ? "ring-2 ring-red-400" : usernameStatus === "available" ? "ring-2 ring-secondary/50" : "focus:ring-secondary/50"
                  }`}
                  style={{
                    height: 44, borderRadius: 10,
                    border: `1px solid ${usernameStatus === "taken" ? "#f87171" : usernameStatus === "available" ? "#3FAE8C" : "#BCBEC0"}`,
                    padding: "12px 40px 12px 16px",
                  }}
                />
                <StatusIcon status={usernameStatus} />
              </div>

              {usernameStatus === "taken" && (
                <p className="text-red-400 text-[12px]">This username is already taken</p>
              )}
              {usernameStatus === "available" && (
                <p className="text-[12px] flex items-center gap-1" style={{ color: "#3FAE8C" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Available — sunalaa.com/ref/{username.trim()}
                </p>
              )}
              {usernameStatus === "taken" && suggestions.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-white/50 text-[12px]">Try one of these:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button key={s} type="button" onClick={() => pickSuggestion(s)}
                        className="px-3 py-1 rounded-full text-[12px] font-semibold bg-white/10 hover:bg-secondary/30 text-white border border-white/20 hover:border-secondary/60 transition cursor-pointer">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Phone ── */}
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 14, fontWeight: 500, color: "#FFFFFF" }}>Phone number</label>
              <div style={{
                "--react-international-phone-height": "44px",
                "--react-international-phone-border-radius": "10px",
                "--react-international-phone-border-color": "#BCBEC0",
                "--react-international-phone-background-color": "#ffffff",
                "--react-international-phone-text-color": "#374151",
                "--react-international-phone-placeholder-color": "#BCBEC0",
                "--react-international-phone-font-size": "14px",
                "--react-international-phone-country-selector-background-color": "#ffffff",
                "--react-international-phone-country-selector-background-color-hover": "#f9fafb",
              }}>
                <PhoneInput
                  defaultCountry="sn"
                  value={phone}
                  onChange={(val) => setPhone(val)}
                  style={{ width: "100%" }}
                  inputStyle={{ width: "100%", fontSize: 14 }}
                />
              </div>
            </div>

            {/* ── Referral code ── */}
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 14, fontWeight: 500, color: "#FFFFFF" }}>
                Referral code <span style={{ color: "#E6B84C", fontSize: 12 }}>* required</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={refCode}
                  onChange={handleRefChange}
                  placeholder="ex: hono_snl"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className={`w-full bg-white text-gray-700 text-sm placeholder:text-[#BCBEC0] outline-none focus:ring-2 transition ${
                    refStatus === "invalid" ? "ring-2 ring-red-400" : refStatus === "valid" ? "ring-2 ring-secondary/50" : "focus:ring-secondary/50"
                  }`}
                  style={{
                    height: 44, borderRadius: 10,
                    border: `1px solid ${refStatus === "invalid" ? "#f87171" : refStatus === "valid" ? "#3FAE8C" : "#BCBEC0"}`,
                    padding: "12px 40px 12px 16px",
                  }}
                />
                <StatusIcon status={refStatus} />
              </div>

              {refStatus === "invalid" && (
                <p className="text-red-400 text-[12px]">This referral code is invalid or does not exist</p>
              )}
              {refStatus === "valid" && sponsor && (
                <p className="text-[12px] flex items-center gap-1" style={{ color: "#3FAE8C" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sponsored by {sponsor.firstName ? `${sponsor.firstName} (@${sponsor.username})` : `@${sponsor.username}`}
                </p>
              )}
            </div>

            {/* Global error */}
            {error && (
              <p className="text-red-400 text-[13px] text-center -mt-1">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-secondary text-white font-semibold text-[15px] py-3.5 rounded-xl hover:brightness-90 transition mt-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              )}
              {loading ? "Saving..." : "Join SUNALA"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

function StatusIcon({ status }) {
  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      {status === "checking" && (
        <svg className="animate-spin w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      )}
      {(status === "valid" || status === "available") && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {(status === "taken" || status === "invalid") && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )}
    </div>
  );
}
