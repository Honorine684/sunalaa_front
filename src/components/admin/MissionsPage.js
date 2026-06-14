"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi, getApiError } from "@/lib/api";

/* ── Platform icon ── */
const PLATFORM_ICONS = {
  telegram: (color = "#3FAE8C") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  twitter: (color = "#3FAE8C") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  youtube: (color = "#3FAE8C") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  discord: (color = "#3FAE8C") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 12h.01M15 12h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M8 9c0-1.1.9-2 2-2h4a2 2 0 012 2v5a2 2 0 01-2 2h-1l-2 2-2-2H8V9z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  facebook: (color = "#3FAE8C") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  instagram: (color = "#3FAE8C") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2"/>
      <circle cx="17.5" cy="6.5" r="1" fill={color}/>
    </svg>
  ),
  whatsapp: (color = "#3FAE8C") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

function PlatformIcon({ platform }) {
  const render = PLATFORM_ICONS[platform?.toLowerCase()] ?? PLATFORM_ICONS.telegram;
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#ECFDF5" }}>
      {render()}
    </div>
  );
}

const PLATFORMS = ["telegram", "twitter", "youtube", "discord", "facebook", "instagram", "whatsapp"];
const COLS = ["MISSION", "TYPE", "RÉCOMPENSE", "STATUT", "COMPLÉTIONS", "DATE", "ACTIONS"];

const EMPTY_FIELDS = { title: "", description: "", platform: "telegram", actionUrl: "", reward: "", isActive: true, requiresApproval: false };

