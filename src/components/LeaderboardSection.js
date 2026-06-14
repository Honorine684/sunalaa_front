"use client";

import { useState, useEffect, useRef } from "react";
import Container from "./Container";
import FilterTabs from "./FilterTabs";
import LeaderboardTable from "./LeaderboardTable";

export default function LeaderboardSection() {
  const [search, setSearch]             = useState("");
  const [debouncedSearch, setDebounced] = useState("");
  const [levelFilter, setLevelFilter]   = useState("All");
  const debounceRef = useRef(null);

  function handleSearch(val) {
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebounced(val), 400);
  }

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return (
    <section className="bg-white py-16 relative overflow-hidden">
      <img src="/images/mode.png" alt="" aria-hidden="true" className="absolute select-none pointer-events-none"
        style={{ width: 280, height: 320, objectFit: "fill", opacity: 0.4, left: -20, top: "14%", filter: "grayscale(1) brightness(0)", zIndex: 0 }} />
      <img src="/images/mode.png" alt="" aria-hidden="true" className="absolute select-none pointer-events-none"
        style={{ width: 280, height: 320, objectFit: "fill", opacity: 0.4, left: -10, bottom: "2%", filter: "grayscale(1) brightness(0)", zIndex: 0 }} />
      <img src="/images/mode.png" alt="" aria-hidden="true" className="absolute select-none pointer-events-none"
        style={{ width: 300, height: 360, objectFit: "fill", opacity: 0.35, right: -60, top: "20%", filter: "grayscale(1) brightness(0)", zIndex: 20 }} />

      <Container className="relative z-10 space-y-6">
        <FilterTabs
          onFilterChange={setLevelFilter}
          onSearch={handleSearch}
          search={search}
        />
        <LeaderboardTable search={debouncedSearch} levelFilter={levelFilter} />
      </Container>
    </section>
  );
}
