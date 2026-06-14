"use client";

import { useTranslations, useLocale } from "next-intl";

const COLORS = ["#3FAE8C", "#E6B84C", "#1F4E46"];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#E6B84C">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const t = useTranslations("Testimonials");
  const locale = useLocale();
  const prefix = locale === "fr" ? "/fr" : "";

  const items = t.raw("items");

  return (
    <section className="relative bg-white py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-[12px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "rgba(63,174,140,0.10)", color: "#3FAE8C" }}>
            {t("badge")}
          </span>
          <h2 className="font-black text-[24px] sm:text-[40px] leading-tight"
            style={{ color: "#0F172B" }}>
            {t("title")}
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={item.name}
              className="rounded-[28px] p-7 flex flex-col gap-5 hover:scale-[1.02] transition-transform duration-300"
              style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(15,23,43,0.06)" }}>
              <Stars />
              <p className="text-[14px] leading-relaxed flex-1" style={{ color: "#45556C" }}>
                &ldquo;{item.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4"
                style={{ borderTop: "1px solid rgba(15,23,43,0.06)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-[13px]"
                  style={{ backgroundColor: COLORS[i] }}>
                  {item.initials}
                </div>
                <div>
                  <p className="font-bold text-[14px]" style={{ color: "#0F172B" }}>{item.name}</p>
                  <p className="text-[12px]" style={{ color: "#94A3B8" }}>{item.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          {[
            { value: t("stats.members"),  label: t("stats.membersLabel") },
            { value: t("stats.rating"),   label: t("stats.ratingLabel") },
            { value: t("stats.points"),   label: t("stats.pointsLabel") },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-black text-[28px] leading-none" style={{ color: "#1F4E46" }}>{value}</p>
              <p className="text-[13px] mt-1" style={{ color: "#94A3B8" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <a
            href={`${prefix}/snl/usage`}
            className="inline-flex items-center gap-2 font-semibold text-[14px] px-5 py-2.5 rounded-full transition-all hover:brightness-110 group"
            style={{ backgroundColor: "#3FAE8C", color: "#fff" }}
          >
            {t("cta")}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
