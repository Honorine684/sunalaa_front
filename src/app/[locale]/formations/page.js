import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormationsHero from "@/components/FormationsHero";

export const metadata = {
  title: "Courses & Masterclass on Crypto",
  description:
    "Access exclusive SUNALA courses on crypto, trading and finance. Learn and earn SNL points as you train.",
  alternates: {
    canonical: "https://sunalaa.com/formations",
    languages: { "x-default": "https://sunalaa.com/formations", en: "https://sunalaa.com/formations", fr: "https://sunalaa.com/fr/formations" },
  },
  openGraph: {
    url: "https://sunalaa.com/formations",
    title: "Crypto Courses | SUNALA",
    description:
      "Courses and masterclasses on crypto, trading and blockchain. Learn and earn SNL on SUNALA.",
    images: [{ url: "/images/sunala_LOGO.png", width: 800, height: 600, alt: "SUNALA Formations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Courses | SUNALA",
    description: "Courses and masterclasses on crypto, trading and blockchain. Learn and earn SNL.",
    images: ["/images/sunala_LOGO.png"],
  },
};

export default function FormationsPage() {
  return (
    <>
      <Navbar />
      <FormationsHero />
      <Footer />
    </>
  );
}
