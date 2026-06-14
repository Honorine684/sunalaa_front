"use client";

import { useEffect, useState } from "react";
import { adminApi, getApiError } from "@/lib/api";

const EMPTY = { name: "", description: "", minPoints: "", color: "#BB4D00", order: "" };

function Modal({ title, fields, setFields, onSave, onClose, saving, err }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[16px] text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
        </div>

        {err && <p className="text-red-500 text-[13px] bg-red-50 rounded-lg px-3 py-2">{err}</p>}

        {[
          { key: "name",        label: "Nom du niveau",     type: "text",   placeholder: "ex: Gold" },
          { key: "description", label: "Description",       type: "text",   placeholder: "ex: Niveau de départ" },
          { key: "minPoints",   label: "Points minimum",    type: "number", placeholder: "ex: 5000" },
          { key: "order",       label: "Ordre d'affichage", type: "number", placeholder: "ex: 1" },
        ].map(({ key, label, type, placeholder }) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-slate-600">{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              value={fields[key]}
              onChange={e => setFields(f => ({ ...f, [key]: e.target.value }))}
              className="border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-primary"
            />
          </div>
        ))}

        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-medium text-slate-600">Couleur (hex)</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={fields.color}
              onChange={e => setFields(f => ({ ...f, color: e.target.value }))}
              className="w-10 h-10 rounded cursor-pointer border-0 p-0"
            />
            <input
              type="text"
              value={fields.color}
              onChange={e => setFields(f => ({ ...f, color: e.target.value }))}
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-primary"
              placeholder="#BB4D00"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[14px] hover:bg-slate-50 cursor-pointer">
            Annuler
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-white text-[14px] font-medium cursor-pointer disabled:opacity-60"
            style={{ backgroundColor: "#1F4E46" }}
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LevelsPage() {
  const [levels, setLevels]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null); // null | { mode: "create" | "edit", level?: {} }
  const [fields, setFields]   = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [err, setErr]         = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.getLevels();
      const raw = res.data?.data ?? res.data;
      setLevels(Array.isArray(raw) ? raw.sort((a, b) => a.order - b.order) : []);
    } catch (e) {
      setErr(getApiError(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setFields(EMPTY);
    setErr("");
    setModal({ mode: "create" });
  }

  function openEdit(level) {
    setFields({
      name:        level.name ?? "",
      description: level.description ?? "",
      minPoints:   String(level.minPoints ?? ""),
      color:       level.color ?? "#BB4D00",
      order:       String(level.order ?? ""),
    });
    setErr("");
    setModal({ mode: "edit", level });
  }

  async function handleSave() {
    if (!fields.name.trim()) { setErr("Le nom est requis."); return; }
    setSaving(true); setErr("");
    const payload = {
      name:        fields.name.trim(),
      description: fields.description.trim(),
      minPoints:   Number(fields.minPoints) || 0,
      color:       fields.color,
      order:       Number(fields.order) || 0,
    };
    try {
      if (modal.mode === "create") {
        await adminApi.createLevel(payload);
      } else {
        await adminApi.updateLevel(modal.level.id, payload);
      }
      setModal(null);
      load();
    } catch (e) {
      setErr(getApiError(e));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(level) {
    if (!confirm(`Supprimer le niveau "${level.name}" ?`)) return;
    setDeleting(level.id);
    try {
      await adminApi.deleteLevel(level.id);
      load();
    } catch (e) {
      alert(getApiError(e));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-slate-800">Niveaux</h2>
          <p className="text-[13px] text-slate-500 mt-0.5">Gérez les paliers SNL et leurs seuils de points</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[14px] font-medium cursor-pointer hover:brightness-110 transition"
          style={{ backgroundColor: "#1F4E46" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Ajouter un niveau
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#1F4E46" strokeWidth="3" strokeDasharray="40 20"/>
            </svg>
          </div>
        ) : levels.length === 0 ? (
          <p className="text-center text-slate-400 text-[14px] py-16">Aucun niveau configuré.</p>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Ordre", "Nom", "Points min.", "Couleur", "Description", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] uppercase tracking-wide text-slate-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {levels.map((level) => (
                <tr key={level.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                  <td className="px-5 py-4 text-slate-500">{level.order}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg shrink-0" style={{ backgroundColor: level.color ?? "#BB4D00" }} />
                      <span className="font-medium text-slate-800">{level.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-700">
                    {Number(level.minPoints ?? 0).toLocaleString("fr-FR")} SNL
                  </td>
                  <td className="px-5 py-4 text-slate-500 font-mono text-[12px]">{level.color}</td>
                  <td className="px-5 py-4 text-slate-500 max-w-[200px] truncate">{level.description || "—"}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(level)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-[12px] hover:bg-slate-50 cursor-pointer transition"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(level)}
                        disabled={deleting === level.id}
                        className="px-3 py-1.5 rounded-lg text-[12px] cursor-pointer transition disabled:opacity-50"
                        style={{ backgroundColor: "#FEF2F2", color: "#EF4444" }}
                      >
                        {deleting === level.id ? "…" : "Supprimer"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal
          title={modal.mode === "create" ? "Ajouter un niveau" : "Modifier le niveau"}
          fields={fields}
          setFields={setFields}
          onSave={handleSave}
          onClose={() => setModal(null)}
          saving={saving}
          err={err}
        />
      )}
    </div>
  );
}
