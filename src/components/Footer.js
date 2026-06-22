"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Container from "./Container";
import { useLocale, useTranslations } from "next-intl";
import { newsletterApi } from "@/lib/api";

const SOCIALS = [
  {
    label: "Facebook",
    href: "#",
    bg: "#1877F2",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    bg: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
        <path d="M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    bg: "#000000",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
      </svg>
    ),
  },
  {
    label: "Telegram",
    href: "https://t.me/+bjyNFGSMyMk1N2Rk",
    bg: "#229ED9",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
  {
    label: "Discord",
    href: "#",
    bg: "#5865F2",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
  },
];


function FootCol({ title, links }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: "#E6B84C" }}>
        {title}
      </p>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-[13px] transition-colors flex items-center gap-2"
              style={{ color: "rgba(255,255,255,0.55)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            >
              {l.label}
              {l.soon && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#E6B84C22", color: "#E6B84C", border: "1px solid #E6B84C44" }}>
                  {l.soon}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const locale = useLocale();
  const prefix = locale === "fr" ? "/fr" : "";

  const t = useTranslations("Footer");
  const [email, setEmail]     = useState("");
  const [subDone, setSubDone] = useState(false);
  useEffect(() => {
    try { if (localStorage.getItem("snl_newsletter_sub") === "1") setSubDone(true); } catch {}
  }, []);

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await newsletterApi.subscribe(email.trim());
    } catch {
      // silent — don't block the UX on network error
    }
    try { localStorage.setItem("snl_newsletter_sub", "1"); } catch {}
    setSubDone(true);
  }

  return (
    <footer style={{ backgroundColor: "#060e0d" }}>
      {/* ── Main grid ── */}
      <Container className="py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand — span 2 on large */}
          <div className="sm:col-span-2 lg:col-span-2 flex flex-col gap-5">
            <Image src="/images/logo Sunaala.png" alt="SUNALA" width={120} height={32} className="object-contain" />
            <p className="text-[13px] leading-relaxed max-w-[240px]" style={{ color: "rgba(255,255,255,0.45)" }}>
              {t("brand_desc")}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 flex-wrap">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-opacity hover:opacity-85 cursor-pointer shrink-0"
                  style={{ background: s.bg }}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Newsletter — desktop only (mobile version is in the last column) */}
            <div className="hidden lg:flex flex-col gap-3 mt-1">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: "#E6B84C" }}>
                {t("section_newsletter")}
              </p>
              <div
                className="flex flex-col gap-3 rounded-xl p-4 max-w-[280px]"
                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div>
                  <p className="text-[13px] font-semibold text-white mb-0.5">{t("newsletter_title")}</p>
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.40)" }}>{t("newsletter_sub")}</p>
                </div>
                {subDone ? (
                  <p className="text-[12px] font-semibold" style={{ color: "#3FAE8C" }}>✓ {t("newsletter_done")}</p>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("newsletter_placeholder")}
                      className="flex-1 min-w-0 text-[12px] rounded-lg px-3 outline-none"
                      style={{ height: 36, backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.10)", color: "#ffffff" }}
                    />
                    <button
                      type="submit"
                      className="shrink-0 font-bold text-[12px] px-3 rounded-lg transition-opacity hover:opacity-90 cursor-pointer"
                      style={{ height: 36, backgroundColor: "#3FAE8C", color: "#ffffff" }}
                    >
                      {t("newsletter_btn")}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Plateforme */}
          <FootCol title={t("section_platform")} links={[
            { label: t("nav_home"),       href: `${prefix}/` },
            { label: t("nav_collect"),    href: `${prefix}/collecter` },
            { label: t("nav_formations"), href: `${prefix}/formations` },
            { label: t("nav_classement"), href: `${prefix}/classement` },
            { label: t("nav_parrainage"), href: `${prefix}/bonus` },
            { label: t("nav_snl"),        href: `${prefix}/snl` },
            { label: t("nav_partner"),    href: `${prefix}/partenaire` },
          ]} />

          {/* Le Projet */}
          <FootCol title={t("section_project")} links={[
            { label: t("proj_about"),      href: "#" },
            { label: t("proj_vision"),     href: "#" },
            { label: t("proj_whitepaper"), href: "#", soon: t("soon") },
            { label: t("proj_roadmap"),    href: "#" },
            { label: t("proj_token"),      href: `${prefix}/snl/valeur` },
            { label: t("proj_blog"),       href: "#" },
          ]} />

          {/* Légal + Newsletter */}
          <div className="flex flex-col gap-8">
            <FootCol title={t("section_legal")} links={[
              { label: t("legal_mentions"), href: "#" },
              { label: t("legal_cgu"),      href: "#" },
              { label: t("legal_privacy"),  href: "#" },
              { label: t("legal_cookies"),  href: "#" },
              { label: t("legal_risk"),     href: "#" },
              { label: t("legal_contact"),  href: "#" },
            ]} />

            {/* Newsletter — mobile only (desktop version is in brand column) */}
            <div className="flex flex-col gap-3 lg:hidden">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: "#E6B84C" }}>
                {t("section_newsletter")}
              </p>
              <div
                className="flex flex-col gap-3 rounded-xl p-4"
                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div>
                  <p className="text-[13px] font-semibold text-white mb-0.5">{t("newsletter_title")}</p>
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                    {t("newsletter_sub")}
                  </p>
                </div>
                {subDone ? (
                  <p className="text-[12px] font-semibold" style={{ color: "#3FAE8C" }}>✓ {t("newsletter_done")}</p>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("newsletter_placeholder")}
                      className="w-full text-[12px] rounded-lg px-3 outline-none"
                      style={{
                        height: 38,
                        backgroundColor: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        color: "#ffffff",
                      }}
                    />
                    <button
                      type="submit"
                      className="w-full font-bold text-[12px] rounded-lg transition-opacity hover:opacity-90 cursor-pointer"
                      style={{ height: 36, backgroundColor: "#3FAE8C", color: "#ffffff" }}
                    >
                      {t("newsletter_btn")}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* ── Legal disclaimer ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Container className="py-6">
          <div
            className="flex gap-4 rounded-xl p-4 sm:p-5"
            style={{ backgroundColor: "rgba(230,184,76,0.06)", border: "1px solid rgba(230,184,76,0.18)" }}
          >
            <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              <span className="font-semibold" style={{ color: "#E6B84C" }}>{t("disclaimer_bold")} </span>
              {t("disclaimer_text")}
            </p>
          </div>
        </Container>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Container className="py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            {t("bar_copyright")}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {[
              { key: "bar_mentions", href: "#" },
              { key: "bar_cgu",      href: "#" },
              { key: "bar_privacy",  href: "#" },
              { key: "bar_cookies",  href: "#" },
              { key: "bar_sitemap",  href: "/sitemap.xml" },
            ].map((l) => (
              <a key={l.key} href={l.href} className="text-[11px] hover:text-white/50 transition-colors" style={{ color: "rgba(255,255,255,0.25)" }}>
                {t(l.key)}
              </a>
            ))}
          </div>
          {/* Locale switcher */}
          <div className="flex items-center gap-2">
            <span className="text-[14px]">🌐</span>
            <a href={locale === "fr" ? "/" : "/fr"}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.10)" }}
            >
              {locale === "fr" ? "FR" : "EN"}
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
