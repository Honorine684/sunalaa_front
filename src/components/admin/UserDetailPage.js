"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, getApiError } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "https://api.sunalaa.com";

const statusStyle = {
  active:    { bg: "#ECFDF5", text: "#059669", label: "Actif" },
  suspended: { bg: "#FFF7ED", text: "#D97706", label: "Suspendu" },
  banned:    { bg: "#FFF1F2", text: "#E11D48", label: "Banni" },
  inactive:  { bg: "#F8FAFC", text: "#94A3B8", label: "Inactif" },
};

const kycStyle = {
  APPROVED: { bg: "#ECFDF5", text: "#059669", label: "Vérifié" },
  PENDING:  { bg: "#FEF9C3", text: "#854D0E", label: "En attente" },
  REJECTED: { bg: "#FEE2E2", text: "#DC2626", label: "Rejeté" },
};

function Badge({ bg, text, label }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold" style={{ backgroundColor: bg, color: text }}>
      {label}
    </span>
  );
}

function Card({ title, children, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        {icon && <span style={{ color: "#3FAE8C" }}>{icon}</span>}
        <h3 className="font-bold text-[14px]" style={{ color: "#0F172B" }}>{title}</h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-[12px] font-medium shrink-0" style={{ color: "#94A3B8" }}>{label}</span>
      <span className="text-[13px] font-semibold text-right break-all" style={{ color: "#0F172B" }}>{value ?? "—"}</span>
    </div>
  );
}

