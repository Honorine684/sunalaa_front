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
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const prefix = locale === "fr" ? "/fr" : "";

  const navLinks = [
    { label: t("home"),        href: `${prefix}/` },
    { label: t("collect"),     href: `${prefix}/collecter` },
    { label: t("bonus"),       href: `${prefix}/bonus` },
    { label: t("leaderboard"), href: `${prefix}/classement` },
    { label: t("formations"),  href: `${prefix}/formations` },
  ];

  useEffect(() => {
    document.body.style.overflow = (confirmLogout || menuOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [confirmLogout, menuOpen]);

  async function handleLogout() {
    setConfirmLogout(false);
    setMenuOpen(false);
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
      <nav className="sticky top-0 left-0 w-full z-50 py-3 lg:py-5" style={{ backgroundColor: "#1F4E46" }}>
        <div className="max-w-[1280px] mx-auto px-4 lg:px-16">
          <div className="flex items-center gap-2 lg:gap-12">

            {/* Logo */}
            <Link href={`${prefix}/`} className="shrink-0" onClick={() => setMenuOpen(false)}>
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

                  {/* Avatar + name — desktop only */}
                  <Link
                    href={`${prefix}/profil`}
                    className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-white hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-[12px] font-bold shrink-0 overflow-hidden">
                      {user?.profileImage
                        ? (avatarError
                            ? initials
                            : <img src={user.profileImage} alt={initials} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={() => setAvatarError(true)} />)
                        : initials}
                    </div>
                    <span className="text-[15px] font-semibold">
                      {user?.username ?? user?.firstName ?? t("profile")}
                    </span>
                  </Link>

                  <button
                    onClick={() => setConfirmLogout(true)}
                    className="hidden lg:flex items-center justify-center px-5 py-2.5 rounded-full text-white transition-colors hover:bg-white/10 cursor-pointer border border-white/20 text-[14px] font-semibold"
                    title={t("logout")}
                  >
                    {t("logout")}
                  </button>
                </>
              ) : (
                <>
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

              {/* Hamburger — mobile only */}
              <button
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl text-white hover:bg-white/10 transition cursor-pointer"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Menu"
              >
                {menuOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                )}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t mt-3" style={{ borderColor: "rgba(255,255,255,0.1)", backgroundColor: "#1F4E46" }}>
            <div className="max-w-[1280px] mx-auto px-4 py-4 flex flex-col gap-1">

              {/* Nav links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-white text-[15px] font-medium hover:bg-white/10 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Divider */}
              <div className="my-2 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }} />

              {/* Auth section */}
              {isAuthenticated ? (
                <>
                  {user?.role?.toLowerCase().includes("admin") && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-[15px] font-medium transition-colors"
                      style={{ color: "#E6B84C" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Admin
                    </Link>
                  )}
                  <Link
                    href={`${prefix}/profil`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-white text-[15px] font-medium hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-[12px] font-bold shrink-0 overflow-hidden">
                      {user?.profileImage
                        ? (avatarError
                            ? initials
                            : <img src={user.profileImage} alt={initials} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={() => setAvatarError(true)} />)
                        : initials}
                    </div>
                    {user?.username ?? user?.firstName ?? t("profile")}
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); setConfirmLogout(true); }}
                    className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-[15px] font-medium hover:bg-white/10 transition-colors cursor-pointer w-full text-left"
                    style={{ color: "#FDA4AF" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {t("logout")}
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href={`${prefix}/login`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center py-3 rounded-xl text-white text-[15px] font-semibold transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href={`${prefix}/register`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center py-3 rounded-xl text-white text-[15px] font-semibold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#E6B84C" }}
                  >
                    {t("register")}
                  </Link>
                </div>
              )}

              {/* Divider */}
              <div className="my-2 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }} />

              {/* Language switcher */}
              <div className="px-3 py-2">
                <LanguageSwitcher />
              </div>

            </div>
          </div>
        )}
      </nav>

      {/* Overlay pour fermer le menu en cliquant en dehors */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

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
