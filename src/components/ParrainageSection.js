"use client";

import { useState, useEffect } from "react";
import Container from "./Container";
import { useAuth } from "@/context/AuthContext";
import { networkApi, usersApi } from "@/lib/api";
import { useTranslations } from "next-intl";

const LEVEL_CONFIG_BASE = [
  { id: "N1", labelKey: "level1", subKey: "level1_sub", bonus: 35, badgeBg: "#1F4E46" },
  { id: "N2", labelKey: "level2", subKey: "level2_sub", bonus: 20, badgeBg: "#3FAE8C" },
  { id: "N3", labelKey: "level3", subKey: "level3_sub", bonus: 15, badgeBg: "#E6B84C" },
];

function getLevelCount(stats, levelIndex) {
  if (!stats) return 0;
  const levels = stats.levels ?? stats.levelBreakdown ?? [];
  if (Array.isArray(levels) && levels[levelIndex] != null) {
    return levels[levelIndex]?.count ?? levels[levelIndex] ?? 0;
  }
  const keys = [`level${levelIndex + 1}Count`, `level${levelIndex + 1}`];
  for (const k of keys) {
    if (stats[k] != null) return typeof stats[k] === "object" ? (stats[k].count ?? 0) : stats[k];
  }
  if (levelIndex === 0) return stats.directCount ?? stats.level1 ?? 0;
  return 0;
}

