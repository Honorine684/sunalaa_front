import Navbar from "@/components/Navbar";
import BonusHero from "@/components/BonusHero";
import MissionsSection from "@/components/MissionsSection";
import ParrainageSection from "@/components/ParrainageSection";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Bonus & Récompenses",
  description:
    "Gagnez des points SNL supplémentaires grâce aux missions quotidiennes et au parrainage. Réclamez vos bonus de réseau niveau 1, 2 et 3.",
  alternates: { canonical: "https://sunalaa.com/bonus" },
  openGraph: {
    url: "https://sunalaa.com/bonus",
    title: "Bonus & Récompenses | SUNALA",
    description:
      "Missions quotidiennes, parrainage 3 niveaux, bonus SNL à réclamer. Maximisez vos gains sur SUNALA.",
  },
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
