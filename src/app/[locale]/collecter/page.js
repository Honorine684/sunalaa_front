import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeHero from "@/components/HomeHero";
import HomeDashboard from "@/components/HomeDashboard";

export const metadata = {
  title: "Daily SNL Collection",
  description:
    "Claim your 100 SNL points for today in one click. Log in every day to maintain your streak and increase your loyalty bonuses.",
  alternates: { canonical: "https://sunalaa.com/collecter" },
  openGraph: {
    url: "https://sunalaa.com/collecter",
    title: "Daily Collection | SUNALAA",
    description:
      "100 SNL to collect per day. Keep your daily streak and boost your bonuses on SUNALAA.",
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
