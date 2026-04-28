"use client";

import { useState } from "react";

const tabs = ["Tout", "Diamond", "Platinum", "Gold", "Sylver", "Bronze"];

export default function FilterTabs({ onFilterChange }) {
  const [active, setActive] = useState("Tout");

  const handleClick = (tab) => {
    setActive(tab);
    onFilterChange?.(tab);
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      {/* Tabs */}
      <div className="flex items-center bg-[#2a1a0a] rounded-lg overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleClick(tab)}
            className={`px-3 lg:px-5 py-2 lg:py-3 text-[12px] lg:text-[14px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              active === tab
                ? "bg-secondary text-white rounded-lg"
                : "text-white/70 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filtre button */}
      <button className="flex items-center gap-2 bg-[#111] text-white font-bold text-[15px] px-6 py-3 rounded-lg hover:bg-[#222] transition cursor-pointer">
        Filtre
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 9l6 6 6-6"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
