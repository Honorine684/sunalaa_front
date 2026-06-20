import Link from "next/link";
import Footer from "@/components/Footer";
import SnlNavbar from "@/components/SnlNavbar";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SNLUsage" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
    alternates: {
      canonical: "https://sunalaa.com/snl/usage",
      languages: { "x-default": "https://sunalaa.com/snl/usage", en: "https://sunalaa.com/snl/usage", fr: "https://sunalaa.com/fr/snl/usage" },
    },
    openGraph: {
      url: "https://sunalaa.com/snl/usage",
      title: t("og_title"),
      description: t("og_desc"),
      images: [{ url: "/images/sunala_LOGO.png", width: 800, height: 600, alt: "SUNALA SNL" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("og_title"),
      description: t("og_desc"),
      images: ["/images/sunala_LOGO.png"],
    },
  };
}

const b = (chunks) => <strong style={{ color: "#1F4E46" }}>{chunks}</strong>;

export default async function UsagePage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SNLUsage" });
  const prefix = locale === "fr" ? "/fr" : "";

  return (
    <div className="bg-white min-h-screen">
      <SnlNavbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: 500, height: 500, border: "1px solid rgba(31,78,70,0.06)", top: -150, right: -150 }} />
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 300, opacity: 0.06, filter: "brightness(0)", left: -60, top: 0 }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: "rgba(63,174,140,0.10)", color: "#3FAE8C" }}>
            {t("hero_badge")}
          </span>
          <h1 className="font-black text-[34px] sm:text-[52px] leading-tight mb-6" style={{ color: "#0F172B" }}>
            {t("hero_h1_1")}<br /><span style={{ color: "#3FAE8C" }}>SUNALA</span> {t("hero_h1_2")}
          </h1>
          <p className="text-[15px] sm:text-[17px] leading-relaxed" style={{ color: "#45556C" }}>
            {t("hero_subtitle")}
          </p>
        </div>
      </section>

      {/* ── Scénarios ── */}
      <section className="relative overflow-hidden pb-24">
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 260, opacity: 0.05, filter: "brightness(0)", right: -40, top: 100 }} />
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 260, opacity: 0.05, filter: "brightness(0)", left: -40, top: 500 }} />

        <div className="max-w-3xl mx-auto px-6 relative z-10 flex flex-col gap-10">

          {/* Scénario 1 */}
          <div className="rounded-3xl p-7 sm:p-9 relative overflow-hidden"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(31,78,70,0.08)" }}>
            <div className="h-1 w-10 rounded-full mb-5" style={{ backgroundColor: "#3FAE8C" }} />
            <h2 className="font-black text-[20px] sm:text-[26px] leading-tight mb-4" style={{ color: "#0F172B" }}>
              {t("s1_title")}
            </h2>
            <p className="text-[14px] leading-relaxed mb-7" style={{ color: "#45556C" }}>
              {t.rich("s1_p", { b })}
            </p>
            <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid rgba(31,78,70,0.08)" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#3FAE8C" }}>{t("s1_result_label")}</p>
              {[
                { label: t("s1_row1"), value: "9 000 pts" },
                { label: t("s1_row2"), value: "2 500 pts" },
                { label: t("s1_row3"), value: "3 000 pts" },
                { label: t("s1_row4"), value: "6 250 pts" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2.5"
                  style={{ borderBottom: "1px solid rgba(31,78,70,0.06)" }}>
                  <span className="text-[13px]" style={{ color: "#45556C" }}>{label}</span>
                  <span className="text-[13px] font-semibold" style={{ color: "#3FAE8C" }}>{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3">
                <span className="text-[14px] font-bold" style={{ color: "#0F172B" }}>{t("s1_total")}</span>
                <span className="text-[15px] font-black" style={{ color: "#1F4E46" }}>~21 $SNL</span>
              </div>
            </div>
          </div>

          {/* Scénario 2 */}
          <div className="rounded-3xl p-7 sm:p-9 relative overflow-hidden"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(31,78,70,0.08)" }}>
            <div className="h-1 w-10 rounded-full mb-5" style={{ backgroundColor: "#E6B84C" }} />
            <h2 className="font-black text-[20px] sm:text-[26px] leading-tight mb-4" style={{ color: "#0F172B" }}>
              {t("s2_title")}
            </h2>
            <p className="text-[14px] leading-relaxed mb-7" style={{ color: "#45556C" }}>
              {t.rich("s2_p", { b })}
            </p>
            <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid rgba(31,78,70,0.08)" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#E6B84C" }}>{t("s2_result_label")}</p>
              {[
                { label: t("s2_row1"), value: "45 000 pts" },
                { label: t("s2_row2"), value: "45 $SNL" },
                { label: t("s2_row3"), value: "$4.50" },
                { label: t("s2_row4"), value: "$22.50" },
                { label: t("s2_row5"), value: "$45.00" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2.5"
                  style={{ borderBottom: "1px solid rgba(31,78,70,0.06)" }}>
                  <span className="text-[13px]" style={{ color: "#45556C" }}>{label}</span>
                  <span className="text-[13px] font-semibold" style={{ color: "#E6B84C" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scénario 3 */}
          <div className="rounded-3xl p-7 sm:p-9 relative overflow-hidden"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(31,78,70,0.08)" }}>
            <span className="text-[10px] font-bold tracking-widest uppercase block mb-2" style={{ color: "#1F4E46" }}>
              {t("s3_tag")}
            </span>
            <div className="h-1 w-10 rounded-full mb-5" style={{ backgroundColor: "#1F4E46" }} />
            <h2 className="font-black text-[20px] sm:text-[26px] leading-tight mb-4" style={{ color: "#0F172B" }}>
              {t("s3_title")}
            </h2>
            <p className="text-[14px] leading-relaxed mb-7" style={{ color: "#45556C" }}>
              {t.rich("s3_p", { b })}
            </p>
            <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid rgba(31,78,70,0.08)" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#1F4E46" }}>{t("s3_result_label")}</p>
              {[
                { label: t("s3_row1"), value: "5 000 $SNL" },
                { label: t("s3_row2"), value: t("s3_val2") },
                { label: t("s3_row3"), value: t("s3_val3") },
                { label: t("s3_row4"), value: t("s3_val4") },
                { label: t("s3_row5"), value: t("s3_val5") },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2.5"
                  style={{ borderBottom: "1px solid rgba(31,78,70,0.06)" }}>
                  <span className="text-[13px]" style={{ color: "#45556C" }}>{label}</span>
                  <span className="text-[13px] font-semibold" style={{ color: "#1F4E46" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="flex justify-center mt-14">
          <Link
            href={`${prefix}/snl/valeur`}
            className="inline-flex items-center gap-2 font-bold text-[14px] text-white px-8 py-4 rounded-full hover:brightness-90 transition"
            style={{ backgroundColor: "#3FAE8C" }}
          >
            {t("cta_btn")}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
