import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import ProfileHero from "@/components/ProfileHero";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileAbout from "@/components/ProfileAbout";
import ProfileLevels from "@/components/ProfileLevels";
import ProfileMissions from "@/components/ProfileMissions";
import ProfileNetwork from "@/components/ProfileNetwork";

export const metadata = {
  title: "Profil — SUNAALA",
  description: "Votre profil SUNAALA",
};

export default function ProfilPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <ProfileHero />

      {/* Profile header — avatar overlaps the hero */}
      <ProfileHeader />

      {/* 3-column grid */}
      <div className="bg-[#F8FAFC] py-8">
        <Container>
          <div className="grid grid-cols-12 gap-6">

            {/* Left sidebar — col 3 */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-5">
              <ProfileAbout />
              <ProfileLevels />
            </div>

            {/* Center feed — col 6 */}
            <div className="col-span-12 lg:col-span-6">
              <ProfileMissions />
            </div>

            {/* Right sidebar — col 3 */}
            <div className="col-span-12 lg:col-span-3">
              <ProfileNetwork />
            </div>

          </div>
        </Container>
      </div>

      <Footer />
    </>
  );
}