function fmt(n) { return n != null ? Number(n).toLocaleString("fr-FR") : "—"; }
function fmtDate(s) { return s ? new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"; }

export default function UserDetailPage({ userId }) {
  const router = useRouter();
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    adminApi.getUser(userId)
      .then((res) => {
        const raw = res.data?.data ?? res.data;
        setUser(raw);
      })
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return (
    <div className="flex justify-center py-24">
      <svg className="animate-spin w-8 h-8" style={{ color: "#3FAE8C" }} viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-red-600 text-[14px]">{error}</div>
  );

  if (!user) return null;

  const displayName = user.username || [user.firstName, user.lastName].filter(Boolean).join(" ") || "—";
  const avatar = user.profileImage ?? user.avatar ?? null;
  const avatarSrc = avatar ? (avatar.startsWith("http") ? avatar : `${API_BASE}${avatar}`) : null;
  const initials = (user.username?.[0] ?? user.firstName?.[0] ?? user.email?.[0] ?? "?").toUpperCase();

  const status    = user.status ?? (user.isActive ? "active" : "inactive");
  const kycStatus = user.kycStatus ?? user.kyc?.status ?? null;
  const points    = user.snlBalance ?? user.points ?? user.balance ?? 0;
  const refs      = user.referralCount ?? user.filleulsCount ?? user.network?.total ?? 0;

  const addresses = Array.isArray(user.addresses) ? user.addresses : user.address ? [user.address] : [];

  return (
    <div className="flex flex-col gap-6">

      {/* Back + Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.back()}
          className="mt-1 w-9 h-9 shrink-0 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-16 h-16 rounded-2xl shrink-0 overflow-hidden flex items-center justify-center font-bold text-[22px] text-white"
            style={{ backgroundColor: "#3FAE8C" }}>
            {avatarSrc
              ? <img src={avatarSrc} alt={displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              : initials}
          </div>
          <div className="min-w-0">
            <h1 className="text-[20px] font-black truncate" style={{ color: "#0F172B" }}>{displayName}</h1>
            <p className="text-[13px] break-all" style={{ color: "#64748B" }}>{user.email ?? "—"}</p>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {(() => { const s = statusStyle[status] ?? statusStyle.inactive; return <Badge bg={s.bg} text={s.text} label={s.label} />; })()}
              {kycStatus && (() => { const k = kycStyle[kycStatus] ?? { bg: "#F1F5F9", text: "#64748B", label: kycStatus }; return <Badge bg={k.bg} text={k.text} label={k.label} />; })()}
              {user.role && (
                <Badge bg="#EDE9FE" text="#7C3AED" label={user.role} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Points SNL", value: fmt(points), color: "#E6B84C" },
          { label: "Filleuls", value: fmt(refs), color: "#3FAE8C" },
          { label: "Commissions", value: fmt(user.commissionsTotal ?? user.totalCommissions), color: "#8B5CF6" },
          { label: "Inscrit le", value: user.createdAt ? new Date(user.createdAt).toLocaleDateString("fr-FR") : "—", color: "#3B82F6" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#94A3B8" }}>{s.label}</p>
            <p className="text-[22px] font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Infos personnelles */}
        <Card title="Informations personnelles" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/></svg>
        }>
          <Row label="Prénom" value={user.firstName ?? user.first_name} />
          <Row label="Nom" value={user.lastName ?? user.last_name} />
          <Row label="Pseudo" value={user.username} />
          <Row label="Email" value={user.email} />
          <Row label="Téléphone" value={user.phone ?? user.phoneNumber} />
          <Row label="Genre" value={user.gender} />
          <Row label="Date de naissance" value={user.birthDate ?? user.dateOfBirth ? fmtDate(user.birthDate ?? user.dateOfBirth) : null} />
        </Card>

        {/* Compte */}
        <Card title="Compte & Sécurité" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        }>
          <Row label="Rôle" value={user.role} />
          <Row label="Statut" value={statusStyle[status]?.label ?? status} />
          <Row label="2FA activé" value={user.twoFactorEnabled ?? user.is2FAEnabled ? "✓ Oui" : "✗ Non"} />
          <Row label="Email vérifié" value={user.emailVerified ?? user.isEmailVerified ? "✓ Oui" : "✗ Non"} />
          <Row label="Inscrit le" value={fmtDate(user.createdAt)} />
          <Row label="Dernière connexion" value={fmtDate(user.lastLogin ?? user.lastLoginAt ?? user.lastActive)} />
          <Row label="Code parrainage" value={user.referralCode ?? user.sponsorCode} />
        </Card>

        {/* KYC */}
        <Card title="Vérification KYC" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/></svg>
        }>
          {kycStatus ? (
            <>
              <Row label="Statut KYC" value={kycStyle[kycStatus]?.label ?? kycStatus} />
              <Row label="Type de pièce" value={user.kyc?.documentType ?? user.kycDocumentType} />
              <Row label="Numéro pièce" value={user.kyc?.documentNumber ?? user.kycDocumentNumber} />
              <Row label="Soumis le" value={fmtDate(user.kyc?.createdAt ?? user.kycSubmittedAt)} />
              <Row label="Décision le" value={fmtDate(user.kyc?.updatedAt ?? user.kycReviewedAt)} />
            </>
          ) : (
            <p className="text-[13px] py-2" style={{ color: "#94A3B8" }}>Aucune demande KYC soumise</p>
          )}
        </Card>

        {/* Réseau */}
        <Card title="Réseau & Parrainage" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="5" stroke="currentColor" strokeWidth="2"/><circle cx="16" cy="15" r="5" stroke="currentColor" strokeWidth="2"/></svg>
        }>
          <Row label="Parrain (sponsor)" value={
            user.sponsor
              ? (user.sponsor.username || [user.sponsor.firstName, user.sponsor.lastName].filter(Boolean).join(" ") || user.sponsor.email)
              : (user.sponsorId ?? user.referredBy)
          } />
          <Row label="Code parrainage" value={user.referralCode ?? user.sponsorCode} />
          <Row label="Nombre de filleuls" value={fmt(refs)} />
          <Row label="Filleuls actifs" value={fmt(user.activeReferrals ?? user.activeFilleuls)} />
          <Row label="Total commissions" value={user.commissionsTotal != null ? `${fmt(user.commissionsTotal)} SNL` : null} />
        </Card>

        {/* Adresses */}
        <Card title="Adresses" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/></svg>
        }>
          {addresses.length === 0 ? (
            <p className="text-[13px] py-2" style={{ color: "#94A3B8" }}>Aucune adresse enregistrée</p>
          ) : addresses.map((a, i) => (
            <div key={i} className="py-2.5 border-b border-slate-50 last:border-0">
              <p className="text-[12px] font-semibold mb-1" style={{ color: "#64748B" }}>
                Adresse {addresses.length > 1 ? `#${i + 1}` : ""}
                {a.isDefault && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#ECFDF5", color: "#059669" }}>Par défaut</span>}
              </p>
              <p className="text-[13px]" style={{ color: "#0F172B" }}>
                {[a.street ?? a.address ?? a.line1, a.city, a.state, a.postalCode ?? a.zip, a.country].filter(Boolean).join(", ") || "—"}
              </p>
            </div>
          ))}
        </Card>

        {/* Identifiant technique */}
        <Card title="Identifiants techniques" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        }>
          <Row label="ID utilisateur" value={<span className="font-mono text-[11px] select-all">{user.id}</span>} />
          <Row label="Profil complété" value={
            user.profileBonusClaimed || user.profileCompletionBonusClaimed
              ? "✓ Bonus réclamé"
              : "✗ Non réclamé"
          } />
          <Row label="Points en attente" value={user.pendingPoints != null ? fmt(user.pendingPoints) : null} />
          <Row label="Source inscription" value={user.authProvider ?? user.registrationSource ?? user.provider} />
        </Card>

      </div>
    </div>
  );
}
