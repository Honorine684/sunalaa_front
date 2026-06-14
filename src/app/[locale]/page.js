import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import LandingHero from "@/components/LandingHero";
import HowItWorks from "@/components/HowItWorks";

// Composants sous le fold — chargés en différé
const WhySunala        = dynamic(() => import("@/components/WhySunala"));
const FounderSection   = dynamic(() => import("@/components/FounderSection"));
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"));
const LandingCTA       = dynamic(() => import("@/components/LandingCTA"));
const Footer           = dynamic(() => import("@/components/Footer"));
const WelcomePopup     = dynamic(() => import("@/components/WelcomePopup"));

export const metadata = {
  title: "Collectez des points SNL chaque jour — Rejoignez la communauté",
  description:
    "SUNALAA vous permet de collecter 100 points SNL par jour, de parrainer vos proches et de gagner des bonus à chaque collecte. Rejoignez des milliers de membres actifs.",
  alternates: { canonical: "https://sunalaa.com" },
  openGraph: {
    url: "https://sunalaa.com",
    title: "SUNALAA — Collectez des points SNL chaque jour",
    description:
      "Collectez 100 SNL par jour, parrainez vos proches et progressez ensemble. Rejoignez la communauté SUNALAA.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SUNALAA",
  url: "https://sunalaa.com",
  logo: "https://sunalaa.com/images/sunala_LOGO.png",
  description:
    "SUNALAA est une plateforme qui permet de collecter des points SNL quotidiennement, de parrainer ses proches et de progresser ensemble dans un réseau de récompenses.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: "French",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
