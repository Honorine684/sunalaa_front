import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
    alternates: {
      canonical: "https://sunalaa.com/about",
      languages: { "x-default": "https://sunalaa.com/about", en: "https://sunalaa.com/about", fr: "https://sunalaa.com/fr/about" },
    },
  };
}

export default async function AboutPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  const prefix = locale === "fr" ? "/fr" : "";

  const missionItems = [
    t("mission_1"),
    t("mission_2"),
    t("mission_3"),
    t("mission_4"),
  ];

  const values = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#3FAE8C" strokeWidth="2"/>
          <path d="M9 12l2 2 4-4" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: t("value_1_title"),
      desc: t("value_1_desc"),
      bg: "rgba(63,174,140,0.08)",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke="#E6B84C" strokeWidth="2"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: t("value_2_title"),
      desc: t("value_2_desc"),
      bg: "rgba(230,184,76,0.08)",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="#3B82F6" strokeWidth="2"/>
        </svg>
      ),
      title: t("value_3_title"),
      desc: t("value_3_desc"),
      bg: "rgba(59,130,246,0.08)",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="#22C55E" strokeWidth="2"/>
          <path d="M12 8v4l3 3" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: t("value_4_title"),
      desc: t("value_4_desc"),
      bg: "rgba(34,197,94,0.08)",
    },
  ];

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative bg-primary overflow-hidden" style={{ minHeight: 400 }}>
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
          <h1 className="text-white font-bold leading-tight" style={{ fontSize: "clamp(28px,5vw,50px)", maxWidth: 620 }}>
            {t("hero_title")}
          </h1>
          <p className="text-white/60 text-[16px] leading-relaxed" style={{ maxWidth: 540 }}>
            {t("hero_subtitle")}
          </p>
        </Container>
      </section>

      {/* ── Histoire ── */}
      <section className="bg-white py-16 border-b border-slate-100">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-[12px] font-bold tracking-widest uppercase mb-3" style={{ color: "#3FAE8C" }}>
              {t("history_label")}
            </p>
            <h2 className="text-[26px] sm:text-[32px] font-bold mb-8 leading-tight" style={{ color: "#0F172B" }}>
              {t("history_title")}
            </h2>
            <div className="flex flex-col gap-5 text-[15px] leading-relaxed" style={{ color: "#45556C" }}>
              <p>{t("history_p1")}</p>
              <p>{t("history_p2")}</p>
              <p className="font-semibold" style={{ color: "#1F4E46" }}>{t("history_p3")}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Mission ── */}
      <section className="bg-[#F8FAFC] py-16 border-b border-slate-100">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-[12px] font-bold tracking-widest uppercase mb-3" style={{ color: "#3FAE8C" }}>
              {t("mission_label")}
            </p>
            <h2 className="text-[26px] sm:text-[32px] font-bold mb-8 leading-tight" style={{ color: "#0F172B" }}>
              {t("mission_title")}
            </h2>
            <div className="flex flex-col gap-4">
              {missionItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(63,174,140,0.1)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-[14px] leading-relaxed pt-0.5" style={{ color: "#334155" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Fondateur ── */}
      <section className="bg-white py-16 border-b border-slate-100">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-[12px] font-bold tracking-widest uppercase mb-3" style={{ color: "#3FAE8C" }}>
              {t("founder_label")}
            </p>
            <h2 className="text-[26px] sm:text-[32px] font-bold mb-8 leading-tight" style={{ color: "#0F172B" }}>
              {t("founder_title")}
            </h2>
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="shrink-0 flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #1F4E46, #3FAE8C)" }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <span className="text-[12px] font-semibold text-center" style={{ color: "#64748B" }}>{t("founder_name")}</span>
                <span className="text-[11px]" style={{ color: "#94A3B8" }}>{t("founder_role")}</span>
              </div>
              <div className="flex flex-col gap-4 text-[15px] leading-relaxed" style={{ color: "#45556C" }}>
                <p>{t("founder_p1")}</p>
                <p>{t("founder_p2")}</p>
              </div>
            </div>

            <blockquote className="mt-10 rounded-2xl px-7 py-6 relative overflow-hidden"
              style={{ backgroundColor: "#1F4E46" }}>
              <div className="absolute top-4 left-5 text-white/10 font-serif" style={{ fontSize: 80, lineHeight: 1 }}>&ldquo;</div>
              <p className="relative z-10 text-white text-[16px] sm:text-[18px] font-medium leading-relaxed italic text-center">
                {t("founder_quote")}
              </p>
              <p className="relative z-10 text-white/50 text-[13px] text-center mt-4">{t("founder_quote_author")}</p>
            </blockquote>
          </div>
        </Container>
      </section>

      {/* ── Valeurs ── */}
      <section className="bg-[#F8FAFC] py-16 border-b border-slate-100">
        <Container>
          <div className="text-center mb-10">
            <p className="text-[12px] font-bold tracking-widest uppercase mb-3" style={{ color: "#3FAE8C" }}>{t("values_label")}</p>
            <h2 className="text-[26px] sm:text-[32px] font-bold" style={{ color: "#0F172B" }}>{t("values_title")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: v.bg }}>
                  {v.icon}
                </div>
                <div>
                  <p className="text-[15px] font-bold mb-1.5" style={{ color: "#0F172B" }}>{v.title}</p>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#64748B" }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary py-16">
        <Container className="flex flex-col items-center text-center gap-6">
          <h2 className="text-white font-bold text-[26px] sm:text-[32px]">{t("cta_title")}</h2>
          <p className="text-white/60 text-[15px]" style={{ maxWidth: 460 }}>{t("cta_subtitle")}</p>
          <a
            href={`${prefix}/register`}
            className="px-8 py-3.5 rounded-full text-white font-semibold text-[15px] hover:brightness-110 transition"
            style={{ backgroundColor: "#E6B84C" }}
          >
            {t("cta_btn")}
          </a>
        </Container>
      </section>

      <Footer />
    </>
  );
}
