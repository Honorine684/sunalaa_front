import Navbar from "@/components/Navbar";
import BonusHero from "@/components/BonusHero";
import MissionsSection from "@/components/MissionsSection";
import ParrainageSection from "@/components/ParrainageSection";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Bonus & Récompenses",
  description:
    "Gagnez des points SNL supplémentaires grâce aux missions quotidiennes et au parrainage. Réclamez vos bonus de réseau niveau 1, 2 et 3.",
  alternates: {
    canonical: "https://sunalaa.com/bonus",
    languages: { "x-default": "https://sunalaa.com/bonus", en: "https://sunalaa.com/bonus", fr: "https://sunalaa.com/fr/bonus" },
  },
  openGraph: {
    url: "https://sunalaa.com/bonus",
    title: "Bonus & Récompenses | SUNALA",
    description:
      "Missions quotidiennes, parrainage 3 niveaux, bonus SNL à réclamer. Maximisez vos points SNL sur SUNALA.",
    images: [{ url: "/images/sunala_LOGO.png", width: 800, height: 600, alt: "SUNALA Bonus" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bonus & Récompenses | SUNALA",
    description: "Missions quotidiennes, parrainage 3 niveaux, bonus SNL à réclamer.",
    images: ["/images/sunala_LOGO.png"],
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
