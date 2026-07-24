"use client";

import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Container from "./Container";
import { missionsApi } from "@/lib/api";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";

const PLATFORM_COLORS = {
  telegram:  "#1A3C34",
  twitter:   "#1A3C34",
  youtube:   "#FF0000",
  discord:   "#5865F2",
  facebook:  "#1877F2",
  instagram: "#E1306C",
  whatsapp:  "#25D366",
};

const PLATFORM_ICONS = {
  telegram: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  ),
  twitter: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
  ),
  youtube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  ),
  discord: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
    </svg>
  ),
  facebook: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
    </svg>
  ),
  whatsapp: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
    </svg>
  ),
};

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function Spinner({ color = "currentColor" }) {
  return (
    <svg className="animate-spin shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="3" strokeDasharray="40 20"/>
    </svg>
  );
}

/* ── Media popup modal ── */
function MediaModal({ mission, remaining, timerDone, busy, onClaim, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: "rgba(0,0,0,0.95)" }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <p className="text-white font-semibold text-[15px] truncate pr-4">{mission.title}</p>
        <button
          onClick={onClose}
          className="shrink-0 w-11 h-11 flex items-center justify-center rounded-full active:bg-white/20 transition"
          style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Media — scrollable zone */}
      <div className="flex-1 flex items-center justify-center px-4 overflow-hidden">
        {mission.contentType === "VIDEO" ? (
          <video
            src={mission.contentUrl}
            controls
            autoPlay
            playsInline
            className="rounded-xl w-full"
            style={{ maxWidth: 720, maxHeight: "60vh", backgroundColor: "#000", display: "block" }}
          />
        ) : (
          <img
            src={mission.contentUrl}
            alt={mission.title}
            className="rounded-xl"
            style={{ maxWidth: "min(100%, 720px)", maxHeight: "60vh", objectFit: "contain", display: "block" }}
          />
        )}
      </div>

      {/* Bottom bar — timer / claim / close */}
      <div className="shrink-0 px-4 pb-8 pt-4 flex flex-col gap-3" style={{ maxWidth: 480, width: "100%", margin: "0 auto" }}>
        {/* Progress bar */}
        {!timerDone && (
          <div className="relative h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(100, ((mission.timeRequired - remaining) / mission.timeRequired) * 100)}%`,
                backgroundColor: "#E6B84C",
              }}
            />
          </div>
        )}

        {timerDone ? (
          <button
            onClick={onClaim}
            disabled={busy}
            className="w-full py-4 rounded-2xl text-white text-[16px] font-bold hover:brightness-110 transition disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#3FAE8C" }}
          >
            {busy && <Spinner color="white" />}
            {busy ? "Vérification…" : "Réclamer les points"}
          </button>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-semibold" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Disponible dans{" "}
            <span className="tabular-nums font-bold" style={{ color: "#E6B84C" }}>{fmtTime(remaining)}</span>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl text-[15px] font-semibold transition active:opacity-70"
          style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}


