import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
    alternates: {
      canonical: "https://sunalaa.com/contact",
      languages: { "x-default": "https://sunalaa.com/contact", en: "https://sunalaa.com/contact", fr: "https://sunalaa.com/fr/contact" },
    },
  };
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });

  const emailCards = [
    {
      email: "contact@sunalaa.com",
      phone: "+33 7 57 83 49 86",
      label: t("card1_label"),
      desc: t("card1_desc"),
      delay: t("card1_delay"),
      color: "#3FAE8C",
    },
    {
      email: "support@sunalaa.com",
      label: t("card2_label"),
      desc: t("card2_desc"),
      delay: t("card2_delay"),
      color: "#3B82F6",
    },
    {
      email: "contact@sunalaa.com",
      phone: "+33 7 57 83 49 86",
      label: t("card3_label"),
      desc: t("card3_desc"),
      delay: t("card3_delay"),
      color: "#8B5CF6",
    },
    {
      email: "contact@sunalaa.com",
      phone: "+33 7 57 83 49 86",
      label: t("card4_label"),
      desc: t("card4_desc"),
      delay: t("card4_delay"),
      color: "#E6B84C",
    },
    {
      email: "contact@sunalaa.com",
      phone: "+33 7 57 83 49 86",
      label: t("card5_label"),
      desc: t("card5_desc"),
      delay: t("card5_delay"),
      color: "#22C55E",
    },
    {
      email: "contact@sunalaa.com",
      phone: "+33 7 57 83 49 86",
      label: t("card6_label"),
      desc: t("card6_desc"),
      delay: t("card6_delay"),
      color: "#F43F5E",
    },
  ];

  const subjectOptions = [
    { value: "general", label: t("subject_general") },
    { value: "support", label: t("subject_support") },
    { value: "legal", label: t("subject_legal") },
    { value: "privacy", label: t("subject_privacy") },
    { value: "partner", label: t("subject_partner") },
    { value: "security", label: t("subject_security") },
  ];

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative bg-primary overflow-hidden" style={{ minHeight: 360 }}>
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center">
          {[640, 480, 340, 210].map((s) => (
            <div key={s} className="absolute rounded-full border border-white/5"
              style={{ width: s, height: s }} />
          ))}
        </div>
        <Container className="relative z-10 py-20 flex flex-col items-center text-center gap-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold"
            style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.18)" }}>
            {t("hero_badge")}
          </span>
          <h1 className="text-white font-bold leading-tight" style={{ fontSize: "clamp(28px,5vw,46px)", maxWidth: 600 }}>
            {t("hero_title")}
          </h1>
          <p className="text-white/60 text-[16px] leading-relaxed" style={{ maxWidth: 540 }}>
            {t("hero_subtitle")}
          </p>
        </Container>
      </section>

      {/* ── Email cards ── */}
      <section className="bg-[#F8FAFC] py-16 border-b border-slate-100">
        <Container>
          <div className="text-center mb-10">
            <p className="text-[12px] font-bold tracking-widest uppercase mb-3" style={{ color: "#3FAE8C" }}>
              {t("emails_label")}
            </p>
            <h2 className="text-[26px] sm:text-[30px] font-bold" style={{ color: "#0F172B" }}>
              {t("emails_title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {emailCards.map((card, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${card.color}15` }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={card.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22,6 12,13 2,6" stroke={card.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                    {card.delay}
                  </span>
                </div>
                <div>
                  <p className="text-[13px] font-bold mb-0.5" style={{ color: "#0F172B" }}>{card.label}</p>
                  <p className="text-[12px]" style={{ color: "#64748B" }}>{card.desc}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[12px] font-semibold select-all" style={{ color: card.color }}>
                    {card.email}
                  </p>
                  {card.phone && (
                    <p className="text-[12px] font-semibold select-all" style={{ color: card.color }}>
                      {card.phone}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Contact form ── */}
      <section className="bg-white py-16">
        <Container>
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-[12px] font-bold tracking-widest uppercase mb-3" style={{ color: "#3FAE8C" }}>
                {t("form_label")}
              </p>
              <h2 className="text-[24px] sm:text-[28px] font-bold" style={{ color: "#0F172B" }}>
                {t("form_title")}
              </h2>
              <p className="text-[14px] mt-2" style={{ color: "#64748B" }}>{t("form_subtitle")}</p>
            </div>

            <ContactForm subjectOptions={subjectOptions} />
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
