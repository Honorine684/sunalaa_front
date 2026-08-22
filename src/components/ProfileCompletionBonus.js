"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { usersApi } from "@/lib/api";

const lsKey = (profile) => `snl_welcome_bonus_claimed_${profile?.id ?? profile?._id ?? "anon"}`;

const REQUIRED_FIELDS = [
  {
    id: "name",
    en: "First & last name",
    fr: "Prénom et nom",
    check: (p) => !!(p?.firstName || p?.first_name) && !!(p?.lastName || p?.last_name || p?.surname),
    tab: "profil",
  },
  {
    id: "phone",
    en: "Phone number",
    fr: "Numéro de téléphone",
    check: (p) => !!(p?.phone || p?.phoneNumber || p?.phone_number),
    tab: "profil",
  },
  {
    id: "avatar",
    en: "Profile photo",
    fr: "Photo de profil",
    check: (p) => !!(p?.avatar || p?.profileImage || p?.profile_image),
    tab: "avatar",
  },
  {
    id: "address",
    en: "Delivery address",
    fr: "Adresse de livraison",
    check: (p) => !!p?.hasAddress,
    tab: "adresses",
  },
  {
    id: "kyc",
    en: "Identity verified (KYC)",
    fr: "Identité vérifiée (KYC)",
    check: (p) => {
      const status = p?.kycStatus ?? p?.kyc?.status ?? p?.kyc_status;
      return status === "APPROVED" || status === "approved" || p?.isKycVerified || p?.kycVerified;
    },
    tab: "securite",
  },
];

function isClaimed(profile) {
  if (
    profile?.profileBonusClaimed ||
    profile?.profileCompletionBonusClaimed ||
    profile?.profile_bonus_claimed
  ) return true;
  try { return localStorage.getItem(lsKey(profile)) === "1"; } catch { return false; }
}

export default function ProfileCompletionBonus({ profile, onNavigate, onUploadPhoto }) {
  const locale = useLocale();
  const [claimed, setClaimed]   = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    setClaimed(isClaimed(profile));
  }, [profile]);

  if (claimed || success) {
    return (
      <div className="col-span-12">
        <div
          className="rounded-2xl px-5 py-4 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg, #1F4E46 0%, #3FAE8C 100%)" }}
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
          <p className="text-white text-[13px] font-semibold">
            {locale === "fr"
              ? "Bonus profil complet réclamé — 1000 SNL crédités !"
              : "Profile completion bonus claimed, 1000 SNL credited!"}
          </p>
        </div>
      </div>
    );
  }

  const fields = REQUIRED_FIELDS.map((f) => ({
    ...f,
    done: f.check(profile),
    label: locale === "fr" ? f.fr : f.en,
  }));

  const completedCount = fields.filter((f) => f.done).length;
  const allDone = completedCount === fields.length;
  const pct = Math.round((completedCount / fields.length) * 100);

  function handleFieldClick(field) {
    if (field.done) return;
    if (field.tab === "avatar") { onUploadPhoto?.(); return; }
    onNavigate?.(field.tab);
  }

  async function handleClaim() {
    if (!allDone) return;
    setClaiming(true);
    setError("");
    try {
      await usersApi.claimProfileBonus();
      try { localStorage.setItem(lsKey(profile), "1"); } catch {}
      setSuccess(true);
    } catch (err) {
      const msg = err?.response?.data?.message ?? (locale === "fr" ? "Erreur lors du claim." : "Claim failed.");
      setError(msg);
    } finally {
      setClaiming(false);
    }
  }

  return (
    <div className="col-span-12">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Top gradient strip */}
        <div className="h-1" style={{ background: "linear-gradient(90deg, #1F4E46, #3FAE8C, #E6B84C)" }} />

        <div className="px-5 py-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              {/* Coin icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #E6B84C22 0%, #E6B84C44 100%)", border: "1px solid #E6B84C55" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#E6B84C" strokeWidth="1.8"/>
                  <path d="M12 7v1m0 8v1M9.5 9.5C9.5 8.4 10.6 7.5 12 7.5s2.5.9 2.5 2c0 1-1 1.7-2 2-.5.2-1 .6-1 1.5v.5M12 15.5h.01" stroke="#E6B84C" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-bold" style={{ color: "#0F172B" }}>
                  {locale === "fr" ? "Complétez votre profil" : "Complete your profile"}
                  {" "}
                  <span className="font-extrabold" style={{ color: "#E6B84C" }}>+ 1000 SNL</span>
                </p>
                <p className="text-[12px]" style={{ color: "#64748B" }}>
                  {completedCount}/{fields.length} {locale === "fr" ? "champs remplis" : "fields completed"}
                </p>
              </div>
            </div>

            {/* Progress % */}
            <span className="text-[13px] font-bold shrink-0" style={{ color: pct === 100 ? "#3FAE8C" : "#94A3B8" }}>
              {pct}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: pct === 100
                  ? "linear-gradient(90deg, #1F4E46, #3FAE8C)"
                  : "linear-gradient(90deg, #3FAE8C, #E6B84C)",
              }}
            />
          </div>

          {/* Fields checklist */}
          <div className="flex flex-col gap-2 mb-4">
            {fields.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => handleFieldClick(f)}
                disabled={f.done}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left w-full"
                style={{
                  backgroundColor: f.done ? "#F0FDF4" : "#F8FAFC",
                  cursor: f.done ? "default" : "pointer",
                  border: `1px solid ${f.done ? "#BBF7D0" : "#E2E8F0"}`,
                }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: f.done ? "#3FAE8C" : "transparent",
                    border: f.done ? "none" : "1.5px solid #CBD5E1",
                  }}
                >
                  {f.done && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span
                  className="text-[13px] font-medium flex-1"
                  style={{ color: f.done ? "#166534" : "#475569" }}
                >
                  {f.label}
                </span>
                {!f.done && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Claim button */}
          <button
            type="button"
            onClick={handleClaim}
            disabled={!allDone || claiming}
            className="w-full py-3 rounded-xl text-[14px] font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: allDone
                ? "linear-gradient(135deg, #1F4E46 0%, #3FAE8C 100%)"
                : "#E2E8F0",
              color: allDone ? "white" : "#94A3B8",
              boxShadow: allDone ? "0 4px 14px rgba(63,174,140,0.35)" : "none",
            }}
          >
            {claiming
              ? (locale === "fr" ? "Réclamation..." : "Claiming...")
              : allDone
                ? (locale === "fr" ? "Réclamer mes 1000 SNL" : "Claim my 1000 SNL")
                : (locale === "fr"
                    ? `Plus que ${fields.length - completedCount} champ${fields.length - completedCount > 1 ? "s" : ""}`
                    : `${fields.length - completedCount} field${fields.length - completedCount > 1 ? "s" : ""} remaining`)
            }
          </button>

          {error && (
            <p className="text-[12px] mt-2 text-center" style={{ color: "#EF4444" }}>{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
