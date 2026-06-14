"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Container from "./Container";
import NotificationBell from "./NotificationBell";
import { useAuth } from "@/context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const prefix = locale === "fr" ? "/fr" : "";

  const navLinks = [
    { label: t("home"),        href: `${prefix}/` },
    { label: t("collect"),     href: `${prefix}/collecter` },
    { label: t("formations"),  href: `${prefix}/formations` },
    { label: t("bonus"),       href: `${prefix}/bonus` },
    { label: t("leaderboard"), href: `${prefix}/classement` },
  ];

  useEffect(() => {
    document.body.style.overflow = (open || confirmLogout) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, confirmLogout]);

  async function handleLogout() {
    setOpen(false);
    setConfirmLogout(false);
    await logout();
    window.location.href = prefix + "/";
  }

  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "?";

  return (
    <>
      <nav className="sticky top-0 left-0 w-full z-50 py-5" style={{ backgroundColor: "#1F4E46" }}>
        <Container>
          <div className="flex items-center justify-between gap-12">
            {/* Logo */}
            <Link href={`${prefix}/`} className="shrink-0" onClick={() => setOpen(false)}>
              <Image src="/images/logo Sunaala.png" alt="SUNALA" width={130} height={34} className="object-contain" priority />
            </Link>

            {/* Nav links — desktop */}
            <div className="hidden lg:flex items-center gap-6 text-white text-[15px] font-normal">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="font-normal hover:text-secondary transition-colors whitespace-nowrap cursor-pointer">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth buttons + switcher — desktop */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <LanguageSwitcher />
              {isAuthenticated ? (
                <>
                  <NotificationBell />
                  <Link href={`${prefix}/profil`}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-[15px] font-semibold transition-colors hover:bg-white/10">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-[12px] font-bold shrink-0">
                      {initials}
                    </div>
                    {user?.firstName ?? t("profile")}
                  </Link>
                  <button onClick={() => setConfirmLogout(true)}
                    className="px-5 py-2.5 rounded-full text-white text-[14px] font-semibold transition-colors hover:bg-white/10 cursor-pointer border border-white/20">
                    {t("logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link href={`${prefix}/login`}
                    className="px-8 py-3 rounded-full text-white text-[15px] font-semibold transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.10)" }}>
                    {t("login")}
                  </Link>
                  <span className="h-7 w-px bg-white/30" aria-hidden="true" />
                  <Link href={`${prefix}/register`}
                    className="px-8 py-3 rounded-full text-white text-[15px] font-semibold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#E6B84C" }}>
                    {t("register")}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              aria-label={open ? t("closeMenu") : t("openMenu")}
              aria-expanded={open}
              className="lg:hidden text-white cursor-pointer shrink-0 z-50 relative"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </Container>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-x-0 top-0 z-40 flex flex-col lg:hidden transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "#1F4E46" }}
        aria-hidden={!open}
      >
        <div className="h-20 shrink-0" />
        <nav className="flex flex-col px-6 py-4 gap-1 overflow-y-auto">
          {navLinks.map((link, i) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className="text-white text-[15px] font-semibold py-2.5 border-b border-white/10 hover:opacity-75"
              style={{ transitionDelay: open ? `${i * 50}ms` : "0ms" }}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3 px-6 py-4 pb-6">
          <div className="pb-2"><LanguageSwitcher /></div>
          {isAuthenticated ? (
            <>
              <Link href={`${prefix}/profil`} onClick={() => setOpen(false)}
                className="w-full text-center py-3 rounded-full text-white text-[14px] font-semibold"
                style={{ backgroundColor: "rgba(255,255,255,0.10)" }}>
                {t("profile")}
              </Link>
              <button onClick={() => { setOpen(false); setConfirmLogout(true); }}
                className="w-full text-center py-3 rounded-full text-white text-[14px] font-semibold border border-white/20 cursor-pointer">
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link href={`${prefix}/login`} onClick={() => setOpen(false)}
                className="w-full text-center py-3 rounded-full text-white text-[14px] font-semibold"
                style={{ backgroundColor: "rgba(255,255,255,0.10)" }}>
                {t("login")}
              </Link>
              <Link href={`${prefix}/register`} onClick={() => setOpen(false)}
                className="w-full text-center py-3 rounded-full text-white text-[14px] font-semibold"
                style={{ backgroundColor: "#E6B84C" }}>
                {t("register")}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Modal confirmation déconnexion */}
      {confirmLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FFF1F2" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[17px] font-bold mb-1" style={{ color: "#0F172B" }}>{t("logoutModal.title")}</p>
              <p className="text-[14px]" style={{ color: "#45556C" }}>{t("logoutModal.message")}</p>
            </div>
            <div className="flex gap-3 w-full mt-1">
              <button onClick={() => setConfirmLogout(false)}
                className="flex-1 py-3 rounded-xl text-[14px] font-semibold border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                style={{ color: "#45556C" }}>
                {t("logoutModal.cancel")}
              </button>
              <button onClick={handleLogout}
                className="flex-1 py-3 rounded-xl text-white text-[14px] font-semibold hover:brightness-90 transition cursor-pointer"
                style={{ backgroundColor: "#E11D48" }}>
                {t("logoutModal.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
