import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeHero from "@/components/HomeHero";
import HomeDashboard from "@/components/HomeDashboard";

export const metadata = {
  title: "Collecter — SUNAALA",
  description: "Collectez vos points SNL quotidiennement",
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
