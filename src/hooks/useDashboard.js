"use client";

import { useEffect, useState } from "react";
import { usersApi, networkApi, getApiError } from "@/lib/api";

export function useDashboard() {
  const [data, setData]                 = useState(null);
  const [network, setNetwork]           = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance]           = useState(null);
  const [levelData, setLevelData]       = useState(null);
  const [referralCode, setReferralCode] = useState(null);
  const [rank, setRank]                 = useState(null);
  const [streak, setStreak]             = useState(0);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  useEffect(() => {
    const controller = new AbortController();

    function catchOrNull(promise) {
      return promise.catch((err) => {
        if (controller.signal.aborted) return null;
        if (err?.response?.status === 401) {
          try { localStorage.removeItem("snl_user"); } catch {}
          try { document.cookie = "snl_user_role=; path=/; max-age=0"; } catch {}
          window.location.href = "/login";
        }
        return null;
      });
    }

    Promise.all([
      catchOrNull(usersApi.getDashboard()),
      catchOrNull(networkApi.getStats()),
      catchOrNull(usersApi.getPointsHistory({ limit: 5 })),
      catchOrNull(usersApi.getProfile()),
      catchOrNull(usersApi.getStreak()),
    ])
      .then(([dashRes, netRes, txRes, profileRes, streakRes]) => {
        if (controller.signal.aborted) return;
        if (dashRes) setData(dashRes.data?.data ?? dashRes.data);
        if (netRes)  setNetwork(netRes.data?.data ?? netRes.data);

        const txPayload = txRes?.data?.data ?? txRes?.data;
        const txRaw     = txPayload?.data ?? txPayload;
        setTransactions(Array.isArray(txRaw) ? txRaw.slice(0, 5) : []);

        const profile  = profileRes?.data?.data ?? profileRes?.data;
        const dashData = dashRes?.data?.data ?? dashRes?.data;

        const bal = profile?.snlBalance ?? profile?.points ?? profile?.totalPoints;
        if (bal != null) setBalance(Number(bal));
        if (profile?.level) setLevelData(profile.level);

        const code = profile?.referralCode ?? profile?.referral_code;
        if (code) setReferralCode(code);

        const rankVal = profile?.leaderboardRank ?? profile?.position
          ?? dashData?.leaderboardRank ?? dashData?.position
          ?? (typeof profile?.rank === "number" ? profile.rank : null)
          ?? (typeof dashData?.rank === "number" ? dashData.rank : null)
          ?? null;
        if (rankVal != null && !isNaN(Number(rankVal))) setRank(Number(rankVal));

        const streakData = streakRes?.data?.data ?? streakRes?.data;
        const streakVal  = streakData?.currentStreak ?? streakData?.streak ?? streakData?.currentDay
          ?? dashData?.streak ?? dashData?.currentStreak ?? dashData?.streakDay ?? 0;
        setStreak(Number(streakVal) || 0);
      })
      .catch((err) => { if (!controller.signal.aborted) setError(getApiError(err)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });

    return () => controller.abort();
  }, []);

  return { data, network, transactions, balance, levelData, referralCode, rank, streak, loading, error };
}
