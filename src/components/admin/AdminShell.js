"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";

export default function AdminShell({ active, title, backHref = "/admin", headerRight, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar active={active} mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="w-full min-w-0 flex flex-col min-h-screen lg:ml-[260px]">

        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-4 lg:px-8 py-4 flex items-center gap-3 sticky top-0 z-10">
          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden text-slate-400 hover:text-slate-600 transition shrink-0 cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* X — desktop only */}
          <Link href={backHref} className="hidden lg:block text-slate-400 hover:text-slate-600 transition shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Link>

          <h1 className="text-[16px] font-bold flex-1 truncate" style={{ color: "#0F172B" }}>{title}</h1>

          {headerRight && <div className="shrink-0">{headerRight}</div>}
        </header>

        {/* Content */}
        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
