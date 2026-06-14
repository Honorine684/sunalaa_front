"use client";

import { useState, useEffect } from "react";
import { levelsApi } from "@/lib/api";

export default function FilterTabs({ onFilterChange, onSearch, search = "" }) {
  const [active, setActive] = useState("All");
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    levelsApi.getAll()
      .then((res) => {
        const body = res.data?.data ?? res.data;
        const raw  = Array.isArray(body) ? body : (body?.data ?? []);
        const sorted = [...raw].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setLevels(sorted);
      })
      .catch(() => {});
  }, []);

  const tabs = ["All", ...levels.map((l) => l.name)];

  function handleClick(tab) {
    setActive(tab);
    onFilterChange?.(tab);
  }

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      {/* Tabs niveaux */}
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

      {/* Barre de recherche à la place du bouton Filtre */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch?.(e.target.value)}
          placeholder="Search for a user…"
          className="pl-9 pr-8 py-3 rounded-lg border border-gray-200 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-secondary/40 transition bg-white w-56 lg:w-64"
        />
        {search && (
          <button
            onClick={() => onSearch?.("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
