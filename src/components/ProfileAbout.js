"use client";

import { useState, useEffect } from "react";
import { getApiError } from "@/lib/api";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

function validate(fields) {
  const errors = {};
  if (fields.firstName?.trim()) {
    if (fields.firstName.trim().length < 2) {
      errors.firstName = "Minimum 2 characters";
    } else if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(fields.firstName.trim())) {
      errors.firstName = "Letters only";
    }
  }

  if (fields.lastName?.trim()) {
    if (fields.lastName.trim().length < 2) {
      errors.lastName = "Minimum 2 characters";
    } else if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(fields.lastName.trim())) {
      errors.lastName = "Letters only";
    }
  }

  if (fields.phone) {
    const digits = fields.phone.replace(/[\s\-().+]/g, "");
    if (digits.length > 0 && (digits.length < 8 || digits.length > 16)) {
      errors.phone = "Invalid phone number";
    }
  }

  return errors;
}

export default function ProfileAbout({ profile, onUpdate, autoEdit = false }) {
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (autoEdit) openEdit();
  }, [autoEdit]);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [fields, setFields] = useState({});

  function openEdit() {
    setFields({
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      phone: profile?.phone ?? profile?.phoneNumber ?? "",
      gender: (profile?.gender ?? "").toUpperCase(),
    });
    setFieldErrors({});
    setApiError("");
    setEditing(true);
  }

  function handleChange(key, value) {
    setFields((p) => ({ ...p, [key]: value }));
    setFieldErrors((p) => ({ ...p, [key]: "" }));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!onUpdate) return;
    const errors = validate(fields);
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }
    setSaving(true);
    setApiError("");
    try {
      await onUpdate(fields);
      setEditing(false);
    } catch (err) {
      setApiError(getApiError(err));
    } finally {
      setSaving(false);
    }
  }

  const GENDER_LABELS = { MALE: "Male", FEMALE: "Female", OTHER: "Other", male: "Male", female: "Female", other: "Other" };
  const rawGender = profile?.gender ?? null;
  const gender = rawGender ? (GENDER_LABELS[rawGender] ?? rawGender) : null;
  const fullName = [profile?.firstName ?? profile?.first_name, profile?.lastName ?? profile?.last_name].filter(Boolean).join(" ") || null;
  const email = profile?.email ?? null;
  const phone = profile?.phone ?? profile?.phoneNumber ?? null;
  const address = profile?.address
    ? [profile.address.street, profile.address.city, profile.address.country].filter(Boolean).join(", ")
    : [profile?.city, profile?.country].filter(Boolean).join(", ") || null;

  const info = [
    fullName && { icon: <PersonIcon />, value: fullName },
    gender && { icon: <PersonIcon />, value: gender },
    address && { icon: <LocationIcon />, value: address },
    email && { icon: <EmailIcon />, value: email },
    phone && { icon: <PhoneIcon />, value: phone },
  ].filter(Boolean);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[18px] font-bold" style={{ lineHeight: "100%", color: "#0F172B" }}>ABOUT</h3>
        {!editing && onUpdate && (
          <button onClick={openEdit}
            className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
            style={{ color: "#45556C" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          {apiError && (
            <p className="text-red-400 text-[12px] px-1">{apiError}</p>
          )}
          {[
            { key: "firstName", label: "First name" },
            { key: "lastName", label: "Last name" },
          ].map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-[12px]" style={{ color: "#45556C" }}>{label}</label>
              <input
                value={fields[key] ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className={`border rounded-xl px-3 py-2 text-[13px] outline-none focus:ring-2 transition bg-white ${fieldErrors[key] ? "border-red-400 ring-1 ring-red-200" : "border-slate-200 focus:ring-secondary/30"}`}
                style={{ color: "#0F172B" }}
              />
              {fieldErrors[key] && <p className="text-red-400 text-[11px]">{fieldErrors[key]}</p>}
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <label className="text-[12px]" style={{ color: "#45556C" }}>Phone</label>
            <PhoneInput
              value={fields.phone ?? ""}
              onChange={(phone) => handleChange("phone", phone)}
              defaultCountry="sn"
              style={{
                "--react-international-phone-height": "38px",
                "--react-international-phone-border-radius": "12px",
                "--react-international-phone-border-color": fieldErrors.phone ? "#f87171" : "#e2e8f0",
                "--react-international-phone-font-size": "13px",
                width: "100%",
              }}
            />
            {fieldErrors.phone && <p className="text-red-400 text-[11px]">{fieldErrors.phone}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px]" style={{ color: "#45556C" }}>Gender</label>
            <select
              value={fields.gender ?? ""}
              onChange={(e) => setFields((p) => ({ ...p, gender: e.target.value }))}
              className="border border-slate-200 rounded-xl px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-secondary/30 bg-white"
              style={{ color: "#0F172B" }}>
              <option value="">— Not specified</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="flex gap-2 mt-1">
            <button type="button" onClick={() => setEditing(false)}
              className="flex-1 py-2 rounded-xl text-[13px] border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
              style={{ color: "#45556C" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2 rounded-xl text-white text-[13px] font-semibold hover:brightness-90 transition cursor-pointer disabled:opacity-60"
              style={{ backgroundColor: "#1F4E46" }}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      ) : info.length === 0 ? (
        <p className="text-slate-400 text-[13px]">No information available.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {info.map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-[14px]" style={{ fontWeight: 500, lineHeight: "100%", color: "#64748B" }}>
              <span className="shrink-0" style={{ width: 16, height: 16, marginLeft: 4, marginRight: 4 }}>{item.icon}</span>
              <span className="break-all">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PersonIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
}
function LocationIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.314-2.686-6-6-6z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="2"/></svg>;
}
function EmailIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M2 8l10 6 10-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
}
function PhoneIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
