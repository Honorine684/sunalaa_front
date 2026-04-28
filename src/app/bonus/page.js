import Navbar from "@/components/Navbar";
import BonusHero from "@/components/BonusHero";
import MissionsSection from "@/components/MissionsSection";
import ParrainageSection from "@/components/ParrainageSection";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Bonus & Récompenses — SUNALA",
  description: "Gagnez des SNL grâce aux missions et au parrainage",
};

export default function BonusPage() {
  return (
    <>
      <Navbar />
      <BonusHero />

      {/* White rounded container sliding over dark hero */}
      <div className="relative -mt-10 bg-white rounded-t-[40px] z-10">
        <MissionsSection />
        <ParrainageSection />
      </div>

      <Footer />
    </>
  );
}
