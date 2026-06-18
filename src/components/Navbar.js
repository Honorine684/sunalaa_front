"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import NotificationBell from "./NotificationBell";
import { useAuth } from "@/context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
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
    document.body.style.overflow = confirmLogout ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [confirmLogout]);

  async function handleLogout() {
    setConfirmLogout(false);
    await logout();
    window.location.href = prefix + "/";
  }

  const initials = user?.username?.[0]?.toUpperCase()
    || ([user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join("").toUpperCase())
    || "?";

  return (
    <>
      <nav className="sticky top-0 left-0 w-full z-50 py-3 lg:py-5" style={{ backgroundColor: "#1F4E46" }}>
        <div className="max-w-[1280px] mx-auto px-3 lg:px-16">
          <div className="flex items-center gap-2 lg:gap-12">

            {/* Logo */}
            <Link href={`${prefix}/`} className="shrink-0">
              <Image
                src="/images/logo Sunaala.png"
                alt="SUNALA"
                width={130}
                height={34}
                className="object-contain w-[82px] lg:w-[130px]"
                priority
              />
            </Link>

            {/* Nav links — scrollable on mobile */}
            <div className="flex items-center gap-3 lg:gap-6 text-white flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[10px] lg:text-[15px] font-normal hover:text-secondary transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth + LanguageSwitcher */}
            <div className="flex items-center gap-1.5 lg:gap-3 shrink-0">

              <div className="hidden lg:block"><LanguageSwitcher /></div>

              {isAuthenticated ? (
                <>
                  <NotificationBell />
                  <Link
                    href={`${prefix}/profil`}
                    className="flex items-center gap-1.5 lg:gap-2 px-1.5 lg:px-4 py-1 lg:py-2 rounded-full text-white hover:bg-white/10 transition-colors"
                  >
                    <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-secondary flex items-center justify-center text-white text-[9px] lg:text-[12px] font-bold shrink-0">
                      {initials}
                    </div>
                    <span className="hidden lg:inline text-[15px] font-semibold">
                      {user?.username ?? user?.firstName ?? t("profile")}
                    </span>
                  </Link>
                  {/* Logout — desktop only, mobile handled in profil page */}
                  <button
                    onClick={() => setConfirmLogout(true)}
                    className="hidden lg:flex items-center justify-center lg:px-5 lg:py-2.5 rounded-full text-white transition-colors hover:bg-white/10 cursor-pointer border border-white/20 text-[14px] font-semibold"
                    title={t("logout")}
                  >
                    {t("logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`${prefix}/login`}
                    className="px-3 lg:px-8 py-1.5 lg:py-3 rounded-full text-white text-[10px] lg:text-[15px] font-semibold transition-colors whitespace-nowrap"
                    style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href={`${prefix}/register`}
                    className="px-3 lg:px-8 py-1.5 lg:py-3 rounded-full text-white text-[10px] lg:text-[15px] font-semibold transition-opacity hover:opacity-90 whitespace-nowrap"
                    style={{ backgroundColor: "#E6B84C" }}
                  >
                    {t("register")}
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      </nav>

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
              <button
                onClick={() => setConfirmLogout(false)}
                className="flex-1 py-3 rounded-xl text-[14px] font-semibold border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                style={{ color: "#45556C" }}
              >
                {t("logoutModal.cancel")}
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl text-white text-[14px] font-semibold hover:brightness-90 transition cursor-pointer"
                style={{ backgroundColor: "#E11D48" }}
              >
                {t("logoutModal.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
