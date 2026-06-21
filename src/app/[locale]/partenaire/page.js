"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { api } from "@/lib/api";

const PARTNERSHIP_TYPES_FR = [
  "Partenaire agricole / Ferme",
  "Partenaire commercial",
  "Partenaire technologique",
  "Partenaire média / Influenceur",
  "Partenaire institutionnel",
  "Autre",
];

const PARTNERSHIP_TYPES_EN = [
  "Agricultural / Farm partner",
  "Commercial partner",
  "Technology partner",
  "Media / Influencer partner",
  "Institutional partner",
  "Other",
];

export default function PartnerPage() {
  const locale = useLocale();
  const isFr = locale === "fr";

  const [fields, setFields] = useState({
    name: "",
    phone: "",
    email: "",
    partnershipType: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [apiError, setApiError] = useState("");

  const types = isFr ? PARTNERSHIP_TYPES_FR : PARTNERSHIP_TYPES_EN;

  const txt = {
    title: isFr ? "Devenir partenaire" : "Become a partner",
    subtitle: isFr
      ? "Vous avez un projet, une ferme, une audience ou une expertise ? Rejoignez l'écosystème SUNALA."
      : "Do you have a project, a farm, an audience or expertise? Join the SUNALA ecosystem.",
    name: isFr ? "Nom ou nom de société" : "Name or company name",
    phone: isFr ? "Numéro de téléphone" : "Phone number",
    email: "Email",
    type: isFr ? "Type de partenariat" : "Partnership type",
    typePlaceholder: isFr ? "Sélectionner..." : "Select...",
    message: isFr ? "Message" : "Message",
    messagePlaceholder: isFr
      ? "Décrivez votre projet ou votre demande..."
      : "Describe your project or request...",
    submit: isFr ? "Envoyer ma demande" : "Send my request",
    sending: isFr ? "Envoi en cours..." : "Sending...",
    successTitle: isFr ? "Demande envoyée !" : "Request sent!",
    successMsg: isFr
      ? "Merci pour votre intérêt. Notre équipe vous contactera dans les meilleurs délais."
      : "Thank you for your interest. Our team will contact you as soon as possible.",
    required: isFr ? "Champ requis" : "Required field",
    invalidEmail: isFr ? "Email invalide" : "Invalid email",
  };

  function set(k, v) {
    setFields((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  }

  function validate() {
    const e = {};
    if (!fields.name.trim()) e.name = txt.required;
    if (!fields.email.trim()) e.email = txt.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = txt.invalidEmail;
    if (!fields.partnershipType) e.partnershipType = txt.required;
    if (!fields.message.trim()) e.message = txt.required;
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSending(true);
    setApiError("");
    try {
      await api.post("/contact/partner", fields);
      setDone(true);
    } catch {
      setApiError(isFr ? "Une erreur est survenue. Veuillez réessayer." : "An error occurred. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>

        {/* Hero */}
        <div className="py-16 lg:py-24" style={{ background: "linear-gradient(135deg, #1F4E46 0%, #1A3A34 100%)" }}>
          <Container>
            <div className="text-center max-w-xl mx-auto">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5" style={{ backgroundColor: "rgba(230,184,76,0.15)", border: "1px solid rgba(230,184,76,0.3)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="text-[28px] lg:text-[40px] font-black text-white mb-4">{txt.title}</h1>
              <p className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{txt.subtitle}</p>
            </div>
          </Container>
        </div>

        {/* Form */}
        <div className="py-12">
          <Container>
            <div className="max-w-xl mx-auto">
              {done ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "#F0FDF4" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="10" stroke="#3FAE8C" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <h2 className="text-[20px] font-bold mb-2" style={{ color: "#0F172B" }}>{txt.successTitle}</h2>
                  <p className="text-[14px] leading-relaxed" style={{ color: "#64748B" }}>{txt.successMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:p-8 flex flex-col gap-5">

                  {/* Name */}
                  <Field label={txt.name} error={errors.name}>
                    <input
                      type="text"
                      value={fields.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder={isFr ? "Ex : Jean Dupont ou SUNALA Corp" : "e.g. John Doe or SUNALA Corp"}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition"
                      style={{ borderColor: errors.name ? "#EF4444" : "#E2E8F0", fontSize: 14, color: "#0F172B" }}
                    />
                  </Field>

                  {/* Phone + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label={txt.phone} error={errors.phone}>
                      <input
                        type="tel"
                        value={fields.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+229 00 00 00 00"
                        className="w-full px-4 py-3 rounded-xl border outline-none transition"
                        style={{ borderColor: errors.phone ? "#EF4444" : "#E2E8F0", fontSize: 14, color: "#0F172B" }}
                      />
                    </Field>
                    <Field label={txt.email} error={errors.email}>
                      <input
                        type="email"
                        value={fields.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="contact@exemple.com"
                        className="w-full px-4 py-3 rounded-xl border outline-none transition"
                        style={{ borderColor: errors.email ? "#EF4444" : "#E2E8F0", fontSize: 14, color: "#0F172B" }}
                      />
                    </Field>
                  </div>

                  {/* Partnership type */}
                  <Field label={txt.type} error={errors.partnershipType}>
                    <select
                      value={fields.partnershipType}
                      onChange={(e) => set("partnershipType", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition bg-white appearance-none"
                      style={{ borderColor: errors.partnershipType ? "#EF4444" : "#E2E8F0", fontSize: 14, color: fields.partnershipType ? "#0F172B" : "#94A3B8" }}
                    >
                      <option value="" disabled>{txt.typePlaceholder}</option>
                      {types.map((tp) => (
                        <option key={tp} value={tp}>{tp}</option>
                      ))}
                    </select>
                  </Field>

                  {/* Message */}
                  <Field label={txt.message} error={errors.message}>
                    <textarea
                      value={fields.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder={txt.messagePlaceholder}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border outline-none transition resize-none"
                      style={{ borderColor: errors.message ? "#EF4444" : "#E2E8F0", fontSize: 14, color: "#0F172B" }}
                    />
                  </Field>

                  {apiError && (
                    <p className="text-[13px] text-center" style={{ color: "#EF4444" }}>{apiError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-4 rounded-xl font-bold text-[15px] text-white transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #1F4E46 0%, #3FAE8C 100%)" }}
                  >
                    {sending ? txt.sending : txt.submit}
                  </button>

                </form>
              )}
            </div>
          </Container>
        </div>
      </div>
      <Footer />
    </>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold" style={{ color: "#374151" }}>{label}</label>
      {children}
      {error && <p className="text-[12px]" style={{ color: "#EF4444" }}>{error}</p>}
    </div>
  );
}
