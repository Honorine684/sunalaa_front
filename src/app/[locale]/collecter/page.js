import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeHero from "@/components/HomeHero";
import HomeDashboard from "@/components/HomeDashboard";

export const metadata = {
  title: "Daily SNL Collection",
  description:
    "Claim your 100 SNL points for today in one click. Log in every day to maintain your streak and increase your loyalty bonuses.",
  alternates: {
    canonical: "https://sunalaa.com/collecter",
    languages: { "x-default": "https://sunalaa.com/collecter", en: "https://sunalaa.com/collecter", fr: "https://sunalaa.com/fr/collecter" },
  },
  openGraph: {
    url: "https://sunalaa.com/collecter",
    title: "Daily Collection | SUNALA",
    description:
      "100 SNL to collect per day. Keep your daily streak and boost your bonuses on SUNALA.",
    images: [{ url: "/images/sunala_LOGO.png", width: 800, height: 600, alt: "SUNALA Collect" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Collection | SUNALA",
    description: "100 SNL to collect per day. Keep your daily streak and boost your bonuses.",
    images: ["/images/sunala_LOGO.png"],
  },
};

export default function CollecterPage() {
  return (
    <>
      <Navbar />
      <HomeHero />
      <HomeDashboard />
      <Footer />
    </>
  );
}
