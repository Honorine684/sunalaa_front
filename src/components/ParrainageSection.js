"use client";

import { useState } from "react";
import Container from "./Container";

/* ── Steps ── */
const steps = [
  {
    num: "1",
    title: "Partagez votre lien",
    desc: "Invitez vos amis, votre famille et votre communauté à rejoindre SUNALAA",
  },
  {
    num: "2",
    title: "Ils s'inscrivent",
    desc: "Vos filleuls créent leur compte et commencent à collecter leurs points SNL",
  },
  {
    num: "3",
    title: "Vous gagnez ensemble",
    desc: "Recevez un bonus sur leurs collectes quotidiennes et progressez en équipe",
  },
];

/* ── Level cards ── */
const levels = [
  {
    id: "N1",
    label: "Niveau 1",
    sub: "Vos invitations directes",
    bonus: "10% de bonus",
    filleuls: "12 filleuls",
    invited: 2,
    remaining: 10,
    total: 12,
    badgeBg: "#1F4E46",
    badgeText: "white",
  },
  {
    id: "N2",
    label: "Niveau 2",
    sub: "Invitations de vos filleuls",
    bonus: "5% de bonus",
    filleuls: "8 filleuls",
    invited: 2,
    remaining: 6,
    total: 8,
    badgeBg: "#3FAE8C",
    badgeText: "white",
  },
  {
    id: "N3",
    label: "Niveau 3",
    sub: "Invitations de niveau 2",
    bonus: "2% de bonus",
    filleuls: "3 filleuls",
    invited: 2,
    remaining: 1,
    total: 3,
    badgeBg: "#E6B84C",
    badgeText: "white",
  },
];