export default function ParrainageSection() {
  const t = useTranslations("ParrainageSection");
  const { user } = useAuth();
  const [copied, setCopied]     = useState(false);
  const [stats, setStats]       = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [pending, setPending]   = useState(null);
  const [claiming, setClaiming] = useState({});

  const referralCode = user?.referralCode ?? user?.referral_code ?? "SUNALAA";
  const referralLink = `https://sunalaa.com/ref/${referralCode}`;

  const steps = [
    { num: "1", title: t("step1_title"), desc: t("step1_desc") },
    { num: "2", title: t("step2_title"), desc: t("step2_desc") },
    { num: "3", title: t("step3_title"), desc: t("step3_desc") },
  ];

  function fetchPendingAndEarnings() {
    usersApi.getReferralPending()
      .then((res) => setPending(res.data?.data ?? res.data))
      .catch(() => {});
    usersApi.getReferralEarnings()
      .then((res) => setEarnings(res.data?.data ?? res.data))
      .catch(() => {});
  }

  useEffect(() => {
    networkApi.getStats()
      .then((res) => setStats(res.data?.data ?? res.data))
      .catch(() => {});
    fetchPendingAndEarnings();
  }, []);

  async function handleClaim(levelNum) {
    setClaiming((prev) => ({ ...prev, [levelNum]: true }));
    try {
      await usersApi.claimReferral(levelNum);
      fetchPendingAndEarnings();
    } catch {
      // silencieux
    } finally {
      setClaiming((prev) => ({ ...prev, [levelNum]: false }));
    }
  }

  function getPendingForLevel(levelNum) {
    if (!pending?.levels) return 0;
    const entry = pending.levels.find((l) => l.level === levelNum);
    return entry?.pending ?? 0;
  }

  function handleCopy() {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const levels = LEVEL_CONFIG_BASE.map((cfg, i) => {
    const levelNum   = i + 1;
    const count      = getLevelCount(stats, i);
    const bonusPct   = stats?.levels?.[i]?.bonusPercentage ?? cfg.bonus;
    const pendingSnl = getPendingForLevel(levelNum);
    return { ...cfg, label: t(cfg.labelKey), sub: t(cfg.subKey), count, bonusPct, levelNum, pendingSnl };
  });

  return (
    <section className="bg-white py-16">
      <Container>
        <h2 className="font-bold text-primary mb-1 text-[18px] lg:text-[24px]" style={{ lineHeight: "32px", fontWeight: 700 }}>{t("title")}</h2>
        <p className="mb-8 text-[14px] lg:text-[16px]" style={{ fontWeight: 400, lineHeight: "24px", color: "#000000" }}>{t("subtitle")}</p>

        <div className="bg-primary rounded-2xl px-4 lg:px-8 py-5 lg:py-7 mb-10">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <p className="text-white text-[15px] lg:text-[18px]" style={{ fontWeight: 700, lineHeight: "28px" }}>{t("referral_link_label")}</p>
            {earnings != null && (
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
                <span className="text-white/70 text-[12px]">{t("total_earned")}</span>
                <span className="text-white font-bold text-[14px]">{earnings.totalEarned ?? 0} SNL</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl px-3 lg:px-5 py-3 flex items-center gap-2 lg:gap-3">
            <div className="flex-1 min-w-0">
              <p className="mb-0.5 text-[12px] lg:text-[14px]" style={{ fontWeight: 400, lineHeight: "20px", letterSpacing: "-0.15px", color: "#45556C" }}>{t("custom_link")}</p>
              <p className="text-gray-700 text-[12px] lg:text-[14px] truncate">{referralLink}</p>
            </div>

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
                {copied ? t("copied") : t("copy")}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h3 className="font-bold mb-7 text-[15px] lg:text-[18px]" style={{ lineHeight: "28px", letterSpacing: "-0.44px", color: "#0F172B" }}>{t("how_title")}</h3>
            <div className="flex flex-col gap-7">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[13px] font-bold shrink-0" style={{ backgroundColor: "#1F4E46" }}>
                    {step.num}
                  </div>
                  <div>
                    <p className="font-normal mb-1 text-[14px] lg:text-[16px]" style={{ lineHeight: "24px", letterSpacing: "-0.31px", color: "#0F172B" }}>{step.title}</p>
                    <p className="text-[12px] lg:text-[14px]" style={{ fontWeight: 400, lineHeight: "20px", letterSpacing: "-0.15px", color: "#45556C" }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">
              <h3 className="text-[15px] lg:text-[18px] font-bold text-gray-900 mb-1">{t("gains_title")}</h3>
              {levels.map((level) => (
                <div key={level.id} className="flex" style={{ borderRadius: 14, border: "1px solid #1F4E46", padding: 14, gap: 12 }}>
                  <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex items-center justify-center text-[11px] font-bold shrink-0"
                        style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: level.badgeBg, color: "white" }}
                      >
                        {level.id}
                      </div>
                      <div>
                        <p className="text-[13px] lg:text-[16px]" style={{ fontWeight: 400, lineHeight: "24px", letterSpacing: "-0.31px", color: "#0F172B" }}>{level.label}</p>
                        <p className="text-[11px] lg:text-[12px]" style={{ fontWeight: 400, lineHeight: "16px", color: "#1F4E46" }}>{level.sub}</p>
                      </div>
                    </div>

                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#344054] rounded-full" style={{ width: "100%" }} />
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[10px] lg:text-[12px]" style={{ color: "#62748E" }}>{t("referrals", { n: level.count })}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between shrink-0">
                    <div className="text-right">
                      <p className="text-[12px] lg:text-[14px]" style={{ fontWeight: 400, lineHeight: "20px", color: "#1F4E46" }}>{t("daily_bonus", { pct: level.bonusPct })}</p>
                    </div>
                    {level.pendingSnl > 0 ? (
                      <button
                        onClick={() => handleClaim(level.levelNum)}
                        disabled={claiming[level.levelNum]}
                        className="bg-secondary text-white hover:brightness-110 transition cursor-pointer shrink-0 flex items-center justify-center text-[12px] lg:text-[14px] disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ minWidth: 90, height: 36, fontWeight: 500, borderRadius: 8, padding: "0 10px" }}
                      >
                        {claiming[level.levelNum] ? "..." : t("claim_btn", { snl: level.pendingSnl })}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-[#344054] text-white shrink-0 flex items-center justify-center text-[12px] lg:text-[14px] opacity-60 cursor-not-allowed"
                        style={{ width: 90, height: 36, fontWeight: 500, borderRadius: 8 }}
                      >
                        {t("claimed")}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="bg-primary rounded-2xl px-5 py-4 flex gap-3 items-start">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.8" />
                  <path d="M12 8v4m0 4h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: "#FFFFFF" }}>
                    {t("info_1")}
                  </p>
                  <p className="mt-1" style={{ fontSize: 12, fontWeight: 400, lineHeight: "16px", color: "#FFFFFF" }}>
                    {t("info_2")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
