"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";

const STORAGE_KEY = "snl_dismissed_tips";

function getDismissed() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); } catch { return []; }
}
function saveDismissed(ids) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); } catch {}
}

/* ─── Tips definitions ───────────────────────────────────────────── */
const TIPS = [
  {
    id: "kyc",
    priority: 1,
    color: "#E6B84C",
    bgColor: "rgba(230,184,76,0.08)",
    borderColor: "rgba(230,184,76,0.35)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    en: {
      title: "Complete your KYC",
      desc: "Verify your identity to convert your SNL points into tokens and unlock withdrawals.",
      cta: "Verify now",
    },
    fr: {
      title: "Complétez votre KYC",
      desc: "Vérifiez votre identité pour convertir vos points SNL en tokens et débloquer les retraits.",
      cta: "Vérifier maintenant",
    },
    condition: (p) => {
      const status = p?.kycStatus ?? p?.kyc?.status;
      return status !== "APPROVED" && !p?.isKycVerified && !p?.kycVerified;
    },
    action: "tab:securite",
  },
  {
    id: "2fa",
    priority: 2,
    color: "#3B82F6",
    bgColor: "rgba(59,130,246,0.06)",
    borderColor: "rgba(59,130,246,0.25)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="11" width="14" height="10" rx="2" stroke="#3B82F6" strokeWidth="2"/>
        <path d="M8 11V7a4 4 0 018 0v4" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="16" r="1.5" fill="#3B82F6"/>
      </svg>
    ),
    en: {
      title: "Enable 2FA",
      desc: "Protect your account with two-factor authentication. An extra layer of security for your SNL.",
      cta: "Enable",
    },
    fr: {
      title: "Activez la 2FA",
      desc: "Protégez votre compte avec l'authentification à deux facteurs. Une couche de sécurité supplémentaire pour vos SNL.",
      cta: "Activer",
    },
    condition: (p) => !p?.twoFactorEnabled && !p?.isTwoFactorEnabled && !p?.mfaEnabled,
    action: "tab:securite",
  },
  {
    id: "no_name",
    priority: 3,
    color: "#3FAE8C",
    bgColor: "rgba(63,174,140,0.07)",
    borderColor: "rgba(63,174,140,0.3)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    en: {
      title: "Add your name",
      desc: "Fill in your first and last name so the community can recognize you.",
      cta: "Complete profile",
    },
    fr: {
      title: "Ajoutez votre nom",
      desc: "Renseignez vos prénom et nom pour que la communauté puisse vous identifier.",
      cta: "Compléter le profil",
    },
    condition: (p) => !p?.firstName && !p?.first_name && !p?.lastName && !p?.last_name,
    action: "tab:profil",
  },
  {
    id: "no_photo",
    priority: 4,
    color: "#8B5CF6",
    bgColor: "rgba(139,92,246,0.06)",
    borderColor: "rgba(139,92,246,0.25)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="13" r="4" stroke="#8B5CF6" strokeWidth="2"/>
      </svg>
    ),
    en: {
      title: "Add a profile photo",
      desc: "Put a face to your username — tap the camera icon on your avatar to upload a photo.",
      cta: "Upload photo",
    },
    fr: {
      title: "Ajoutez une photo de profil",
      desc: "Mettez un visage sur votre pseudo — appuyez sur l'icône appareil photo sur votre avatar.",
      cta: "Ajouter une photo",
    },
    condition: (p) => !p?.avatar,
    action: "scroll_top",
  },
  {
    id: "referral",
    priority: 5,
    color: "#F59E0B",
    bgColor: "rgba(245,158,11,0.06)",
    borderColor: "rgba(245,158,11,0.25)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    en: {
      title: "Share your referral link",
      desc: "Invite friends and earn bonus SNL points on 3 levels. Every referral counts.",
      cta: "Copy link",
    },
    fr: {
      title: "Partagez votre lien de parrainage",
      desc: "Invitez des amis et gagnez des points SNL sur 3 niveaux. Chaque parrainage compte.",
      cta: "Copier le lien",
    },
    condition: () => true,
    action: "copy_referral",
  },
  {
    id: "address",
    priority: 6,
    color: "#EF4444",
    bgColor: "rgba(239,68,68,0.06)",
    borderColor: "rgba(239,68,68,0.22)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="10" r="3" stroke="#EF4444" strokeWidth="2"/>
      </svg>
    ),
    en: {
      title: "Add your address",
      desc: "Add a delivery address to receive your SNL products and rewards.",
      cta: "Add address",
    },
    fr: {
      title: "Ajoutez votre adresse",
      desc: "Ajoutez une adresse de livraison pour recevoir vos produits et récompenses SNL.",
      cta: "Ajouter une adresse",
    },
    condition: (p) => !p?.addresses?.length,
    action: "tab:adresses",
  },
];

