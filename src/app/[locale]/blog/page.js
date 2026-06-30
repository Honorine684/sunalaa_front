import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
    alternates: {
      canonical: "https://sunalaa.com/blog",
      languages: { "x-default": "https://sunalaa.com/blog", en: "https://sunalaa.com/blog", fr: "https://sunalaa.com/fr/blog" },
    },
  };
}

export default async function BlogPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  const prefix = locale === "fr" ? "/fr" : "";

  const articles = [
    { key: "a1", category: t("a1_cat") },
    { key: "a2", category: t("a2_cat") },
    { key: "a3", category: t("a3_cat") },
    { key: "a4", category: t("a4_cat") },
    { key: "a5", category: t("a5_cat") },
  ];

  const catColors = {
    0: "#3FAE8C",
    1: "#3B82F6",
    2: "#8B5CF6",
    3: "#E6B84C",
    4: "#F43F5E",
  };

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
          <p className="text-white/60 text-[16px] leading-relaxed" style={{ maxWidth: 500 }}>
            {t("hero_subtitle")}
          </p>
        </Container>
      </section>

      {/* ── Articles ── */}
      <section className="bg-[#F8FAFC] py-16">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {articles.map((article, i) => (
              <div key={article.key} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                {/* Thumbnail placeholder */}
                <div className="h-40 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${catColors[i]}18, ${catColors[i]}08)` }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={catColors[i]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="14,2 14,8 20,8" stroke={catColors[i]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke={catColors[i]} strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke={catColors[i]} strokeWidth="1.5" strokeLinecap="round"/>
                    <polyline points="10,9 9,9 8,9" stroke={catColors[i]} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                      style={{ backgroundColor: `${catColors[i]}15`, color: catColors[i] }}>
                      {article.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded"
                      style={{ backgroundColor: "rgba(230,184,76,0.12)", color: "#E6B84C", border: "1px solid rgba(230,184,76,0.3)" }}>
                      {t("soon_badge")}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-bold leading-snug" style={{ color: "#0F172B" }}>
                    {t(`${article.key}_title`)}
                  </h3>
                  <p className="text-[13px] leading-relaxed flex-1" style={{ color: "#64748B" }}>
                    {t(`${article.key}_teaser`)}
                  </p>
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[12px] font-semibold cursor-not-allowed select-none"
                      style={{ color: "#94A3B8" }}>
                      {t("read_soon")} →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Newsletter CTA ── */}
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
