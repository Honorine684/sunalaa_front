"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";

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

function fmtMembers(n) {
  if (n == null) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `${Math.floor(n / 100) / 10}k+`;
  return `${n}+`;
}

function fmtPoints(n) {
  if (n == null) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k+`;
  return `${n}`;
}

export default function TestimonialsSection() {
  const t = useTranslations("Testimonials");
  const locale = useLocale();
  const prefix = locale === "fr" ? "/fr" : "";
  const items = t.raw("items");

  const [liveStats, setLiveStats] = useState({ members: null, totalPoints: null });

  useEffect(() => {
    fetch("/api/platform-stats")
      .then((r) => r.json())
      .then((d) => setLiveStats(d))
      .catch(() => {});
  }, []);

  const membersValue  = fmtMembers(liveStats.members)  ?? t("stats.members");
  const pointsValue   = fmtPoints(liveStats.totalPoints) ?? t("stats.points");

  const statRows = [
    { value: membersValue, label: t("stats.membersLabel") },
    { value: pointsValue,  label: t("stats.pointsLabel") },
  ];

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
              className="rounded-[28px] p-7 flex flex-col gap-5"
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

        {/* Live stats bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          {statRows.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-black text-[28px] leading-none" style={{ color: "#1F4E46" }}>{value}</p>
              <p className="text-[13px] mt-1" style={{ color: "#94A3B8" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[11px] mt-8" style={{ color: "rgba(0,0,0,0.35)" }}>
          {t("disclaimer")}
        </p>

        {/* CTA */}
        <div className="flex justify-center mt-6">
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
