"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { authApi, usersApi } from "@/lib/api";

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
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const prefix = locale === "fr" ? "/fr" : "";

  const [username, setUsername]             = useState("");
  const [usernameStatus, setUsernameStatus] = useState(null); // null | "checking" | "available" | "taken"
  const [suggestions, setSuggestions]       = useState([]);
  const [error, setError]                   = useState("");
  const [loading, setLoading]               = useState(false);
  const [fromOAuth, setFromOAuth]           = useState(false);
  const usernameTimer = useRef(null);

  useEffect(() => {
    try {
      const flag = sessionStorage.getItem("snl_needs_username_setup");
      setFromOAuth(flag === "1");
    } catch {}
  }, []);

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

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = username.trim();

    if (!trimmed) { setError("Please enter a username"); return; }
    if (trimmed.length < 3) { setError("Minimum 3 characters"); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) { setError("Letters, numbers and _ only"); return; }
    if (usernameStatus === "taken") { setError("This username is already taken — pick another"); return; }

    setLoading(true);
    setError("");
    try {
      await usersApi.setUsername(trimmed);
      await refreshUser();
      try { sessionStorage.removeItem("snl_needs_username_setup"); } catch {}
      router.replace(`${prefix}/profil`);
    } catch (err) {
      const msg = err?.response?.data?.message;
      if (typeof msg === "string" && (msg.toLowerCase().includes("taken") || msg.toLowerCase().includes("exist"))) {
        setUsernameStatus("taken");
        setSuggestions(generateSuggestions(trimmed));
        setError("This username is already taken");
      } else {
        setError(Array.isArray(msg) ? msg.join(". ") : (msg || "An error occurred. Please try again."));
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSkip() {
    try { sessionStorage.removeItem("snl_needs_username_setup"); } catch {}
    router.replace(`${prefix}/profil`);
  }

  const currentAutoUsername = user?.username ?? "";

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md flex flex-col items-center gap-6">

        <Image src="/images/logo Sunaala.png" alt="SUNALA" width={120} height={32} className="object-contain" priority />

        <div className="w-full bg-white/10 backdrop-blur-sm border-[3px] border-white/70 rounded-4xl px-6 py-8">

          {/* Header */}
          <div className="flex flex-col items-center text-center gap-2 mb-7">
            <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mb-1">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-white font-bold text-[22px]">Choose your username</h1>
            <p className="text-white/60 text-[13px] leading-relaxed">
              Your username is permanent and used in your referral link.<br />
              <span style={{ color: "#E6B84C" }}>Choose wisely — it cannot be changed later.</span>
            </p>
          </div>

          {/* Auto-generated preview */}
          {currentAutoUsername && (
            <div className="mb-5 px-4 py-3 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <p className="text-[12px] text-white/40 mb-0.5">Auto-generated username</p>
              <p className="text-white font-mono text-[14px]">{currentAutoUsername}</p>
              <p className="text-[11px] text-white/30 mt-0.5">Your referral link: sunalaa.com/ref/{currentAutoUsername}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Username input */}
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 14, fontWeight: 400, color: "#FFFFFF" }}>New username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={handleChange}
                  placeholder="ex: hono_snl"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className={`w-full bg-white text-gray-700 text-sm placeholder:text-[#BCBEC0] outline-none focus:ring-2 transition ${
                    error || usernameStatus === "taken"
                      ? "ring-2 ring-red-400"
                      : usernameStatus === "available"
                      ? "ring-2 ring-secondary/50"
                      : "focus:ring-secondary/50"
                  }`}
                  style={{
                    height: 44, borderRadius: 10,
                    border: `1px solid ${error || usernameStatus === "taken" ? "#f87171" : usernameStatus === "available" ? "#3FAE8C" : "#BCBEC0"}`,
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

              {(error || usernameStatus === "taken") && (
                <p className="text-red-400 text-[12px] mt-0.5">{error || "This username is already taken"}</p>
              )}
              {usernameStatus === "available" && !error && (
                <p className="text-[12px] flex items-center gap-1" style={{ color: "#3FAE8C" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Username available — your link: sunalaa.com/ref/{username.trim()}
                </p>
              )}

              {/* Suggestions */}
              {usernameStatus === "taken" && suggestions.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-0.5">
                  <p className="text-white/50 text-[12px]">Try one of these:</p>
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

            {/* Referral link preview */}
            {username.trim().length >= 3 && /^[a-zA-Z0-9_]+$/.test(username.trim()) && usernameStatus !== "taken" && (
              <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: "rgba(63,174,140,0.12)", border: "1px solid rgba(63,174,140,0.3)" }}>
                <p className="text-[11px] text-white/40 mb-0.5">Your referral link will be</p>
                <p className="text-[13px] font-semibold" style={{ color: "#3FAE8C" }}>
                  sunalaa.com/ref/{username.trim()}
                </p>
              </div>
            )}

            {/* Buttons */}
            <button
              type="submit"
              disabled={loading || usernameStatus === "checking" || usernameStatus === "taken"}
              className="w-full bg-secondary text-white font-semibold text-[15px] py-3.5 rounded-xl hover:brightness-90 transition mt-1 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              )}
              {loading ? "Saving..." : "Confirm username"}
            </button>

            {fromOAuth && (
              <button
                type="button"
                onClick={handleSkip}
                className="w-full text-white/40 hover:text-white/70 text-[13px] transition cursor-pointer py-1"
              >
                Skip for now — keep auto-generated username
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
