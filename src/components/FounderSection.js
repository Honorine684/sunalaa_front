import { useTranslations } from "next-intl";

export default function FounderSection() {
  const t = useTranslations("FounderSection");

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden" style={{ backgroundColor: "#EDF2ED" }}>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex justify-center mb-8">
          <span className="inline-block text-[12px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full"
            style={{ backgroundColor: "rgba(63,174,140,0.10)", color: "#3FAE8C" }}>
            {t("badge")}
          </span>
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="font-black text-[26px] sm:text-[36px] leading-tight mb-6" style={{ color: "#0F172B" }}>
            {t("title_1")}<br />
            <span style={{ color: "#3FAE8C" }}>{t("title_2")}</span>
          </h2>
          <p className="text-[15px] leading-relaxed mb-5" style={{ color: "#45556C" }}>{t("p1")}</p>
          <p className="text-[15px] leading-relaxed mb-8" style={{ color: "#45556C" }}>
            {t.rich("p2", { token: (chunks) => <strong style={{ color: "#0F172B" }}>{chunks}</strong> })}
          </p>
          <div className="flex items-center gap-4 pt-6" style={{ borderTop: "1px solid rgba(15,23,43,0.08)" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#1F4E46" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-[15px]" style={{ color: "#0F172B" }}>{t("founder_title")}</p>
              <p className="text-[13px]" style={{ color: "#3FAE8C" }}>SUNALA</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
