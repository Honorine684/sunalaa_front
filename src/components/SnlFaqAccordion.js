"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function SnlFaqAccordion({ light = false }) {
  const t = useTranslations("SNLFaq");
  const [open, setOpen] = useState(0);

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
  ];

  const cardBg = light ? "#F8FAFC" : "#0d1f1a";
  const cardBorder = light ? "1px solid rgba(31,78,70,0.08)" : "1px solid rgba(255,255,255,0.07)";
  const questionColor = light ? "#0F172B" : "#ffffff";
  const answerColor = light ? "#45556C" : "rgba(255,255,255,0.65)";

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: cardBg, border: cardBorder }}
        >
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left"
          >
            <span className="font-bold text-[15px] sm:text-[17px] leading-snug pr-4" style={{ color: questionColor }}>
              {faq.q}
            </span>
            <span
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[18px] font-bold transition-transform duration-300"
              style={{
                backgroundColor: open === i ? "#3FAE8C" : "rgba(63,174,140,0.15)",
                color: "#3FAE8C",
                transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
              }}
            >
              +
            </span>
          </button>
          {open === i && (
            <div className="px-6 pb-6">
              <p className="text-[14px] leading-relaxed" style={{ color: answerColor }}>
                {faq.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
