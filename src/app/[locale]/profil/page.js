"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import ProfileHero from "@/components/ProfileHero";
import ProfileHeader from "@/components/ProfileHeader";
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
import HomeDashboard from "@/components/HomeDashboard";
import MissionsSection from "@/components/MissionsSection";
import ParrainageSection from "@/components/ParrainageSection";
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
  const { profile, loading, error, updateProfile, uploadAvatar, updateBalance } = useProfile();
  const [activeTab, setActiveTab] = useState("profil");

  const TABS = [
    { id: "profil",      label: t("tab_profil") },
    { id: "reseau",      label: t("tab_reseau") },
    { id: "snl",         label: t("tab_snl") },
    { id: "collecter",   label: t("tab_collecter") },
    { id: "recompenses", label: t("tab_recompenses") },
    { id: "adresses",    label: t("tab_adresses") },
    { id: "securite",    label: t("tab_securite") },
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
                    ? "border-[#1F4E46] text-[#1F4E46]"
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
      ) : activeTab === "collecter" ? (
        <div className="bg-[#F8FAFC] min-h-[60vh]">
          <HomeDashboard />
        </div>
      ) : activeTab === "recompenses" ? (
        <div className="bg-white min-h-[60vh]">
          <MissionsSection />
          <ParrainageSection />
        </div>
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
