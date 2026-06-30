import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AvertissementRisque" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
    alternates: {
      canonical: "https://sunalaa.com/avertissement-risque",
      languages: { "x-default": "https://sunalaa.com/avertissement-risque", en: "https://sunalaa.com/avertissement-risque", fr: "https://sunalaa.com/fr/avertissement-risque" },
    },
  };
}

export default async function AvertissementRisquePage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AvertissementRisque" });
  const prefix = locale === "fr" ? "/fr" : "";

  const cryptoRisks = [
    t("crypto_r1"),
    t("crypto_r2"),
    t("crypto_r3"),
    t("crypto_r4"),
    t("crypto_r5"),
  ];

  const sunalaRisks = [
    t("sunala_r1"),
    t("sunala_r2"),
    t("sunala_r3"),
    t("sunala_r4"),
  ];

  const notDoing = [
    t("not_r1"),
    t("not_r2"),
    t("not_r3"),
  ];

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative bg-primary overflow-hidden" style={{ minHeight: 300 }}>
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center">
          {[480, 340, 220].map((s) => (
            <div key={s} className="absolute rounded-full border border-white/5"
              style={{ width: s, height: s }} />
          ))}
        </div>
        <Container className="relative z-10 py-16 flex flex-col items-center text-center gap-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold"
            style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.18)" }}>
            {t("hero_badge")}
          </span>
          <h1 className="text-white font-bold leading-tight" style={{ fontSize: "clamp(24px,4vw,42px)", maxWidth: 560 }}>
            {t("hero_title")}
          </h1>
          <p className="text-white/60 text-[15px] leading-relaxed" style={{ maxWidth: 500 }}>
            {t("hero_subtitle")}
          </p>
        </Container>
      </section>

      {/* ── Content ── */}
      <section className="bg-[#F8FAFC] py-16">
        <Container>
          <div className="max-w-2xl mx-auto flex flex-col gap-10">

            {/* Crypto risks */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
              <h2 className="text-[19px] font-bold" style={{ color: "#0F172B" }}>{t("s1_title")}</h2>
              <div className="flex flex-col gap-3">
                {cryptoRisks.map((risk, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: "rgba(244,63,94,0.1)" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-[14px] leading-relaxed" style={{ color: "#334155" }}>{risk}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sunala-specific risks */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
              <h2 className="text-[19px] font-bold" style={{ color: "#0F172B" }}>{t("s2_title")}</h2>
              <div className="flex flex-col gap-3">
                {sunalaRisks.map((risk, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: "rgba(230,184,76,0.1)" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#E6B84C" strokeWidth="2"/>
                        <path d="M12 8v4M12 16h.01" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p className="text-[14px] leading-relaxed" style={{ color: "#334155" }}>{risk}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What SUNALA does NOT do */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
              <h2 className="text-[19px] font-bold" style={{ color: "#0F172B" }}>{t("s3_title")}</h2>
              <div className="flex flex-col gap-3">
                {notDoing.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: "rgba(148,163,184,0.1)" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#64748B" strokeWidth="2"/>
                        <path d="M8 12l2.5 2.5L16 9" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-[14px] leading-relaxed" style={{ color: "#334155" }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div className="rounded-2xl px-7 py-6 relative overflow-hidden"
              style={{ backgroundColor: "#1F4E46" }}>
              <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
                {t("rec_label")}
              </p>
              <p className="text-white text-[15px] leading-relaxed">{t("rec_text")}</p>
            </div>

          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary py-16">
        <Container className="flex flex-col items-center text-center gap-6">
          <h2 className="text-white font-bold text-[26px] sm:text-[32px]">{t("cta_title")}</h2>
          <p className="text-white/60 text-[15px]" style={{ maxWidth: 480 }}>{t("cta_subtitle")}</p>
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
