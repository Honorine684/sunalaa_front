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
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError]     = useState("");
  const [confirmAction, setConfirmAction] = useState(null); // "suspend" | "ban" | "activate"

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

  async function handleStatusChange(action) {
    setStatusLoading(true);
    setStatusError("");
    setConfirmAction(null);
    try {
      if (action === "ban") {
        await adminApi.deleteUser(userId);
        router.back();
      } else {
        const newStatus = action === "activate" ? "active" : "suspended";
        await adminApi.updateUserStatus(userId, newStatus);
        setUser((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      setStatusError(getApiError(err));
    } finally {
      setStatusLoading(false);
    }
  }

  if (!user) return null;

  const displayName = user.username || [user.firstName, user.lastName].filter(Boolean).join(" ") || "—";
  const avatar = user.profileImage ?? user.avatar ?? null;
  const avatarSrc = avatar ? (avatar.startsWith("http") ? avatar : `${API_BASE}${avatar}`) : null;
  const initials = (user.username?.[0] ?? user.firstName?.[0] ?? user.email?.[0] ?? "?").toUpperCase();

  const status    = (user.status ?? "").toLowerCase() || (user.isActive ? "active" : "inactive");
  const kycStatus = user.kycStatus ?? user.kyc?.status ?? null;
  const refs      = user.directCount ?? user._count?.downlines ?? 0;

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

      {/* Actions statut */}
      {statusError && (
        <div className="rounded-xl px-4 py-3 text-[13px] border" style={{ backgroundColor: "#FEF2F2", borderColor: "#FECACA", color: "#DC2626" }}>
          {statusError}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {status !== "active" && (
          <button
            onClick={() => setConfirmAction("activate")}
            disabled={statusLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold border transition hover:brightness-95 disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: "#ECFDF5", borderColor: "#A7F3D0", color: "#059669" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Réactiver le compte
          </button>
        )}
        {status !== "suspended" && (
          <button
            onClick={() => setConfirmAction("suspend")}
            disabled={statusLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold border transition hover:brightness-95 disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: "#FFF7ED", borderColor: "#FED7AA", color: "#D97706" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M10 9v6M14 9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Suspendre
          </button>
        )}
        {status !== "banned" && (
          <button
            onClick={() => setConfirmAction("ban")}
            disabled={statusLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold border transition hover:brightness-95 disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: "#FFF1F2", borderColor: "#FECDD3", color: "#E11D48" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M4.93 4.93l14.14 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Bannir
          </button>
        )}
      </div>

      {/* Confirmation modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(15,23,43,0.45)" }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
            <h3 className="text-[16px] font-bold" style={{ color: "#0F172B" }}>
              {confirmAction === "activate" && "Réactiver ce compte ?"}
              {confirmAction === "suspend" && "Suspendre ce compte ?"}
              {confirmAction === "ban"     && "Bannir cet utilisateur ?"}
            </h3>
            <p className="text-[13px]" style={{ color: "#64748B" }}>
              {confirmAction === "activate" && `Le compte de ${displayName} sera réactivé et l'utilisateur pourra se reconnecter.`}
              {confirmAction === "suspend"  && `${displayName} sera suspendu temporairement et ne pourra plus accéder à la plateforme.`}
              {confirmAction === "ban"      && `Le compte de ${displayName} sera supprimé définitivement. Cette action est irréversible.`}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-xl border text-[13px] font-semibold hover:bg-slate-50 transition cursor-pointer"
                style={{ borderColor: "#E2E8F0", color: "#64748B" }}
              >
                Annuler
              </button>
              <button
                onClick={() => handleStatusChange(confirmAction)}
                className="px-4 py-2 rounded-xl text-white text-[13px] font-semibold transition hover:brightness-110 cursor-pointer"
                style={{ backgroundColor: confirmAction === "activate" ? "#059669" : confirmAction === "suspend" ? "#D97706" : "#E11D48" }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Points SNL", value: user.snlBalance != null ? fmt(user.snlBalance) : "—", color: "#E6B84C" },
          { label: "Filleuls directs", value: fmt(refs), color: "#3FAE8C" },
          { label: "Équipe totale", value: fmt(user.teamCount), color: "#8B5CF6" },
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
          <Row label="Prénom" value={user.firstName} />
          <Row label="Nom" value={user.lastName} />
          <Row label="Pseudo" value={user.username} />
          <Row label="Email" value={user.email} />
          <Row label="Téléphone" value={user.phone} />
          <Row label="Genre" value={user.gender} />
        </Card>

        {/* Compte */}
        <Card title="Compte & Sécurité" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        }>
          <Row label="Rôle" value={user.role} />
          <Row label="Rang" value={user.rank} />
          <Row label="Niveau" value={user.level != null ? `Niveau ${user.level}` : null} />
          <Row label="Statut" value={statusStyle[status]?.label ?? status} />
          <Row label="2FA activé" value={user.twoFactorEnabled ? "✓ Oui" : "✗ Non"} />
          <Row label="Email vérifié" value={user.emailVerified ? "✓ Oui" : "✗ Non"} />
          <Row label="Tél. vérifié" value={user.phoneVerified ? "✓ Oui" : "✗ Non"} />
          <Row label="Inscrit le" value={fmtDate(user.createdAt)} />
          <Row label="Dernière connexion" value={fmtDate(user.lastLoginAt)} />
          <Row label="Code parrainage" value={user.referralCode} />
        </Card>

        {/* KYC */}
        <Card title="Vérification KYC" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/></svg>
        }>
          {kycStatus ? (
            <>
              <Row label="Statut KYC" value={kycStyle[kycStatus]?.label ?? kycStatus} />
              <Row label="Type de pièce" value={user.kyc?.documentType ?? user.kycDocumentType} />
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
              ? [user.sponsor.firstName, user.sponsor.lastName].filter(Boolean).join(" ") || user.sponsor.referralCode
              : user.sponsorId
          } />
          <Row label="Code parrain" value={user.sponsor?.referralCode} />
          <Row label="Mon code parrainage" value={user.referralCode} />
          <Row label="Filleuls directs" value={fmt(refs)} />
          <Row label="Équipe totale" value={fmt(user.teamCount)} />
          <Row label="Volume personnel" value={fmt(user.personalVolume)} />
          <Row label="Volume groupe" value={fmt(user.groupVolume)} />
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
          <Row label="Bonus profil réclamé" value={user.profileBonusClaimed ? "✓ Oui" : "✗ Non"} />
          <Row label="Bonus bienvenue réclamé" value={user.welcomeBonusClaimed ? "✓ Oui" : "✗ Non"} />
          <Row label="Username défini" value={user.isUsernameSet ? "✓ Oui" : "✗ Non"} />
          <Row label="Wallet — solde" value={user.wallet?.balance != null ? `${parseFloat(user.wallet.balance).toLocaleString("fr-FR")} ${user.wallet.currency ?? ""}`.trim() : null} />
          <Row label="Wallet — en attente" value={user.wallet?.pendingBalance != null ? `${parseFloat(user.wallet.pendingBalance).toLocaleString("fr-FR")} ${user.wallet.currency ?? ""}`.trim() : null} />
          <Row label="Wallet — total gagné" value={user.wallet?.totalEarned != null ? `${parseFloat(user.wallet.totalEarned).toLocaleString("fr-FR")} ${user.wallet.currency ?? ""}`.trim() : null} />
          <Row label="Wallet — total retiré" value={user.wallet?.totalWithdrawn != null ? `${parseFloat(user.wallet.totalWithdrawn).toLocaleString("fr-FR")} ${user.wallet.currency ?? ""}`.trim() : null} />
        </Card>

      </div>
    </div>
  );
}
