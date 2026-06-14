import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function LandingCTA() {
  const t = useTranslations("LandingCTA");
  const locale = useLocale();
  const prefix = locale === "fr" ? "/fr" : "";

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#1F4E46" }}>
      <div className="absolute -top-20 left-0 w-full hidden lg:block"
        style={{ height: "210px", backgroundColor: "#FFFFFF", clipPath: "polygon(0 0, 100% 0, 100% 42%, 40.5% 42%, 31.5% 100%, 0 100%)" }} />
      <div className="absolute top-0 left-0 w-full h-10 bg-white lg:hidden" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-16 lg:pt-52 pb-16 lg:pb-24">
        <div className="relative overflow-hidden rounded-3xl p-10 lg:p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
          style={{ backgroundColor: "#3FAE8C" }}>
          <div className="relative z-10">
            <h2 className="text-[18px] lg:text-3xl font-black text-white mb-3">{t("title")}</h2>
            <p className="text-white/75 text-[15px] leading-relaxed max-w-md">{t("subtitle")}</p>
          </div>
          <div className="relative z-10 shrink-0 w-full lg:w-auto">
            <Link href={`${prefix}/login`}
              className="inline-flex items-center justify-center gap-3 bg-white font-bold text-[13px] lg:text-[15px] rounded-full px-6 lg:px-8 py-3 lg:py-4 hover:brightness-95 transition-all duration-300 whitespace-nowrap w-full lg:w-auto"
              style={{ color: "#1A3A34" }}>
              {t("cta")}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        <div className="flex justify-center mt-8 px-4">
          <Link href={`${prefix}/snl/valeur`}
            className="inline-flex items-center gap-2 text-white text-[14px] lg:text-[15px] font-medium hover:opacity-80 transition-opacity group text-center">
            <span>{t("secondary")}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0 group-hover:translate-x-0.5 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
