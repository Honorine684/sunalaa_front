"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { newsletterApi } from "@/lib/api";

export default function UnsubscribePage() {
  const t           = useTranslations("Unsubscribe");
  const params      = useSearchParams();
  const email       = params.get("email") ?? "";

  const [status, setStatus]         = useState("loading"); // loading | success | already | error
  const [resubDone, setResubDone]   = useState(false);
  const [resubLoading, setResubLoading] = useState(false);

  useEffect(() => {
    if (!email) { setStatus("error"); return; }
    newsletterApi.unsubscribe(email)
      .then(() => setStatus("success"))
      .catch((err) => {
        const code = err?.response?.status;
        if (code === 404) setStatus("already");
        else setStatus("error");
      });
  }, [email]);

  async function handleResubscribe() {
    setResubLoading(true);
    try {
      await newsletterApi.subscribe(email);
      setResubDone(true);
    } catch {
      // silent
    } finally {
      setResubLoading(false);
    }
  }

  const ICONS = {
    loading: (
      <svg className="animate-spin" width="40" height="40" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeDasharray="40 20"/>
      </svg>
    ),
    success: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17l-5-5" stroke="#E6B84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    already: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#E6B84C" strokeWidth="2"/>
        <path d="M12 8v4M12 16h.01" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    error: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2"/>
        <path d="M15 9l-6 6M9 9l6 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  };

  const isError = status === "error";

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#060e0d" }}
    >
      {/* Logo */}
      <Link href="/" className="mb-10">
        <Image src="/images/sunala_LOGO.png" alt="SUNALA" width={120} height={40} className="object-contain" />
      </Link>

      {/* Card */}
      <div
        className="w-full max-w-md flex flex-col items-center text-center gap-6 rounded-2xl p-8"
        style={{
          backgroundColor: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: isError ? "rgba(239,68,68,0.12)" : "rgba(230,184,76,0.12)",
            border: `1px solid ${isError ? "rgba(239,68,68,0.25)" : "rgba(230,184,76,0.25)"}`,
          }}
        >
          {ICONS[status]}
        </div>

        {/* Text */}
        {status === "loading" && (
          <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.55)" }}>
            {t("loading")}
          </p>
        )}

        {status !== "loading" && (
          <>
            <div className="flex flex-col gap-2">
              <h1 className="text-[22px] font-bold text-white">
                {t(`${status}_title`)}
              </h1>
              <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
                {t(`${status}_body`)}
              </p>
              {email && (
                <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.30)" }}>
                  {email}
                </p>
              )}
            </div>

            {/* Re-subscribe option (only on success) */}
            {status === "success" && !resubDone && (
              <button
                onClick={handleResubscribe}
                disabled={resubLoading}
                className="text-[13px] underline underline-offset-2 cursor-pointer disabled:opacity-50 transition-opacity hover:opacity-70"
                style={{ color: "rgba(255,255,255,0.40)" }}
              >
                {resubLoading ? "…" : t("resubscribe")}
              </button>
            )}

            {resubDone && (
              <p className="text-[13px] font-semibold" style={{ color: "#3FAE8C" }}>
                ✓ {t("resubscribed")}
              </p>
            )}

            {/* Back home */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[14px] text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#1F4E46" }}
            >
              ← {t("back_home")}
            </Link>
          </>
        )}
      </div>

      {/* Footer minimal */}
      <p className="mt-8 text-[11px]" style={{ color: "rgba(255,255,255,0.20)" }}>
        © {new Date().getFullYear()} SUNALA UAB
      </p>
    </main>
  );
}
