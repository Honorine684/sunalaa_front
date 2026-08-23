"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { adminApi, getApiError } from "@/lib/api";

const COLORS = ["#3FAE8C", "#8B5CF6", "#3B82F6", "#F59E0B"];

const statusStyle = {
  active:    { bg: "#ECFDF5", text: "#059669", border: "#D1FAE5", label: "Actif" },
  suspended: { bg: "#FFF7ED", text: "#D97706", border: "#FED7AA", label: "Suspendu" },
  banned:    { bg: "#FFF1F2", text: "#E11D48", border: "#FFE4E6", label: "Banni" },
  inactive:  { bg: "#F8FAFC", text: "#94A3B8", border: "#E2E8F0", label: "Inactif" },
};

const PHONE_FLAGS = [
  { prefix: "+221", flag: "🇸🇳" }, { prefix: "+225", flag: "🇨🇮" },
  { prefix: "+223", flag: "🇲🇱" }, { prefix: "+226", flag: "🇧🇫" },
  { prefix: "+224", flag: "🇬🇳" }, { prefix: "+228", flag: "🇹🇬" },
  { prefix: "+229", flag: "🇧🇯" }, { prefix: "+227", flag: "🇳🇪" },
  { prefix: "+237", flag: "🇨🇲" }, { prefix: "+242", flag: "🇨🇬" },
  { prefix: "+243", flag: "🇨🇩" }, { prefix: "+261", flag: "🇲🇬" },
  { prefix: "+212", flag: "🇲🇦" }, { prefix: "+213", flag: "🇩🇿" },
  { prefix: "+216", flag: "🇹🇳" }, { prefix: "+234", flag: "🇳🇬" },
  { prefix: "+233", flag: "🇬🇭" }, { prefix: "+254", flag: "🇰🇪" },
  { prefix: "+255", flag: "🇹🇿" }, { prefix: "+251", flag: "🇪🇹" },
  { prefix: "+509", flag: "🇭🇹" }, { prefix: "+352", flag: "🇱🇺" },
  { prefix: "+351", flag: "🇵🇹" }, { prefix: "+27",  flag: "🇿🇦" },
  { prefix: "+20",  flag: "🇪🇬" }, { prefix: "+33",  flag: "🇫🇷" },
  { prefix: "+32",  flag: "🇧🇪" }, { prefix: "+41",  flag: "🇨🇭" },
  { prefix: "+44",  flag: "🇬🇧" }, { prefix: "+49",  flag: "🇩🇪" },
  { prefix: "+34",  flag: "🇪🇸" }, { prefix: "+39",  flag: "🇮🇹" },
  { prefix: "+55",  flag: "🇧🇷" }, { prefix: "+1",   flag: "🇺🇸" },
].sort((a, b) => b.prefix.length - a.prefix.length);

function getPhoneDisplay(phone) {
  if (!phone) return "—";
  const match = PHONE_FLAGS.find((c) => phone.startsWith(c.prefix));
  return match ? `${match.flag} ${phone}` : phone;
}

function getStatusStyle(user) {
  const s = (user?.status ?? (user?.isActive ? "active" : "inactive")).toLowerCase();
  return statusStyle[s] ?? statusStyle.inactive;
}

function getInitials(user) {
  if (user?.username) return user.username[0].toUpperCase();
  const first = user?.firstName?.[0] ?? user?.first_name?.[0] ?? user?.name?.[0] ?? "?";
  const last = user?.lastName?.[0] ?? user?.last_name?.[0] ?? "";
  return (first + last).toUpperCase();
}

function getColor(user) {
  const name = user?.username ?? user?.firstName ?? user?.email ?? "A";
  return COLORS[name.charCodeAt(0) % COLORS.length];
}

function fmt(n) { return Number(n ?? 0).toLocaleString("fr-FR"); }

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

function StatusBadge({ user }) {
  const s = getStatusStyle(user);
  return (
    <span className="inline-flex w-fit items-center px-3 py-1 rounded-full text-[12px] font-normal border whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}>
      {s.label}
    </span>
  );
}

