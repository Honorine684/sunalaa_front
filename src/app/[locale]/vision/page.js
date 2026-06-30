import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Vision" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
    alternates: {
      canonical: "https://sunalaa.com/vision",
      languages: { "x-default": "https://sunalaa.com/vision", en: "https://sunalaa.com/vision", fr: "https://sunalaa.com/fr/vision" },
    },
  };
}

export default async function VisionPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Vision" });
  const prefix = locale === "fr" ? "/fr" : "";

  const changeItems = [
    t("change_1"),
    t("change_2"),
    t("change_3"),
    t("change_4"),
  ];

  const horizons = [
    { label: t("h1_label"), title: t("h1_title"), desc: t("h1_desc"), color: "#3FAE8C" },
    { label: t("h2_label"), title: t("h2_title"), desc: t("h2_desc"), color: "#E6B84C" },
    { label: t("h3_label"), title: t("h3_title"), desc: t("h3_desc"), color: "#3B82F6" },
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
          <h1 className="text-white font-bold leading-tight" style={{ fontSize: "clamp(28px,5vw,50px)", maxWidth: 680 }}>
            {t("hero_title")}
          </h1>
          <p className="text-white/60 text-[16px] leading-relaxed" style={{ maxWidth: 560 }}>
            {t("hero_subtitle")}
          </p>
        </Container>
      </section>

      {/* ── Intro ── */}
      <section className="bg-white py-16 border-b border-slate-100">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-[12px] font-bold tracking-widest uppercase mb-3" style={{ color: "#3FAE8C" }}>
              {t("intro_label")}
            </p>
            <h2 className="text-[26px] sm:text-[32px] font-bold mb-6 leading-tight" style={{ color: "#0F172B" }}>
              {t("intro_title")}
            </h2>
            <p className="text-[16px] leading-relaxed" style={{ color: "#45556C" }}>
              {t("intro_text")}
            </p>
          </div>
        </Container>
      </section>

      {/* ── Ce que nous voulons changer ── */}
      <section className="bg-[#F8FAFC] py-16 border-b border-slate-100">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-[12px] font-bold tracking-widest uppercase mb-3" style={{ color: "#3FAE8C" }}>
              {t("change_label")}
            </p>
            <h2 className="text-[26px] sm:text-[32px] font-bold mb-8 leading-tight" style={{ color: "#0F172B" }}>
              {t("change_title")}
            </h2>
            <div className="flex flex-col gap-4">
              {changeItems.map((item, i) => (
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

      {/* ── 3 Horizons ── */}
      <section className="bg-white py-16 border-b border-slate-100">
        <Container>
          <div className="text-center mb-10">
            <p className="text-[12px] font-bold tracking-widest uppercase mb-3" style={{ color: "#3FAE8C" }}>
              {t("horizons_label")}
            </p>
            <h2 className="text-[26px] sm:text-[32px] font-bold" style={{ color: "#0F172B" }}>
              {t("horizons_title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {horizons.map((h, i) => (
              <div key={i} className="bg-[#F8FAFC] rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: h.color }} />
                  <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: h.color }}>
                    {h.label}
                  </span>
                </div>
                <p className="text-[16px] font-bold" style={{ color: "#0F172B" }}>{h.title}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: "#64748B" }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Citation ── */}
      <section className="bg-[#F8FAFC] py-16 border-b border-slate-100">
        <Container>
          <div className="max-w-2xl mx-auto">
            <blockquote className="rounded-2xl px-7 py-8 relative overflow-hidden"
              style={{ backgroundColor: "#1F4E46" }}>
              <div className="absolute top-4 left-5 text-white/10 font-serif" style={{ fontSize: 80, lineHeight: 1 }}>&ldquo;</div>
              <p className="relative z-10 text-white text-[17px] sm:text-[19px] font-medium leading-relaxed italic text-center">
                {t("quote_text")}
              </p>
              <p className="relative z-10 text-white/50 text-[13px] text-center mt-4">{t("quote_author")}</p>
            </blockquote>
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