function pad(n) { return String(n).padStart(2, "0"); }
function formatCountdown(ms) {
  if (ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function ResetBadge({ nextResetAt }) {
  const t = useTranslations("MissionsSection");
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    function tick() {
      const ms = new Date(nextResetAt) - Date.now();
      setCountdown(formatCountdown(ms));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nextResetAt]);

  return (
    <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2.5 rounded-full w-fit mx-auto"
      style={{ backgroundColor: "rgba(63,174,140,0.10)", border: "1px solid rgba(63,174,140,0.25)" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#3FAE8C" strokeWidth="2"/>
        <path d="M12 6v6l4 2" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <span className="text-[13px]" style={{ color: "#3FAE8C" }}>
        {t("reset_in")}{" "}
        <span className="font-bold tabular-nums">{countdown}</span>
      </span>
    </div>
  );
}

function MissionsSectionInner() {
  const t = useTranslations("MissionsSection");
  const { isAuthenticated, refreshUser } = useAuth();
  const searchParams = useSearchParams();
  const highlightId = searchParams?.get("mission") ?? null;

  const [missions, setMissions]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [loadingId, setLoadingId]           = useState(null);
  const [remainingTimes, setRemainingTimes] = useState({});
  const [mediaModalId, setMediaModalId]     = useState(null);
  const [nextResetAt, setNextResetAt]       = useState(null);

  const prevStatuses   = useRef({});
  const missionRefs    = useRef({});
  const timerRef       = useRef(null);
  const mediaModalIdRef = useRef(null);

  // Keep ref in sync so the interval closure can read current modal state
  useEffect(() => { mediaModalIdRef.current = mediaModalId; }, [mediaModalId]);

  /* ── Scroll to highlighted mission ── */
  useEffect(() => {
    if (!highlightId || loading) return;
    const el = missionRefs.current[highlightId];
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 400);
  }, [highlightId, loading]);

  /* ── Countdown timer for PENDING missions with timeRequired ── */
  useEffect(() => {
    const pending = missions.filter((m) => m.userStatus === "PENDING" && m.timeRequired > 0);

    if (timerRef.current) clearInterval(timerRef.current);

    if (pending.length === 0) {
      setRemainingTimes({});
      return;
    }

    // Init: prefer saved remaining (set on visibilitychange) over wall-clock recalc
    const initial = {};
    pending.forEach((m) => {
      try {
        const saved = localStorage.getItem(`snl_mission_remaining_${m.id}`);
        if (saved) {
          initial[m.id] = Math.max(0, Number(saved));
        } else {
          const startMs = localStorage.getItem(`snl_mission_start_${m.id}`)
            ? Number(localStorage.getItem(`snl_mission_start_${m.id}`))
            : m.startedAt ? new Date(m.startedAt).getTime() : Date.now();
          initial[m.id] = Math.max(0, m.timeRequired - (Date.now() - startMs) / 1000);
        }
      } catch {
        initial[m.id] = m.timeRequired;
      }
    });
    setRemainingTimes(initial);

    // Save remaining when tab goes hidden so iOS reload doesn't recalculate from startMs
    function onHide() {
      if (document.visibilityState !== "hidden") return;
      setRemainingTimes((current) => {
        Object.entries(current).forEach(([id, rem]) => {
          try { localStorage.setItem(`snl_mission_remaining_${id}`, String(rem)); } catch {}
        });
        return current;
      });
    }
    document.addEventListener("visibilitychange", onHide);
    // pagehide fires on iOS when page is unloaded (more reliable than visibilitychange)
    window.addEventListener("pagehide", onHide);

    const intervalId = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setRemainingTimes((prev) => {
        const next = { ...prev };
        let anyActive = false;
        Object.keys(next).forEach((id) => {
          if (next[id] > 0) {
            const mission = pending.find((m) => String(m.id) === String(id));
            const isMedia = mission?.contentType === "VIDEO" || mission?.contentType === "IMAGE";
            if (isMedia && String(mediaModalIdRef.current) !== String(id)) {
              anyActive = true;
              return;
            }
            next[id] = Math.max(0, next[id] - 1);
            // Keep saved remaining in sync
            try { localStorage.setItem(`snl_mission_remaining_${id}`, String(next[id])); } catch {}
            if (next[id] > 0) anyActive = true;
          }
        });
        if (!anyActive) clearInterval(intervalId);
        return next;
      });
    }, 1000);
    timerRef.current = intervalId;

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
    };
  }, [missions]);

  /* ── Data fetching ── */
  function applyMissions(list) {
    const newStatuses = Object.fromEntries(list.map((m) => [m.id, m.userStatus]));
    const justCompleted = list.some(
      (m) => m.userStatus === "COMPLETED" && prevStatuses.current[m.id] === "UNDER_REVIEW"
    );
    prevStatuses.current = newStatuses;
    setMissions(list);
    if (justCompleted) refreshUser().catch(() => {});
  }

  async function fetchMissions(silent = false) {
    if (!silent) setLoading(true);
    try {
      const res  = await missionsApi.getMyMissions();
      const body = res.data?.data ?? res.data;
      // New response: { data: [...], nextResetAt: "..." }
      const list = body?.data ?? (Array.isArray(body) ? body : []);
      applyMissions(Array.isArray(list) ? list : []);
      if (body?.nextResetAt) setNextResetAt(body.nextResetAt);
    } catch {
      if (!silent) setMissions([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) { setMissions([]); setLoading(false); return; }
    fetchMissions();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    function onVisible() {
      if (document.visibilityState === "visible") fetchMissions(true);
    }
    document.addEventListener("visibilitychange", onVisible);
    const hasUnderReview = missions.some((m) => m.userStatus === "UNDER_REVIEW");
    const interval = hasUnderReview ? setInterval(() => fetchMissions(true), 30_000) : null;
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated, missions]);

  /* ── Actions ── */
  async function handleStart(mission) {
    // LINK missions: open external URL
    if ((!mission.contentType || mission.contentType === "LINK") && mission.actionUrl) {
      window.open(mission.actionUrl, "_blank", "noopener");
    }
    // Store local startedAt for countdown
    if (mission.timeRequired) {
      try { localStorage.setItem(`snl_mission_start_${mission.id}`, Date.now()); } catch {}
    }
    setLoadingId(mission.id);
    try {
      await missionsApi.start(mission.id);
      setMissions((prev) =>
        prev.map((m) => m.id === mission.id ? { ...m, userStatus: "PENDING" } : m)
      );
      if (mission.contentType === "VIDEO" || mission.contentType === "IMAGE") {
        setMediaModalId(mission.id);
      }
    } catch {
      missionsApi.getMyMissions()
        .then((res) => { const raw = res.data?.data ?? res.data; if (Array.isArray(raw)) setMissions(raw); })
        .catch(() => {});
    } finally {
      setLoadingId(null);
    }
  }

  async function handleComplete(id) {
    setLoadingId(id);
    try {
      const res = await missionsApi.complete(id);
      const updated = res.data?.data ?? res.data;
      const newStatus = updated?.status ?? updated?.userStatus ?? "UNDER_REVIEW";
      setMissions((prev) => prev.map((m) => m.id === id ? { ...m, userStatus: newStatus } : m));
      try {
        localStorage.removeItem(`snl_mission_remaining_${id}`);
        localStorage.removeItem(`snl_mission_start_${id}`);
      } catch {}
      // Mission validée immédiatement (sans double validation) → mettre à jour le solde
      if (newStatus === "COMPLETED" || newStatus === "completed") {
        refreshUser().catch(() => {});
      }
    } catch (err) {
      // Backend says timer not done yet → resync remaining from server value
      const errCode = err?.response?.data?.error;
      if (errCode === "TIME_NOT_ELAPSED") {
        const secs = err?.response?.data?.secondsRemaining;
        if (secs) setRemainingTimes((prev) => ({ ...prev, [id]: Math.ceil(secs) }));
      }
    } finally {
      setLoadingId(null);
    }
  }

  /* ── Render ── */
  const modalMission = mediaModalId ? missions.find((m) => m.id === mediaModalId) : null;

  return (
    <section className="bg-white py-16 relative overflow-hidden">
      {/* Media popup */}
      {modalMission && (
        <MediaModal
          mission={modalMission}
          remaining={remainingTimes[modalMission.id] ?? 0}
          timerDone={!modalMission.timeRequired || (remainingTimes[modalMission.id] ?? 0) <= 0}
          busy={loadingId === modalMission.id}
          onClaim={async () => { await handleComplete(modalMission.id); setMediaModalId(null); }}
          onClose={() => setMediaModalId(null)}
        />
      )}
      <div className="absolute left-[13%] top-44.5 pointer-events-none select-none">
        {[338, 281, 224, 140].map((size) => (
          <div key={size} className="absolute rounded-full border border-secondary/25"
            style={{ width: size, height: size, left: -size / 2, top: -size / 2 }} />
        ))}
      </div>
      <div className="absolute right-[13%] top-50.5 pointer-events-none select-none">
        {[338, 281, 224, 140].map((size) => (
          <div key={size} className="absolute rounded-full border border-secondary/25"
            style={{ width: size, height: size, right: -size / 2, top: -size / 2 }} />
        ))}
      </div>

      <Container className="relative z-10">
        <div className="text-center mb-10">
          <h2 className="font-bold mb-4 text-[26px] lg:text-[48px]" style={{ lineHeight: "1.1", letterSpacing: "-0.33px", color: "#0F172B" }}>
            {t("title")}
          </h2>
          <p className="max-w-lg mx-auto text-center text-[14px] lg:text-[18px]" style={{ fontWeight: 400, lineHeight: "1.6", color: "#0F172B" }}>
            {t("subtitle")}
          </p>
          {nextResetAt && <ResetBadge nextResetAt={nextResetAt} />}
        </div>

        <p className="mb-5 text-[16px] lg:text-[24px]" style={{ fontWeight: 600, lineHeight: "1.4", color: "#0A3706" }}>
          {t("points_label")}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-100 p-4" style={{ minHeight: 170 }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
                  <div className="flex-1 flex flex-col gap-2 pt-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-10 bg-slate-200 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : missions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(63,174,140,0.12)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4M12 3a9 9 0 100 18A9 9 0 0012 3z" stroke="#3FAE8C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="font-semibold text-[18px]" style={{ color: "#0F172B" }}>{t("empty")}</p>
            <p className="text-[14px] max-w-xs" style={{ color: "#45556C" }}>{t("empty_sub")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {missions.filter((m) => m.userStatus !== "COMPLETED" && m.completed !== true).map((mission) => {
              const key      = mission.platform?.toLowerCase();
              const iconBg   = PLATFORM_COLORS[key] ?? "#1A3C34";
              const icon     = PLATFORM_ICONS[key]  ?? PLATFORM_ICONS.telegram;
              const status   = mission.userStatus ?? (mission.completed === true ? "COMPLETED" : null);
              const claimed  = status === "COMPLETED";
              const pending  = status === "PENDING";
              const inReview = status === "UNDER_REVIEW";
              const rejected = status === "REJECTED";
              const busy     = loadingId === mission.id;
              const isHighlighted = highlightId === String(mission.id);

              const isMedia    = mission.contentType === "VIDEO" || mission.contentType === "IMAGE";
              const remaining  = remainingTimes[mission.id] ?? 0;
              const timerDone  = !mission.timeRequired || remaining <= 0;
              const pct        = mission.timeRequired
                ? Math.min(100, ((mission.timeRequired - remaining) / mission.timeRequired) * 100)
                : 100;

              return (
                <div
                  key={mission.id}
                  ref={(el) => { missionRefs.current[mission.id] = el; }}
                  className="flex flex-col justify-between bg-white hover:scale-[1.01] transition-all duration-200"
                  style={{
                    minHeight: 170,
                    borderRadius: 8,
                    border: isHighlighted ? "2px solid #E6B84C" : "1px solid rgba(7,58,3,0.16)",
                    padding: 16,
                    gap: 12,
                    opacity: claimed ? 0.7 : 1,
                    boxShadow: isHighlighted ? "0 0 0 4px rgba(230,184,76,0.15)" : undefined,
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center shrink-0" style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: iconBg }}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[14px] sm:text-[20px]" style={{ fontWeight: 600, lineHeight: "22px", color: "#0F172B" }}>
                            {mission.title}
                          </p>
                          {/* Media type badge */}
                          {mission.contentType === "VIDEO" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              Vidéo
                            </span>
                          )}
                          {mission.contentType === "IMAGE" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(59,130,246,0.1)", color: "#3B82F6" }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/><polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              Image
                            </span>
                          )}
                        </div>
                        <div className={`relative w-6 h-6 sm:w-8 sm:h-8 shrink-0 ${claimed ? "opacity-40" : ""}`}>
                          <Image src="/images/4.png" alt="coins" fill className="object-contain" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-[12px] sm:text-[16px]" style={{ fontWeight: 400, lineHeight: "22.75px", color: "#45556C" }}>
                          {mission.description}
                        </p>
                        <span className="font-bold shrink-0 text-[14px] sm:text-[20px]" style={{ lineHeight: "21px", color: claimed ? "#CBD5E1" : "#0A3706" }}>
                          {mission.reward} SNL
                        </span>
                      </div>
                      {/* Time required badge (not yet started) */}
                      {!pending && !claimed && !inReview && mission.timeRequired > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] mt-1" style={{ color: "#94A3B8" }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          {mission.timeRequired >= 60
                            ? `${Math.round(mission.timeRequired / 60)} min requis`
                            : `${mission.timeRequired} sec requis`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Voir le contenu — shown when PENDING + media */}
                  {pending && isMedia && mission.contentUrl && (
                    <button
                      onClick={() => setMediaModalId(mission.id)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-medium transition hover:brightness-95"
                      style={{ backgroundColor: "rgba(31,78,70,0.07)", color: "#1F4E46", border: "1px solid rgba(31,78,70,0.15)" }}
                    >
                      {mission.contentType === "VIDEO" ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/><polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                      Voir le contenu
                    </button>
                  )}

                  {/* Actions */}
                  {isAuthenticated ? (
                    claimed ? (
                      <button disabled className="w-full py-3 rounded-xl text-white text-[14px] font-normal cursor-default" style={{ backgroundColor: "#E6B84C" }}>
                        {t("claimed_btn")}
                      </button>
                    ) : inReview ? (
                      <button disabled className="w-full py-3 rounded-xl text-[14px] font-normal cursor-default flex items-center justify-center gap-2" style={{ backgroundColor: "#EFF6FF", color: "#3B82F6" }}>
                        <Spinner color="#3B82F6" />
                        {t("in_review_btn")}
                      </button>
                    ) : rejected ? (
                      <button
                        onClick={() => handleStart(mission)}
                        disabled={busy}
                        className="w-full py-3 rounded-xl text-[14px] font-normal hover:brightness-110 transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 border"
                        style={{ backgroundColor: "#FEF2F2", color: "#EF4444", borderColor: "#FECACA" }}
                      >
                        {busy && <Spinner color="#EF4444" />}
                        {busy ? "…" : t("rejected_btn")}
                      </button>
                    ) : pending ? (
                      mission.timeRequired > 0 ? (
                        /* Timer countdown UI */
                        <div className="flex flex-col gap-2">
                          {/* Progress bar */}
                          <div className="relative h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(31,78,70,0.10)" }}>
                            <div
                              className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
                              style={{ width: `${pct}%`, backgroundColor: timerDone ? "#3FAE8C" : "#E6B84C" }}
                            />
                          </div>
                          {timerDone ? (
                            <button
                              onClick={() => handleComplete(mission.id)}
                              disabled={busy}
                              className="w-full py-3 rounded-xl text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                              style={{ backgroundColor: "#3FAE8C" }}
                            >
                              {busy && <Spinner color="white" />}
                              {busy ? t("verifying_btn") : t("verify_claim_btn")}
                            </button>
                          ) : (
                            <button disabled className="w-full py-3 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 cursor-default" style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="#94A3B8" strokeWidth="2"/>
                                <path d="M12 6v6l4 2" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                              Disponible dans {fmtTime(remaining)}
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleComplete(mission.id)}
                          disabled={busy}
                          className="w-full py-3 rounded-xl text-white text-[14px] font-normal hover:brightness-110 transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                          style={{ backgroundColor: "#E17100" }}
                        >
                          {busy && <Spinner color="white" />}
                          {busy ? t("verifying_btn") : t("verify_claim_btn")}
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => handleStart(mission)}
                        disabled={busy}
                        className="w-full py-3 rounded-xl text-white text-[14px] font-normal hover:brightness-110 transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                        style={{ backgroundColor: "#344054" }}
                      >
                        {busy && <Spinner color="white" />}
                        {busy ? "Starting…" : t("start_btn")}
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => mission.actionUrl && window.open(mission.actionUrl, "_blank", "noopener")}
                      className="w-full bg-[#344054] text-white text-[14px] font-normal py-3 rounded-xl hover:brightness-110 transition cursor-pointer"
                    >
                      {t("complete_btn")}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}

export default function MissionsSection() {
  return (
    <Suspense fallback={
      <section className="bg-white py-16">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-100 p-4" style={{ minHeight: 170 }}>
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    }>
      <MissionsSectionInner />
    </Suspense>
  );
}
