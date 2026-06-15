"use client";

import { useEffect, useState } from "react";
import { usersApi, getApiError } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "https://api.sunalaa.com";

function normalizeProfile(raw) {
  if (!raw) return raw;
  const imgRaw = raw.profileImage ?? raw.avatar ?? raw.avatarUrl ?? null;
  const avatar = imgRaw
    ? imgRaw.startsWith("http") ? imgRaw : `${API_BASE}${imgRaw}`
    : null;
  let username = raw.username ?? null;
  if (!username) {
    try {
      const stored = localStorage.getItem("snl_user");
      if (stored) username = JSON.parse(stored)?.username ?? null;
    } catch {}
  }
  return { ...raw, avatar, ...(username ? { username } : {}) };
}

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      usersApi.getProfile(),
      usersApi.getPoints().catch(() => null),
    ])
      .then(([profileRes, pointsRes]) => {
        const profileData = normalizeProfile(profileRes.data?.data ?? profileRes.data);
        const pointsRaw = pointsRes?.data?.data ?? pointsRes?.data;
        const balance = pointsRaw?.balance ?? pointsRaw?.snlBalance ?? pointsRaw?.totalPoints ?? null;
        setProfile({ ...profileData, snlBalance: balance != null ? Number(balance) : Number(profileData?.snlBalance ?? 0) });
      })
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  async function updateProfile(data) {
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== "" && v !== null && v !== undefined)
    );
    try {
      const res = await usersApi.updateProfile(payload);
      setProfile(normalizeProfile(res.data?.data ?? res.data));
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  async function uploadAvatar(formData) {
    await usersApi.uploadAvatar(formData);
    const res = await usersApi.getProfile();
    const updated = normalizeProfile(res.data?.data ?? res.data);
    setProfile(updated);
    return updated?.avatar;
  }

  function updateBalance(newBalance) {
    setProfile((prev) => prev ? { ...prev, snlBalance: Number(newBalance) } : prev);
  }

  return { profile, loading, error, updateProfile, uploadAvatar, updateBalance };
}
