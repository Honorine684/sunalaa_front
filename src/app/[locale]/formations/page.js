import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormationsHero from "@/components/FormationsHero";
import FormationsContent from "@/components/FormationsContent";

export const metadata = {
  title: "Courses & Masterclass on Crypto",
  description:
    "Access exclusive SUNALAA courses on crypto, trading and finance. Learn and earn SNL points as you train.",
  alternates: { canonical: "https://sunalaa.com/formations" },
  openGraph: {
    url: "https://sunalaa.com/formations",
    title: "Crypto Courses | SUNALAA",
    description:
      "Courses and masterclasses on crypto, trading and blockchain. Learn and earn SNL on SUNALAA.",
  },
};

export default function FormationsPage() {
  return (
    <>
      <Navbar />
      <FormationsHero />
      <FormationsContent />
      <Footer />
    </>
  );
}
