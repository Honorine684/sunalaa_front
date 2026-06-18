"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import ProfileHero from "@/components/ProfileHero";
import ProfileHeader from "@/components/ProfileHeader";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";
import ProfileAbout from "@/components/ProfileAbout";
import ProfileLevels from "@/components/ProfileLevels";
import ProfileNetwork from "@/components/ProfileNetwork";
import ProfileSecurity from "@/components/ProfileSecurity";
import ProfileAddresses from "@/components/ProfileAddresses";
import ProfileKyc from "@/components/ProfileKyc";
import ProfileLoginHistory from "@/components/ProfileLoginHistory";
import ProfileCommandes from "@/components/ProfileCommandes";
import ProfileTransfer from "@/components/ProfileTransfer";
import ProfileTips from "@/components/ProfileTips";
import { useProfile } from "@/hooks/useProfile";

function SkeletonBlock({ className }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />;
}

function ProfileSkeleton() {
  return (
    <div className="bg-[#F8FAFC] py-8">
      <Container>
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col gap-3">
              <SkeletonBlock className="h-5 w-48" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-2.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default function ProfilPage() {
  const t = useTranslations("ProfilPage");
  const locale = useLocale();
  const { logout } = useAuth();
  const { profile, loading, error, updateProfile, uploadAvatar, updateBalance } = useProfile();
  const [activeTab, setActiveTab] = useState("profil");

  const prefix = locale === "fr" ? "/fr" : "";

  async function handleMobileLogout() {
    await logout();
    window.location.href = prefix + "/";
  }

  const TABS = [
    { id: "profil",   label: t("tab_profil") },
    { id: "reseau",   label: t("tab_reseau") },
    { id: "snl",      label: t("tab_snl") },
    { id: "adresses", label: t("tab_adresses") },
    { id: "securite", label: t("tab_securite") },
  ];

  return (
    <>
      <Navbar />

      <ProfileHero />
      <ProfileHeader profile={profile} loading={loading} onUploadAvatar={uploadAvatar} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 text-center">
          {error}
        </div>
      )}

      {/* Mobile only: lang switcher + logout */}
      <div className="lg:hidden bg-white border-b border-slate-100 px-4 py-2.5 flex items-center justify-between">
        <LanguageSwitcher />
        <button
          onClick={handleMobileLogout}
          className="flex items-center gap-2 text-[13px] font-semibold text-red-500 hover:text-red-600 transition cursor-pointer"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t("logout")}
        </button>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-slate-200">
        <Container>
          <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-4 text-[14px] font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {loading ? (
        <ProfileSkeleton />
      ) : (
        <div className="bg-[#F8FAFC] py-8 min-h-[60vh]">
          <Container>

            {activeTab === "profil" && (
              <div className="flex flex-col gap-6">
                <ProfileTips
                  profile={profile}
                  onNavigate={setActiveTab}
                  onUploadPhoto={() => document.querySelector("[data-avatar-upload]")?.click()}
                />
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
                    <ProfileAbout profile={profile} onUpdate={updateProfile} />
                    <ProfileLevels profile={profile} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reseau" && (
              <ProfileNetwork />
            )}

            {activeTab === "snl" && (
              <div className="grid grid-cols-12 gap-6">
                <ProfileTransfer onTransferComplete={updateBalance} />
              </div>
            )}

            {activeTab === "adresses" && (
              <div className="flex flex-col gap-6">
                <ProfileAddresses />
                <ProfileCommandes />
              </div>
            )}

            {activeTab === "securite" && (
              <div className="flex flex-col gap-6">
                <ProfileSecurity user={profile} />
                <ProfileKyc />
                <ProfileLoginHistory />
              </div>
            )}

          </Container>
        </div>
      )}

      <Footer />
    </>
  );
}
