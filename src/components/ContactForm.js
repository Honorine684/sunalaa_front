"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactForm({ subjectOptions }) {
  const t = useTranslations("Contact");
  const [fields, setFields] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");

  function set(key, val) { setFields((p) => ({ ...p, [key]: val })); setError(""); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess(false);
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "An error occurred."); return; }
      setSuccess(true);
      setFields({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-[#F8FAFC] rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(63,174,140,0.12)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-[18px] font-bold" style={{ color: "#0F172B" }}>{t("form_success_title")}</h3>
        <p className="text-[14px]" style={{ color: "#64748B" }}>{t("form_success_sub")}</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 text-[13px] font-semibold underline cursor-pointer"
          style={{ color: "#3FAE8C" }}
        >
          {t("form_send_another")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#F8FAFC] rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold" style={{ color: "#334155" }}>{t("form_name")}</label>
          <input
            type="text"
            placeholder={t("form_name_ph")}
            value={fields.name}
            onChange={(e) => set("name", e.target.value)}
            required
            className="w-full text-[13px] rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/30 transition"
            style={{ height: 42, backgroundColor: "#fff", border: "1px solid #E2E8F0", color: "#0F172B" }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold" style={{ color: "#334155" }}>{t("form_email")}</label>
          <input
            type="email"
            placeholder={t("form_email_ph")}
            value={fields.email}
            onChange={(e) => set("email", e.target.value)}
            required
            className="w-full text-[13px] rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/30 transition"
            style={{ height: 42, backgroundColor: "#fff", border: "1px solid #E2E8F0", color: "#0F172B" }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold" style={{ color: "#334155" }}>{t("form_subject")}</label>
        <select
          value={fields.subject}
          onChange={(e) => set("subject", e.target.value)}
          required
          className="w-full text-[13px] rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/30 transition appearance-none cursor-pointer"
          style={{ height: 42, backgroundColor: "#fff", border: "1px solid #E2E8F0", color: fields.subject ? "#0F172B" : "#94A3B8" }}
        >
          <option value="" disabled>{t("form_subject_ph")}</option>
          {subjectOptions.map((opt) => (
            <option key={opt.value} value={opt.label}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold" style={{ color: "#334155" }}>{t("form_message")}</label>
        <textarea
          placeholder={t("form_message_ph")}
          rows={5}
          value={fields.message}
          onChange={(e) => set("message", e.target.value)}
          required
          className="w-full text-[13px] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 transition resize-none"
          style={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", color: "#0F172B" }}
        />
      </div>

      {error && (
        <p className="text-[13px] text-red-500 bg-red-50 px-3 py-2.5 rounded-xl">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl font-semibold text-[14px] text-white transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        style={{ height: 46, backgroundColor: "#3FAE8C" }}
      >
        {loading ? t("form_sending") : t("form_submit")}
      </button>
    </form>
  );
}
