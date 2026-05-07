"use client";
import { useEffect, useState } from "react";

const LAUNCH_DATE = new Date("2026-10-01T00:00:00Z");

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function LaunchCountdown() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    function calc() {
      const diff = LAUNCH_DATE - Date.now();
      if (diff <= 0) return setTime(null);
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTime({ days, hours, mins, secs });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  const units = [
    { label: "Jours", value: pad(time.days) },
    { label: "Heures", value: pad(time.hours) },
    { label: "Minutes", value: pad(time.mins) },
    { label: "Secondes", value: pad(time.secs) },
  ];

  return (
    <div className="mt-10 flex flex-col items-center sm:items-start gap-3">
      <p className="text-white/60 text-[13px] font-medium tracking-widest uppercase">
        Lancement du token $SNL dans
      </p>
      <div className="flex items-center gap-3">
        {units.map(({ label, value }, i) => (
          <div key={label} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span className="font-black text-[28px] sm:text-[36px] leading-none text-white"
                style={{ fontVariantNumeric: "tabular-nums" }}>
                {value}
              </span>
              <span className="text-white/40 text-[10px] uppercase tracking-wider mt-1">{label}</span>
            </div>
            {i < units.length - 1 && (
              <span className="text-white/40 text-[24px] font-bold leading-none mb-3">:</span>
            )}
          </div>
        ))}
      </div>
      <p className="text-white/40 text-[12px] leading-relaxed">
        Après ce délai, les points accumulés seront convertis en $SNL. Chaque point compte.
      </p>
    </div>
  );
}
