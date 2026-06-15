"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import ProfileHero from "@/components/ProfileHero";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileAbout from "@/components/ProfileAbout";
import ProfileLevels from "@/components/ProfileLevels";
import ProfileMissions from "@/components/ProfileMissions";
import ProfileNetwork from "@/components/ProfileNetwork";
import ProfileSecurity from "@/components/ProfileSecurity";
import ProfileAddresses from "@/components/ProfileAddresses";
import ProfileKyc from "@/components/ProfileKyc";
import ProfileLoginHistory from "@/components/ProfileLoginHistory";
import ProfileCommandes from "@/components/ProfileCommandes";
import ProfileTransfer from "@/components/ProfileTransfer";
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

const TABS = [
  { id: "profil",   label: "Profil" },
  { id: "reseau",   label: "Réseau" },
  { id: "snl",      label: "SNL" },
  { id: "adresses", label: "Adresses & Commandes" },
  { id: "securite", label: "Sécurité" },
];

export default function ProfilPage() {
  const { profile, loading, error, updateProfile, uploadAvatar, updateBalance } = useProfile();
  const [activeTab, setActiveTab] = useState("profil");

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
      ) : (
        <div className="bg-[#F8FAFC] py-8 min-h-[60vh]">
          <Container>

            {activeTab === "profil" && (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
                  <ProfileAbout profile={profile} onUpdate={updateProfile} />
                  <ProfileLevels profile={profile} />
                </div>
                <div className="col-span-12 lg:col-span-8">
                  <ProfileMissions onMissionComplete={updateBalance} />
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
