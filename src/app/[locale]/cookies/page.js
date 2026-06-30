import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Cookies" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
    alternates: {
      canonical: "https://sunalaa.com/cookies",
      languages: { "x-default": "https://sunalaa.com/cookies", en: "https://sunalaa.com/cookies", fr: "https://sunalaa.com/fr/cookies" },
    },
  };
}

export default async function CookiesPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Cookies" });

  const cookieRows = [
    { type: t("table_type1"), purpose: t("table_purpose1"), consent: t("table_no") },
    { type: t("table_type2"), purpose: t("table_purpose2"), consent: t("table_yes") },
    { type: t("table_type3"), purpose: t("table_purpose3"), consent: t("table_yes") },
    { type: t("table_type4"), purpose: t("table_purpose4"), consent: t("table_yes") },
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
          <h1 className="text-white font-bold leading-tight" style={{ fontSize: "clamp(24px,4vw,42px)", maxWidth: 520 }}>
            {t("hero_title")}
          </h1>
          <p className="text-white/50 text-[13px]">{t("hero_date")}</p>
        </Container>
      </section>

      {/* ── Content ── */}
      <section className="bg-white py-16">
        <Container>
          <div className="max-w-2xl mx-auto flex flex-col gap-10">

            {/* What is a cookie */}
            <div className="flex flex-col gap-4">
              <h2 className="text-[20px] font-bold pb-2 border-b border-slate-100" style={{ color: "#0F172B" }}>
                {t("s1_title")}
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ color: "#45556C" }}>{t("s1_text")}</p>
            </div>

            {/* Table */}
            <div className="flex flex-col gap-4">
              <h2 className="text-[20px] font-bold pb-2 border-b border-slate-100" style={{ color: "#0F172B" }}>
                {t("s2_title")}
              </h2>
              <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr style={{ backgroundColor: "#F8FAFC" }}>
                      <th className="text-left px-4 py-3 font-semibold" style={{ color: "#0F172B" }}>{t("table_col_type")}</th>
                      <th className="text-left px-4 py-3 font-semibold" style={{ color: "#0F172B" }}>{t("table_col_purpose")}</th>
                      <th className="text-left px-4 py-3 font-semibold" style={{ color: "#0F172B" }}>{t("table_col_consent")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookieRows.map((row, i) => (
                      <tr key={i} className="border-t border-slate-100">
                        <td className="px-4 py-3 font-medium" style={{ color: "#1F4E46" }}>{row.type}</td>
                        <td className="px-4 py-3" style={{ color: "#45556C" }}>{row.purpose}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold"
                            style={{
                              backgroundColor: row.consent === t("table_yes") ? "rgba(63,174,140,0.1)" : "rgba(148,163,184,0.1)",
                              color: row.consent === t("table_yes") ? "#3FAE8C" : "#64748B",
                            }}>
                            {row.consent}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Manage cookies */}
            <div className="flex flex-col gap-4">
              <h2 className="text-[20px] font-bold pb-2 border-b border-slate-100" style={{ color: "#0F172B" }}>
                {t("s3_title")}
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ color: "#45556C" }}>{t("s3_text")}</p>
            </div>

          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
