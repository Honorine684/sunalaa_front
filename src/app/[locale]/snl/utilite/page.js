import Link from "next/link";
import Footer from "@/components/Footer";
import SnlNavbar from "@/components/SnlNavbar";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SNLUtilite" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
    alternates: {
      canonical: "https://sunalaa.com/snl/utilite",
      languages: { "x-default": "https://sunalaa.com/snl/utilite", en: "https://sunalaa.com/snl/utilite", fr: "https://sunalaa.com/fr/snl/utilite" },
    },
    openGraph: {
      url: "https://sunalaa.com/snl/utilite",
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

export default async function UtilitePage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SNLUtilite" });
  const prefix = locale === "fr" ? "/fr" : "";

  const utilites = [
    { num: "01", title: t("util1_title"), desc: t("util1_desc"), example: t("util1_example"), color: "#3FAE8C" },
    { num: "02", title: t("util2_title"), desc: t("util2_desc"), example: t("util2_example"), color: "#E6B84C" },
    { num: "03", title: t("util3_title"), desc: t("util3_desc"), example: t("util3_example"), color: "#3FAE8C" },
    { num: "04", title: t("util4_title"), desc: t("util4_desc"), example: t("util4_example"), color: "#1F4E46" },
    { num: "05", title: t("util5_title"), desc: t("util5_desc"), example: t("util5_example"), color: "#E6B84C" },
    { num: "06", title: t("util6_title"), desc: t("util6_desc"), example: t("util6_example"), color: "#3FAE8C" },
  ];

  return (
    <div className="bg-white min-h-screen">
      <SnlNavbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: 600, height: 600, border: "1px solid rgba(63,174,140,0.06)", top: -200, right: -200 }} />
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: 400, height: 400, border: "1px solid rgba(63,174,140,0.08)", top: -120, right: -120 }} />
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 280, opacity: 0.06, filter: "brightness(0)", left: -60, bottom: 0 }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: "rgba(63,174,140,0.10)", color: "#3FAE8C" }}>
            {t("hero_badge")}
          </span>
          <h1 className="font-black text-[34px] sm:text-[52px] leading-tight mb-6" style={{ color: "#0F172B" }}>
            {t("hero_h1_1")}<br />{t("hero_h1_2")} <span style={{ color: "#3FAE8C" }}>$SNL</span>
          </h1>
          <p className="text-[15px] sm:text-[17px] leading-relaxed" style={{ color: "#45556C" }}>
            {t("hero_subtitle_1")}<br />{t("hero_subtitle_2")}
          </p>
        </div>
      </section>

      {/* ── Les 6 utilités ── */}
      <section className="relative overflow-hidden pb-24">
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 260, opacity: 0.05, filter: "brightness(0)", right: -40, top: 200 }} />
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 260, opacity: 0.05, filter: "brightness(0)", left: -40, top: 600 }} />

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="flex flex-col gap-6">
            {utilites.map(({ num, title, desc, example, color }) => (
              <div key={num}
                className="rounded-3xl p-7 sm:p-9 relative overflow-hidden"
                style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(31,78,70,0.08)" }}>
                <span className="absolute top-5 right-7 font-black text-[56px] leading-none select-none pointer-events-none"
                  style={{ color: "rgba(15,23,43,0.04)" }}>{num}</span>
                <div className="h-1 w-10 rounded-full mb-5" style={{ backgroundColor: color }} />
                <h3 className="font-bold text-[18px] sm:text-[20px] mb-3 leading-snug" style={{ color: "#0F172B" }}>
                  {title}
                </h3>
                <p className="text-[14px] leading-relaxed mb-4" style={{ color: "#45556C" }}>{desc}</p>
                <div className="rounded-xl px-4 py-3 text-[13px] leading-relaxed font-medium"
                  style={{ borderLeft: `3px solid ${color}`, backgroundColor: "rgba(31,78,70,0.04)", color: "#1F4E46" }}>
                  {example}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-14">
            <Link
              href={`${prefix}/snl/usage`}
              className="inline-flex items-center gap-2 font-bold text-[14px] text-white px-8 py-4 rounded-full hover:brightness-90 transition"
              style={{ backgroundColor: "#3FAE8C" }}
            >
              {t("cta_btn")}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
