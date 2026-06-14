"use client";

import { useEffect, useState, useCallback } from "react";
import { adminApi, getApiError } from "@/lib/api";

function normalizeSettings(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    // might be { key: value } flat map
    return Object.entries(raw).map(([key, value]) => ({ key, value }));
  }
  return [];
}

function EditModal({ setting, onClose, onSaved }) {
  const [value, setValue]   = useState(String(setting.value ?? ""));
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await adminApi.updateSetting(setting.key, value);
      onSaved(setting.key, value);
      onClose();
    } catch (err) {
      setError(getApiError(err));
    } finally { setLoading(false); }
  }

  const isBoolean = value === "true" || value === "false";
  const isNumber  = !isNaN(Number(value)) && value !== "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-[16px] font-bold" style={{ color: "#1F4E46" }}>Modifier le paramètre</h2>
            <p className="text-[12px] text-slate-400 mt-0.5 font-mono">{setting.key}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {setting.description && (
            <p className="text-[13px] text-slate-500 bg-slate-50 rounded-xl px-4 py-3">{setting.description}</p>
          )}

          {isBoolean ? (
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-slate-500 font-semibold uppercase tracking-wider">Valeur</label>
              <div className="flex gap-3">
                {["true", "false"].map((v) => (
                  <button key={v} type="button" onClick={() => setValue(v)}
                    className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold border transition cursor-pointer ${
                      value === v ? "bg-primary text-white border-primary" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}>
                    {v === "true" ? "Activé" : "Désactivé"}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-slate-500 font-semibold uppercase tracking-wider">Valeur</label>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type={isNumber ? "number" : "text"}
                className="border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-secondary font-mono"
              />
            </div>
          )}

          {error && <p className="text-[13px] text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-500 hover:bg-slate-50 transition cursor-pointer">
              Annuler
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 text-white text-[13px] font-semibold rounded-xl hover:brightness-110 transition cursor-pointer disabled:opacity-60 bg-primary">
              {loading ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const CATEGORY_ICONS = {
  default: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M19.07 4.93A10 10 0 115 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

const KEY_META = {
  // SNL Points — cœur du système
  daily_collect_points:        { label: "Points par collecte",           desc: "Nombre de points SNL gagnés par collecte quotidienne (actuellement 100)" },
  registration_bonus:          { label: "Bonus d'inscription",           desc: "Points SNL offerts gratuitement à chaque nouvel inscrit" },
  referral_bonus_n1:           { label: "Bonus parrainage niveau 1 (%)", desc: "% des points collectés par le filleul direct crédité au parrain (ex: 35 = 35%)" },
  referral_bonus_n2:           { label: "Bonus parrainage niveau 2 (%)", desc: "% des points collectés par le filleul de niveau 2 crédité au parrain (ex: 20 = 20%)" },
  referral_bonus_n3:           { label: "Bonus parrainage niveau 3 (%)", desc: "% des points collectés par le filleul de niveau 3 crédité au parrain (ex: 15 = 15%)" },
  max_mlm_levels:              { label: "Niveaux de parrainage actifs",  desc: "Nombre de niveaux de parrainage pris en compte (actuellement 3)" },
  // Système
  maintenance_mode:            { label: "Mode maintenance",              desc: "Si activé, le site est inaccessible aux utilisateurs" },
  site_name:                   { label: "Nom du site",                   desc: "Nom affiché sur la plateforme" },
  // Retraits wallet (secondaire)
  min_withdrawal:              { label: "Retrait minimum",               desc: "Montant minimum pour effectuer un retrait depuis le wallet" },
  max_withdrawal:              { label: "Retrait maximum",               desc: "Montant maximum autorisé par retrait depuis le wallet" },
  withdrawal_fee:              { label: "Frais de retrait",              desc: "Pourcentage prélevé sur chaque retrait (ex: 0.02 = 2%)" },
  // Non utilisé dans l'architecture SNL actuelle
  site_currency:               { label: "Devise wallet",                 desc: "Devise du wallet (non utilisé dans le système SNL points)" },
  commission_approval_required:{ label: "Validation des commissions",    desc: "Non utilisé — le système SNL crédite automatiquement les bonus parrainage" },
};

function getKeyMeta(key) {
  return KEY_META[key] ?? KEY_META[key.toLowerCase()] ?? { label: key, desc: "" };
}

function guessCategory(key) {
  const k = key.toLowerCase();
  if (k.includes("mail") || k.includes("email") || k.includes("smtp")) return "Email";
  if (k.includes("payment") || k.includes("stripe") || k.includes("cinetpay")) return "Paiement";
  if (k.includes("commission") || k.includes("rate") || k.includes("percent")) return "Commissions";
  if (k.includes("storage") || k.includes("s3") || k.includes("upload")) return "Stockage";
  if (k.includes("notif") || k.includes("push") || k.includes("fcm")) return "Notifications";
  if (k.includes("maintenance") || k.includes("debug") || k.includes("log")) return "Système";
  return "Général";
}

const KEY_FORMAT = {
  daily_collect_points: (v) => `${v} SNL / collecte`,
  registration_bonus:   (v) => Number(v) === 0 ? "Aucun" : `${v} SNL`,
  referral_bonus_n1:    (v) => `${v}% des collectes filleul`,
  referral_bonus_n2:    (v) => `${v}% des collectes filleul`,
  referral_bonus_n3:    (v) => `${v}% des collectes filleul`,
  max_mlm_levels:       (v) => `${v} niveaux`,
  min_withdrawal:       (v) => `${v} USD`,
  max_withdrawal:       (v) => `${v} USD`,
  withdrawal_fee:       (v) => `${(Number(v) * 100).toFixed(0)} %`,
};

function formatValue(value, key) {
  if (value === "true"  || value === true)  return <span className="text-green-600 font-semibold text-[12px] bg-green-50 px-2 py-0.5 rounded-lg">Activé</span>;
  if (value === "false" || value === false) return <span className="text-red-500 font-semibold text-[12px] bg-red-50 px-2 py-0.5 rounded-lg">Désactivé</span>;
  if (key && KEY_FORMAT[key]) return <span className="text-[13px] font-semibold" style={{ color: "#1F4E46" }}>{KEY_FORMAT[key](value)}</span>;
  if (String(value).length > 50) return <span className="font-mono text-[12px] text-slate-500 truncate" title={value}>{String(value).slice(0, 50)}…</span>;
  return <span className="font-mono text-[13px] text-slate-600">{String(value ?? "—")}</span>;
}

export default function SettingsManagement() {
  const [settings, setSettings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [selected, setSelected]   = useState(null);
  const [search, setSearch]       = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await adminApi.getSettings();
      const raw = res.data?.data ?? res.data;
      setSettings(normalizeSettings(raw));
    } catch (e) { setError(getApiError(e)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleSaved(key, newValue) {
    setSettings((prev) => prev.map((s) => s.key === key ? { ...s, value: newValue } : s));
  }

  const HIDDEN_KEYS = new Set(["site_currency", "min_withdrawal", "max_withdrawal", "withdrawal_fee", "commission_approval_required"]);

  const filtered = settings.filter((s) => {
    if (HIDDEN_KEYS.has(s.key)) return false;
    return !search || s.key.toLowerCase().includes(search.toLowerCase()) ||
      String(s.value ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (s.description ?? "").toLowerCase().includes(search.toLowerCase());
  });

  const GROUP_LABELS = { snl: "Points SNL", mlm: "Parrainage", system: "Système", general: "Général" };

  // Group by category
  const grouped = filtered.reduce((acc, s) => {
    const raw = s.group ?? s.category ?? guessCategory(s.key);
    const cat = GROUP_LABELS[raw] ?? raw;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-[22px] font-bold" style={{ color: "#1F4E46" }}>Paramètres</h2>
          <p className="text-[13px] text-slate-400 mt-0.5">{settings.length} paramètre{settings.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-[13px] outline-none focus:border-secondary w-64" />
        </div>
      </div>

      {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-600">{error}</div>}

      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 animate-pulse flex flex-col gap-3">
              <div className="h-4 bg-slate-100 rounded w-24" />
              {[...Array(3)].map((__, j) => <div key={j} className="h-12 bg-slate-50 rounded-xl" />)}
            </div>
          ))}
        </div>
      ) : settings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <p className="text-slate-400 text-[14px]">Aucun paramètre trouvé</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                <div className="text-primary">{CATEGORY_ICONS.default}</div>
                <h3 className="text-[14px] font-bold" style={{ color: "#1F4E46" }}>{category}</h3>
                <span className="text-[11px] text-slate-400 bg-slate-50 rounded-full px-2 py-0.5 ml-1">{items.length}</span>
              </div>
              <div className="divide-y divide-slate-50">
                {items.map((s) => (
                  <div key={s.key} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition group">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>{getKeyMeta(s.key).label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{s.description || getKeyMeta(s.key).desc}</p>
                    </div>
                    <div className="shrink-0">{formatValue(s.value, s.key)}</div>
                    <button
                      onClick={() => setSelected(s)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition text-[12px] font-semibold text-secondary hover:underline cursor-pointer ml-2">
                      Modifier
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && <EditModal setting={selected} onClose={() => setSelected(null)} onSaved={handleSaved} />}
    </div>
  );
}
