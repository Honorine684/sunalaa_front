import Navbar from "@/components/Navbar";
import LandingHero from "@/components/LandingHero";
import HowItWorks from "@/components/HowItWorks";
import WhySunala from "@/components/WhySunala";
import LandingCTA from "@/components/LandingCTA";
import Footer from "@/components/Footer";

export const metadata = { title: "SUNAALA — Rejoignez la communauté" };

export default function HomePage() {
  return (
    <>
      <Navbar />
      <LandingHero />
      <HowItWorks />
      <WhySunala />
      <LandingCTA />
      <Footer />
    </>
  );
}
