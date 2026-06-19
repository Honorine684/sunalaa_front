"use client";

import { useState, useEffect } from "react";
import { authApi, getApiError } from "@/lib/api";
import { usePushNotifications } from "@/hooks/usePushNotifications";

/* ── Change Password ── */
function EyeIcon({ visible }) {
  return visible ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

function ChangePasswordForm() {
  const [fields, setFields] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [showFields, setShowFields] = useState({ currentPassword: false, newPassword: false, confirm: false });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!fields.currentPassword) e.currentPassword = "Required";
    if (!fields.newPassword) e.newPassword = "Required";
    else if (fields.newPassword.length < 8) e.newPassword = "Minimum 8 characters";
    else if (!/[A-Z]/.test(fields.newPassword)) e.newPassword = "Must contain at least one uppercase letter";
    else if (!/[a-z]/.test(fields.newPassword)) e.newPassword = "Must contain at least one lowercase letter";
    else if (!/[0-9]/.test(fields.newPassword)) e.newPassword = "Must contain at least one number";
    else if (!/[@$!%*?&]/.test(fields.newPassword)) e.newPassword = "Must contain at least one special character: @ $ ! % * ? &";
    if (!e.newPassword && fields.newPassword === fields.currentPassword) e.newPassword = "Must be different from the old one";
    if (!fields.confirm) e.confirm = "Required";
    else if (fields.confirm !== fields.newPassword) e.confirm = "Passwords do not match";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError("");
    setSuccess("");
    try {
      await authApi.changePassword({ currentPassword: fields.currentPassword, newPassword: fields.newPassword });
      setSuccess("Password changed successfully.");
      setFields({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      setApiError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  function handleChange(key, val) {
    setFields((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: "" }));
    setApiError("");
    setSuccess("");
  }

  return (
    <div>
      <p className="text-[16px] font-bold mb-4" style={{ color: "#0F172B" }}>Change password</p>

      {apiError && (
        <div className="mb-3 px-4 py-2.5 rounded-xl text-[13px]" style={{ backgroundColor: "#FFF1F2", color: "#E11D48", border: "1px solid #FFE4E6" }}>
          {apiError}
        </div>
      )}
      {success && (
        <div className="mb-3 px-4 py-2.5 rounded-xl text-[13px]" style={{ backgroundColor: "#ECFDF5", color: "#059669", border: "1px solid #D1FAE5" }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
        {[
          { key: "currentPassword", label: "Current password", placeholder: "••••••••" },
          { key: "newPassword", label: "New password", placeholder: "Minimum 8 characters" },
          { key: "confirm", label: "Confirm new password", placeholder: "Repeat new password" },
        ].map(({ key, label, placeholder }) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-[14px]" style={{ color: "#45556C" }}>{label}</label>
            <div className="relative">
              <input
                type={showFields[key] ? "text" : "password"}
                value={fields[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className={`w-full border rounded-xl px-4 py-2.5 pr-10 text-[15px] outline-none focus:ring-2 focus:ring-secondary/30 transition bg-white ${errors[key] ? "border-red-400 ring-1 ring-red-300" : "border-slate-200"}`}
                style={{ color: "#0F172B" }}
              />
              <button type="button"
                onClick={() => setShowFields((p) => ({ ...p, [key]: !p[key] }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                <EyeIcon visible={showFields[key]} />
              </button>
            </div>
            {errors[key] && <p className="text-red-400 text-[11px]">{errors[key]}</p>}
          </div>
        ))}

        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl text-white text-[15px] font-semibold hover:brightness-90 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
          style={{ backgroundColor: "#1F4E46" }}>
          {loading && <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
          {loading ? "Changing..." : "Change password"}
        </button>
      </form>
    </div>
  );
}

/* ── 2FA ── */
function TwoFactorSection({ user }) {
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.twoFactorEnabled ?? user?.tfaEnabled ?? false);
  const [step, setStep] = useState("idle"); // idle | setup | verify | disable
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSetup() {
    setLoading(true);
    setError("");
    try {
      const res = await authApi.setup2FA();
      const d = res.data?.data ?? res.data;
      setQrCode(d?.qrCode ?? d?.qr ?? "");
      setSecret(d?.secret ?? d?.manualCode ?? "");
      setStep("setup");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleEnable(e) {
    e.preventDefault();
    if (!code.trim()) { setError("Code required"); return; }
    setLoading(true);
    setError("");
    try {
      await authApi.enable2FA(code.trim());
      setIs2FAEnabled(true);
      setSuccess("2FA enabled successfully.");
      setStep("idle");
      setCode("");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleDisable(e) {
    e.preventDefault();
    if (!code.trim()) { setError("Code required"); return; }
    setLoading(true);
    setError("");
    try {
      await authApi.disable2FA(code.trim());
      setIs2FAEnabled(false);
      setSuccess("2FA disabled.");
      setStep("idle");
      setCode("");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-4 border-t border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[16px] font-bold" style={{ color: "#0F172B" }}>Two-factor authentication (2FA)</p>
          <p className="text-[12px]" style={{ color: "#45556C" }}>
            Status: <span className="font-semibold" style={{ color: is2FAEnabled ? "#059669" : "#94A3B8" }}>
              {is2FAEnabled ? "Enabled" : "Disabled"}
            </span>
          </p>
        </div>
        {step === "idle" && (
          <button
            onClick={is2FAEnabled ? () => setStep("disable") : handleSetup}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-[13px] font-semibold transition cursor-pointer disabled:opacity-50"
            style={is2FAEnabled
              ? { backgroundColor: "#FFF1F2", color: "#E11D48" }
              : { backgroundColor: "#ECFDF5", color: "#059669" }}>
            {loading ? "..." : is2FAEnabled ? "Disable" : "Enable"}
          </button>
        )}
      </div>

      {error && <p className="text-red-400 text-[12px] mb-2">{error}</p>}
      {success && <p className="text-[12px] mb-2" style={{ color: "#059669" }}>{success}</p>}

      {step === "setup" && (
        <div className="flex flex-col gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">

          {/* Étapes */}
          <div className="flex flex-col gap-2">
            {[
              { n: "1", text: "Download the app", sub: "Google Authenticator or Authy on your phone" },
              { n: "2", text: "Scan the QR code", sub: "Open the app and scan the image below" },
              { n: "3", text: "Enter the code", sub: "Enter the 6-digit code generated by the app" },
            ].map(({ n, text, sub }) => (
              <div key={n} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white text-[11px] font-bold" style={{ backgroundColor: "#1F4E46" }}>{n}</div>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>{text}</p>
                  <p className="text-[12px]" style={{ color: "#45556C" }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200" />

          {qrCode && (
            <div className="flex flex-col items-center gap-2">
              <img src={qrCode} alt="QR Code 2FA" className="w-44 h-44 rounded-xl border border-slate-200 bg-white p-2" />
              <p className="text-[11px]" style={{ color: "#94A3B8" }}>No camera? Use the manual code below</p>
            </div>
          )}

          {secret && (
            <div className="flex flex-col items-center gap-1">
              <p className="text-[12px]" style={{ color: "#45556C" }}>Manual code:</p>
              <code className="font-mono text-[13px] font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200 select-all tracking-widest" style={{ color: "#1F4E46" }}>
                {secret}
              </code>
            </div>
          )}

          <div className="border-t border-slate-200" />

          <div className="flex flex-col gap-1">
            <p className="text-[13px] font-semibold mb-1" style={{ color: "#0F172B" }}>Verification code</p>
            <form onSubmit={handleEnable} className="flex gap-2">
              <input type="text" inputMode="numeric" value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(""); }}
                placeholder="000000"
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-[16px] font-mono text-center outline-none focus:ring-2 focus:ring-secondary/30 bg-white tracking-widest"
                style={{ color: "#0F172B" }} maxLength={6} />
              <button type="submit" disabled={loading || code.length !== 6}
                className="px-4 py-2 rounded-xl text-white text-[13px] font-semibold cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: "#3FAE8C" }}>
                {loading ? "..." : "Enable"}
              </button>
            </form>
            <p className="text-[11px] mt-0.5" style={{ color: "#94A3B8" }}>The code changes every 30 seconds</p>
          </div>

          <button onClick={() => { setStep("idle"); setCode(""); setError(""); }}
            className="text-[12px] text-center cursor-pointer" style={{ color: "#94A3B8" }}>
            Cancel
          </button>
        </div>
      )}

      {step === "disable" && (
        <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50">
          <p className="text-[13px]" style={{ color: "#45556C" }}>Enter your 2FA code to disable:</p>
          <form onSubmit={handleDisable} className="flex gap-2">
            <input type="text" value={code} onChange={(e) => { setCode(e.target.value); setError(""); }}
              placeholder="6-digit code"
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-secondary/30 bg-white"
              style={{ color: "#0F172B" }} maxLength={6} />
            <button type="submit" disabled={loading}
              className="px-4 py-2 rounded-xl text-white text-[13px] font-semibold cursor-pointer disabled:opacity-60"
              style={{ backgroundColor: "#E11D48" }}>
              {loading ? "..." : "Disable"}
            </button>
          </form>
          <button onClick={() => { setStep("idle"); setCode(""); setError(""); }}
            className="text-[12px] text-center cursor-pointer" style={{ color: "#94A3B8" }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Push Notifications ── */
function PushNotifSection() {
  const { subscribe, unsubscribe } = usePushNotifications();
  const [enabled, setEnabled]   = useState(false);
  const [loading, setLoading]   = useState(true);
  const [blocked, setBlocked]   = useState(false);
  const [feedback, setFeedback] = useState(null); // "granted" | "denied" | "error"

  // Source de vérité : le navigateur lui-même
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setLoading(false);
      return;
    }
    setBlocked(Notification.permission === "denied");
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setEnabled(sub !== null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (typeof window === "undefined" || !("PushManager" in window)) return null;

  async function handleToggle() {
    if (enabled) {
      setLoading(true);
      await unsubscribe();
      setEnabled(false);
      setFeedback(null);
      setLoading(false);
    } else {
      setLoading(true);
      const result = await subscribe();
      setLoading(false);
      if (result.ok) {
        setEnabled(true);
        setFeedback("granted");
      } else if (result.reason === "denied") {
        setBlocked(true);
        setFeedback("denied");
      } else {
        setFeedback("error");
      }
    }
  }

  return (
    <div className="pt-4 border-t border-slate-100">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[16px] font-bold" style={{ color: "#0F172B" }}>Push notifications</p>
          <p className="text-[12px] mt-0.5" style={{ color: "#45556C" }}>
            {blocked
              ? "Blocked by your browser — enable in browser settings"
              : enabled
              ? <span className="font-semibold" style={{ color: "#059669" }}>Enabled</span>
              : <span style={{ color: "#94A3B8" }}>Disabled</span>
            }
          </p>
          {feedback === "denied" && (
            <p className="text-[11px] mt-1" style={{ color: "#F59E0B" }}>
              Go to your browser settings → Notifications → Allow sunalaa.com
            </p>
          )}
          {feedback === "granted" && (
            <p className="text-[11px] mt-1" style={{ color: "#059669" }}>Notifications successfully enabled ✓</p>
          )}
          {feedback === "error" && (
            <p className="text-[11px] mt-1" style={{ color: "#EF4444" }}>
              Server configuration issue — notifications unavailable for now
            </p>
          )}
        </div>

        {!blocked && (
          <button
            onClick={handleToggle}
            disabled={loading}
            className="relative shrink-0 w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: enabled ? "#3FAE8C" : "#E2E8F0" }}
            aria-label="Toggle push notifications"
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
              style={{ transform: enabled ? "translateX(24px)" : "translateX(0)" }}
            />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Main ── */
export default function ProfileSecurity({ user }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#1F4E46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2 className="text-[16px] font-bold" style={{ color: "#1F4E46" }}>Security</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChangePasswordForm />
        <div className="md:border-l md:border-slate-100 md:pl-8 flex flex-col gap-0">
          <TwoFactorSection user={user} />
          <PushNotifSection />
        </div>
      </div>
    </div>
  );
}