/* ─── Component ──────────────────────────────────────────────────── */
export default function ProfileTips({ profile, onNavigate, onUploadPhoto }) {
  const locale = useLocale();
  const [dismissed, setDismissed] = useState([]);
  const [copied, setCopied]       = useState(false);

  useEffect(() => { setDismissed(getDismissed()); }, []);

  const activeTips = TIPS
    .filter((t) => !dismissed.includes(t.id) && t.condition(profile))
    .sort((a, b) => a.priority - b.priority);

  const total = TIPS.filter((t) => t.condition(profile)).length;
  const done  = total - activeTips.length;

  function dismiss(id) {
    const next = [...dismissed, id];
    setDismissed(next);
    saveDismissed(next);
  }

  function dismissAll() {
    const ids = TIPS.filter((t) => t.condition(profile)).map((t) => t.id);
    setDismissed(ids);
    saveDismissed(ids);
  }

  function handleAction(tip) {
    if (tip.action === "tab:securite") onNavigate?.("securite");
    else if (tip.action === "tab:profil") onNavigate?.("profil");
    else if (tip.action === "tab:adresses") onNavigate?.("adresses");
    else if (tip.action === "scroll_top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      onUploadPhoto?.();
    }
    else if (tip.action === "copy_referral") {
      const username = profile?.username ?? profile?.referralCode ?? "";
      const link = `${window.location.origin}/ref/${username}`;
      try {
        navigator.clipboard?.writeText(link).then?.(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        });
      } catch {}
    }
  }

  if (!profile || activeTips.length === 0) return null;

  const tx = (tip) => tip[locale] ?? tip.en;

  return (
    <div className="col-span-12">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#F0FDF4" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-bold" style={{ color: "#0F172B" }}>
                {locale === "fr" ? "Améliorez votre profil" : "Boost your profile"}
              </p>
              <p className="text-[12px] text-slate-400">
                {done}/{total} {locale === "fr" ? "complété" : "completed"}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex-1 max-w-32 hidden sm:block">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(done / total) * 100}%`, backgroundColor: "#3FAE8C" }}
              />
            </div>
          </div>

          <button
            onClick={dismissAll}
            className="text-[12px] text-slate-400 hover:text-slate-600 transition cursor-pointer whitespace-nowrap shrink-0"
          >
            {locale === "fr" ? "Tout ignorer" : "Dismiss all"}
          </button>
        </div>

        {/* Tips list */}
        <div className="divide-y divide-slate-50">
          {activeTips.map((tip) => {
            const t = tx(tip);
            return (
              <div
                key={tip.id}
                className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors"
                style={{ borderLeft: `3px solid ${tip.color}` }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: tip.bgColor }}
                >
                  {tip.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold mb-0.5" style={{ color: "#0F172B" }}>{t.title}</p>
                  <p className="text-[12px] text-slate-400 leading-relaxed mb-2.5">{t.desc}</p>
                  <button
                    type="button"
                    onClick={() => handleAction(tip)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition cursor-pointer hover:brightness-95"
                    style={{ backgroundColor: tip.bgColor, color: tip.color, border: `1px solid ${tip.borderColor}` }}
                  >
                    {tip.id === "copy_referral" && copied
                      ? (locale === "fr" ? "Copié !" : "Copied!")
                      : t.cta}
                    {tip.id !== "copy_referral" && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>

                {/* Dismiss */}
                <button
                  type="button"
                  onClick={() => dismiss(tip.id)}
                  className="text-slate-300 hover:text-slate-500 transition cursor-pointer shrink-0 p-1 mt-0.5"
                  aria-label="Dismiss"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