function ActionMenu({ user, onStatusChange, onDelete }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onOutside(e) { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setConfirmDelete(false); } }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  async function changeStatus(status) {
    setOpen(false);
    setLoading(true);
    try {
      await adminApi.updateUserStatus(user.id, status);
      onStatusChange(user.id, status);
    } catch (e) {
      alert(e?.response?.data?.message ?? "Erreur lors du changement de statut");
    } finally { setLoading(false); }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await adminApi.deleteUser(user.id);
      fetch("/api/presence", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id }) }).catch(() => {});
      onDelete(user.id);
      setOpen(false);
    } catch (e) {
      alert(e?.response?.data?.message ?? "Erreur lors de la suppression");
    } finally { setLoading(false); setConfirmDelete(false); }
  }

  const currentStatus = (user?.status ?? (user?.isActive ? "active" : "inactive")).toLowerCase();

  return (
    <div ref={ref} className="relative flex justify-center">
      <button
        onClick={() => { setOpen((v) => !v); setConfirmDelete(false); }}
        disabled={loading}
        className="text-slate-400 hover:text-slate-600 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100 disabled:opacity-40"
      >
        {loading ? (
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 bg-white rounded-xl border border-slate-100 shadow-lg py-1 w-44">
          {currentStatus !== "active" && (
            <button onClick={() => changeStatus("active")}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-[13px] hover:bg-green-50 transition cursor-pointer"
              style={{ color: "#059669" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Activer
            </button>
          )}

          <div className="border-t border-slate-100 my-1" />

          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-[13px] hover:bg-red-50 transition cursor-pointer"
              style={{ color: "#EF4444" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Supprimer
            </button>
          ) : (
            <div className="px-4 py-3">
              <p className="text-[12px] font-semibold mb-2" style={{ color: "#EF4444" }}>Confirmer la suppression ?</p>
              <div className="flex gap-2">
                <button onClick={handleDelete}
                  className="flex-1 py-1.5 rounded-lg text-white text-[12px] font-semibold transition hover:brightness-110 cursor-pointer"
                  style={{ backgroundColor: "#EF4444" }}>
                  Oui
                </button>
                <button onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-1.5 rounded-lg text-[12px] font-semibold bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                  style={{ color: "#45556C" }}>
                  Non
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const KYC_INFO = {
  APPROVED:      { label: "Vérifié",    bg: "#D1FAE5", color: "#065F46" },
  PENDING:       { label: "En attente", bg: "#FEF9C3", color: "#854D0E" },
  REJECTED:      { label: "Rejeté",     bg: "#FEE2E2", color: "#7F1D1D" },
  NOT_SUBMITTED: { label: "Non soumis", bg: "#F1F5F9", color: "#64748B" },
};

function KycBadge({ user }) {
  const status = user?.kycStatus ?? user?.kyc?.status ?? (user?.isKycVerified || user?.kycVerified ? "APPROVED" : "NOT_SUBMITTED");
  if (!status) return <span className="text-[12px]" style={{ color: "#94A3B8" }}>—</span>;
  const info = KYC_INFO[status] ?? { label: status, bg: "#F1F5F9", color: "#475569" };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold w-fit"
      style={{ backgroundColor: info.bg, color: info.color }}>
      {info.label}
    </span>
  );
}

const NODE_COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];

function nodeColor(node) {
  const name = node?.username ?? node?.firstName ?? node?.first_name ?? node?.email ?? "A";
  return NODE_COLORS[name.charCodeAt(0) % NODE_COLORS.length];
}

function nodeInitials(node) {
  if (node?.username) return node.username[0].toUpperCase();
  const first = node?.firstName?.[0] ?? node?.first_name?.[0] ?? node?.name?.[0] ?? node?.email?.[0] ?? "?";
  const last  = node?.lastName?.[0]  ?? node?.last_name?.[0]  ?? "";
  return (first + last).toUpperCase();
}

function nodeName(node) {
  if (!node) return "—";
  return node.username
    || [node.firstName ?? node.first_name, node.lastName ?? node.last_name].filter(Boolean).join(" ")
    || node.name || node.email || "—";
}

function TreeNode({ node, depth = 0, rootName }) {
  const children = node?.children ?? node?.downlines ?? node?.referrals ?? node?.directs ?? [];
  const [open, setOpen] = useState(depth <= 1);
  const isRoot = depth === 0;
  const name     = isRoot ? (rootName || nodeName(node)) : nodeName(node);
  const initials = isRoot ? (rootName?.[0]?.toUpperCase() ?? "M") : nodeInitials(node);
  const color    = isRoot ? "#1F4E46" : nodeColor(node);

  return (
    <div className={depth > 0 ? "ml-5 border-l border-slate-100 pl-3" : ""}>
      <div className="flex items-center gap-2 py-1.5">
        {children.length > 0 ? (
          <button onClick={() => setOpen(o => !o)}
            className="shrink-0 w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              {open
                ? <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                : <path d="M3.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
            </svg>
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
          style={{ backgroundColor: color }}>
          {initials}
        </div>
        <span className="text-[13px] truncate flex-1" style={{ color: isRoot ? "#1F4E46" : "#0F172B", fontWeight: isRoot ? 700 : 400 }}>
          {name}
        </span>
        {children.length > 0 && (
          <span className="text-[10px] shrink-0 px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#F1F5F9", color: "#94A3B8" }}>
            {children.length}
          </span>
        )}
      </div>
      {open && children.map((child, i) => (
        <TreeNode key={child?.id ?? i} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

function UserNetworkModal({ user, onClose }) {
  const [tree, setTree]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    adminApi.getUserTree(user.id)
      .then((res) => {
        const raw = res?.data?.data ?? res?.data ?? null;
        // Backend may return an array of children instead of a root node
        if (Array.isArray(raw)) {
          setTree({ ...user, children: raw });
        } else if (raw && !raw.children && !raw.downlines && !raw.referrals && !raw.directs) {
          // Object exists but no recognised children field — check deeper keys
          const childrenKey = Object.keys(raw).find(k =>
            Array.isArray(raw[k]) && raw[k].length > 0 &&
            ["children","downlines","referrals","directs","nodes","members","users","referees","tree"].includes(k)
          );
          if (childrenKey) {
            setTree({ ...user, children: raw[childrenKey] });
          } else {
            // raw might itself be the root node with identity fields
            setTree(raw?.id ? raw : { ...user, children: [] });
          }
        } else {
          setTree(raw);
        }
      })
      .catch((e) => setError(getApiError(e)))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const userName = nodeName(user);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <p className="font-bold text-[16px]" style={{ color: "#0F172B" }}>Network tree — {userName}</p>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5">
          {loading ? (
            <div className="flex flex-col gap-2">
              {[...Array(5)].map((_, i) => <div key={i} className="h-8 rounded-lg bg-slate-100 animate-pulse" />)}
            </div>
          ) : error ? (
            <p className="text-red-500 text-[13px] text-center py-6">{error}</p>
          ) : tree ? (
            <TreeNode node={tree} depth={0} rootName={userName} />
          ) : (
            <p className="text-slate-400 text-[13px] text-center py-6">Aucun réseau.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const COLS = ["UTILISATEUR", "EMAIL", "TÉLÉPHONE", "POINTS SNL", "PARRAINAGES", "KYC", "STATUT", "INSCRIPTION", "ACTIONS"];
const GRID = "grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_1fr_1.2fr_1.2fr_1fr]";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [viewUser, setViewUser] = useState(null);
  const [bannedCount, setBannedCount] = useState(0);

  useEffect(() => {
    adminApi.getUsers({ limit: 50, page: 1 })
      .then((res) => {
        const raw = res.data?.data ?? res.data;
        const list = raw?.users ?? raw?.data ?? (Array.isArray(raw) ? raw : []);
        setUsers(Array.isArray(list) ? list : []);
      })
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = useCallback((userId, newStatus) => {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: newStatus, isActive: newStatus === "active" } : u));
  }, []);

  const handleDelete = useCallback((userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setBannedCount((n) => n + 1);
  }, []);

  const filtered = users.filter((u) => {
    const name = (u?.username ?? [u?.firstName ?? u?.first_name, u?.lastName ?? u?.last_name].filter(Boolean).join(" ")).toLowerCase();
    const email = (u?.email ?? "").toLowerCase();
    const phone = (u?.phone ?? "").toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || email.includes(search.toLowerCase()) || phone.includes(search.toLowerCase());
    const userStatus = (u?.status ?? (u?.isActive ? "active" : "inactive")).toLowerCase();
    const matchStatus = filterStatus === "Tous" ||
      (filterStatus === "Actif" && userStatus === "active") ||
      (filterStatus === "Suspendu" && userStatus === "suspended") ||
      (filterStatus === "Banni" && userStatus === "banned");
    return matchSearch && matchStatus;
  });

  const counts = {
    total: users.length,
    actifs: users.filter((u) => (u?.status ?? (u?.isActive ? "active" : "")).toLowerCase() === "active").length,
    suspendus: users.filter((u) => (u?.status ?? "").toLowerCase() === "suspended").length,
    bannis: users.filter((u) => (u?.status ?? "").toLowerCase() === "banned").length,
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[20px] sm:text-[26px] font-bold mb-1" style={{ color: "#0F172B" }}>Gestion des utilisateurs</h2>
        <p className="text-[14px]" style={{ color: "#45556C" }}>Contrôler et modérer les comptes utilisateurs</p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email ou téléphone..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-[14px] placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-secondary/30 transition"
              style={{ color: "#45556C" }} />
          </div>
          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 bg-white cursor-pointer hover:bg-slate-50 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="#45556C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-[14px] outline-none cursor-pointer" style={{ color: "#45556C" }}>
              {["Tous", "Actif", "Suspendu", "Banni"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        <div className="px-5 py-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
          {[
            { label: "Total",     value: counts.total,     color: "#45556C" },
            { label: "Actifs",    value: counts.actifs,    color: "#059669" },
            { label: "Suspendus", value: counts.suspendus, color: "#D97706" },
            { label: "Bannis",    value: bannedCount,      color: "#E11D48" },
          ].map(({ label, value, color }) => (
            <span key={label} className="font-bold" style={{ color: "#45556C" }}>
              {label} :<span className="ml-1" style={{ color }}>{value}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <div className="bg-white min-w-200">
          <div className={`grid ${GRID} px-6 py-3 border-b border-slate-100 rounded-t-xl`} style={{ backgroundColor: "#E2E8F0" }}>
            {COLS.map((col) => (
              <span key={col} className="text-[11px] font-bold tracking-wider uppercase" style={{ color: "#45556C" }}>{col}</span>
            ))}
          </div>

          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className={`grid ${GRID} px-6 py-4 items-center border-b border-slate-100 gap-2`}>
                <Skeleton className="h-9 w-36" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-5 w-18 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            ))
          ) : (
            <>
              {filtered.map((user, i) => {
                const displayName = user?.username
                  || [user?.firstName ?? user?.first_name, user?.lastName ?? user?.last_name].filter(Boolean).join(" ")
                  || user?.email?.split("@")[0] || "—";
                const points = user?.snlBalance ?? user?.points ?? user?.totalPoints ?? 0;
                const refs = user?.directCount ?? user?.referralCount ?? user?.totalReferrals ?? 0;
                const createdAt = user?.createdAt ?? user?.created_at;
                const phone = user?.phone ?? user?.phoneNumber ?? null;
                return (
                  <div
                    key={user?.id ?? i}
                    className={[
                      `grid ${GRID} px-6 py-4 items-center hover:bg-slate-50 transition-colors`,
                      i < filtered.length - 1 ? "border-b border-slate-100" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: getColor(user) }}>
                        <span className="text-white text-[12px] font-bold">{getInitials(user)}</span>
                      </div>
                      <div>
                        <p className="text-[14px] font-bold leading-none mb-0.5" style={{ color: "#0F172B" }}>{displayName}</p>
                        <p className="text-[11px] font-mono select-all" style={{ color: "#94A3B8" }}>{user?.id ?? "—"}</p>
                      </div>
                    </div>
                    <span className="text-[13px] truncate" style={{ color: "#45556C" }}>{user?.email ?? "—"}</span>
                    <span className="text-[13px]" style={{ color: "#45556C" }}>{getPhoneDisplay(phone)}</span>
                    <span className="text-[14px]" style={{ color: "#0F172B" }}>{fmt(points)}</span>
                    <span className="text-[14px]" style={{ color: "#45556C" }}>{fmt(refs)}</span>
                    <KycBadge user={user} />
                    <StatusBadge user={user} />
                    <span className="text-[14px]" style={{ color: "#45556C" }}>
                      {createdAt ? new Date(createdAt).toLocaleDateString("fr-FR") : "—"}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/utilisateurs/${user.id}`}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold transition cursor-pointer hover:brightness-110"
                        style={{ backgroundColor: "#EFF6FF", color: "#3B82F6" }}
                        title="Voir le profil complet"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Voir
                      </Link>
                      <ActionMenu user={user} onStatusChange={handleStatusChange} onDelete={handleDelete} />
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="px-6 py-12 text-center text-[14px]" style={{ color: "#45556C" }}>
                  Aucun utilisateur trouvé.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {viewUser && <UserNetworkModal user={viewUser} onClose={() => setViewUser(null)} />}
    </div>
  );
}
