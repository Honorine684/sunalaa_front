import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PodiumSection from "@/components/PodiumSection";
import LeaderboardSection from "@/components/LeaderboardSection";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Classement — SUNALA",
  description: "Découvrez le classement des meilleurs collecteurs de points SNL.",
};

export default function ClassementPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <PodiumSection />
      <LeaderboardSection />
      <Footer />
    </>
  );
}
