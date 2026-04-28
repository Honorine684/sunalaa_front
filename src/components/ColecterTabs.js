"use client";

import { useState } from "react";
import HomeDashboard from "./HomeDashboard";
import FormationsContent from "./FormationsContent";

export default function ColecterTabs() {
  const [active, setActive] = useState("collecter");

  return (
    <div className="bg-white">
      {/* Tab bar */}
      <div className="border-b border-slate-100 bg-white sticky top-0 z-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16 flex gap-1 pt-4">
          {[
            {
              id: "collecter",
              label: "Collecter",
              icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
            },
            {
              id: "formations",
              label: "Formations",
              icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={[
                "flex items-center gap-2 px-6 py-3 text-[14px] font-normal border-b-2 transition-colors cursor-pointer",
                active === tab.id
                  ? "border-secondary text-secondary"
                  : "border-transparent text-slate-400 hover:text-slate-600",
              ].join(" ")}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {active === "collecter" ? <HomeDashboard /> : <FormationsContent />}
    </div>
  );
}
