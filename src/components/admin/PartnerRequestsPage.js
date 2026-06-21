"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";

const STATUSES = ["pending", "contacted", "accepted", "rejected"];

const STATUS_LABELS = {
  pending:   { label: "En attente",  bg: "#FEF3C7", color: "#D97706" },
  contacted: { label: "Contacté",    bg: "#DBEAFE", color: "#2563EB" },
  accepted:  { label: "Accepté",     bg: "#D1FAE5", color: "#059669" },
  rejected:  { label: "Refusé",      bg: "#FEE2E2", color: "#DC2626" },
};

function StatusBadge({ status }) {
  const s = STATUS_LABELS[status] ?? { label: status, bg: "#F1F5F9", color: "#64748B" };
  return (
    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

export default function PartnerRequestsPage() {
  const [requests, setRequests]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("all");
  const [selected, setSelected]     = useState(null);
  const [updating, setUpdating]     = useState(false);

  useEffect(() => {
    load();
  }, [filter]);

  async function load() {
    setLoading(true);
    try {
      const params = filter !== "all" ? { status: filter } : {};
      const res = await adminApi.getPartnerRequests(params);
      const raw = res.data?.data ?? res.data;
      const list = Array.isArray(raw) ? raw
        : Array.isArray(raw?.items) ? raw.items
        : Array.isArray(raw?.data) ? raw.data
        : [];
      setRequests(list);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(id, status) {
    setUpdating(true);
    try {
      await adminApi.updatePartnerRequest(id, { status });
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      if (selected?.id === id) setSelected((prev) => ({ ...prev, status }));
    } catch {/* noop */}
    finally { setUpdating(false); }
  }

  const counts = requests.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: "pending",   label: "En attente" },
          { key: "contacted", label: "Contactés" },
          { key: "accepted",  label: "Acceptés" },
          { key: "rejected",  label: "Refusés" },
        ].map(({ key, label }) => (
          <div key={key} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-[12px] font-medium mb-1" style={{ color: "#94A3B8" }}>{label}</p>
            <p className="text-[26px] font-black" style={{ color: "#0F172B" }}>{counts[key] ?? 0}</p>
            <div className="mt-1 h-1 rounded-full" style={{ backgroundColor: STATUS_LABELS[key]?.bg ?? "#F1F5F9" }}>
              <div className="h-full rounded-full" style={{ width: `${requests.length ? ((counts[key] ?? 0) / requests.length) * 100 : 0}%`, backgroundColor: STATUS_LABELS[key]?.color ?? "#94A3B8" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Filter + Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-bold text-[15px]" style={{ color: "#0F172B" }}>
            Demandes de partenariat <span className="text-slate-400 font-normal">({requests.length})</span>
          </h2>
          <div className="flex gap-2 flex-wrap">
            {["all", ...STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
                style={{
                  backgroundColor: filter === s ? "#1F4E46" : "#F8FAFC",
                  color: filter === s ? "white" : "#64748B",
                  border: `1px solid ${filter === s ? "#1F4E46" : "#E2E8F0"}`,
                }}
              >
                {s === "all" ? "Tous" : STATUS_LABELS[s]?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <svg className="animate-spin w-6 h-6" style={{ color: "#3FAE8C" }} viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          </div>
        ) : requests.length === 0 ? (
          <p className="text-center py-16 text-slate-400 text-[14px]">Aucune demande</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Nom / Société", "Email", "Téléphone", "Type", "Statut", "Date", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#94A3B8" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                    <td className="px-5 py-3.5 text-[13px] font-semibold" style={{ color: "#0F172B" }}>{r.name}</td>
                    <td className="px-5 py-3.5 text-[13px]" style={{ color: "#475569" }}>{r.email}</td>
                    <td className="px-5 py-3.5 text-[13px]" style={{ color: "#475569" }}>{r.phone || "—"}</td>
                    <td className="px-5 py-3.5 text-[12px] max-w-[160px] truncate" style={{ color: "#64748B" }}>{r.partnershipType ?? r.partnership_type}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                    <td className="px-5 py-3.5 text-[12px]" style={{ color: "#94A3B8" }}>
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setSelected(r)}
                        className="text-[12px] font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
                        style={{ color: "#475569" }}
                      >
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">

            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-[16px]" style={{ color: "#0F172B" }}>Demande partenaire</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
              <Row label="Nom / Société" value={selected.name} />
              <Row label="Email" value={selected.email} />
              <Row label="Téléphone" value={selected.phone || "—"} />
              <Row label="Type de partenariat" value={selected.partnershipType ?? selected.partnership_type} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#94A3B8" }}>Message</p>
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: "#374151" }}>{selected.message}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#94A3B8" }}>Statut</p>
                <StatusBadge status={selected.status} />
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-slate-100 flex flex-wrap gap-2">
              {STATUSES.filter((s) => s !== selected.status).map((s) => (
                <button
                  key={s}
                  onClick={() => changeStatus(selected.id, s)}
                  disabled={updating}
                  className="text-[13px] font-semibold px-4 py-2 rounded-xl border transition cursor-pointer disabled:opacity-50"
                  style={{
                    backgroundColor: STATUS_LABELS[s]?.bg ?? "#F8FAFC",
                    color: STATUS_LABELS[s]?.color ?? "#64748B",
                    borderColor: STATUS_LABELS[s]?.color ?? "#E2E8F0",
                  }}
                >
                  → {STATUS_LABELS[s]?.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: "#94A3B8" }}>{label}</p>
      <p className="text-[14px]" style={{ color: "#374151" }}>{value}</p>
    </div>
  );
}
