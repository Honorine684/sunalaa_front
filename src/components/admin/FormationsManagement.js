"use client";

import { useEffect, useRef, useState } from "react";
import { productsApi, adminApi, getApiError } from "@/lib/api";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://api.sunalaa.com/api/v1").replace("/api/v1", "");
function toAbsoluteUrl(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
}

const TYPES = ["Vidéo", "PDF", "Zoom", "Séminaire"];
const STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];

const TYPE_COLORS = {
  "Vidéo":     { color: "#3B82F6", bg: "#EFF6FF" },
  "PDF":       { color: "#EF4444", bg: "#FEF2F2" },
  "Zoom":      { color: "#10B981", bg: "#ECFDF5" },
  "Séminaire": { color: "#8B5CF6", bg: "#F5F3FF" },
};

function MediaUploadField({ label, accept, currentUrl, onUpload, uploading }) {
  const ref = useRef(null);
  const fileName = currentUrl ? currentUrl.split("/").pop() : null;
  async function handleChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    await onUpload(file);
    e.target.value = "";
  }
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium" style={{ color: "#45556C" }}>{label}</label>
      <button type="button" onClick={() => !uploading && ref.current?.click()}
        className={`flex items-center gap-2.5 border-2 border-dashed rounded-xl px-3 py-2.5 transition cursor-pointer text-left w-full ${currentUrl ? "border-green-200 bg-green-50" : "border-slate-200 bg-slate-50 hover:bg-white"}`}>
        {uploading ? (
          <>
            <svg className="animate-spin w-4 h-4 shrink-0 text-blue-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            <span className="text-[13px] text-blue-500">Envoi en cours...</span>
          </>
        ) : currentUrl ? (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[12px] truncate flex-1" style={{ color: "#059669" }}>{fileName}</span>
            <span className="text-[11px] shrink-0" style={{ color: "#94A3B8" }}>Changer</span>
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[13px]" style={{ color: "#94A3B8" }}>Cliquer pour uploader</span>
          </>
        )}
      </button>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={handleChange} />
    </div>
  );
}

function Badge({ children, color, bg }) {
  return (
    <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg" style={{ color, backgroundColor: bg }}>
      {children}
    </span>
  );
}

function StatusBadge({ status }) {
  return status === "ACTIVE"
    ? <Badge color="#059669" bg="#ECFDF5">Actif</Badge>
    : <Badge color="#94A3B8" bg="#F1F5F9">Inactif</Badge>;
}

