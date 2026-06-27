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

  const publicNavLinks = [
    { label: t("home"),           href: `${prefix}/` },
    { label: t("about"),          href: `${prefix}/about` },
    { label: t("understand_snl"), href: `${prefix}/snl` },
  ];

  const privateNavLinks = [
    { label: t("home"),        href: `${prefix}/` },
    { label: t("collect"),     href: `${prefix}/collecter` },
    { label: t("bonus"),       href: `${prefix}/bonus` },
    { label: t("leaderboard"), href: `${prefix}/classement` },
    { label: t("formations"),  href: `${prefix}/formations` },
  ];

  const navLinks = isAuthenticated ? privateNavLinks : publicNavLinks;

  useEffect(() => {
    document.body.style.overflow = confirmLogout ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [confirmLogout]);

  async function handleLogout() {
    setConfirmLogout(false);
    await logout();
    window.location.href = prefix + "/";
  }

  const initials =
    user?.username?.[0]?.toUpperCase() ??
    user?.firstName?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "?";
  const [avatarError, setAvatarError] = useState(false);

  return (
    <>
      <nav className="sticky top-0 left-0 w-full z-50" style={{ backgroundColor: "#1F4E46", paddingTop: "max(12px, env(safe-area-inset-top))" }}>

        {/* ── Top bar ── */}
        <div className="max-w-[1280px] mx-auto px-4 lg:px-16 pb-3 lg:pb-5">
          <div className="flex items-center gap-2 lg:gap-12">

            {/* Logo */}
            <Link href={`${prefix}/`} className="shrink-0">
              <Image
                src="/images/logo Sunaala.png"
                alt="SUNALA"
                width={130}
                height={34}
                className="object-contain w-[90px] lg:w-[130px]"
                priority
              />
            </Link>

            {/* Nav links — desktop only */}
            <div className="hidden lg:flex items-center gap-6 text-white flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[15px] font-normal hover:text-secondary transition-colors whitespace-nowrap cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 lg:gap-3 shrink-0 ml-auto">

              {/* Language switcher — desktop only */}
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>

              {isAuthenticated ? (
                <>
                  {/* Admin badge — desktop only */}
                  {user?.role?.toLowerCase().includes("admin") && (
                    <Link
                      href="/admin"
                      className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors"
                      style={{ backgroundColor: "rgba(230,184,76,0.18)", color: "#E6B84C", border: "1px solid rgba(230,184,76,0.35)" }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Admin
                    </Link>
                  )}

                  {/* Bell — always visible */}
                  <NotificationBell />

                  {/* Avatar — desktop: with username; mobile: circle only */}
                  <Link
                    href={`${prefix}/profil`}
                    className="flex items-center gap-2 px-2 lg:px-4 py-2 rounded-full text-white hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-[12px] font-bold shrink-0 overflow-hidden">
                      {user?.profileImage
                        ? (avatarError
                            ? initials
                            : <img src={user.profileImage} alt={initials} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={() => setAvatarError(true)} />)
                        : initials}
                    </div>
                    <span className="hidden lg:inline text-[15px] font-semibold">
                      {user?.username ?? user?.firstName ?? t("profile")}
                    </span>
                  </Link>

                  {/* Logout — desktop only */}
                  <button
                    onClick={() => setConfirmLogout(true)}
                    className="hidden lg:flex items-center justify-center px-5 py-2.5 rounded-full text-white transition-colors hover:bg-white/10 cursor-pointer border border-white/20 text-[14px] font-semibold"
                  >
                    {t("logout")}
                  </button>
                </>
              ) : (
                <>
                  {/* Mobile: compact login pill */}
                  <Link
                    href={`${prefix}/login`}
                    className="lg:hidden px-4 py-2 rounded-full text-white text-[13px] font-semibold transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
                  >
                    {t("login")}
                  </Link>

                  {/* Desktop auth buttons */}
                  <Link
                    href={`${prefix}/login`}
                    className="hidden lg:block px-8 py-3 rounded-full text-white text-[15px] font-semibold transition-colors whitespace-nowrap"
                    style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href={`${prefix}/register`}
                    className="hidden lg:block px-8 py-3 rounded-full text-white text-[15px] font-semibold transition-opacity hover:opacity-90 whitespace-nowrap"
                    style={{ backgroundColor: "#E6B84C" }}
                  >
                    {t("register")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Mobile nav row — horizontal scroll ── */}
        <div
          className="lg:hidden overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-t"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-center px-2 pb-1 pt-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2.5 text-[14px] font-medium whitespace-nowrap transition-colors shrink-0 cursor-pointer"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {link.label}
              </Link>
            ))}

            {/* Séparateur */}
            <span className="shrink-0 w-px h-5 mx-2" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} />

            {/* Language switcher */}
            <div className="shrink-0 px-1">
              <LanguageSwitcher />
            </div>

            {isAuthenticated ? (
              /* Logout */
              <button
                onClick={() => setConfirmLogout(true)}
                className="flex items-center gap-1.5 px-3 py-2 ml-1 rounded-full text-[13px] font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                style={{ color: "#FDA4AF", backgroundColor: "rgba(253,164,175,0.12)" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t("logout")}
              </button>
            ) : (
              /* S'inscrire */
              <Link
                href={`${prefix}/register`}
                className="px-4 py-2 my-0.5 ml-1 rounded-full text-[13px] font-semibold whitespace-nowrap shrink-0"
                style={{ backgroundColor: "#E6B84C", color: "white" }}
              >
                {t("register")}
              </Link>
            )}
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
