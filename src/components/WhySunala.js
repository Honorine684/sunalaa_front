import Image from "next/image";
import { useTranslations } from "next-intl";

export default function WhySunala() {
  const t = useTranslations("WhySunala");

  const cards = [
    { titleKey: "card1_title", descKey: "card1_desc", icon: <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#00FFA0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/></svg> },
    { titleKey: "card2_title", descKey: "card2_desc", img: "/images/growth.png" },
    { titleKey: "card3_title", descKey: "card3_desc", img: "/images/money.png" },
    { titleKey: "card4_title", descKey: "card4_desc", img: "/images/card.png" },
  ];

  return (
    <section className="relative overflow-hidden pt-10 pb-24 lg:pt-12 lg:pb-32 bg-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-bold mb-4 text-[22px] sm:text-[48px]" style={{ lineHeight: "1.1", letterSpacing: "0.35px", color: "#0F172B" }}>
            {t("title")}
          </h2>
          <p className="max-w-2xl mx-auto text-center text-[16px] sm:text-[20px]" style={{ lineHeight: "28px", color: "#45556C", letterSpacing: "-0.45px" }}>
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card) => (
            <div key={card.titleKey}
              className="rounded-[55px] flex flex-col items-center text-center gap-6 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              style={{ backgroundColor: "#1F4E46", padding: "44px 44px" }}>
              <div className="flex items-center justify-center">
                {card.icon && card.icon}
                {card.img && <Image src={card.img} alt={t(card.titleKey)} width={72} height={72} style={{ objectFit: "contain" }} />}
              </div>
              <h3 className="text-white font-semibold text-[18px] sm:text-[24px] leading-none text-center">{t(card.titleKey)}</h3>
              <p style={{ fontSize: 16, lineHeight: "24px", letterSpacing: "-0.31px", color: "#FFFFFF", fontWeight: 400 }}>{t(card.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
