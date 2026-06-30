import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MentionsLegales" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
    alternates: {
      canonical: "https://sunalaa.com/mentions-legales",
      languages: { "x-default": "https://sunalaa.com/mentions-legales", en: "https://sunalaa.com/mentions-legales", fr: "https://sunalaa.com/fr/mentions-legales" },
    },
  };
}

export default async function MentionsLegalesPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MentionsLegales" });

  const sections = [
    {
      title: t("s1_title"),
      items: [
        { label: t("s1_name_label"), value: t("s1_name") },
        { label: t("s1_type_label"), value: t("s1_type") },
        { label: t("s1_hq_label"), value: t("s1_hq") },
        { label: t("s1_rep_label"), value: t("s1_rep") },
        { label: t("s1_email_label"), value: "legal@sunalaa.com" },
      ],
    },
    {
      title: t("s2_title"),
      text: t("s2_text"),
    },
    {
      title: t("s3_title"),
      text: t("s3_text"),
    },
    {
      title: t("s4_title"),
      text: t("s4_text"),
    },
    {
      title: t("s5_title"),
      text: t("s5_text"),
    },
    {
      title: t("s6_title"),
      text: t("s6_text"),
    },
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
          <p className="text-white/50 text-[13px]">{t("hero_date")}</p>
        </Container>
      </section>

      {/* ── Content ── */}
      <section className="bg-white py-16">
        <Container>
          <div className="max-w-2xl mx-auto flex flex-col gap-10">
            {sections.map((sec, i) => (
              <div key={i} className="flex flex-col gap-4">
                <h2 className="text-[20px] font-bold pb-2 border-b border-slate-100" style={{ color: "#0F172B" }}>
                  {sec.title}
                </h2>
                {sec.items ? (
                  <div className="flex flex-col gap-2">
                    {sec.items.map((item, j) => (
                      <div key={j} className="flex flex-col sm:flex-row sm:gap-3">
                        <span className="text-[13px] font-semibold shrink-0 w-44" style={{ color: "#1F4E46" }}>{item.label}</span>
                        <span className="text-[14px]" style={{ color: "#45556C" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[14px] leading-relaxed" style={{ color: "#45556C" }}>{sec.text}</p>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