export default function ParrainageSection() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://sunalaa.io/ref/CRYPTO2025";

  function handleCopy() {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="bg-white py-16">
      <Container>
        {/* Section title */}
        <h2 className="font-bold text-primary mb-1 text-[18px] lg:text-[24px]" style={{ lineHeight: "32px", fontWeight: 700 }}>Parrainage SUNALAA</h2>
        <p className="mb-8 text-[14px] lg:text-[16px]" style={{ fontWeight: 400, lineHeight: "24px", color: "#000000" }}>Gagner plus de point en parrainant</p>

        {/* ── Referral card (dark green, full width) ── */}
        <div className="bg-primary rounded-2xl px-4 lg:px-8 py-5 lg:py-7 mb-10">
          <p className="text-white mb-4 text-[15px] lg:text-[18px]" style={{ fontWeight: 700, lineHeight: "28px" }}>Votre lien de parrainage</p>

          {/* Input row */}
          <div className="bg-white rounded-xl px-3 lg:px-5 py-3 flex items-center gap-2 lg:gap-3">
            {/* Link text area */}
            <div className="flex-1 min-w-0">
              <p className="mb-0.5 text-[12px] lg:text-[14px]" style={{ fontWeight: 400, lineHeight: "20px", letterSpacing: "-0.15px", color: "#45556C" }}>Lien personnalisé</p>
              <p className="text-gray-700 text-[12px] lg:text-[14px] truncate">{referralLink}</p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 lg:gap-2 bg-[#1a1a1a] text-white font-normal px-3 lg:px-4 py-2 lg:py-2.5 rounded-full hover:brightness-125 transition cursor-pointer text-[13px] lg:text-[16px]"
                style={{ lineHeight: "24px", letterSpacing: "-0.31px" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="13" height="13" rx="2" stroke="white" strokeWidth="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="white" strokeWidth="2" />
                </svg>
                {copied ? "Copié !" : "Copier"}
              </button>

              <button className="flex items-center gap-1.5 lg:gap-2 bg-secondary text-white font-normal px-3 lg:px-4 py-2 lg:py-2.5 rounded-full hover:brightness-110 transition cursor-pointer text-[13px] lg:text-[16px]" style={{ lineHeight: "24px", letterSpacing: "-0.31px" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" stroke="white" strokeWidth="1.5" />
                </svg>
                Partager
              </button>
            </div>
          </div>
        </div>

        {/* ── Two columns: steps | levels ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Left — Comment ça marche */}
          <div>
            <h3 className="font-bold mb-7 text-[15px] lg:text-[18px]" style={{ lineHeight: "28px", letterSpacing: "-0.44px", color: "#0F172B" }}>Comment ça marche ?</h3>
            <div className="flex flex-col gap-7">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-4">
                  {/* Number badge — dark green rounded square */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[13px] font-bold shrink-0"
                    style={{ backgroundColor: "#1F4E46" }}
                  >
                    {step.num}
                  </div>
                  {/* Text */}
                  <div>
                    <p className="font-normal mb-1 text-[14px] lg:text-[16px]" style={{ lineHeight: "24px", letterSpacing: "-0.31px", color: "#0F172B" }}>{step.title}</p>
                    <p className="text-[12px] lg:text-[14px]" style={{ fontWeight: 400, lineHeight: "20px", letterSpacing: "-0.15px", color: "#45556C" }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Vos gains par niveau */}
          <div className="flex flex-col gap-4">
            {/* Outer wrapper card */}
            <div className="border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">
            <h3 className="text-[15px] lg:text-[18px] font-bold text-gray-900 mb-1">Vos gains par niveau</h3>
            {levels.map((level) => {
              const progress = Math.round((level.invited / level.total) * 100);
              return (
                <div key={level.id} className="flex" style={{ borderRadius: 14, border: "1px solid #1F4E46", padding: 14, gap: 12 }}>
                  {/* Left column: badge+name, progress bar, labels */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                    {/* Badge + name */}
                    <div className="flex items-center gap-2">
                      <div
                        className="flex items-center justify-center text-[11px] font-bold shrink-0"
                        style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: level.badgeBg, color: level.badgeText }}
                      >
                        {level.id}
                      </div>
                      <div>
                        <p className="text-[13px] lg:text-[16px]" style={{ fontWeight: 400, lineHeight: "24px", letterSpacing: "-0.31px", color: "#0F172B" }}>{level.label}</p>
                        <p className="text-[11px] lg:text-[12px]" style={{ fontWeight: 400, lineHeight: "16px", letterSpacing: 0, color: "#1F4E46" }}>{level.sub}</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#344054] rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Bar labels */}
                    <div className="flex justify-between">
                      <span className="text-[10px] lg:text-[12px]" style={{ fontWeight: 400, lineHeight: "16px", letterSpacing: 0, color: "#62748E" }}>{level.invited} amis invités</span>
                      <span className="text-[10px] lg:text-[12px]" style={{ fontWeight: 400, lineHeight: "16px", letterSpacing: 0, color: "#62748E" }}>{level.remaining} restants</span>
                    </div>
                  </div>

                  {/* Right column: stats on top, button on bottom */}
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <div className="text-right">
                      <p className="text-[12px] lg:text-[14px]" style={{ fontWeight: 400, lineHeight: "20px", letterSpacing: "-0.15px", color: "#1F4E46" }}>{level.bonus}</p>
                      <p className="text-[13px] lg:text-[16px]" style={{ fontWeight: 400, lineHeight: "24px", letterSpacing: "-0.31px", color: "#1F4E46" }}>{level.filleuls}</p>
                    </div>
                    <button className="bg-[#344054] text-white hover:brightness-110 transition cursor-pointer shrink-0 flex items-center justify-center text-[12px] lg:text-[14px]" style={{ width: 90, height: 36, fontWeight: 500, lineHeight: "20px", letterSpacing: "-0.15px", borderRadius: 8 }}>
                      Réclamé
                    </button>
                  </div>
                </div>
              );
            })}

              {/* Info banner — inside outer wrapper */}
              <div className="bg-primary rounded-2xl px-5 py-4 flex gap-3 items-start">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.8" />
                  <path d="M12 8v4m0 4h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", letterSpacing: "-0.15px", color: "#FFFFFF" }}>
                    Les bonus sont calculés sur les collectes quotidiennes de vos filleuls actifs.
                  </p>
                  <p className="mt-1" style={{ fontSize: 12, fontWeight: 400, lineHeight: "16px", letterSpacing: 0, color: "#FFFFFF" }}>
                    Plus votre réseau est actif, plus vous gagnez de points SNL.
                  </p>
                </div>
              </div>
            </div>{/* end outer wrapper */}
          </div>
        </div>
      </Container>
    </section>
  );
}
