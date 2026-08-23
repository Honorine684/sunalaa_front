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
  title: "Collectez des points SNL chaque jour : Rejoignez la communauté",
  description:
    "SUNALA vous permet de collecter 100 points SNL par jour, de parrainer vos proches et de gagner des bonus à chaque collecte. Rejoignez des milliers de membres actifs.",
  alternates: {
    canonical: "https://sunalaa.com",
    languages: { "x-default": "https://sunalaa.com", en: "https://sunalaa.com", fr: "https://sunalaa.com/fr" },
  },
  openGraph: {
    url: "https://sunalaa.com",
    title: "SUNALA : Collectez des points SNL chaque jour",
    description:
      "Collectez 100 SNL par jour, parrainez vos proches et progressez ensemble. Rejoignez la communauté SUNALA.",
    images: [{ url: "/images/sunala_LOGO.png", width: 800, height: 600, alt: "SUNALA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SUNALA : Collectez des points SNL chaque jour",
    description: "Collectez 100 SNL par jour, parrainez vos proches et progressez ensemble.",
    images: ["/images/sunala_LOGO.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SUNALA",
  url: "https://sunalaa.com",
  logo: "https://sunalaa.com/images/sunala_LOGO.png",
  description:
    "SUNALA est une plateforme qui permet de collecter des points SNL quotidiennement, de parrainer ses proches et de progresser ensemble dans un réseau de récompenses.",
  sameAs: [
    "https://t.me/sunala_agri",
    "https://x.com/sunala_universe",
    "https://discord.gg/cQhSUWrHd",
    "https://www.facebook.com/share/1Dc2MhmXGj/",
    "https://www.instagram.com/sunala.universe",
  ],
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