/* ── Modal Formulaire ── */
function FormationModal({ initial, categories, onClose, onSave }) {
  const isEdit = !!initial?.id;

  const [fields, setFields] = useState({
    name: initial?.name ?? "",
    type: initial?.type ?? "",
    shortDesc: initial?.shortDesc ?? "",
    description: initial?.description ?? "",
    categoryId: initial?.categoryId ?? "",
    price: initial?.price ?? 0,
    pv: initial?.pv ?? 0,
    contentUrl: initial?.contentUrl ?? initial?.videoUrl ?? initial?.pdfUrl ?? initial?.zoomLink ?? "",
    imageUrl: initial?.images?.[0] ?? "",
    status: initial?.status ?? "ACTIVE",
    isFeatured: initial?.isFeatured ?? false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingContent, setUploadingContent] = useState(false);

  function set(key, val) {
    setFields(p => ({ ...p, [key]: val }));
    setError("");
  }

  async function uploadMedia(file, setUploading, fieldKey) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("media", file);
      const res = await adminApi.uploadProductMedia(fd);
      const url = (res.data?.data ?? res.data)?.url;
      if (url) set(fieldKey, url);
    } catch (err) {
      setError(`Erreur upload : ${getApiError(err)}`);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fields.name.trim()) { setError("Le nom est requis."); return; }
    const priceNum = Number(fields.price);
    if (!fields.price || isNaN(priceNum) || priceNum <= 0) { setError("Le prix est requis et doit être supérieur à 0."); return; }

    const payload = {
      name: fields.name.trim(),
      type: fields.type || undefined,
      shortDesc: fields.shortDesc.trim(),
      description: fields.description.trim(),
      categoryId: fields.categoryId || undefined,
      sku: fields.name.trim().toLowerCase().replace(/\s+/g, "-"),
      price: priceNum,
      comparePrice: 0,
      cost: 0,
      pv: Number(fields.pv) || 0,
      bv: 0,
      stock: 9999,
      status: fields.status,
      isFeatured: fields.isFeatured,
      images: fields.imageUrl ? [fields.imageUrl] : [],
      // contentUrl ajouté dès que le backend ajoute le champ au DTO
    };

    setLoading(true);
    setError("");
    try {
      await onSave(payload);
      onClose();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-[16px] font-bold" style={{ color: "#0F172B" }}>
            {isEdit ? "Modifier la formation" : "Nouvelle formation"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-4">

          {error && (
            <div className="px-4 py-2.5 rounded-xl text-[13px]" style={{ backgroundColor: "#FFF1F2", color: "#E11D48", border: "1px solid #FFE4E6" }}>
              {error}
            </div>
          )}

          {/* Nom */}
          <Field label="Nom *">
            <input value={fields.name} onChange={e => set("name", e.target.value)}
              placeholder="Ex : Introduction à la Blockchain"
              className="input-base" />
          </Field>

          {/* Type + Catégorie */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <select value={fields.type} onChange={e => set("type", e.target.value)} className="input-base">
                <option value="">— Choisir</option>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Catégorie">
              <select value={fields.categoryId} onChange={e => set("categoryId", e.target.value)} className="input-base">
                <option value="">— Aucune</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>

          {/* Description courte */}
          <Field label="Description courte">
            <input value={fields.shortDesc} onChange={e => set("shortDesc", e.target.value)}
              placeholder="Résumé en une phrase..."
              className="input-base" />
          </Field>

          {/* Description longue */}
          <Field label="Description complète">
            <textarea value={fields.description} onChange={e => set("description", e.target.value)}
              rows={3} placeholder="Contenu détaillé..."
              className="input-base resize-none" />
          </Field>

          {/* Contenu */}
          {fields.type === "Vidéo" || fields.type === "PDF" ? (
            <MediaUploadField
              label={fields.type === "PDF" ? "Fichier PDF" : "Fichier vidéo"}
              accept={fields.type === "PDF" ? "application/pdf" : "video/mp4,video/webm"}
              currentUrl={fields.contentUrl}
              uploading={uploadingContent}
              onUpload={(file) => uploadMedia(file, setUploadingContent, "contentUrl")}
            />
          ) : (
            <Field label="Lien du contenu (Zoom, séminaire...)">
              <input value={fields.contentUrl} onChange={e => set("contentUrl", e.target.value)}
                placeholder="https://zoom.us/j/..."
                className="input-base" type="url" />
            </Field>
          )}

          {/* Image de couverture */}
          <MediaUploadField
            label="Image de couverture"
            accept="image/jpeg,image/png,image/webp"
            currentUrl={fields.imageUrl}
            uploading={uploadingImage}
            onUpload={(file) => uploadMedia(file, setUploadingImage, "imageUrl")}
          />

          {/* Prix + PV */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prix (FCFA)">
              <input value={fields.price} onChange={e => set("price", e.target.value)}
                type="number" min="0" className="input-base" />
            </Field>
            <Field label="Récompense (SNL / PV)">
              <input value={fields.pv} onChange={e => set("pv", e.target.value)}
                type="number" min="0" className="input-base" />
            </Field>
          </div>

          {/* Statut + Featured */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Statut">
              <select value={fields.status} onChange={e => set("status", e.target.value)} className="input-base">
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === "ACTIVE" ? "Actif" : "Inactif"}</option>)}
              </select>
            </Field>
            <Field label="Mise en avant">
              <label className="flex items-center gap-2 h-[42px] cursor-pointer">
                <input type="checkbox" checked={fields.isFeatured} onChange={e => set("isFeatured", e.target.checked)}
                  className="w-4 h-4 accent-secondary" />
                <span className="text-[13px]" style={{ color: "#45556C" }}>Mettre en vedette</span>
              </label>
            </Field>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 justify-end">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-[14px] border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
            style={{ color: "#45556C" }}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="px-5 py-2.5 rounded-xl text-white text-[14px] font-semibold hover:brightness-90 transition cursor-pointer disabled:opacity-60 flex items-center gap-2"
            style={{ backgroundColor: "#1F4E46" }}>
            {loading && <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
            {loading ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[13px] font-medium" style={{ color: "#45556C" }}>{label}</label>
      {children}
    </div>
  );
}

/* ── Confirmation suppression ── */
function DeleteConfirm({ name, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p className="text-[16px] font-bold mb-1" style={{ color: "#0F172B" }}>Supprimer la formation</p>
          <p className="text-[13px]" style={{ color: "#64748B" }}>
            Confirmer la suppression de <strong>{name}</strong> ? Cette action est irréversible.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[14px] hover:bg-slate-50 transition cursor-pointer" style={{ color: "#45556C" }}>
            Annuler
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-white text-[14px] font-semibold transition cursor-pointer disabled:opacity-60"
            style={{ backgroundColor: "#E11D48" }}>
            {loading ? "..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function FormationsManagement() {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [modal, setModal]           = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch]         = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function fetchAll() {
    setLoading(true);
    setError("");
    try {
      const [prodRes, catRes] = await Promise.allSettled([
        productsApi.getAll({ limit: 100 }),
        productsApi.getCategories(),
      ]);
      if (prodRes.status === "fulfilled") {
        const raw = prodRes.value.data?.data ?? prodRes.value.data ?? [];
        const list = Array.isArray(raw) ? raw : (raw?.items ?? raw?.products ?? raw?.data ?? []);
        setProducts(list);
      } else {
        setError(getApiError(prodRes.reason));
      }
      if (catRes.status === "fulfilled") {
        const raw = catRes.value.data?.data ?? catRes.value.data ?? [];
        setCategories(Array.isArray(raw) ? raw : (raw?.items ?? raw?.categories ?? []));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  function showSuccess(msg) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  }

  async function handleCreate(payload) {
    await productsApi.create(payload);
    await fetchAll();
    showSuccess("Formation ajoutée avec succès !");
  }

  async function handleUpdate(payload) {
    await productsApi.update(modal.product.id, payload);
    await fetchAll();
    showSuccess("Formation mise à jour avec succès !");
  }

  async function handleDelete() {
    setDeleteLoading(true);
    try {
      await productsApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      await fetchAll();
    } catch (err) {
      setError(getApiError(err));
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  }

  async function toggleStatus(product) {
    const newStatus = product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await productsApi.update(product.id, { status: newStatus });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: newStatus } : p));
    } catch (err) {
      setError(getApiError(err));
    }
  }

  const filtered = products.filter(p =>
    !search || (p.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const getCatName = (id) => categories.find(c => c.id === id)?.name ?? "—";

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-[22px] font-bold" style={{ color: "#1F4E46" }}>Formations</h2>
          <p className="text-[13px]" style={{ color: "#45556C" }}>
            {products.length} formation{products.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: "create" })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[14px] font-semibold hover:brightness-90 transition cursor-pointer"
          style={{ backgroundColor: "#1F4E46" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          Nouvelle formation
        </button>
      </div>

      {successMsg && (
        <div className="px-4 py-3 rounded-xl text-[13px] flex items-center gap-2" style={{ backgroundColor: "#ECFDF5", color: "#059669", border: "1px solid #D1FAE5" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {successMsg}
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-xl text-[13px]" style={{ backgroundColor: "#FFF1F2", color: "#E11D48", border: "1px solid #FFE4E6" }}>
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative w-full max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher une formation..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-secondary/30 transition"
          style={{ color: "#0F172B" }} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-[14px]">
            {search ? `Aucun résultat pour "${search}"` : "Aucune formation. Créez-en une !"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Nom", "Type", "Catégorie", "PV / SNL", "Prix", "Statut", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[12px] font-semibold" style={{ color: "#94A3B8" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const typeInfo = TYPE_COLORS[p.type] ?? null;
                  return (
                    <tr key={p.id} className={`hover:bg-slate-50 transition ${i < filtered.length - 1 ? "border-b border-slate-50" : ""}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {p.images?.[0] ? (
                            <img src={toAbsoluteUrl(p.images[0])} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                          ) : (
                            <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1F4E46, #3FAE8C)" }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" opacity="0.6">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium truncate max-w-[200px]" style={{ color: "#0F172B" }}>{p.name}</p>
                            {p.isFeatured && <span className="text-[10px]" style={{ color: "#E6B84C" }}>★ En vedette</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {typeInfo ? (
                          <Badge color={typeInfo.color} bg={typeInfo.bg}>{p.type}</Badge>
                        ) : (
                          <span className="text-[12px]" style={{ color: "#94A3B8" }}>—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-[13px]" style={{ color: "#45556C" }}>{getCatName(p.categoryId)}</td>
                      <td className="px-5 py-3.5 text-[13px] font-medium" style={{ color: "#1F4E46" }}>
                        {p.pv ? `${p.pv} SNL` : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-[13px]" style={{ color: "#45556C" }}>
                        {p.price ? `${Number(p.price).toLocaleString("fr-FR")} FCFA` : "Gratuit"}
                      </td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => toggleStatus(p)} className="cursor-pointer">
                          <StatusBadge status={p.status} />
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setModal({ mode: "edit", product: p })}
                            className="p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer text-slate-500 hover:text-slate-700">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer text-slate-400 hover:text-red-500">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal && (
        <FormationModal
          initial={modal.mode === "edit" ? modal.product : null}
          categories={categories}
          onClose={() => setModal(null)}
          onSave={modal.mode === "edit" ? handleUpdate : handleCreate}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      {/* Style input */}
      <style>{`.input-base { width: 100%; border: 1px solid #E2E8F0; border-radius: 12px; padding: 10px 14px; font-size: 14px; color: #0F172B; outline: none; background: white; } .input-base:focus { box-shadow: 0 0 0 2px rgba(63,174,140,0.25); border-color: #3FAE8C; }`}</style>
    </div>
  );
}
