import { useTranslations } from "next-intl";

export default function FounderSection() {
  const t = useTranslations("FounderSection");

  return (
    <section className="relative bg-white py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(31,78,70,0.05) 0%, transparent 70%)" }} />

      <div className="max-w-4xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex justify-center mb-8">
          <span className="inline-block text-[12px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full"
            style={{ backgroundColor: "rgba(63,174,140,0.10)", color: "#3FAE8C" }}>
            {t("badge")}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-[40px] overflow-hidden" style={{ backgroundColor: "#1F4E46" }}>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-white/30">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <span className="text-[12px]">{t("photo_placeholder")}</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-2xl" style={{ backgroundColor: "#E6B84C", opacity: 0.25 }} />
            </div>
          </div>

          <div>
            <h2 className="font-black text-[26px] sm:text-[36px] leading-tight mb-6" style={{ color: "#0F172B" }}>
              {t("title_1")}<br />
              <span style={{ color: "#3FAE8C" }}>{t("title_2")}</span>
            </h2>
            <p className="text-[15px] leading-relaxed mb-5" style={{ color: "#45556C" }}>{t("p1")}</p>
            <p className="text-[15px] leading-relaxed mb-8" style={{ color: "#45556C" }}>
              {t.rich("p2", { token: (chunks) => <strong style={{ color: "#0F172B" }}>{chunks}</strong> })}
            </p>
            <div className="flex items-center gap-4 pt-6" style={{ borderTop: "1px solid rgba(15,23,43,0.08)" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-black text-white text-[16px]"
                style={{ backgroundColor: "#1F4E46" }}>
                GE
              </div>
              <div>
                <p className="font-bold text-[15px]" style={{ color: "#0F172B" }}>Godfroy ETCHIKOU</p>
                <p className="text-[13px]" style={{ color: "#3FAE8C" }}>{t("founder_title")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
