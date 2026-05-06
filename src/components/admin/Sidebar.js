"use client";

import Link from "next/link";

const navLinks = [
  {
    id: "overview",
    label: "Vue d'ensemble",
    href: "/admin",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    id: "users",
    label: "Utilisateurs",
    href: "/admin/utilisateurs",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "points",
    label: "Points SNL",
    href: "/admin/points",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "stats",
    label: "Statistiques",
    href: "/admin/statistiques",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "exports",
    label: "Exports",
    href: "/admin/exports",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "notifications",
    label: "Notifications",
    href: "/admin/notifications",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "missions",
    label: "Missions",
    href: "/admin/missions",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
];

export default function Sidebar({ active = "overview", mobileOpen = false, onClose }) {
  return (
    <aside
      className={[
        "fixed top-0 left-0 h-screen w-[260px] flex flex-col z-30 transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      ].join(" ")}
      style={{ backgroundColor: "#1A3A2E" }}
    >
      {/* Header */}
      <div className="px-6 pt-7 pb-6 flex items-start justify-between">
        <div>
          <p className="text-white text-[20px] font-bold tracking-wide leading-none mb-1">SUNALAA</p>
          <p className="text-[12px] font-normal tracking-widest" style={{ color: "#90A1B9" }}>Administration</p>
        </div>
        {/* Close button — mobile only */}
        <button
          className="lg:hidden text-white/60 hover:text-white transition mt-1 cursor-pointer"
          onClick={onClose}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div className="mx-6 border-t border-white/10 mb-4" />

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = active === link.id;
          return (
            <Link
              key={link.id}
              href={link.href}
              onClick={onClose}
              className={[
                "flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-normal transition-all duration-200",
                isActive
                  ? "bg-secondary text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10",
              ].join(" ")}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer user */}
      <div className="mx-6 border-t border-white/10 mt-4 pt-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <span className="text-white text-[13px] font-bold">AD</span>
        </div>
        <div className="min-w-0">
          <p className="text-white text-[13px] font-bold leading-none mb-0.5 truncate">Admin</p>
          <p className="text-white/40 text-[11px] truncate">Super Utilisateur</p>
        </div>
      </div>

      {/* Voir le site + Déconnexion */}
      <div className="px-3 pb-5 pt-2 flex flex-col gap-1">
        <Link
          href="/"
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[14px] text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Voir le site
        </Link>
        <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-[14px] text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
