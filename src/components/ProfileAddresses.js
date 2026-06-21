"use client";

import { useEffect, useState } from "react";
import { usersApi, getApiError } from "@/lib/api";

const TYPE_LABELS = { home: "Home", work: "Work", other: "Other" };
const EMPTY = { label: "", street: "", city: "", state: "", country: "", postalCode: "", isDefault: false };

function validateAddress(fields) {
  const e = {};
  if (!fields.label?.trim()) e.label = "Required";
  else if (fields.label.trim().length < 2) e.label = "Min 2 characters";

  if (!fields.street?.trim()) e.street = "Required";
  else if (fields.street.trim().length < 3) e.street = "Min 3 characters";

  if (!fields.city?.trim()) e.city = "Required";
  else if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(fields.city.trim())) e.city = "Letters only";

  if (!fields.country?.trim()) e.country = "Required";
  else if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(fields.country.trim())) e.country = "Letters only";

  if (fields.postalCode && !/^\d{3,10}$/.test(fields.postalCode.trim())) e.postalCode = "Digits only (3-10)";

  return e;
}

function AddressForm({ initial, onSave, onCancel, saving }) {
  const [fields, setFields] = useState(initial ?? EMPTY);
  const [errors, setErrors] = useState({});

  function set(key, val) {
    setFields((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: "" }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validateAddress(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(fields);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50">
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: "label", label: "Label *", placeholder: "e.g. Home" },
          { key: "street", label: "Street *", placeholder: "123 Main St" },
          { key: "city", label: "City *", placeholder: "Dakar" },
          { key: "state", label: "State / Region", placeholder: "Dakar" },
          { key: "postalCode", label: "Postal code", placeholder: "10000", inputMode: "numeric" },
          { key: "country", label: "Country *", placeholder: "Senegal" },
        ].map(({ key, label, placeholder, inputMode }) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-[14px]" style={{ color: "#45556C" }}>{label}</label>
            <input
              value={fields[key] ?? ""}
              onChange={(e) => set(key, e.target.value)}
              placeholder={placeholder}
              inputMode={inputMode}
              className={`border rounded-xl px-3 py-2 text-[14px] outline-none focus:ring-2 transition bg-white ${errors[key] ? "border-red-400 ring-1 ring-red-200" : "border-slate-200 focus:ring-secondary/30"}`}
              style={{ color: "#0F172B" }}
            />
            {errors[key] && <p className="text-red-400 text-[11px]">{errors[key]}</p>}
          </div>
        ))}
        <div className="flex items-center gap-2 col-span-2 mt-1">
          <input type="checkbox" id="isDefault" checked={fields.isDefault ?? false}
            onChange={(e) => set("isDefault", e.target.checked)}
            className="w-4 h-4 accent-secondary cursor-pointer" />
          <label htmlFor="isDefault" className="text-[14px] cursor-pointer select-none" style={{ color: "#45556C" }}>
            Set as default address
          </label>
        </div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onCancel}
          className="flex-1 py-2 rounded-xl text-[14px] border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
          style={{ color: "#45556C" }}>
          Cancel
        </button>
        <button type="submit" disabled={saving}
          className="flex-1 py-2 rounded-xl text-white text-[14px] font-semibold hover:brightness-90 transition cursor-pointer disabled:opacity-60"
          style={{ backgroundColor: "#1F4E46" }}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

export default function ProfileAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState(null); // null | "add" | { edit: address }
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    usersApi.getAddresses()
      .then((res) => {
        const outer = res.data?.data ?? res.data;
        let list = [];
        if (Array.isArray(outer)) {
          list = outer;
        } else if (outer && typeof outer === "object") {
          const nested =
            outer.data      != null ? outer.data      :
            outer.addresses != null ? outer.addresses :
            outer.items     != null ? outer.items     :
            outer.results   != null ? outer.results   : null;
          if (Array.isArray(nested)) list = nested;
        }
        setAddresses(list);
      })
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(data) {
    setSaving(true);
    try {
      const res = await usersApi.addAddress(data);
      const created = res.data?.data ?? res.data;
      setAddresses((p) => [...p, created]);
      setMode(null);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id, data) {
    setSaving(true);
    try {
      const res = await usersApi.updateAddress(id, data);
      const updated = res.data?.data ?? res.data;
      setAddresses((p) => p.map((a) => (a.id === id ? updated : a)));
      setMode(null);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    setConfirmDeleteId(null);
    try {
      await usersApi.deleteAddress(id);
      setAddresses((p) => p.filter((a) => a.id !== id));
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.314-2.686-6-6-6z" stroke="#1F4E46" strokeWidth="2"/>
            <circle cx="12" cy="8" r="2" stroke="#1F4E46" strokeWidth="2"/>
          </svg>
          <h2 className="text-[16px] font-bold" style={{ color: "#1F4E46" }}>My addresses</h2>
        </div>
        {mode === null && (
          <button onClick={() => setMode("add")}
            className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg text-white hover:brightness-90 transition cursor-pointer"
            style={{ backgroundColor: "#1F4E46" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add
          </button>
        )}
      </div>

      {error && <p className="text-red-400 text-[13px] mb-3">{error}</p>}

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((addr) => (
            <div key={addr.id}>
              {mode?.edit?.id === addr.id ? (
                <AddressForm
                  initial={{ label: addr.label ?? "", street: addr.street ?? "", city: addr.city ?? "", state: addr.state ?? "", postalCode: addr.postalCode ?? "", country: addr.country ?? "", isDefault: addr.isDefault ?? false }}
                  saving={saving}
                  onSave={(data) => handleUpdate(addr.id, data)}
                  onCancel={() => setMode(null)}
                />
              ) : (
                <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#F0FDF4" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.314-2.686-6-6-6z" stroke="#1F4E46" strokeWidth="2"/>
                      <circle cx="12" cy="8" r="2" stroke="#1F4E46" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[14px] font-semibold" style={{ color: "#0F172B" }}>
                        {addr.label || TYPE_LABELS[addr.type] || "Address"}
                      </p>
                      <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}>
                        {TYPE_LABELS[addr.type] ?? addr.type}
                      </span>
                    </div>
                    <p className="text-[14px]" style={{ color: "#64748B" }}>
                      {[addr.street, addr.city, addr.state, addr.postalCode, addr.country].filter(Boolean).join(", ") || "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {confirmDeleteId === addr.id ? (
                      <>
                        <span className="text-[12px] mr-1" style={{ color: "#64748B" }}>Delete?</span>
                        <button onClick={() => handleDelete(addr.id)} disabled={deletingId === addr.id}
                          className="px-2.5 py-1 rounded-lg text-white text-[12px] font-semibold cursor-pointer hover:brightness-90 disabled:opacity-50"
                          style={{ backgroundColor: "#E11D48" }}>
                          {deletingId === addr.id ? "..." : "Yes"}
                        </button>
                        <button onClick={() => setConfirmDeleteId(null)}
                          className="px-2.5 py-1 rounded-lg text-[12px] border border-slate-200 hover:bg-slate-50 cursor-pointer"
                          style={{ color: "#64748B" }}>
                          No
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setMode({ edit: addr })}
                          className="p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer" style={{ color: "#64748B" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button onClick={() => setConfirmDeleteId(addr.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer" style={{ color: "#E11D48" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {addresses.length === 0 && mode !== "add" && (
            <p className="text-slate-400 text-[14px] text-center py-6">No addresses saved.</p>
          )}

          {mode === "add" && (
            <AddressForm saving={saving} onSave={handleAdd} onCancel={() => setMode(null)} />
          )}
        </div>
      )}
    </div>
  );
}
