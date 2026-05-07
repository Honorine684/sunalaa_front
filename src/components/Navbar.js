"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Container from "./Container";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Collecter", href: "/collecter" },
  { label: "Formations", href: "/formations" },
  { label: "Bonus & Récompenses", href: "/bonus" },
  { label: "Classement", href: "/classement" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className="sticky top-0 left-0 w-full z-50 py-5" style={{ backgroundColor: "#1F4E46" }}>
        <Container>
          <div className="flex items-center justify-between gap-12">
            {/* Logo */}
            <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
              <Image
                src="/images/logo Sunaala.png"
                alt="SUNALA"
                width={130}
                height={34}
                className="object-contain"
                priority
              />
            </Link>

            {/* Nav links — desktop */}
            <div className="hidden lg:flex items-center gap-6 text-white text-[15px] font-normal">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-normal hover:text-secondary transition-colors whitespace-nowrap cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth buttons — desktop */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <Link
                href="/login"
                className="px-8 py-3 rounded-full text-white text-[15px] font-semibold transition-colors"
                style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
              >
                Login
              </Link>
              <span className="h-7 w-px bg-white/30" aria-hidden="true" />
              <Link
                href="/register"
                className="px-8 py-3 rounded-full text-white text-[15px] font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#E6B84C" }}
              >
                Register
              </Link>
            </div>

            {/* Mobile hamburger / close */}
            <button
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              className="lg:hidden text-white cursor-pointer shrink-0 z-50 relative"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                /* X icon */
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                /* Hamburger icon */
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </Container>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-x-0 top-0 z-40 flex flex-col lg:hidden transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "#1F4E46" }}
        aria-hidden={!open}
      >
        {/* Spacer for navbar height */}
        <div className="h-20 shrink-0" />

        {/* Links */}
        <nav className="flex flex-col px-6 py-4 gap-1 overflow-y-auto">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-white text-[15px] font-semibold py-2.5 border-b border-white/10 transition-opacity hover:opacity-75"
              style={{
                transitionDelay: open ? `${i * 50}ms` : "0ms",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="flex flex-col gap-3 px-6 py-4 pb-6">
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="w-full text-center py-3 rounded-full text-white text-[14px] font-semibold"
            style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
          >
            Login
          </Link>
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="w-full text-center py-3 rounded-full text-white text-[14px] font-semibold"
            style={{ backgroundColor: "#E6B84C" }}
          >
            Register
          </Link>
        </div>
      </div>
    </>
  );
}
