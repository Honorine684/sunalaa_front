"use client";

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
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4">
              <SkeletonBlock className="h-5 w-24" />
              {[...Array(4)].map((_, i) => <SkeletonBlock key={i} className="h-4 w-full" />)}
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-3">
              <SkeletonBlock className="h-5 w-32" />
              {[...Array(5)].map((_, i) => <SkeletonBlock key={i} className="h-14 w-full" />)}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col gap-3">
                <SkeletonBlock className="h-5 w-48" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-2.5 w-full rounded-full" />
              </div>
            ))}
          </div>
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4">
              <SkeletonBlock className="h-5 w-28" />
              {[...Array(4)].map((_, i) => <SkeletonBlock key={i} className="h-12 w-full" />)}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function ProfilPage() {
  const { profile, loading, error, updateProfile, uploadAvatar, updateBalance } = useProfile();

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

      {loading ? (
        <ProfileSkeleton />
      ) : (
        <div className="bg-[#F8FAFC] py-8">
          <Container>
            <div className="grid grid-cols-12 gap-6">

              {/* Left col */}
              <div className="col-span-12 lg:col-span-3 flex flex-col gap-5">
                <ProfileAbout profile={profile} onUpdate={updateProfile} />
                <ProfileLevels profile={profile} />
              </div>

              {/* Center col */}
              <div className="col-span-12 lg:col-span-6">
                <ProfileMissions onMissionComplete={updateBalance} />
              </div>

              {/* Right col */}
              <div className="col-span-12 lg:col-span-3">
                <ProfileNetwork />
              </div>

              {/* Full width — Sécurité */}
              <div className="col-span-12">
                <ProfileSecurity user={profile} />
              </div>

              {/* Full width — Adresses */}
              <div className="col-span-12">
                <ProfileAddresses />
              </div>

              {/* Transfert SNL — full width */}
              <ProfileTransfer onTransferComplete={updateBalance} />

              {/* Commandes */}
              <div className="col-span-12">
                <ProfileCommandes />
              </div>

              {/* KYC + Login history */}
              <div className="col-span-12 lg:col-span-6">
                <ProfileKyc />
              </div>
              <div className="col-span-12 lg:col-span-6">
                <ProfileLoginHistory />
              </div>

            </div>
          </Container>
        </div>
      )}

      <Footer />
    </>
  );
}
