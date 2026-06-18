"use client";

import { useRef, useState, useEffect } from "react";
import Container from "./Container";
import { getApiError } from "@/lib/api";

const AVATAR_COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];

function getInitials(profile) {
  if (profile?.username) return profile.username[0].toUpperCase();
  const first = profile?.firstName?.[0] ?? profile?.first_name?.[0] ?? "";
  const last = profile?.lastName?.[0] ?? profile?.last_name?.[0] ?? "";
  return (first + last).toUpperCase() || "?";
}

function getAvatarColor(profile) {
  const name = profile?.username ?? profile?.firstName ?? profile?.first_name ?? "A";
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function fmt(n) {
  return Number(n ?? 0).toLocaleString("en-US");
}

export default function ProfileHeader({ profile, loading, onUploadAvatar }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (lightbox) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = parseInt(document.body.style.top || "0", 10);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, -scrollY);
    }
    return () => {
      const scrollY = parseInt(document.body.style.top || "0", 10);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, -scrollY);
    };
  }, [lightbox]);

  const initials = getInitials(profile);
  const avatarColor = getAvatarColor(profile);
  const username = profile?.username ?? "";
  const fullName = [profile?.firstName ?? profile?.first_name, profile?.lastName ?? profile?.last_name]
    .filter(Boolean).join(" ");
  const handle = profile?.referralCode ?? profile?.referral_code ?? "";
  const levelName = profile?.level?.name ?? profile?.rank ?? "Bronze";
  const snlBalance = Number(profile?.snlBalance ?? profile?.points ?? profile?.totalPoints ?? 0);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file || !onUploadAvatar) return;
    if (!file.type.startsWith("image/")) { setUploadError("Image file required"); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadError("Max size 5 MB"); return; }

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    setUploadError("");
    try {
      await onUploadAvatar(formData);
    } catch (err) {
      setUploadError(getApiError(err));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="bg-white border-b border-slate-100">
      <Container>
        <div className="flex flex-wrap items-end gap-5 py-8">

          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className={`w-24 h-24 -mt-12 lg:w-45 lg:h-45 lg:-mt-31.25 ml-8 rounded-full flex items-center justify-center overflow-hidden ${profile?.avatar ? "cursor-zoom-in" : ""}`}
              style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.15)", backgroundColor: profile?.avatar ? undefined : avatarColor }}
              onClick={() => profile?.avatar && setLightbox(true)}
            >
              {profile?.avatar ? (
                <img src={profile.avatar} alt={username || fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-[48px] font-bold select-none">
                  {loading ? "" : initials}
                </span>
              )}
            </div>

            {/* Bouton appareil photo */}
            {onUploadAvatar && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-1 right-2 w-9 h-9 rounded-full flex items-center justify-center shadow-md border-2 border-white cursor-pointer hover:brightness-90 transition disabled:opacity-60"
                style={{ backgroundColor: "#1F4E46" }}>
                {uploading ? (
                  <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="2"/>
                  </svg>
                )}
              </button>
            )}

            {uploadError && (
              <p className="absolute -bottom-5 left-0 text-red-400 text-[11px] whitespace-nowrap">{uploadError}</p>
            )}
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} data-avatar-upload />

          {/* Name + handle */}
          <div className="-mb-4.5">
            <h1 className="text-[22px] lg:text-[30px]" style={{ fontWeight: 700, lineHeight: "100%", color: "#0F172B" }}>
              {username || "—"}
            </h1>
            {fullName && (
              <p className="mt-1 text-[14px]" style={{ fontWeight: 400, lineHeight: "100%", color: "#64748B" }}>
                {fullName}
              </p>
            )}
            {handle && (
              <p className="mt-2 text-[14px]" style={{ fontWeight: 400, lineHeight: "100%", color: "#94A3B8" }}>
                Code: {handle}
              </p>
            )}
          </div>

          {/* Badges */}
          <div className="ml-auto flex items-center gap-3 flex-wrap">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#1A3A34" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M8 21h8m-4-4v4m0-4c-4.418 0-8-3.582-8-8V5h16v4c0 4.418-3.582 8-8 8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 9H2a1 1 0 01-1-1V7a1 1 0 011-1h2M20 9h2a1 1 0 001-1V7a1 1 0 00-1-1h-2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="bg-[#1A3A34] text-white text-[14px] font-normal px-5 py-2.5 rounded-xl shrink-0">
              Level {levelName}
            </div>

            <div className="border-2 border-slate-200 text-slate-800 text-[14px] font-bold px-5 py-2.5 rounded-xl shrink-0">
              {fmt(snlBalance)} SNL
            </div>
          </div>
        </div>
      </Container>

      {lightbox && profile?.avatar && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <img
            src={profile.avatar}
            alt={username || fullName}
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
