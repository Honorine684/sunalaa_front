import Navbar from "@/components/Navbar";
import LandingHero from "@/components/LandingHero";
import HowItWorks from "@/components/HowItWorks";
import WhySunala from "@/components/WhySunala";
import FounderSection from "@/components/FounderSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import LandingCTA from "@/components/LandingCTA";
import Footer from "@/components/Footer";
import WelcomePopup from "@/components/WelcomePopup";

export const metadata = { title: "SUNAALA — Rejoignez la communauté" };

export default function HomePage() {
  return (
    <>
      <Navbar />
      <LandingHero />
      <HowItWorks />
      <WhySunala />
      <FounderSection />
      <TestimonialsSection />
      <LandingCTA />
      <Footer />
      <WelcomePopup />
    </>
  );
}
