"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi, getApiError } from "@/lib/api";

const TABS = ["Abonnés", "Campagnes", "Envoyer"];

function fmt(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ── Badge ─────────────────────────────────────────────────────────
function StatusBadge({ active }) {
  return active ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ backgroundColor: "#ECFDF5", color: "#059669", border: "1px solid #D1FAE5" }}>
      Actif
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ backgroundColor: "#F1F5F9", color: "#64748B", border: "1px solid #E2E8F0" }}>
      Désabonné
    </span>
  );
}

// ── Onglet Abonnés ────────────────────────────────────────────────
function SubscribersTab() {
  const [rows, setRows]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async (p = 1, q = search) => {
    setLoading(true);
    try {
      const res = await adminApi.getNewsletterSubscribers({ page: p, limit: 20, search: q });
      const d = res.data?.data ?? res.data;
      setRows(d?.data ?? d ?? []);
      setTotal(d?.total ?? 0);
      setPage(p);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(1); }, []);

  async function handleDelete(id) {
    if (!confirm("Supprimer cet abonné ?")) return;
    setDeleting(id);
    try {
      await adminApi.deleteNewsletterSubscriber(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
      setTotal((t) => t - 1);
    } catch (err) {
      alert(getApiError(err));
    } finally {
      setDeleting(null);
    }
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="flex flex-col gap-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total abonnés", value: total },
          { label: "Actifs", value: rows.filter((r) => r.isActive).length },
          { label: "Désabonnés", value: rows.filter((r) => !r.isActive).length },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <p className="text-[11px] text-slate-400 mb-1">{s.label}</p>
            <p className="text-[22px] font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(1, search)}
          placeholder="Rechercher un email..."
          className="flex-1 border border-slate-200 rounded-lg px-3 text-[13px] text-slate-700 outline-none focus:ring-2 focus:ring-primary/20"
          style={{ height: 38 }}
        />
        <button onClick={() => load(1, search)}
          className="px-4 rounded-lg text-[13px] font-medium text-white cursor-pointer"
          style={{ height: 38, backgroundColor: "#1F4E46" }}>
          Rechercher
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
                {["Email", "Source", "Date d'inscription", "Statut", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-400 text-[13px]">Chargement...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-400 text-[13px]">Aucun abonné</td></tr>
              ) : rows.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #F8FAFC" }}>
                  <td className="px-4 py-3 font-medium text-slate-700">{r.email}</td>
                  <td className="px-4 py-3 text-slate-400">{r.source ?? "footer"}</td>
                  <td className="px-4 py-3 text-slate-400">{fmt(r.createdAt)}</td>
                  <td className="px-4 py-3"><StatusBadge active={r.isActive} /></td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={deleting === r.id}
                      className="text-red-400 hover:text-red-600 text-[12px] cursor-pointer disabled:opacity-50"
                    >
                      {deleting === r.id ? "..." : "Supprimer"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-50">
            <p className="text-[12px] text-slate-400">{total} abonné{total > 1 ? "s" : ""}</p>
            <div className="flex gap-2">
              <button onClick={() => load(page - 1)} disabled={page <= 1}
                className="px-3 py-1 rounded text-[12px] border border-slate-200 text-slate-500 disabled:opacity-40 cursor-pointer">
                ←
              </button>
              <span className="px-3 py-1 text-[12px] text-slate-500">{page} / {totalPages}</span>
              <button onClick={() => load(page + 1)} disabled={page >= totalPages}
                className="px-3 py-1 rounded text-[12px] border border-slate-200 text-slate-500 disabled:opacity-40 cursor-pointer">
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Onglet Campagnes ──────────────────────────────────────────────
function CampaignsTab() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getNewsletterCampaigns({ page: 1, limit: 50 })
      .then((res) => {
        const d = res.data?.data ?? res.data;
        setRows(d?.data ?? d ?? []);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
              {["Sujet", "Cible", "Envoyés", "Date d'envoi"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-10 text-slate-400 text-[13px]">Chargement...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-slate-400 text-[13px]">Aucune campagne envoyée</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid #F8FAFC" }}>
                <td className="px-4 py-3 font-medium text-slate-700 max-w-[300px] truncate">{r.subject}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ backgroundColor: "#F0FDF4", color: "#16a34a" }}>
                    {r.targetGroup === "all" ? "Tous" : "Actifs"}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-700">{r.sentCount ?? "—"}</td>
                <td className="px-4 py-3 text-slate-400">{fmt(r.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Onglet Envoyer ────────────────────────────────────────────────
function SendTab() {
  const [subject, setSubject]   = useState("");
  const [body, setBody]         = useState("");
  const [target, setTarget]     = useState("all");
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(null);
  const [error, setError]       = useState("");

  async function handleSend(e) {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) { setError("Le sujet et le contenu sont requis."); return; }
    if (!confirm(`Envoyer cette newsletter à ${target === "all" ? "tous les abonnés" : "les abonnés actifs"} ?`)) return;
    setLoading(true);
    setError("");
    setSuccess(null);
    try {
      const res = await adminApi.sendNewsletter({ subject: subject.trim(), html: body.trim(), targetGroup: target });
      const d = res.data?.data ?? res.data;
      setSuccess(d?.sentCount ?? d?.sent ?? d?.count ?? null);
      setSubject("");
      setBody("");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSend} className="flex flex-col gap-5">
        {/* Cible */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Destinataires</label>
          <div className="flex gap-3">
            {[{ value: "all", label: "Tous les abonnés" }, { value: "active", label: "Abonnés actifs uniquement" }].map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setTarget(o.value)}
                className="px-4 py-2 rounded-lg text-[13px] font-medium border transition-colors cursor-pointer"
                style={{
                  backgroundColor: target === o.value ? "#1F4E46" : "white",
                  color: target === o.value ? "white" : "#64748B",
                  borderColor: target === o.value ? "#1F4E46" : "#E2E8F0",
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sujet */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Sujet de l'email</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="ex: Nouveautés SUNALA — Juin 2026"
            className="border border-slate-200 rounded-lg px-3 text-[13px] text-slate-700 outline-none focus:ring-2 focus:ring-primary/20"
            style={{ height: 42 }}
          />
        </div>

        {/* Contenu */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Contenu (HTML ou texte)</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Bonjour,&#10;&#10;Voici les dernières nouvelles de SUNALA..."
            rows={10}
            className="border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 resize-y font-mono"
          />
          <p className="text-[11px] text-slate-400">Vous pouvez utiliser du HTML basique (&lt;b&gt;, &lt;a&gt;, &lt;p&gt;, etc.)</p>
        </div>

        {error && <p className="text-[13px] text-red-500">{error}</p>}
        {success !== null && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "#ECFDF5", border: "1px solid #D1FAE5" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-[13px] font-semibold text-green-700">
              {success != null
                ? `Newsletter envoyée à ${success} abonné${success > 1 ? "s" : ""} !`
                : "Newsletter envoyée avec succès !"}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="self-start px-6 py-2.5 rounded-lg text-[14px] font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-60"
          style={{ backgroundColor: "#1F4E46" }}
        >
          {loading ? "Envoi en cours..." : "Envoyer la newsletter"}
        </button>
      </form>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────
export default function NewsletterPage() {
  const [tab, setTab] = useState(0);

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl self-start" style={{ backgroundColor: "#F1F5F9" }}>
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className="px-4 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer"
            style={{
              backgroundColor: tab === i ? "#ffffff" : "transparent",
              color: tab === i ? "#1F4E46" : "#94A3B8",
              boxShadow: tab === i ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && <SubscribersTab />}
      {tab === 1 && <CampaignsTab />}
      {tab === 2 && <SendTab />}
    </div>
  );
}
