"use client";

import Link from "next/link";
import { useState } from "react";
import Container from "./Container";
import CollecteModal from "./CollecteModal";
import { useDashboard } from "@/hooks/useDashboard";
import { useLocale, useTranslations } from "next-intl";

/* ── Skeleton ─────────────────────────────────────────────────────── */
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

/* ── Icon wrapper ── */
function IconBox({ children, color = "#3FAE8C" }) {
  return (
    <div className="flex items-center justify-center shrink-0"
      style={{ width: "57.65px", height: "57.65px", borderRadius: "16.81px", backgroundColor: color }}>
      {children}
    </div>
  );
}

/* ── Card shell ── */
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

/* ── Format numbers ── */
function fmt(n) {
  if (n == null) return "—";
  return Number(n).toLocaleString("en-US");
}

const TX_COLORS = { credit: "#10B981", debit: "#EF4444", transfer: "#3B82F6" };

function TxRow({ tx, last }) {
  const isCredit = (tx.type ?? "").toLowerCase().includes("credit") ||
    (tx.amount ?? 0) > 0 && !((tx.type ?? "").toLowerCase().includes("debit"));
  const sign = isCredit ? "+" : "-";
  const color = TX_COLORS[isCredit ? "credit" : "debit"];
  const label = tx.description ?? tx.label ?? tx.type ?? "Transaction";
  const date = tx.createdAt ?? tx.date ?? tx.timestamp;
  return (
    <div className={`flex items-center justify-between py-3 ${!last ? "border-b border-slate-100" : ""}`}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            {isCredit
              ? <path d="M12 5v14M5 12l7-7 7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              : <path d="M12 19V5M5 12l7 7 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
          </svg>
        </div>
        <div>
          <p className="text-[13px] lg:text-[14px] font-medium text-slate-800 leading-none mb-0.5">{label}</p>
          {date && <p className="text-[11px] text-slate-400">{new Date(date).toLocaleDateString("en-US")}</p>}
        </div>
      </div>
      <span className="font-bold text-[14px] lg:text-[15px]" style={{ color }}>
        {sign}{fmt(Math.abs(tx.amount ?? 0))} SNL
      </span>
    </div>
  );
}

export default function HomeDashboard() {
  const t = useTranslations("HomeDashboard");
  const { data, network, transactions, balance, levelData, referralCode, rank, streak, loading, error } = useDashboard();
  const locale = useLocale();
  const prefix = locale === "fr" ? "/fr" : "";
  const [showModal, setShowModal] = useState(false);
  const [localBalance, setLocalBalance] = useState(null);
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const link = `https://sunalaa.com/register?ref=${referralCode ?? ""}`;
    const text = t("share_text");
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: "SUNALAA", text, url: link }); } catch {}
    } else {
      try { navigator.clipboard?.writeText(link); } catch {}
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const totalPoints   = localBalance ?? balance ?? data?.snlBalance ?? data?.totalPoints ?? data?.points ?? 0;
  const dailyPoints   = data?.dailyPoints ?? data?.todayPoints ?? data?.todayEarned ?? 0;
  const levelName     = levelData?.name ?? data?.level?.name ?? data?.levelName ?? "—";
  const levelProgress = Number(levelData?.progress ?? data?.level?.progress ?? 0);
  const levelNext     = levelData?.next ?? data?.level?.next ?? null;
  const referralCount = network?.totalReferrals ?? network?.directCount ?? network?.total ?? 0;

  return (
    <div className="relative bg-white overflow-hidden">

      {/* Concentric circles — left */}
      <div className="absolute left-[10%] top-45 pointer-events-none select-none z-0">
        {[300, 220, 145, 70].map((size) => (
          <div key={size} className="absolute rounded-full border border-secondary/20"
            style={{ width: size, height: size, left: -size / 2, top: -size / 2 }} />
        ))}
      </div>

      {/* Concentric circles — right */}
      <div className="absolute right-[10%] top-45 pointer-events-none select-none z-0">
        {[300, 220, 145, 70].map((size) => (
          <div key={size} className="absolute rounded-full border border-secondary/20"
            style={{ width: size, height: size, right: -size / 2, top: -size / 2 }} />
        ))}
      </div>

      <Container className="relative z-10 pt-16 pb-20">

        {/* Section title */}
        <div className="text-center mb-10">
          <h2 className="font-bold text-primary mb-3 text-[28px] lg:text-[48px]" style={{ lineHeight: "1.1", letterSpacing: "0.35px" }}>
            {t("section_title")}
          </h2>
          <p className="text-center mx-auto text-[14px] lg:text-[18px]" style={{ lineHeight: "28px", maxWidth: 672, color: "#0F172B" }}>
            {t("section_sub")}
          </p>
        </div>

        {/* Erreur API */}
        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[13px]">
            {t("error_load", { error })}
          </div>
        )}

        {/* ── Balance card ── */}
        <div className="bg-primary mb-6 flex flex-col"
          style={{ borderRadius: 12, border: "1.2px solid rgba(255,255,255,0.10)", paddingTop: 30, paddingRight: 30, paddingBottom: 24, paddingLeft: 30, gap: 9.61, minHeight: 142.92 }}>
          <div className="flex items-center justify-between">
            <p className="font-bold text-[13px] lg:text-[16.81px]" style={{ color: "#DBEAFE" }}>{t("balance_label")}</p>
            <div className="flex items-center gap-2 font-normal text-[13px] lg:text-[16.81px]" style={{ color: "#5EE9B5" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 7l-9.5 9.5-5-5L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 7h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {loading ? "…" : t("today_delta", { n: fmt(dailyPoints) })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <img src="/images/Icon.png" alt="SNL" width={36} height={36} style={{ objectFit: "contain" }} />
            {loading ? (
              <Skeleton className="h-9 w-40 bg-white/20" />
            ) : (
              <p className="text-white text-[26px] lg:text-[38px] font-bold leading-none">
                {fmt(totalPoints)} <span className="font-bold text-[16px] lg:text-[21.62px]" style={{ color: "#DBEAFE" }}>SNL</span>
              </p>
            )}
          </div>
        </div>

        {/* ── 2-col: Niveau + Parrainage ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

          {/* Niveau */}
          <Card>
            <div className="flex items-start gap-4 mb-5">
              <IconBox>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="9" r="5" stroke="white" strokeWidth="2"/>
                  <path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </IconBox>
              <div>
                {loading ? <Skeleton className="h-5 w-28 mb-1" /> : (
                  <h3 className="font-bold text-[16px] lg:text-[21.62px]" style={{ lineHeight: "33.63px", color: "#0F172B" }}>
                    {t("level_title", { name: levelName })}
                  </h3>
                )}
                <p className="text-[13px] lg:text-[16.81px]" style={{ fontWeight: 400, color: "#45558C" }}>
                  {loading ? "" : levelNext ? t("level_progressing", { next: levelNext }) : levelName !== "—" ? t("level_max") : t("level_loading")}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] text-slate-500">{t("progress_label")}</span>
              <span className="text-[13px] font-bold text-slate-700">{loading ? "…" : `${levelProgress}%`}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full mb-2">
              <div className="h-2 bg-secondary rounded-full transition-all" style={{ width: `${levelProgress}%` }} />
            </div>
            <p className="text-[12px] mb-5" style={{ color: "#62748E" }}>
              {loading ? "" : levelNext ? t("progress_remaining", { pct: 100 - levelProgress, next: levelNext }) : levelName !== "—" ? t("level_top") : ""}
            </p>
            <Link href={`${prefix}/profil`} className="block w-full text-center border border-slate-200 text-slate-700 text-[13px] lg:text-[14px] font-normal py-3 rounded-xl hover:bg-slate-50 transition">
              {t("view_profile")}
            </Link>
          </Card>

          {/* Parrainage */}
          <Card>
            <div className="flex items-start gap-4 mb-5">
              <IconBox>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </IconBox>
              <div>
                <h3 className="font-bold text-[16px] lg:text-[21.62px]" style={{ lineHeight: "33.63px", color: "#0F172B" }}>{t("referral_title")}</h3>
                <p className="text-[13px] lg:text-[16.81px]" style={{ fontWeight: 400, color: "#45558C" }}>{t("referral_sub")}</p>
              </div>
            </div>

            {/* Filleuls actifs */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] lg:text-[14px] text-slate-500">{t("active_referrals")}</span>
              {loading ? <Skeleton className="h-8 w-16" /> : (
                <span className="text-[22px] lg:text-[28px] font-bold text-slate-900">{fmt(referralCount)}</span>
              )}
            </div>

            {/* Lien de parrainage */}
            <div className="rounded-xl px-3 py-3 mb-4 flex items-center gap-2" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] mb-0.5" style={{ color: "#94A3B8" }}>{t("your_link")}</p>
                {loading || !referralCode ? (
                  <Skeleton className="h-4 w-40" />
                ) : (
                  <p className="text-[12px] font-medium truncate" style={{ color: "#0F172B" }}>
                    sunalaa.com/register?ref={referralCode}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  const code = referralCode ?? "";
                  try { navigator.clipboard?.writeText(`https://sunalaa.com/register?ref=${code}`); } catch {}
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                disabled={!referralCode}
                className="shrink-0 flex items-center gap-1.5 text-white text-[12px] font-normal px-3 py-2 rounded-lg transition cursor-pointer disabled:opacity-40"
                style={{ backgroundColor: copied ? "#10B981" : "#1a1a1a" }}
              >
                {copied ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" stroke="white" strokeWidth="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="white" strokeWidth="2"/>
                  </svg>
                )}
                {copied ? t("copied") : t("copy")}
              </button>
            </div>

            <button
              onClick={handleShare}
              disabled={!referralCode}
              className="w-full flex items-center justify-center gap-2 bg-secondary text-white text-[13px] lg:text-[14px] font-normal py-3 rounded-xl hover:brightness-90 transition cursor-pointer disabled:opacity-40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="18" cy="5" r="3" stroke="white" strokeWidth="2"/>
                <circle cx="6" cy="12" r="3" stroke="white" strokeWidth="2"/>
                <circle cx="18" cy="19" r="3" stroke="white" strokeWidth="2"/>
                <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {t("share_link")}
            </button>

          </Card>
        </div>

        {/* ── Collecte quotidienne ── */}
        <Card className="mb-5">
          <div className="flex items-start gap-4 mb-5">
            <IconBox color="#1F4E46">
              <svg width="21.63" height="24.03" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </IconBox>
            <div>
              <h3 className="font-bold text-[16px] lg:text-[21.62px]" style={{ lineHeight: "33.63px", color: "#0F172B" }}>{t("collect_title")}</h3>
              <p className="text-[13px] lg:text-[16.81px]" style={{ fontWeight: 400, color: "#45556C" }}>{t("collect_sub")}</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center w-full bg-primary text-white hover:brightness-110 transition mb-4 text-[15px] lg:text-[21.62px] cursor-pointer"
            style={{ height: "72.06px", borderRadius: "16.81px", gap: "9.61px", boxShadow: "0 4.8px 7.21px -4.8px rgba(0,0,0,0.4)", fontWeight: 400, border: "none" }}
          >
            <svg width="21.63" height="24.03" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t("collect_btn")}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex items-center justify-center gap-2 text-[13px] lg:text-[16.81px]" style={{ fontWeight: 400, color: "#45556C" }}>
            <span className="w-4 h-4 rounded-full bg-gold/40 inline-block shrink-0" />
            {loading ? "…" : t("streak", { n: streak })}
          </div>
        </Card>

        {/* ── Classement ── */}
        <Card className="mb-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-start gap-4">
              <IconBox color="#1F4E46">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="2" stroke="white" strokeWidth="2"/>
                </svg>
              </IconBox>
              <div>
                <h3 className="font-bold text-[16px] lg:text-[21.62px]" style={{ lineHeight: "33.63px", color: "#0F172B" }}>{t("leaderboard_title")}</h3>
                <p className="text-[13px] lg:text-[16.81px]" style={{ fontWeight: 400, color: "#45556C" }}>{t("leaderboard_sub")}</p>
              </div>
            </div>
            <Link href="/classement" className="flex items-center gap-1 hover:opacity-70 transition whitespace-nowrap text-[12px] lg:text-[16.81px]" style={{ fontWeight: 400, color: "#0F172B" }}>
              {t("view_top")}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          <div className="rounded-xl px-6 py-5 flex items-center justify-between mb-4" style={{ backgroundColor: "#1F4E4626" }}>
            <div>
              <p className="mb-1 text-[12px] lg:text-[16.81px]" style={{ fontWeight: 400, color: "#64748B" }}>{t("your_rank")}</p>
              {loading ? <Skeleton className="h-9 w-20" /> : (
                <p className="font-bold leading-none text-[26px] lg:text-[36px]" style={{ color: "#1F4E46" }}>
                  {rank != null && !isNaN(rank) ? `#${fmt(rank)}` : "—"}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="mb-1 text-[12px] lg:text-[16.81px]" style={{ fontWeight: 400, color: "#94A3B8" }}>{t("goal")}</p>
              <p className="font-bold text-[17px] lg:text-[21.62px]" style={{ color: "#000000" }}>Top 100</p>
            </div>
          </div>
          <p className="text-center text-[12px] lg:text-[16.81px]" style={{ fontWeight: 400, color: "#45556C" }}>
            {t("leaderboard_tip")}
          </p>
        </Card>

        {/* ── Transactions récentes ── */}
        <Card className="mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-start gap-4">
              <IconBox color="#1F4E46">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </IconBox>
              <div>
                <h3 className="font-bold text-[16px] lg:text-[21.62px]" style={{ lineHeight: "33.63px", color: "#0F172B" }}>{t("tx_title")}</h3>
                <p className="text-[13px] lg:text-[16.81px]" style={{ fontWeight: 400, color: "#45556C" }}>{t("tx_sub")}</p>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-6">{t("tx_empty")}</p>
          ) : (
            <div>
              {transactions.map((tx, i) => (
                <TxRow key={tx.id ?? i} tx={tx} last={i === transactions.length - 1} />
              ))}
            </div>
          )}
        </Card>

        {/* ── Conseil du jour ── */}
        <div className="bg-primary rounded-3xl px-8 py-7 flex items-start gap-5">
          <div className="w-10 h-10 shrink-0 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 12v10H4V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 7H2v5h20V7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-white font-bold mb-2 text-[15px] lg:text-[19.22px]" style={{ lineHeight: "28.82px" }}>{t("tip_title")}</h3>
            <p className="text-white mb-4 text-[13px] lg:text-[16.81px]" style={{ lineHeight: "24.02px", fontWeight: 400 }}>
              {t("tip_desc")}
            </p>
            <div className="flex flex-wrap gap-2">
              {[t("tag_daily"), t("tag_referral"), t("tag_progress")].map((tag) => (
                <span key={tag} className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full text-[11px] lg:text-[14.41px]" style={{ fontWeight: 400 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

      </Container>

      {showModal && (
        <CollecteModal
          onClose={() => setShowModal(false)}
          onCollected={(newBalance) => setLocalBalance(Number(newBalance))}
        />
      )}
    </div>
  );
}
