"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

function IllustrationStep1() {
  return (
    <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="10" width="140" height="120" rx="12" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="36" y="32" width="108" height="10" rx="4" fill="#F1F5F9" />
      <rect x="36" y="52" width="108" height="10" rx="4" fill="#F1F5F9" />
      <rect x="36" y="72" width="80" height="10" rx="4" fill="#F1F5F9" />
      <rect x="36" y="96" width="108" height="18" rx="6" fill="#1A3A34" />
      <text x="90" y="109" textAnchor="middle" fill="white" fontSize="8" fontFamily="sans-serif" fontWeight="bold">
        S&apos;inscrire
      </text>
      <circle cx="148" cy="32" r="14" fill="#3FAE8C" />
      <path d="M142 32l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IllustrationStep2() {
  return (
    <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="70" r="44" fill="#E5B858" fillOpacity="0.15" />
      <circle cx="90" cy="70" r="32" fill="#E5B858" />
      <text x="90" y="76" textAnchor="middle" fill="#1A3A34" fontSize="24" fontFamily="sans-serif" fontWeight="900">
        SNL
      </text>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 90 + Math.cos(rad) * 38;
        const y1 = 70 + Math.sin(rad) * 38;
        const x2 = 90 + Math.cos(rad) * 50;
        const y2 = 70 + Math.sin(rad) * 50;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E5B858" strokeWidth="2.5" strokeLinecap="round" />
        );
      })}
    </svg>
  );
}

const illustrations = [IllustrationStep1, IllustrationStep2, null];

export default function HowItWorks() {
  const t = useTranslations("HowItWorks");
  const locale = useLocale();
  const prefix = locale === "fr" ? "/fr" : "";
  const isFr = locale === "fr";
  const [expanded, setExpanded] = useState({});

  const steps = [
    {
      num: t("step1_num"),
      title: t("step1_title"),
      desc: t("step1_desc"),
      more: [t("step1_more_1"), t("step1_more_2"), t("step1_more_3"), t("step1_more_4")],
      img: isFr ? "/images/VIS INSCRIPTION.jpg" : "/images/VIS_INSCRIPTION_EN.jpg",
    },
    {
      num: t("step2_num"),
      title: t("step2_title"),
      desc: t("step2_desc"),
      more: [t("step2_more_1"), t("step2_more_2"), t("step2_more_3"), t("step2_more_4"), t("step2_more_5")],
      img: isFr ? "/images/VIS COLLECTION.jpg" : "/images/VIS_COLLECTION_EN.jpg",
    },
    {
      num: t("step3_num"),
      title: t("step3_title"),
      desc: t("step3_desc"),
      more: [t("step3_more_1"), t("step3_more_2"), t("step3_more_3"), t("step3_more_4"), t("step3_more_5")],
      img: isFr ? "/images/VIS RESEAU.jpg" : "/images/VIS_RESEAU_EN.jpg",
    },
  ];

  return (
    <section className="bg-white pt-24 pb-10 lg:pt-32 lg:pb-12 relative overflow-hidden">
      <Image
        src="/images/Group.png"
        alt="" aria-hidden="true"
        width={280} height={420}
        loading="lazy"
        className="absolute select-none pointer-events-none hidden lg:block"
        style={{ opacity: 0.35, filter: "brightness(0) sepia(1) saturate(5) hue-rotate(110deg)", right: -80, top: -220 }}
      />

      <div className="absolute hidden lg:block pointer-events-none select-none overflow-hidden"
        style={{ width: 280, height: 500, left: 220, top: 570, zIndex: 20 }}>
        <Image src="/images/Group.png" alt="" aria-hidden="true"
          width={280} height={280} loading="lazy"
          style={{ opacity: 0.35, filter: "brightness(0)" }} />
      </div>

      <div className="absolute hidden lg:block pointer-events-none select-none overflow-hidden"
        style={{ width: 280, height: 500, right: 180, top: 680 }}>
        <Image src="/images/Group.png" alt="" aria-hidden="true"
          width={280} height={280} loading="lazy"
          style={{ opacity: 0.35, filter: "brightness(0)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-black text-[24px] sm:text-[40px] leading-normal" style={{ color: "#0F172B" }}>
            {t("title")}
          </h2>
        </div>

        <div className="flex flex-col gap-16 lg:gap-24">
          {steps.map((step, idx) => {
            const IllustrationComponent = illustrations[idx];
            const isEven = idx % 2 === 1;

            return (
              <div key={step.num} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
                <div className={isEven ? "lg:order-last" : ""}>
                  {!step.img && (
                    <div
                      className="font-black leading-none mb-4 select-none"
                      style={{ fontSize: 80, color: "#1F4E46", opacity: 0.12 }}
                    >
                      {step.num}
                    </div>
                  )}
                  <h3 className="font-black text-[20px] sm:text-[32px] leading-normal mb-4" style={{ color: "#0F172B" }}>
                    {step.title}
                  </h3>
                  <p className="text-[16px] mb-5" style={{ color: "#45556C", lineHeight: "28px", letterSpacing: "0.01em" }}>{step.desc}</p>
                  {expanded[idx] && (
                    <div className="flex flex-col gap-3 mb-6">
                      {step.more.map((p, i) => (
                        <p key={i} className="text-[15px]" style={{ color: "#45556C", lineHeight: "26px" }}>{p}</p>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-[16px] text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#E5B858" }}
                  >
                    {expanded[idx] ? t("read_less_btn") : t("read_more_btn")}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      style={{ transform: expanded[idx] ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                <div className={isEven ? "lg:order-first" : ""}>
                  {step.img ? (
                    <Image
                      src={step.img}
                      alt={step.title}
                      width={520}
                      height={400}
                      priority={idx === 0}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      style={{ objectFit: "contain", width: "100%", height: "auto" }}
                    />
                  ) : (
                    <div className="rounded-3xl bg-slate-50 p-6 flex items-center justify-center h-64">
                      <IllustrationComponent />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-16">
          <Link
            href={`${prefix}/snl/utilite`}
            className="inline-flex items-center gap-2 font-semibold text-[14px] text-primary border-primary px-6 py-3 rounded-full transition-all border hover:bg-primary hover:text-white active:text-white group w-full sm:w-auto justify-center"
          >
            {t("discover_link")}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
