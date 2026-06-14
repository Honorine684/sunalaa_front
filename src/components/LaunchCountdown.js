"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const LAUNCH_DATE = new Date("2026-10-01T00:00:00Z");

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function LaunchCountdown() {
  const t = useTranslations("LaunchCountdown");
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
    { labelKey: "days", value: pad(time.days) },
    { labelKey: "hours", value: pad(time.hours) },
    { labelKey: "minutes", value: pad(time.mins) },
    { labelKey: "seconds", value: pad(time.secs) },
  ];

  return (
    <div className="mt-10 flex flex-col items-center sm:items-start gap-3">
      <p className="text-white/60 text-[13px] font-medium tracking-widest uppercase">
        {t("label")}
      </p>
      <div className="flex items-center gap-3">
        {units.map(({ labelKey, value }, i) => (
          <div key={labelKey} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span className="font-black text-[28px] sm:text-[36px] leading-none text-white"
                style={{ fontVariantNumeric: "tabular-nums" }}>
                {value}
              </span>
              <span className="text-white/40 text-[10px] uppercase tracking-wider mt-1">{t(labelKey)}</span>
            </div>
            {i < units.length - 1 && (
              <span className="text-white/40 text-[24px] font-bold leading-none mb-3">:</span>
            )}
          </div>
        ))}
      </div>
      <p className="text-white/40 text-[12px] leading-relaxed">
        {t("description")}
      </p>
    </div>
  );
}