/* ── Mission modal ── */
function MissionModal({ mission, onClose, onSaved }) {
  const isEdit = !!mission;
  const [fields, setFields] = useState(
    isEdit
      ? { title: mission.title, description: mission.description, platform: mission.platform,
          actionUrl: mission.actionUrl, reward: String(mission.reward), isActive: mission.isActive,
          requiresApproval: mission.requiresApproval ?? false }
      : { ...EMPTY_FIELDS }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  function set(key, val) { setFields((p) => ({ ...p, [key]: val })); }

  async function handleSave() {
    if (!fields.title.trim() || !fields.actionUrl.trim() || !fields.reward) {
      setError("Titre, URL et récompense sont requis."); return;
    }
    setLoading(true); setError("");
    try {
      const payload = { ...fields, reward: Number(fields.reward) };
      const res = isEdit
        ? await adminApi.updateMission(mission.id, payload)
        : await adminApi.createMission(payload);
      onSaved(res.data?.data ?? res.data);
      onClose();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(15,23,43,0.45)" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white">
          <h3 className="text-[17px] font-bold" style={{ color: "#0F172B" }}>
            {isEdit ? "Modifier la mission" : "Nouvelle mission"}
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#45556C" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="rounded-xl px-4 py-3 text-[13px] border" style={{ backgroundColor: "#FEF2F2", borderColor: "#FECACA", color: "#DC2626" }}>
              {error}
            </div>
          )}

          {[
            { key: "title",       label: "Titre",       type: "text",   ph: "Ex : Rejoindre le canal Telegram" },
            { key: "actionUrl",   label: "URL de l'action", type: "url", ph: "https://t.me/..." },
            { key: "reward",      label: "Récompense (SNL)", type: "number", ph: "25" },
          ].map(({ key, label, type, ph }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>{label}</label>
              <input
                type={type}
                min={type === "number" ? 1 : undefined}
                value={fields[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={ph}
                className="w-full px-4 py-2.5 rounded-xl border text-[14px] outline-none focus:ring-2"
                style={{ borderColor: "#E2E8F0", color: "#0F172B" }}
              />
            </div>
          ))}

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>Description</label>
            <textarea
              value={fields.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Décrivez l'action à effectuer…"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border text-[14px] outline-none focus:ring-2 resize-none"
              style={{ borderColor: "#E2E8F0", color: "#0F172B" }}
            />
          </div>

          {/* Platform */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>Plateforme</label>
            <select
              value={fields.platform}
              onChange={(e) => set("platform", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-[14px] outline-none focus:ring-2 cursor-pointer capitalize"
              style={{ borderColor: "#E2E8F0", color: "#0F172B" }}
            >
              {PLATFORMS.map((p) => <option key={p} value={p} className="capitalize">{p}</option>)}
            </select>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>Mission active</label>
            <button type="button" onClick={() => set("isActive", !fields.isActive)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${fields.isActive ? "bg-[#3FAE8C]" : "bg-slate-300"}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${fields.isActive ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          {/* Approval toggle */}
          <div className="flex items-center justify-between rounded-xl px-4 py-3 border" style={{ borderColor: "#E2E8F0", backgroundColor: fields.requiresApproval ? "#FFF7ED" : "#F8FAFC" }}>
            <div>
              <p className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>Approbation manuelle requise</p>
              <p className="text-[12px] mt-0.5" style={{ color: "#45556C" }}>
                {fields.requiresApproval ? "L'admin doit valider avant de créditer les points" : "Points crédités automatiquement après vérification"}
              </p>
            </div>
            <button type="button" onClick={() => set("requiresApproval", !fields.requiresApproval)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative shrink-0 ml-4 ${fields.requiresApproval ? "bg-[#E17100]" : "bg-slate-300"}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${fields.requiresApproval ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border text-[14px] font-semibold hover:bg-slate-50 transition cursor-pointer" style={{ borderColor: "#E2E8F0", color: "#45556C" }}>
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ backgroundColor: "#3FAE8C" }}
          >
            {loading && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeDasharray="40 20"/></svg>}
            {loading ? "Enregistrement…" : isEdit ? "Enregistrer" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete confirm ── */
function DeleteConfirm({ mission, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  async function confirm() {
    setLoading(true);
    try {
      await adminApi.deleteMission(mission.id);
      onDeleted(mission.id);
      onClose();
    } catch (err) { setError(getApiError(err)); }
    finally { setLoading(false); }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(15,23,43,0.45)" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
        <p className="text-[16px] font-bold" style={{ color: "#0F172B" }}>Supprimer la mission ?</p>
        <p className="text-[13px]" style={{ color: "#45556C" }}>
          « {mission.title} » sera définitivement supprimée.
        </p>
        {error && <p className="text-[13px]" style={{ color: "#DC2626" }}>{error}</p>}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border text-[14px] font-semibold hover:bg-slate-50 transition cursor-pointer" style={{ borderColor: "#E2E8F0", color: "#45556C" }}>Annuler</button>
          <button onClick={confirm} disabled={loading} className="px-4 py-2 rounded-xl text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-60" style={{ backgroundColor: "#EF4444" }}>
            {loading ? "…" : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Reviews section ── */
function ReviewsSection() {
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [actioning, setActioning] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await adminApi.getMissionReviews({ page: 1, limit: 50 });
      const raw = res.data?.data ?? res.data;
      setReviews(Array.isArray(raw) ? raw : (raw?.data ?? []));
    } catch (err) { setError(getApiError(err)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function act(id, action) {
    setActioning(id + action);
    try {
      if (action === "approve") await adminApi.approveMissionReview(id);
      else await adminApi.rejectMissionReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) { setError(getApiError(err)); }
    finally { setActioning(null); }
  }

  if (loading) return (
    <div className="flex justify-center py-8">
      <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#3FAE8C" strokeWidth="3" strokeLinecap="round" strokeDasharray="40 20"/>
      </svg>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-[18px] font-bold" style={{ color: "#0F172B" }}>Demandes en attente</h3>
        {reviews.length > 0 && (
          <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold text-white" style={{ backgroundColor: "#E17100" }}>
            {reviews.length}
          </span>
        )}
      </div>

      {error && <p className="text-[13px] mb-3" style={{ color: "#DC2626" }}>{error}</p>}

      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 px-6 py-10 text-center">
          <p className="text-[14px]" style={{ color: "#94A3B8" }}>Aucune demande en attente de validation.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100">
        <div className="bg-white min-w-150">
          <div className="grid grid-cols-[2fr_2fr_1fr_1.2fr] px-6 py-3 border-b border-slate-100 rounded-t-xl" style={{ backgroundColor: "#E2E8F0" }}>
            {["UTILISATEUR", "MISSION", "RÉCOMPENSE", "ACTIONS"].map((col) => (
              <span key={col} className="text-[11px] font-bold tracking-wider uppercase" style={{ color: "#45556C" }}>{col}</span>
            ))}
          </div>

          {reviews.map((r, i) => {
            const userName = [r.user?.firstName, r.user?.lastName].filter(Boolean).join(" ") || r.user?.email || "—";
            const isActioning = actioning === r.id + "approve" || actioning === r.id + "reject";
            return (
              <div
                key={r.id}
                className={["grid grid-cols-[2fr_2fr_1fr_1.2fr] px-6 py-4 items-center hover:bg-slate-50 transition-colors duration-150",
                  i < reviews.length - 1 ? "border-b border-slate-100" : ""].join(" ")}
              >
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>{userName}</p>
                  <p className="text-[11px]" style={{ color: "#94A3B8" }}>{r.user?.email}</p>
                </div>
                <div>
                  <p className="text-[13px]" style={{ color: "#0F172B" }}>{r.mission?.title}</p>
                  <p className="text-[11px]" style={{ color: "#94A3B8" }}>
                    {r.createdAt
                      ? `${new Date(r.createdAt).toLocaleDateString("fr-FR")} ${new Date(r.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
                      : r.startedAt
                      ? `${new Date(r.startedAt).toLocaleDateString("fr-FR")} ${new Date(r.startedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
                      : "—"}
                  </p>
                </div>
                <span className="text-[13px] font-semibold" style={{ color: "#E6B84C" }}>{r.mission?.reward} SNL</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => act(r.id, "approve")}
                    disabled={isActioning}
                    className="px-3 py-1.5 rounded-lg text-white text-[12px] font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-50"
                    style={{ backgroundColor: "#3FAE8C" }}
                  >
                    {actioning === r.id + "approve" ? "…" : "Approuver"}
                  </button>
                  <button
                    onClick={() => act(r.id, "reject")}
                    disabled={isActioning}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-semibold hover:bg-red-50 transition cursor-pointer disabled:opacity-50 border"
                    style={{ color: "#EF4444", borderColor: "#FECACA" }}
                  >
                    {actioning === r.id + "reject" ? "…" : "Rejeter"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      )}
    </div>
  );
}

/* ── Main ── */
export default function MissionsPage() {
  const [missions, setMissions]     = useState([]);
  const [stats, setStats]           = useState({ total: 0, active: 0, totalCompletions: 0, snlDistributed: 0 });
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [modal, setModal]           = useState(null); // null | "create" | mission object
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await adminApi.getMissions({ page: 1, limit: 100 });
      const body = res.data?.data ?? res.data;
      const list = Array.isArray(body) ? body : (body?.data ?? []);
      setMissions(list);
      const total            = list.length;
      const active           = list.filter((m) => m.isActive).length;
      const totalCompletions = list.reduce((acc, m) => acc + (m._count?.userMissions ?? m.completionCount ?? 0), 0);
      const snlDistributed   = list.reduce((acc, m) => acc + (m._count?.userMissions ?? m.completionCount ?? 0) * (m.reward ?? 0), 0);
      setStats({ total, active, totalCompletions, snlDistributed });
    } catch (err) { setError(getApiError(err)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = missions.filter(
    (m) => !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.platform.toLowerCase().includes(search.toLowerCase())
  );

  function handleSaved(saved) {
    setMissions((prev) => {
      const idx = prev.findIndex((m) => m.id === saved.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
      return [saved, ...prev];
    });
  }

  const statCards = [
    { label: "Total missions",    value: stats.total,            color: "#0F172B" },
    { label: "Missions actives",  value: stats.active,           color: "#3FAE8C" },
    { label: "Total complétions", value: stats.totalCompletions?.toLocaleString("fr-FR") ?? "—", color: "#3FAE8C" },
    { label: "SNL distribués",    value: stats.snlDistributed?.toLocaleString("fr-FR") ?? "—",   color: "#E6B84C" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <p className="text-[14px]" style={{ color: "#45556C" }}>Créez et gérez les missions pour encourager l&apos;engagement communautaire</p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
            <p className="text-[13px] mb-2" style={{ color: "#45556C" }}>{s.label}</p>
            <p className="text-[32px] font-bold leading-none" style={{ color: s.color }}>{loading ? "…" : s.value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-xl px-5 py-4 border text-[13px]" style={{ backgroundColor: "#FEF2F2", borderColor: "#FECACA", color: "#DC2626" }}>
          {error}
        </div>
      )}

      {/* Action bar */}
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#94A3B8" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une mission..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-[14px] placeholder:text-slate-400 outline-none focus:ring-2 transition"
            style={{ color: "#45556C" }}
          />
        </div>
        <button
          onClick={() => setModal("create")}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer whitespace-nowrap shrink-0"
          style={{ backgroundColor: "#3FAE8C" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          Ajouter une mission
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100">
      <div className="bg-white min-w-180">
        <div className="grid grid-cols-[2.5fr_1fr_1.2fr_0.8fr_1fr_1.2fr_0.7fr] px-6 py-3 border-b border-slate-100 rounded-t-xl" style={{ backgroundColor: "#E2E8F0" }}>
          {COLS.map((col) => (
            <span key={col} className="text-[11px] font-bold tracking-wider uppercase" style={{ color: "#45556C" }}>{col}</span>
          ))}
        </div>

        {loading ? (
          <div className="px-6 py-12 flex justify-center">
            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#3FAE8C" strokeWidth="3" strokeLinecap="round" strokeDasharray="40 20"/>
            </svg>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-[14px]" style={{ color: "#45556C" }}>Aucune mission trouvée.</div>
        ) : filtered.map((m, i) => (
          <div
            key={m.id}
            className={["grid grid-cols-[2.5fr_1fr_1.2fr_0.8fr_1fr_1.2fr_0.7fr] px-6 py-4 items-center hover:bg-slate-50 transition-colors duration-150",
              i < filtered.length - 1 ? "border-b border-slate-100" : ""].join(" ")}
          >
            <div className="flex items-center gap-3">
              <PlatformIcon platform={m.platform} />
              <div>
                <p className="text-[13px] font-semibold leading-snug" style={{ color: "#0F172B" }}>{m.title}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "#94A3B8" }}>{m.description}</p>
              </div>
            </div>
            <span className="text-[13px] capitalize" style={{ color: "#45556C" }}>{m.platform}</span>
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="6" stroke="#E6B84C" strokeWidth="2"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="text-[13px] font-semibold" style={{ color: "#E6B84C" }}>{m.reward} SNL</span>
            </div>
            <span
              className="inline-flex w-fit items-center px-2.5 py-1 rounded-full text-[12px] border whitespace-nowrap"
              style={m.isActive
                ? { backgroundColor: "#ECFDF5", color: "#059669", borderColor: "#D1FAE5" }
                : { backgroundColor: "#FFF7ED", color: "#D97706", borderColor: "#FED7AA" }}
            >
              {m.isActive ? "Actif" : "Inactif"}
            </span>
            <span className="text-[13px]" style={{ color: "#45556C" }}>
              {(m.completionCount ?? m._count?.userMissions ?? 0).toLocaleString("fr-FR")}
            </span>
            <div className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#94A3B8" strokeWidth="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/></svg>
              <span className="text-[13px]" style={{ color: "#45556C" }}>
                {new Date(m.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setModal(m)} className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button onClick={() => setDeleteTarget(m)} className="hover:text-red-500 transition cursor-pointer" style={{ color: "#94A3B8" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>

      {/* Demandes en attente */}
      <ReviewsSection />

      {modal && (
        <MissionModal
          mission={modal === "create" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          mission={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={(id) => setMissions((prev) => prev.filter((m) => m.id !== id))}
        />
      )}
    </div>
  );
}
